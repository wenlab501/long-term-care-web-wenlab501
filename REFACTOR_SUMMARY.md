# 顏色與圖標系統重構總結

## 🎯 重構目標

1. **統一顏色管理**：將所有顏色定義移到 CSS 中，使用語義化的顏色名稱
2. **共用霧化樣式**：統一所有霧化效果的 CSS 類別
3. **圖標系統重構**：使用完整的 `<i>` 標籤格式，移除舊的圖標映射系統
4. **移除舊系統**：清除
   `VISUALIZATION_COLORS`、`generateLayerColors`、`LAYER_TYPE_ICONS`、`getLayerIcon`
   等舊函數

## 📁 修改的檔案

### 1. `src/assets/css/common.css`

**新增內容：**

- **圖層顏色系統**：16 種預定義顏色變數 (`--my-layer-color-*`)
- **顏色類別**：文字顏色類別 (`.my-layer-color-*`) 和背景顏色類別 (`.my-layer-bg-*`)
- **共用霧化樣式**：
  - `.my-blur-strong`：強化霧化效果 (12px blur, 180% saturate)
  - `.my-blur-medium`：中等霧化效果 (8px blur, 150% saturate)
  - `.my-blur-light`：輕微霧化效果 (8px blur, 120% saturate)
- **圖標系統**：使用 FontAwesome Unicode 字符的 CSS 類別 (`.my-layer-icon-*`)

### 2. `src/utils/utils.js`

**移除內容：**

- `LAYER_TYPE_ICONS` 常數
- `getLayerIcon()` 函數
- `VISUALIZATION_COLORS` 常數
- `generateLayerColors()` 函數
- `generateRandomColor()` 函數

**新增內容：**

- **圖層顏色系統**：
  - `LAYER_COLOR_NAMES`：16 種顏色名稱陣列
  - `assignLayerColorNames(totalLayers)`：為圖層分配顏色名稱
  - `getLayerColorVar(colorName)`：獲取 CSS 變數名稱
  - `getLayerColorClass(colorName, isBackground)`：獲取 CSS 類別名稱
- **圖層圖標系統**：
  - `LAYER_ICON_MAPPING`：圖標名稱映射表
  - `getLayerIconName(layerName)`：根據圖層名稱判斷圖標名稱
  - `getLayerIconHtml(iconName)`：獲取完整的 `<i>` 標籤 HTML
  - `getLayerIconClass(iconName)`：獲取圖標 CSS 類別名稱

**修復內容：**

- 修復 `ICONS` 對象中的重複鍵值問題

### 3. `src/stores/dataStore.js`

**修改內容：**

- 移除 `LAYER_COLORS` 陣列
- 導入新的顏色工具函數：`assignLayerColorNames`、`getLayerColorVar`、`getLayerColorClass`
- 為每個圖層添加：
  - `colorName`：顏色名稱 (如 'blue', 'green')
  - `color`：CSS 變數 (如 'var(--my-layer-color-blue)')
  - `colorClass`：CSS 類別名稱 (如 'my-layer-color-blue')

### 4. `src/views/LeftView.vue`

**修改內容：**

- 更新 import 語句：移除 `getLayerIcon`，新增
  `getLayerIconName`、`getLayerIconHtml`
- 更新 setup 函數中的返回值

### 5. `src/views/MapView.vue`

**修改內容：**

- 移除內聯的霧化樣式 CSS
- 在模板中添加共用霧化樣式類別：
  - `.map-bottom-controls` 添加 `my-blur-strong`
  - `.dropdown-menu` 添加 `my-blur-light`

### 6. `src/views/UpperView.vue`

**修改內容：**

- 移除內聯的霧化樣式 CSS
- 在模板中添加共用霧化樣式類別：
  - `.my-view-switcher-controls` 添加 `my-blur-strong`

## 🎨 新的顏色系統

### 顏色名稱列表

```javascript
const LAYER_COLOR_NAMES = [
  'blue',
  'green',
  'orange',
  'red',
  'purple',
  'cyan',
  'deep-orange',
  'brown',
  'blue-grey',
  'pink',
  'light-green',
  'amber',
  'indigo',
  'teal',
  'lime',
  'orange-variant',
];
```

### 使用方式

```javascript
// 獲取顏色名稱
const colorNames = assignLayerColorNames(6);

// 獲取 CSS 變數
const colorVar = getLayerColorVar('blue'); // 'var(--my-layer-color-blue)'

// 獲取 CSS 類別
const colorClass = getLayerColorClass('blue'); // 'my-layer-color-blue'
const bgClass = getLayerColorClass('blue', true); // 'my-layer-bg-blue'
```

## 🎭 新的圖標系統

### 圖標名稱映射

```javascript
const LAYER_ICON_MAPPING = {
  hospital: 'hospital',
  clinic: 'clinic',
  pharmacy: 'pharmacy',
  // ... 更多映射
};
```

### 使用方式

```javascript
// 根據圖層名稱獲取圖標名稱
const iconName = getLayerIconName('醫院'); // 'hospital'

// 獲取完整的 HTML 標籤
const iconHtml = getLayerIconHtml('hospital'); // '<i class="fas fa-hospital"></i>'

// 獲取 CSS 類別名稱
const iconClass = getLayerIconClass('hospital'); // 'my-layer-icon-hospital'
```

## 🌫️ 霧化樣式系統

### CSS 類別

- `.my-blur-strong`：主要控制項使用 (12px blur, 180% saturate)
- `.my-blur-medium`：次要控制項使用 (8px blur, 150% saturate)
- `.my-blur-light`：下拉選單等使用 (8px blur, 120% saturate)

### 使用方式

```html
<!-- 強化霧化效果 -->
<div class="my-view-switcher-controls my-blur-strong">
  <!-- 輕微霧化效果 -->
  <ul class="dropdown-menu my-blur-light"></ul>
</div>
```

## ✅ 重構優點

1. **集中管理**：所有顏色定義在 CSS 中，易於維護和修改
2. **語義化命名**：使用顏色名稱而非具體顏色值，提高可讀性
3. **樣式復用**：霧化效果統一管理，避免重複代碼
4. **類型安全**：圖標系統使用完整的 HTML 標籤格式
5. **向後兼容**：保持原有功能的同時改善代碼結構

## 🔧 開發者指南

### 添加新顏色

1. 在 `common.css` 中添加新的 CSS 變數：`--my-layer-color-新顏色名`
2. 在 `LAYER_COLOR_NAMES` 陣列中添加新顏色名稱
3. 添加對應的 CSS 類別

### 添加新圖標

1. 在 `LAYER_ICON_MAPPING` 中添加新的映射
2. 在 `getLayerIconHtml()` 函數中添加對應的 HTML 標籤
3. 在 CSS 中添加對應的圖標類別（可選）

### 使用霧化效果

直接在 HTML 元素上添加對應的霧化樣式類別即可，無需重複定義 CSS。

## 📋 測試檢查清單

- [x] 應用程式正常啟動
- [x] 圖層顏色正確顯示
- [x] 霧化效果正常運作
- [x] 圖標系統功能正常
- [x] ESLint 檢查通過
- [x] Prettier 格式化完成
- [x] 無 console 錯誤（僅有 warning）

## 🎯 未來改進建議

1. **主題系統**：可以基於現有的顏色變數系統擴展為完整的主題切換功能
2. **圖標庫擴展**：可以支援更多圖標庫（如 Material Icons）
3. **動態顏色**：可以實現根據數據動態生成顏色的功能
4. **無障礙支援**：為顏色系統添加無障礙支援（如高對比度模式）
