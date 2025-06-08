# Donkey Fever Analysis - 空間分析視覺化專案

這是一個基於 Vue.js 3、Leaflet 地圖和 D3.js 的空間分析視覺化網站。

## 功能特色

- **響應式設計**: 使用 Bootstrap 5 實現的 12 欄網格佈局
- **互動式地圖**: 整合 Leaflet 地圖，支援多圖層顯示
- **數據視覺化**: 使用 D3.js 創建各種圖表
- **狀態管理**: 使用 Pinia 進行應用狀態管理
- **自動部署**: 支援 GitHub Pages 自動部署

## 版面配置

- **左側控制面版** (2 欄): 圖層控制、篩選條件
- **主畫面** (8 欄): 
  - 上方 75%: Leaflet 互動式地圖
  - 下方 25%: 主畫面控制面版
- **右側控制面版** (2 欄): 數據統計、圖表類型選擇

## 本地開發

### 安裝依賴
```bash
npm install
```

### 啟動開發服務器
```bash
npm run serve
```

開發服務器將在 `http://192.168.1.102:8080/long-term-care-web` 上運行。

### 編譯和最小化生產版本
```bash
npm run build
```

## GitHub Pages 部署

### 手動部署
```bash
npm run deploy
```

### 自動部署
推送到 `main` 或 `master` 分支時會自動觸發 GitHub Actions 部署到 GitHub Pages。

### 部署前設置
1. 在 GitHub 倉庫設置中啟用 GitHub Pages
2. 更新 `package.json` 中的 `homepage` 字段為你的 GitHub Pages URL
3. 確保你的倉庫名稱是 `long-term-care-web`

## 技術棧

- **前端框架**: Vue.js 3 (Composition API)
- **UI 框架**: Bootstrap 5
- **地圖庫**: Leaflet
- **數據視覺化**: D3.js
- **狀態管理**: Pinia
- **建構工具**: Vue CLI
- **部署**: GitHub Pages + GitHub Actions

## 專案結構

```
src/
├── App.vue           # 主應用組件
├── main.js          # 應用入口點
├── assets/          # 靜態資源
└── components/      # Vue 組件

public/              # 公共資源
.github/
└── workflows/
    └── deploy.yml   # GitHub Actions 部署配置
```

## 開發指南

### 添加新的地圖圖層
在 `App.vue` 的 `initializeMap()` 方法中添加新的圖層：

```javascript
const newLayer = L.tileLayer('your-tile-server-url/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Your attribution'
}).addTo(map)
```

### 使用 D3.js 創建圖表
在 `setChartType()` 方法中實現不同類型的圖表：

```javascript
const setChartType = (type) => {
  // 使用 D3.js 創建圖表
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", 400)
    .attr("height", 300)
}
```

## 許可證

MIT License
