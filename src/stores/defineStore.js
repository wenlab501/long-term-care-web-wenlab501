import { defineStore } from 'pinia'

export const useDefineStore = defineStore('define', {
  state: () => ({
    // 色票選項
    colorSchemes: [
      { label: 'Viridis', value: 'viridis' },
      { label: 'Plasma', value: 'plasma' },
      { label: 'Inferno', value: 'inferno' },
      { label: 'Magma', value: 'magma' },
      { label: 'Cividis', value: 'cividis' }
    ],
    // 地圖底圖選項
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
    // 分析方法選項
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
    // 其他全域常數
    defaultMapZoom: 10,
    availableFileTypes: ['geojson', 'xlsx', 'csv']
  })
}) 