# OpenRouteService 路徑規劃 API 整合說明

## 🎯 功能需求

用戶要求使用 OpenRouteService 的 Directions API 在路徑規劃點選完成後：

1. 計算選定路徑點之間的最佳路線
2. 在地圖上繪製路線
3. 計算並顯示路線長度（公里為單位）
4. 顯示預估行車時間

## 🛠️ 技術實現

### 1. OpenRouteService Directions API 整合

#### API 配置

```javascript
const apiKey = '5b3ce3597851110001cf6248cd3e1a052bec45bc8410b037091bb766';
const apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';
```

#### API 請求參數

```javascript
{
  coordinates: [[lng1, lat1], [lng2, lat2], ...], // 路徑點坐標陣列
  format: 'geojson',           // 返回 GeoJSON 格式
  instructions: false,         // 不需要詳細指示
  geometry_simplify: false,    // 不簡化幾何
  continue_straight: false,    // 允許轉彎
}
```

### 2. 核心函數實現

#### `fetchRouteDirections(coordinates, profile)`

- **功能**: 調用 ORS Directions API 計算路線
- **參數**:
  - `coordinates`: 路徑點坐標陣列
  - `profile`: 交通方式（預設 'driving-car'）
- **返回**: ORS API 響應數據（GeoJSON 格式）
- **錯誤處理**: 完整的 API 錯誤捕捉和處理

#### `calculateAndDrawRoute(profile)`

- **功能**: 計算路線並添加到地圖圖層
- **處理流程**:
  1. 獲取路徑規劃點坐標
  2. 調用 ORS Directions API
  3. 解析返回的路線數據
  4. 創建路線 GeoJSON 要素
  5. 更新圖層數據和統計
- **返回**: 路線統計信息（距離、時間、路徑點數等）

### 3. 數據結構設計

#### 路線 GeoJSON 要素

```javascript
{
  type: 'Feature',
  geometry: route.geometry, // ORS 返回的路線幾何
  properties: {
    id: 'route_1234567890_abc123',
    layerId: 'route-planning-layer',
    type: 'route-line',
    name: '路徑規劃路線',
    distance: 5.23,      // 距離（公里）
    duration: 18,        // 時間（分鐘）
    profile: 'driving-car', // 交通方式
    waypoints: 4,        // 路徑點數量
    createdAt: '2024-01-15T10:30:00.000Z'
  }
}
```

#### 更新後的表格數據

```javascript
{
  '#': 1,
  名稱: '路徑規劃路線 (4個點)',
  類型: '路徑規劃',
  起點: '路徑點 1',
  終點: '路徑點 4',
  路徑點數: 4,
  總距離: '5.23 公里',    // ← 新增
  預估時間: '18 分鐘',     // ← 新增
  狀態: '已完成',         // ← 更新
}
```

### 4. 地圖視覺化實現

#### 路線樣式配置

```javascript
{
  color: 'var(--my-color-orange)',  // 橘色路線
  weight: 4,                        // 路線粗細
  opacity: 0.8,                     // 透明度
  lineCap: 'round',                 // 圓形端點
  lineJoin: 'round',                // 圓形連接
  dashArray: null,                  // 實線
}
```

#### 路線懸停效果

```javascript
// 懸停時
{
  weight: 6,                                    // 加粗路線
  opacity: 1.0,                                // 完全不透明
  color: 'var(--my-color-orange-hover)',       // 深橘色 (#f57c00)
}
```

#### 路線彈出視窗

```html
<div>
  <div class="my-title-xs-gray pb-2">路徑規劃圖層</div>
  <div class="my-content-sm-black">路徑規劃路線</div>
  <div class="my-content-xs-gray pt-1">總距離: 5.23 公里</div>
  <div class="my-content-xs-gray">預估時間: 18 分鐘</div>
  <div class="my-content-xs-gray">路徑點數: 4 個</div>
</div>
```

### 5. 用戶交互流程

#### 完整操作流程

```
1. 點擊「點選路徑規劃點」(橘色按鈕)
   ↓
2. 在地圖上點選多個路徑點 (顯示橘色數字圓圈)
   ↓
3. 點擊「路徑規劃點選完成」(紅色按鈕)
   ↓
4. 自動調用 ORS Directions API
   ↓
5. 在地圖上繪製橘色路線
   ↓
6. 顯示路線統計和成功提示
```

#### 用戶反饋機制

- **控制台日誌**: 詳細的計算過程和結果
- **彈出提示**: 路線計算完成的摘要信息
- **錯誤處理**: API 失敗時的友善錯誤訊息

### 6. 錯誤處理和容錯

#### API 錯誤處理

```javascript
try {
  const routeData = await fetchRouteDirections(coordinates, profile);
  // 成功處理邏輯
} catch (error) {
  console.error('❌ 路徑規劃失敗:', error);
  alert(`路徑規劃失敗: ${error.message}`);
  // 更新圖層狀態為錯誤狀態
}
```

#### 輸入驗證

- **最少路徑點檢查**: 至少需要 2 個路徑點
- **座標有效性**: 確保坐標格式正確
- **API 響應驗證**: 檢查返回數據完整性

#### 用戶提示

- **不足路徑點**: "路徑規劃至少需要2個路徑點，請添加更多路徑點。"
- **API 失敗**: "路徑規劃失敗，請檢查路徑點是否有效或網路連線。"
- **無路徑點**: "請先在地圖上選擇路徑點。"

## 🎨 視覺效果

### 路線顏色主題

- **正常狀態**: 橘色 `#ff9800`，線寬 4px
- **懸停狀態**: 深橘色 `#f57c00`，線寬 6px
- **透明度**: 0.8（正常）→ 1.0（懸停）

### 與其他圖層的視覺區分

```
數據分析:   🟢 綠色圓圈 + 綠色加號點
等時圈分析: 🔵 藍色多邊形 + 藍色加號點
路徑規劃:   🟠 橘色路線 + 橘色數字點
```

## 📊 數據統計和顯示

### 圖層摘要更新

```javascript
// 計算前
description: '正在規劃路徑，已選擇 4 個路徑點';

// 計算後
description: '路線已規劃完成，總距離 5.23 公里，預估 18 分鐘';
coverage: '5.23 公里';
```

### 控制台輸出範例

```
🛣️ 開始計算路徑，使用 4 個路徑點
路徑點坐標: [[121.5654, 25.0330], [121.5700, 25.0350], ...]
✅ 路徑計算成功
📏 路徑距離: 5.23 公里
⏱️ 預估時間: 18 分鐘
✅ 路徑規劃完成！
📏 總距離: 5.23 公里
⏱️ 預估時間: 18 分鐘
🚗 交通方式: driving-car
```

### 成功提示彈窗

```
路徑規劃完成！
總距離: 5.23 公里
預估時間: 18 分鐘
```

## 🔧 技術細節

### API 限制和配額

- **免費額度**: 每日 2000 次請求
- **速率限制**: 每分鐘 40 次請求
- **最大路徑點**: 50 個路徑點
- **最大距離**: 6000 公里

### 性能優化

- **路線重用**: 清除舊路線避免重疊
- **幾何簡化**: 保持原始精度以確保準確性
- **錯誤快速失敗**: 無效輸入立即返回

### 擴展性設計

- **多種交通方式**: 支援 'driving-car', 'cycling-regular', 'foot-walking'
- **自定義配置**: 可調整 API 參數
- **插件化**: 易於添加其他路線規劃服務

## ✅ 完成功能清單

- ✅ **ORS Directions API 整合**
- ✅ **路線計算和幾何處理**
- ✅ **地圖路線繪製（橘色主題）**
- ✅ **距離計算（公里為單位）**
- ✅ **時間預估（分鐘為單位）**
- ✅ **路線懸停效果**
- ✅ **詳細彈出視窗**
- ✅ **完整錯誤處理**
- ✅ **用戶友善提示**
- ✅ **控制台詳細日誌**
- ✅ **表格數據更新**
- ✅ **圖層統計更新**

## 🚀 使用範例

### 基本使用

```javascript
// 1. 添加路徑點
dataStore.addRoutePlanningPoint(25.033, 121.5654); // 路徑點 1
dataStore.addRoutePlanningPoint(25.035, 121.57); // 路徑點 2
dataStore.addRoutePlanningPoint(25.037, 121.575); // 路徑點 3

// 2. 計算並繪製路線
const result = await dataStore.calculateAndDrawRoute('driving-car');

// 3. 獲取結果
console.log(`路線距離: ${result.distance} 公里`);
console.log(`預估時間: ${result.duration} 分鐘`);
```

### 高級功能

```javascript
// 不同交通方式
await dataStore.calculateAndDrawRoute('cycling-regular'); // 騎車
await dataStore.calculateAndDrawRoute('foot-walking'); // 步行

// 獲取路徑點坐標
const coordinates = dataStore.getRoutePlanningCoordinates();
console.log('路徑點:', coordinates);
```

---

_此實現提供了完整的路徑規劃功能，從用戶交互到 API 整合，再到視覺化顯示，形成了一個完整的路線規劃解決方案。_
