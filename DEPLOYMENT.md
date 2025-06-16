# 部署說明

## GitHub Pages 自動部署

本專案已設置 GitHub Actions 自動部署到 GitHub Pages。

### 設置步驟

1. **推送代碼到 GitHub**

   ```bash
   git add .
   git commit -m "準備部署到 GitHub Pages"
   git push origin main
   ```

2. **啟用 GitHub Pages**

   - 進入 GitHub 儲存庫設置
   - 點擊 "Pages" 分頁
   - 在 "Source" 下選擇 "GitHub Actions"
   - 儲存設置

3. **檢查部署狀態**
   - 在 "Actions" 分頁查看工作流程狀態
   - 部署完成後，網站將在以下網址可用：
     `https://kevin7261.github.io/long-term-care-web/`

## 手動部署 (備選方案)

如果需要手動部署：

```bash
# 建置專案
npm run build

# 使用 gh-pages 部署
npm run deploy
```

## 注意事項

- 確保 `vue.config.js` 中的 `publicPath` 設置正確
- GitHub Actions 需要寫入權限才能部署到 Pages
- 首次部署可能需要幾分鐘時間才能生效
