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
- `--font-family-primary`: 'Noto Sans TC', sans-serif (主要字體)
- `--font-family-monospace`: 'Consolas', 'Monaco', 'Courier New', monospace (等寬字體)

#### 字體大小
```css
--font-size-xs: 0.75rem      /* 12px */
--font-size-sm: 0.875rem     /* 14px */
--font-size-base: 1rem       /* 16px - 基準大小 */
--font-size-lg: 1.125rem     /* 18px */
--font-size-xl: 1.25rem      /* 20px */
--font-size-2xl: 1.5rem      /* 24px */
--font-size-3xl: 1.875rem    /* 30px */
--font-size-4xl: 2.25rem     /* 36px */
```

#### 字重
```css
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

#### 行高
```css
--line-height-tight: 1.25
--line-height-normal: 1.5
--line-height-relaxed: 1.75
```

### 顏色系統

#### 主色調（藍色系）
```css
--color-primary-50: #e3f2fd   /* 最淺 */
--color-primary-500: #2196f3  /* 主色 */
--color-primary-900: #0d47a1  /* 最深 */
```

#### 功能色
- **成功色（綠色）**: `--color-success-*`
- **警告色（橙黃）**: `--color-warning-*`
- **危險色（紅色）**: `--color-danger-*`
- **信息色（青色）**: `--color-info-*`

#### 中性色（灰階）
```css
--color-gray-50: #fafafa     /* 最淺灰 */
--color-gray-500: #9e9e9e    /* 中性灰 */
--color-gray-900: #212121    /* 最深灰 */
```

#### 語義化顏色
```css
--text-primary: 主要文字顏色
--text-secondary: 次要文字顏色
--text-muted: 柔和文字顏色
--bg-primary: 主要背景色
--bg-secondary: 次要背景色
--border-light: 淺色邊框
--border-normal: 標準邊框
```

### 間距系統

採用 4px 基準的間距系統：

```css
--spacing-1: 0.25rem    /* 4px */
--spacing-2: 0.5rem     /* 8px */
--spacing-3: 0.75rem    /* 12px */
--spacing-4: 1rem       /* 16px */
--spacing-5: 1.25rem    /* 20px */
--spacing-6: 1.5rem     /* 24px */
--spacing-8: 2rem       /* 32px */
--spacing-10: 2.5rem    /* 40px */
--spacing-12: 3rem      /* 48px */
--spacing-16: 4rem      /* 64px */
--spacing-20: 5rem      /* 80px */
--spacing-24: 6rem      /* 96px */
```

### 圓角系統

```css
--radius-none: 0
--radius-sm: 0.125rem    /* 2px */
--radius-base: 0.25rem   /* 4px */
--radius-md: 0.375rem    /* 6px */
--radius-lg: 0.5rem      /* 8px */
--radius-xl: 0.75rem     /* 12px */
--radius-2xl: 1rem       /* 16px */
--radius-full: 9999px    /* 完全圓形 */
```

### 陰影系統

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Z-Index 層級管理

```css
--z-index-dropdown: 1000
--z-index-sticky: 1020
--z-index-fixed: 1030
--z-index-modal-backdrop: 1040
--z-index-modal: 1050
--z-index-popover: 1060
--z-index-tooltip: 1070
--z-index-loading: 9999
```

### 過渡動畫

```css
--transition-fast: all 0.15s ease
--transition-base: all 0.2s ease
--transition-slow: all 0.3s ease
--transition-colors: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease
```

## 實用工具類別

設計系統提供了預定義的實用工具類別：

### 字體大小
```css
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
/* 等等... */
```

### 字重
```css
.font-light { font-weight: var(--font-weight-light); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
/* 等等... */
```

### 顏色
```css
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.bg-primary { background-color: var(--bg-primary); }
/* 等等... */
```

### 圓角
```css
.rounded-sm { border-radius: var(--radius-sm); }
.rounded { border-radius: var(--radius-base); }
.rounded-lg { border-radius: var(--radius-lg); }
/* 等等... */
```

### 陰影
```css
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow { box-shadow: var(--shadow-base); }
.shadow-lg { box-shadow: var(--shadow-lg); }
/* 等等... */
```

## 使用方式

### 1. 在CSS中使用變數

```css
.my-component {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.my-component:hover {
  background-color: var(--color-primary-50);
  box-shadow: var(--shadow-lg);
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
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
  transition: var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
</style>
```

## 特殊用途顏色

### 數據可視化
```css
--color-data-1: var(--color-primary-500)
--color-data-2: var(--color-success-500)
--color-data-3: var(--color-warning-500)
--color-data-4: var(--color-danger-500)
--color-data-5: var(--color-info-500)
--color-data-6: #9c27b0
--color-data-7: #ff5722
--color-data-8: #795548
```

### 熱力圖配色
```css
--color-heat-0: var(--color-gray-300)    /* 無數據 */
--color-heat-1: var(--color-primary-100) /* 低強度 */
--color-heat-2: var(--color-primary-300) /* 中低強度 */
--color-heat-3: var(--color-warning-400) /* 中高強度 */
--color-heat-4: var(--color-danger-500)  /* 高強度 */
```

## 深色模式支援

設計系統預留了深色模式的支援，當系統偏好深色模式時會自動調整：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--color-gray-900);
    --bg-secondary: var(--color-gray-800);
    --text-primary: var(--color-gray-100);
    --text-secondary: var(--color-gray-300);
    /* 等等... */
  }
}
```

## 最佳實踐

### 1. 優先使用變數
```css
/* 好的做法 */
.component {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  padding: var(--spacing-4);
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
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
}

/* 避免直接使用數字變數 */
.header {
  background-color: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
}
```

### 3. 善用工具類別
```html
<!-- 簡單樣式使用工具類別 -->
<button class="text-sm font-medium rounded shadow transition">
  按鈕
</button>

<!-- 複雜樣式寫在CSS中 -->
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
2. 添加語義化變數（如`--text-new-color`）
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