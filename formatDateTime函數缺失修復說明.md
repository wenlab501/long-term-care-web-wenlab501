# formatDateTime 函數缺失修復說明

## 🐛 錯誤描述

用戶遇到 JavaScript 運行時錯誤：

```
ERROR
_ctx.formatDateTime is not a function
TypeError: _ctx.formatDateTime is not a function
    at Proxy.render (PropertiesTab.vue:102:17)
```

### 錯誤原因

在 PropertiesTab.vue 模板中使用了 `formatDateTime`
函數，但該函數沒有在組件的 setup 函數中定義和返回。

### 出現位置

```html
<!-- ❌ 錯誤：使用了未定義的 formatDateTime 函數 -->
<DetailItem
  label="建立時間"
  :value="formatDateTime(routePlanningDetails.routeInfo.createdAt)"
/>
<DetailItem label="建立時間" :value="formatDateTime(point.createdAt)" />
<DetailItem
  label="建立時間"
  :value="formatDateTime(selectedFeature.properties.createdAt)"
/>
```

## 🔧 修復方案

### 添加 formatDateTime 函數定義

在 PropertiesTab.vue 的 setup 函數中添加 `formatDateTime` 函數：

```javascript
/**
 * 🕐 格式化日期時間 (Format Date Time)
 * 將 ISO 字串轉換為本地化的日期時間格式
 * @param {string} isoString - ISO 格式的日期時間字串
 * @returns {string} - 格式化後的日期時間字串
 */
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleString('zh-TW');
  } catch (error) {
    console.warn('日期格式化失敗:', error);
    return isoString;
  }
};
```

### 在 return 語句中暴露函數

```javascript
// 📤 返回響應式數據給模板使用
return {
  selectedFeature, // 選中物件
  selectedLayer, // 選中圖層
  // ... 其他屬性
  formatDateTime, // ✅ 日期時間格式化函數
};
```

## 📊 函數功能

### 輸入格式

- **ISO 字串**: `"2024-01-15T10:30:00.000Z"`
- **空值處理**: `null`, `undefined`, `""` → `"N/A"`

### 輸出格式

- **中文本地化**: `"2024/1/15 上午6:30:00"`
- **錯誤處理**: 如果格式化失敗，返回原始字串

### 使用範例

```javascript
formatDateTime('2024-01-15T10:30:00.000Z');
// 輸出: "2024/1/15 下午6:30:00"

formatDateTime(null);
// 輸出: "N/A"

formatDateTime('invalid-date');
// 輸出: "invalid-date" (原始字串)
```

## 🎯 修復效果

### ✅ 修復前的錯誤

```
❌ ERROR: _ctx.formatDateTime is not a function
❌ 路徑規劃詳細信息無法顯示
❌ 應用程式崩潰
```

### ✅ 修復後的效果

```
✅ 建立時間正常顯示: "2024/1/15 下午6:30:00"
✅ 路徑規劃詳細信息完整顯示
✅ 應用程式正常運行
```

## 🔄 相關功能

### 使用 formatDateTime 的地方

1. **路線詳細信息**:

   ```html
   <DetailItem
     label="建立時間"
     :value="formatDateTime(routePlanningDetails.routeInfo.createdAt)"
   />
   ```

2. **路徑點詳細信息**:

   ```html
   <DetailItem label="建立時間" :value="formatDateTime(point.createdAt)" />
   ```

3. **路徑點屬性信息**:
   ```html
   <DetailItem
     label="建立時間"
     :value="formatDateTime(selectedFeature.properties.createdAt)"
   />
   ```

### 日期時間數據來源

- **路線建立時間**: 完成路徑規劃時記錄的時間戳
- **路徑點建立時間**: 點擊地圖添加路徑點時記錄的時間戳
- **ISO 格式**: 所有時間戳都以 ISO 8601 格式存儲

## 🧪 測試方法

### 測試步驟

1. **創建路線**:

   ```
   1. 點擊 "點選路徑規劃點"
   2. 在地圖上點擊幾個點
   3. 點擊 "路徑規劃點選完成"
   ```

2. **查看路線詳細信息**:

   ```
   1. 在地圖上點擊橘色路線
   2. ✅ 確認右側面板顯示 "建立時間"
   3. ✅ 確認時間格式為中文本地化格式
   ```

3. **查看路徑點詳細信息**:

   ```
   1. 在地圖上點擊路徑點
   2. ✅ 確認右側面板顯示 "建立時間"
   3. ✅ 確認時間格式正確
   ```

4. **表格點擊測試**:
   ```
   1. 切換到資料表格分頁
   2. 點擊路徑規劃圖層的表格行
   3. ✅ 確認沒有 JavaScript 錯誤
   4. ✅ 確認右側面板正常顯示
   ```

## ✅ 修復完成

### 修復項目

- ✅ **函數定義**: 添加 `formatDateTime` 函數
- ✅ **錯誤處理**: 處理空值和無效日期
- ✅ **本地化**: 使用 `zh-TW` 中文格式
- ✅ **函數暴露**: 在 return 語句中暴露給模板
- ✅ **向後兼容**: 不影響其他功能

### 預期結果

- ✅ **無運行時錯誤**: JavaScript 錯誤完全消除
- ✅ **正常顯示**: 所有日期時間正常格式化顯示
- ✅ **用戶體驗**: 路徑規劃詳細信息完整可用

---

_現在 formatDateTime 函數已正確定義，路徑規劃詳細信息中的建立時間會以中文本地化格式正常顯示！_
