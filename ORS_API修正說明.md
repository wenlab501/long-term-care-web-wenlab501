# ORS Directions API 修正說明

## 🚨 問題描述

用戶回報路徑規劃功能失敗，錯誤訊息為：

```
路徑規劃失敗，請檢查路徑點是否有效或網路連線。
```

## 🔍 問題分析

通過比較用戶提供的參考程式，發現我們的 API 請求格式與 OpenRouteService 官方範例有以下關鍵差異：

### 1. API URL 格式錯誤

```javascript
// ❌ 錯誤格式 (缺少 /geojson)
const apiUrl = `https://api.openrouteservice.org/v2/directions/${profile}`;

// ✅ 正確格式 (包含 /geojson)
const apiUrl = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
```

### 2. HTTP Headers 不完整

```javascript
// ❌ 錯誤格式 (缺少 Accept header)
headers: {
  Authorization: apiKey,
  'Content-Type': 'application/json',
}

// ✅ 正確格式 (包含完整 headers)
headers: {
  'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
  'Content-Type': 'application/json',
  'Authorization': apiKey,
}
```

### 3. 請求 Body 參數過於複雜

```javascript
// ❌ 錯誤格式 (包含不必要參數)
body: JSON.stringify({
  coordinates: coordinates,
  format: 'geojson', // 不需要 (URL 已指定)
  instructions: false, // 不需要
  geometry_simplify: false, // 不需要
  continue_straight: false, // 不需要
});

// ✅ 正確格式 (簡化參數)
body: JSON.stringify({
  coordinates: coordinates,
});
```

### 4. 錯誤處理不夠詳細

```javascript
// ❌ 錯誤格式 (無法解析具體錯誤)
const errorText = await response.text();
throw new Error(
  `ORS Directions API 錯誤! 狀態: ${response.status}, 訊息: ${errorText}`
);

// ✅ 正確格式 (解析 JSON 錯誤訊息)
let errorMessage = `HTTP ${response.status}`;
try {
  const errorData = await response.json();
  if (errorData.error && errorData.error.message) {
    errorMessage = errorData.error.message;
  }
} catch (parseError) {
  errorMessage = `HTTP ${response.status} - ${response.statusText}`;
}
throw new Error(`ORS API 錯誤: ${errorMessage}`);
```

## 🛠️ 修正實施

### 修正後的完整函數

```javascript
const fetchRouteDirections = async (coordinates, profile = 'driving-car') => {
  const apiKey = '5b3ce3597851110001cf6248cd3e1a052bec45bc8410b037091bb766';

  if (!coordinates || coordinates.length < 2) {
    throw new Error('路徑規劃至少需要2個路徑點');
  }

  try {
    console.log(`🛣️ 開始計算路徑，使用 ${coordinates.length} 個路徑點`);
    console.log('路徑點坐標:', coordinates);

    // ✅ 使用正確的 API URL 格式 (包含 /geojson)
    const apiUrl = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        // ✅ 包含完整的 Accept header
        Accept:
          'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        // ✅ 簡化的請求參數
        coordinates: coordinates,
      }),
    });

    if (!response.ok) {
      // ✅ 改進的錯誤處理
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (parseError) {
        errorMessage = `HTTP ${response.status} - ${response.statusText}`;
      }
      throw new Error(`ORS API 錯誤: ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      throw new Error('API 返回的路徑數據為空');
    }

    console.log('✅ 路徑計算成功');
    console.log(
      `📏 路徑距離: ${(data.features[0].properties.summary.distance / 1000).toFixed(2)} 公里`
    );
    console.log(
      `⏱️ 預估時間: ${Math.round(data.features[0].properties.summary.duration / 60)} 分鐘`
    );

    return data;
  } catch (error) {
    console.error('🚫 路徑計算失敗:', error);
    throw error;
  }
};
```

## 🧪 測試驗證

### 創建測試文件

創建了 `test-ors-api.html` 測試文件，包含以下測試案例：

1. **台北市區路線測試**

   - 龍山寺 → 西門紅樓 → 台北車站
   - 驗證多點路徑規劃

2. **短距離路線測試**

   - 台北101附近兩點
   - 驗證最小路徑點需求

3. **長距離路線測試**

   - 台北車站 → 桃園車站
   - 驗證跨縣市路徑規劃

4. **錯誤處理測試**
   - 使用無效坐標
   - 驗證錯誤處理機制

### 測試方法

```bash
# 在瀏覽器中打開測試文件
open test-ors-api.html

# 或直接在專案中運行
cd /Users/kevincheng/Library/CloudStorage/Dropbox/__NTU/_Project/_強化照護資源供需空間配置分析的長照韌性社區/website/long-term-care-web/
python3 -m http.server 8000
# 然後訪問 http://localhost:8000/test-ors-api.html
```

## 📋 修正清單

- ✅ **API URL 格式修正**: 添加 `/geojson` 後綴
- ✅ **HTTP Headers 完善**: 添加完整的 `Accept` header
- ✅ **請求參數簡化**: 移除不必要的參數
- ✅ **錯誤處理改進**: 解析 JSON 錯誤訊息
- ✅ **測試文件創建**: 提供完整的測試案例
- ✅ **文檔更新**: 更新 API 使用說明

## 🎯 預期結果

修正後的 API 調用應該能夠：

1. **成功連接** OpenRouteService API
2. **正確解析** 返回的 GeoJSON 路線數據
3. **準確計算** 路線距離和時間
4. **友善處理** 各種錯誤情況
5. **在地圖上** 正確繪製橘色路線

## 🔄 後續步驟

1. **測試驗證**: 使用 `test-ors-api.html` 驗證修正效果
2. **功能測試**: 在主應用中測試路徑規劃功能
3. **錯誤監控**: 觀察控制台日誌確認 API 調用狀態
4. **用戶反饋**: 收集實際使用中的問題回報

## 📞 故障排除

如果仍然遇到問題，請檢查：

### 1. API 金鑰有效性

```javascript
// 驗證 API 金鑰
const apiKey = '5b3ce3597851110001cf6248cd3e1a052bec45bc8410b037091bb766';
console.log('API 金鑰:', apiKey.length, '字符');
```

### 2. 網路連線

```javascript
// 測試基本連線
fetch('https://api.openrouteservice.org/health')
  .then((response) => console.log('ORS 服務狀態:', response.status))
  .catch((error) => console.error('連線測試失敗:', error));
```

### 3. 坐標格式

```javascript
// 確認坐標格式 [經度, 緯度]
const coordinates = [
  [121.5, 25.0372], // ✅ 正確: [lng, lat]
  // [25.0372, 121.5000]  // ❌ 錯誤: [lat, lng]
];
```

### 4. 配額限制

- **免費額度**: 每日 2000 次請求
- **速率限制**: 每分鐘 40 次請求
- **檢查方法**: 查看 API 響應 headers 中的配額信息

---

_此修正基於 OpenRouteService 官方文檔和用戶提供的參考程式，應該能夠解決路徑規劃失敗的問題。_
