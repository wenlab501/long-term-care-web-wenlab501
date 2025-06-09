/**
 * 📍 座標轉換工具庫
 * 
 * 長照空間分析系統的精確座標轉換模組
 * 專門處理台灣地區 TWD97 與 WGS84 座標系統間的轉換
 * 
 * 座標系統說明：
 * - 🇹🇼 TWD97 (EPSG:3826): 台灣地區官方座標系統
 * - 🌍 WGS84 (EPSG:4326): 國際標準地理座標系統
 * 
 * 轉換特色：
 * - 🎯 高精度轉換演算法 (使用 GRS80 橢球參數)
 * - ⚡ 簡化版快速轉換 (適用於效能要求場景)
 * - 📏 精確的距離計算 (Haversine 公式)
 * - 🔍 座標範圍驗證 (台灣邊界檢查)
 * 
 * 應用場景：
 * - 長照機構座標標準化
 * - GIS 資料格式整合
 * - 地圖圖層疊加顯示
 * - 空間分析計算
 * 
 * 技術規格：
 * - 基準橢球：GRS80
 * - 投影方式：橫麥卡托投影 (TM2)
 * - 中央經線：121°E
 * - 比例因子：0.9999
 * 
 * @author 長照空間分析團隊
 * @version 1.0.0
 * @since 2024
 */

/**
 * TWD97 (EPSG:3826) 轉 WGS84 (EPSG:4326) 座標轉換
 * 使用較精確的轉換參數，適用於台灣地區
 * @param {number} x - TWD97 X座標 (東距)
 * @param {number} y - TWD97 Y座標 (北距)  
 * @returns {Array} [lng, lat] WGS84座標
 */
export function twd97ToWgs84Precise(x, y) {
  // TWD97 TM2分帶投影參數
  const a = 6378137.0 // GRS80橢球長半軸
  const f = 1 / 298.257222101 // GRS80橢球扁率
  const k0 = 0.9999 // 比例因子
  const lon0 = 121.0 * Math.PI / 180 // 中央經線 121°E
  const x0 = 250000 // 東偏移量 250km
  const y0 = 0 // 北偏移量
  
  // 計算橢球參數
  const e2 = f * (2 - f)
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2))
  
  // 移除偏移量
  const x1 = x - x0
  const y1 = y - y0
  
  // 計算子午線弧長參數
  const M = y1 / k0
  const mu = M / (a * (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256))
  
  // 計算緯度
  const phi1 = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) +
    (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) +
    (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu)
  
  // 計算輔助參數
  const C1 = e2 * Math.cos(phi1) * Math.cos(phi1) / (1 - e2)
  const T1 = Math.tan(phi1) * Math.tan(phi1)
  const N1 = a / Math.sqrt(1 - e2 * Math.sin(phi1) * Math.sin(phi1))
  const R1 = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(phi1) * Math.sin(phi1), 1.5)
  const D = x1 / (N1 * k0)
  
  // 計算經緯度
  const lat = phi1 - (N1 * Math.tan(phi1) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * e2) * D * D * D * D / 24 +
    (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * e2 - 3 * C1 * C1) * D * D * D * D * D * D / 720)
  
  const lon = lon0 + (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * e2 + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1)
  
  // 轉換為度數
  const latDeg = lat * 180 / Math.PI
  const lonDeg = lon * 180 / Math.PI
  
  return [lonDeg, latDeg]
}

/**
 * 簡化版TWD97轉WGS84轉換（快速但精度稍低）
 * @param {number} x - TWD97 X座標
 * @param {number} y - TWD97 Y座標  
 * @returns {Array} [lng, lat] WGS84座標
 */
export function twd97ToWgs84Simple(x, y) {
  // 台灣地區的近似轉換參數
  const offsetX = 250000
  const offsetY = 0
  
  // 移除偏移量
  const normalizedX = x - offsetX
  const normalizedY = y - offsetY
  
  // 簡化的線性轉換（適用於台灣南部）
  const lat = 22.0 + normalizedY / 111000
  const lng = 120.0 + normalizedX / (111000 * Math.cos(lat * Math.PI / 180))
  
  return [lng, lat]
}

/**
 * 計算兩點間距離（公里）
 * @param {number} lat1 - 第一點緯度
 * @param {number} lng1 - 第一點經度
 * @param {number} lat2 - 第二點緯度
 * @param {number} lng2 - 第二點經度
 * @returns {number} 距離（公里）
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // 地球半徑（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 驗證轉換結果是否在台灣範圍內
 * @param {number} lng - 經度
 * @param {number} lat - 緯度
 * @returns {boolean} 是否在台灣範圍內
 */
export function isInTaiwanBounds(lng, lat) {
  return lng >= 119.0 && lng <= 122.5 && lat >= 21.5 && lat <= 25.5
} 