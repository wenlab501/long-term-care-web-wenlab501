/**
 * 🔧 defineStore.js - 全域定義與常數管理模組
 * 
 * 🎯 功能說明：
 * 1. 🎨 管理色票方案選項（Viridis, Plasma, Inferno 等）
 * 2. 🗺️ 定義地圖底圖選項（OSM, Esri, Google Maps 等）
 * 3. 📊 提供分析方法選項（空間自相關、聚集檢測等）
 * 4. ⚙️ 管理全域常數和預設值
 * 5. 📋 定義可用的檔案類型和格式
 * 
 * 🏗️ 架構說明：
 * - colorSchemes：色彩方案清單，支援多種科學色票
 * - basemaps：地圖底圖選項，包含國內外主流地圖服務
 * - analysisMethods：空間分析方法清單
 * - 全域預設值：地圖縮放等級、檔案類型支援等
 * 
 * 💡 設計理念：
 * - 使用 Pinia Options API 模式儲存靜態定義
 * - 提供標準化的選項清單給各組件使用
 * - 集中管理常數避免重複定義
 * - 支援國際化和本地化需求
 */

import { defineStore } from 'pinia'

/**
 * 🔧 全域定義存儲 (Global Definition Store)
 * 管理應用程式中的所有靜態定義和常數選項
 */
export const useDefineStore = defineStore('define', {
  state: () => ({
    // 🎨 色票選項 (Color Scheme Options)
    colorSchemes: [
      { label: 'Viridis', value: 'viridis' },
      { label: 'Plasma', value: 'plasma' },
      { label: 'Inferno', value: 'inferno' },
      { label: 'Magma', value: 'magma' },
      { label: 'Cividis', value: 'cividis' }
          ],
      // 🗺️ 地圖底圖選項 (Basemap Options)
      basemaps: [
      { label: 'OpenStreetMap', value: 'osm' },
      { label: 'Esri Street', value: 'esri_street' },
      { label: 'Esri Topo', value: 'esri_topo' },
      { label: 'Esri Imagery', value: 'esri_imagery' },
      { label: 'Google Maps 街道', value: 'google_road' },
      { label: 'Google Maps 衛星', value: 'google_satellite' },
      { label: '國土規劃中心電子地圖', value: 'nlsc_emap' },
      { label: '國土規劃中心正射影像', value: 'nlsc_photo' },
      { label: '地形圖', value: 'terrain' },
      { label: '空照圖 (Esri)', value: 'aerial' },
      { label: '空白無地圖', value: 'blank' }
          ],
      // 📊 分析方法選項 (Analysis Method Options)
      analysisMethods: [
      { label: '空間自相關', value: 'spatial_autocorrelation' },
      { label: '聚集檢測', value: 'cluster_detection' },
      { label: '最近鄰分析', value: 'nearest_neighbor' },
      { label: '空間滯後', value: 'spatial_lag' },
      { label: '熱點分析', value: 'hotspot_analysis' },
      { label: '描述統計', value: 'descriptive_statistics' },
      { label: '相關分析', value: 'correlation_analysis' },
      { label: '聚類分析', value: 'clustering' }
          ],
      // ⚙️ 其他全域常數 (Other Global Constants)
      defaultMapZoom: 10,
    availableFileTypes: ['geojson', 'xlsx', 'csv']
  })
}) 