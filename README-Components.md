# 空間分析視覺化平台 - 組件架構說明

## 項目概述

這是一個基於Vue.js
3的空間分析視覺化平台，專門用於台南市登革熱數據的分析與視覺化。平台採用模塊化架構，將功能拆分為獨立的組件，便於維護和擴展。

## 核心技術棧

- **前端框架**: Vue 3 (Composition API)
- **UI框架**: Bootstrap 5
- **地圖庫**: Leaflet
- **圖表庫**: D3.js
- **圖標庫**: FontAwesome
- **數據處理**: XLSX.js for Excel files
- **樣式**: CSS3 + Custom CSS

## 組件架構

### 主要組件層級

```
App.vue (主應用)
├── LoadingOverlay.vue (全屏載入覆蓋層)
├── LeftView.vue (左側控制面板)
├── MainContent.vue (主內容區域)
│   ├── MapView.vue (地圖視圖)
│   └── DashboardView.vue (數據儀表板)
├── BottomView.vue (底部控制面板)
│   ├── tabs/DataTableTab.vue (數據表格標籤)
│   └── tabs/ControlsTab.vue (控制面板標籤)
└── RightView.vue (右側控制面板)
    ├── tabs/AnalysisResultsTab.vue (分析結果標籤)
    └── tabs/AnalysisListTab.vue (分析清單標籤)
```

### 共用組件 (src/components/common/)

#### 數據顯示組件

- **EmptyState.vue**: 空狀態組件，統一的無數據顯示

#### 互動組件

- **AnalysisItem.vue**: 分析項目組件，顯示分析歷史記錄

### 標籤頁組件 (src/components/tabs/)

#### 底部面板標籤

- **DataTableTab.vue**: 數據表格標籤，顯示合併後的台南數據

#### 右側面板標籤

- **AnalysisResultsTab.vue**: 分析結果標籤，統計數據和操作按鈕
- **AnalysisListTab.vue**: 分析清單標籤，分析歷史管理

## 核心功能模組

### 1. 地圖視覺化 (MapView.vue)

**主要功能:**

- 基於Leaflet的互動式地圖
- 多圖層管理 (商店標記、熱點區域、台南區域)
- GeoJSON數據視覺化
- 動態顏色編碼基於數據值
- 彈出視窗和提示框
- 地圖控制 (縮放、平移、重置)

**關鍵特性:**

- 自動適應台南數據範圍
- 高亮顯示功能
- 響應式設計
- 詳細的控制台日志記錄

### 2. 數據處理 (src/utils/dataProcessor.js)

**主要功能:**

- GeoJSON文件載入
- Excel文件讀取 (特定工作表)
- 數據合併 (GeoJSON + Excel)
- 顏色生成算法
- 大小寫處理和數據清理

**合併邏輯:**

- 使用CODE2 (GeoJSON) 和 name (Excel) 進行匹配
- 處理大小寫差異
- 提供詳細的合併統計
- 支援預設值處理

### 3. 數據儀表板 (DashboardView.vue)

**主要功能:**

- 統計卡片顯示
- D3.js動態圖表
- 柱狀圖和圓餅圖
- 響應式圖表容器
- 實時數據更新

### 4. 分析工作流程

**流程步驟:**

1. 數據載入 (GeoJSON + Excel)
2. 數據合併和驗證
3. 地圖視覺化
4. 統計分析
5. 結果保存和管理

## 數據流架構

### 父子組件通信

```javascript
// 屬性傳遞 (Props)
parent -> child: 數據和配置

// 事件發送 (Emits)
child -> parent: 用戶操作和狀態變更
```

### 狀態管理

所有狀態都在App.vue中集中管理，包括：

- 圖層顯示狀態
- 地圖控制狀態
- 數據載入狀態
- 分析結果狀態
- UI面板狀態

## 樣式系統

### CSS架構 (src/assets/css/common.css)

- **全局樣式**: 基礎重置和字體設定
- **布局樣式**: Flexbox和Grid布局
- **組件樣式**: 卡片、按鈕、表格等
- **主題樣式**: 顏色、陰影、動畫
- **響應式樣式**: 媒體查詢適配

### 設計系統

- **色彩**: 基於Bootstrap的色彩系統
- **間距**: 統一的margin和padding規則
- **字體**: Noto Sans TC中文字體
- **圖標**: FontAwesome圖標庫
- **動畫**: CSS過渡和關鍵幀動畫

## 關鍵修復點

### 1. GeoJSON顯示問題

**問題**: GeoJSON圖層不顯示在地圖上 **解決方案**:

- 修復watch監聽邏輯
- 添加深度監聽
- 改進錯誤處理和日志記錄
- 確保數據載入後觸發圖層創建

### 2. 圖表破圖問題

**問題**: D3.js圖表溢出容器 **解決方案**:

- 重新設計Flexbox佈局
- 添加容器邊界檢查
- 改進響應式處理
- 修復高度計算問題

### 3. 組件模塊化

**問題**: 組件職責不清晰，代碼重複 **解決方案**:

- 拆分為獨立的tab組件
- 創建可重用的common組件
- 清晰的props和emits定義
- 統一的組件介面

## 開發建議

### 1. 新增功能

- 在適當的組件中添加新功能
- 使用共用組件減少重複代碼
- 遵循現有的props/emits模式
- 添加適當的錯誤處理

### 2. 樣式修改

- 使用CSS變數進行主題管理
- 遵循響應式設計原則
- 保持與Bootstrap的一致性
- 測試各種屏幕尺寸

### 3. 數據處理

- 在dataProcessor.js中添加新的工具函數
- 保持數據格式的一致性
- 添加適當的驗證邏輯
- 提供詳細的錯誤訊息

### 4. 性能優化

- 使用computed屬性緩存計算結果
- 避免不必要的重新渲染
- 優化大型數據集的處理
- 使用懶加載減少初始載入時間

## 檔案結構

```
src/
├── components/
│   ├── common/          # 共用組件
│   ├── tabs/            # 標籤頁組件
│   ├── App.vue          # 主應用組件
│   ├── LeftView.vue    # 左側面板
│   ├── RightView.vue   # 右側面板
│   ├── BottomView.vue  # 底部面板
│   ├── MainContent.vue  # 主內容區域
│   ├── MapView.vue      # 地圖組件
│   ├── DashboardView.vue # 儀表板組件
│   └── LoadingOverlay.vue # 載入覆蓋層
├── utils/
│   ├── dataProcessor.js # 數據處理工具
│   └── utils.js         # 通用工具函數
├── assets/
│   └── css/
│       └── common.css   # 主要樣式文件
├── router/              # 路由配置
└── main.js             # 應用入口
```

## 維護指南

### 1. 日常維護

- 定期檢查控制台錯誤
- 更新依賴套件
- 測試數據載入功能
- 驗證圖表顯示

### 2. 問題排查

- 檢查Vue DevTools
- 查看瀏覽器控制台
- 驗證數據格式
- 測試網路連接

### 3. 代碼品質

- 使用ESLint檢查
- 遵循Vue.js最佳實踐
- 保持組件職責單一
- 編寫清晰的註釋

## 部署說明

### 開發環境

```bash
npm install
npm run serve
```

### 生產環境

```bash
npm run build
```

構建後的文件在`dist/`目錄中，可以部署到任何靜態文件服務器。

---

_最後更新: 2024年6月_
