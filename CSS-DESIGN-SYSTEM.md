# CSS 設計系統使用指南

## 概述

本項目採用統一的CSS設計系統來管理樣式，確保視覺一致性和維護便利性。設計系統包含字體、顏色、間距、陰影等所有設計元素的標準化定義。

## 文件結構

```
src/assets/css/
├── variables.css      # 所有CSS變數定義
├── common.css         # 通用樣式和組件樣式
└── README.md         # 本說明文件
```

## CSS 變數系統

### 字體系統

#### 字體族

- `--my-font-family-primary`: 'Noto Sans TC', sans-serif (主要字體)
- `--my-font-family-monospace`: 'Consolas', 'Monaco', 'Courier New', monospace
  (等寬字體)

#### 字體大小

```css
--my-font-size-xs: 0.75rem /* 12px */ --my-font-size-sm: 0.875rem /* 14px */
  --my-font-size-base: 1rem /* 16px - 基準大小 */ --my-font-size-lg: 1.125rem
  /* 18px */ --my-font-size-xl: 1.25rem /* 20px */ --my-font-size-2xl: 1.5rem
  /* 24px */ --my-font-size-3xl: 1.875rem /* 30px */ --my-font-size-4xl: 2.25rem
  /* 36px */;
```

#### 字重

```css
--my-font-weight-light: 300 --my-font-weight-normal: 400
  --my-font-weight-medium: 500 --my-font-weight-semibold: 600
  --my-font-weight-bold: 700;
```

#### 行高

```css
--my-line-height-tight: 1.25 --my-line-height-normal: 1.5
  --my-line-height-relaxed: 1.75;
```

### 顏色系統

#### 主色調（藍色系）

```css
--my-color-primary-50: #e3f2fd /* 最淺 */ --my-color-primary-500: #2196f3
  /* 主色 */ --my-color-primary-900: #0d47a1 /* 最深 */;
```

#### 功能色

- **成功色（綠色）**: `--my-color-success-*`
- **警告色（橙黃）**: `--my-color-warning-*`
- **危險色（紅色）**: `--my-color-danger-*`
- **信息色（青色）**: `--my-color-info-*`

#### 中性色（灰階）

```css
--my-color-gray-50: #fafafa /* 最淺灰 */ --my-color-gray-500: #9e9e9e
  /* 中性灰 */ --my-color-gray-900: #212121 /* 最深灰 */;
```

#### 語義化顏色

```css
--my-text-primary: 主要文字顏色 --my-text-secondary: 次要文字顏色
  --my-text-muted: 柔和文字顏色 --my-bg-primary: 主要背景色
  --my-bg-secondary: 次要背景色 --my-border-light: 淺色邊框
  --my-border-normal: 標準邊框;
```

### 間距系統

採用 4px 基準的間距系統：

```css
--my-spacing-1: 0.25rem /* 4px */ --my-spacing-2: 0.5rem /* 8px */
  --my-spacing-3: 0.75rem /* 12px */ --my-spacing-4: 1rem /* 16px */
  --my-spacing-5: 1.25rem /* 20px */ --my-spacing-6: 1.5rem /* 24px */
  --my-spacing-8: 2rem /* 32px */ --my-spacing-10: 2.5rem /* 40px */
  --my-spacing-12: 3rem /* 48px */ --my-spacing-16: 4rem /* 64px */
  --my-spacing-20: 5rem /* 80px */ --my-spacing-24: 6rem /* 96px */;
```

### 圓角系統

```css
--my-radius-none: 0 --my-radius-sm: 0.125rem /* 2px */ --my-radius-base: 0.25rem
  /* 4px */ --my-radius-md: 0.375rem /* 6px */ --my-radius-lg: 0.5rem /* 8px */
  --my-radius-xl: 0.75rem /* 12px */ --my-radius-2xl: 1rem /* 16px */
  --my-radius-full: 9999px /* 完全圓形 */;
```

### 陰影系統

```css
--my-shadow-sm:
  0 1px 2px 0 rgba(0, 0, 0, 0.05) --my-shadow-base: 0 1px 3px 0
    rgba(0, 0, 0, 0.1),
  0 1px 2px 0 rgba(0, 0, 0, 0.06) --my-shadow-md: 0 4px 6px -1px
    rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06) --my-shadow-lg: 0 10px 15px -3px
    rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05) --my-shadow-xl: 0 20px 25px -5px
    rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04) --my-shadow-2xl: 0 25px 50px -12px
    rgba(0, 0, 0, 0.25);
```

### Z-Index 層級管理

```css
--my-z-index-dropdown: 1000 --my-z-index-sticky: 1020 --my-z-index-fixed: 1030
  --my-z-index-modal-backdrop: 1040 --my-z-index-modal: 1050
  --my-z-index-popover: 1060 --my-z-index-tooltip: 1070
  --my-z-index-loading: 9999;
```

### 過渡動畫

```css
--my-transition-fast:
  all 0.15s ease --my-transition-base: all 0.2s ease --my-transition-slow: all
    0.3s ease --my-transition-colors: color 0.15s ease,
  background-color 0.15s ease, border-color 0.15s ease;
```

## 實用工具類別

設計系統提供了預定義的實用工具類別：

### 字體大小

```css
.text-xs {
  font-size: var(--my-font-size-xs);
}
.text-sm {
  font-size: var(--my-font-size-sm);
}
.text-base {
  font-size: var(--my-font-size-base);
}
.text-lg {
  font-size: var(--my-font-size-lg);
}
/* 等等... */
```

### 字重

```css
.font-light {
  font-weight: var(--my-font-weight-light);
}
.font-normal {
  font-weight: var(--my-font-weight-normal);
}
.font-medium {
  font-weight: var(--my-font-weight-medium);
}
/* 等等... */
```

### 顏色

```css
.text-primary {
  color: var(--my-text-primary);
}
.text-secondary {
  color: var(--my-text-secondary);
}
.bg-primary {
  background-color: var(--my-bg-primary);
}
/* 等等... */
```

### 圓角

```css
.rounded-sm {
  border-radius: var(--my-radius-sm);
}
.rounded {
  border-radius: var(--my-radius-base);
}
.rounded-lg {
  border-radius: var(--my-radius-lg);
}
/* 等等... */
```

### 陰影

```css
.shadow-sm {
  box-shadow: var(--my-shadow-sm);
}
.shadow {
  box-shadow: var(--my-shadow-base);
}
.shadow-lg {
  box-shadow: var(--my-shadow-lg);
}
/* 等等... */
```

## 使用方式

### 1. 在CSS中使用變數

```css
.my-component {
  font-size: var(--my-font-size-lg);
  color: var(--my-text-primary);
  background-color: var(--my-bg-secondary);
  padding: var(--my-spacing-4) var(--my-spacing-6);
  border-radius: var(--my-radius-lg);
  box-shadow: var(--my-shadow-md);
  transition: var(--my-transition-base);
}

.my-component:hover {
  background-color: var(--my-color-primary-50);
  box-shadow: var(--my-shadow-lg);
}
```

### 2. 使用實用工具類別

```html
<div class="text-lg font-medium text-primary bg-secondary rounded-lg shadow-md">
  這是一個使用工具類別的元素
</div>
```

### 3. 在Vue組件中使用

```vue
<template>
  <div class="card">
    <h3 class="text-xl font-semibold text-primary">標題</h3>
    <p class="text-base text-secondary">內容文字</p>
  </div>
</template>

<style scoped>
  .card {
    background-color: var(--my-bg-primary);
    border: 1px solid var(--my-border-light);
    border-radius: var(--my-radius-lg);
    padding: var(--my-spacing-6);
    box-shadow: var(--my-shadow-base);
    transition: var(--my-transition-base);
  }

  .card:hover {
    box-shadow: var(--my-shadow-md);
    transform: translateY(-2px);
  }
</style>
```

## 特殊用途顏色

### 數據可視化

```css
--my-color-data-1: var(--my-color-primary-500)
  --my-color-data-2: var(--my-color-success-500)
  --my-color-data-3: var(--my-color-warning-500)
  --my-color-data-4: var(--my-color-danger-500)
  --my-color-data-5: var(--my-color-info-500) --my-color-data-6: #9c27b0
  --my-color-data-7: #ff5722 --my-color-data-8: #795548;
```

### 熱力圖配色

```css
--my-color-heat-0: var(--my-color-gray-300) /* 無數據 */
  --my-color-heat-1: var(--my-color-primary-100) /* 低強度 */
  --my-color-heat-2: var(--my-color-primary-300) /* 中低強度 */
  --my-color-heat-3: var(--my-color-warning-400) /* 中高強度 */
  --my-color-heat-4: var(--my-color-danger-500) /* 高強度 */;
```

## 深色模式支援

設計系統預留了深色模式的支援，當系統偏好深色模式時會自動調整：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --my-bg-primary: var(--my-color-gray-900);
    --my-bg-secondary: var(--my-color-gray-800);
    --my-text-primary: var(--my-color-gray-100);
    --my-text-secondary: var(--my-color-gray-300);
    /* 等等... */
  }
}
```

## 最佳實踐

### 1. 優先使用變數

```css
/* 好的做法 */
.component {
  color: var(--my-text-primary);
  font-size: var(--my-font-size-lg);
  padding: var(--my-spacing-4);
}

/* 避免硬編碼 */
.component {
  color: #333;
  font-size: 18px;
  padding: 16px;
}
```

### 2. 利用語義化變數

```css
/* 好的做法 - 語義化 */
.header {
  background-color: var(--my-bg-primary);
  border-bottom: 1px solid var(--my-border-light);
}

/* 避免直接使用數字變數 */
.header {
  background-color: var(--my-color-gray-50);
  border-bottom: 1px solid var(--my-color-gray-200);
}
```

### 3. 善用工具類別

```html
<!--my- 簡單樣式使用工具類別 --my->
<button class="text-sm font-medium rounded shadow transition">
  按鈕
</button>

<!--my- 複雜樣式寫在CSS中 --my->
<div class="custom-component">複雜組件</div>
```

### 4. 保持一致性

- 使用統一的間距系統（4px基準）
- 使用定義好的顏色變數
- 遵循字體大小層級
- 使用標準化的圓角和陰影

## 維護指南

### 添加新顏色

1. 在`variables.css`中定義完整的色階（50-900）
2. 添加語義化變數（如`--my-text-new-color`）
3. 更新此文檔

### 修改現有變數

1. 確保向後兼容性
2. 測試所有使用該變數的組件
3. 更新相關文檔

### 添加新的實用工具類別

1. 在`variables.css`底部添加新類別
2. 遵循現有命名規範
3. 提供使用示例

這個設計系統確保了項目的視覺一致性，同時提供了靈活性和可維護性。請在開發過程中優先使用這些定義好的變數和類別。
