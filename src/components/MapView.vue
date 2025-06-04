<template>
  <div id="map-container" class="h-100 w-100 position-relative">
    <!-- 🐛 調試信息 (Debug Info) -->
    <div class="position-absolute top-0 start-0 bg-info text-white p-2 small" style="z-index: 1001;">
      地圖狀態: {{ mapStatus }}
    </div>
    
    <!-- 🎛️ 底圖控制區 (Basemap Control) -->
    <div class="basemap-control card shadow-sm" style="top: 80px; right: 15px;">
      <div class="card-body p-2">
        <label for="basemap-select" class="form-label mb-1 small fw-medium">底圖選擇</label>
        <select 
          id="basemap-select"
          class="form-select form-select-sm" 
          v-model="selectedBasemap" 
          @change="changeBasemap">
          <option value="osm">OpenStreetMap</option>
          <option value="satellite">衛星圖</option>
          <option value="terrain">地形圖</option>
          <option value="dark">深色模式</option>
        </select>
        
        <!-- 🎯 顯示全部按鈕 -->
        <div class="mt-2">
          <button 
            class="btn btn-outline-primary btn-sm w-100"
            @click="showAllFeatures"
            :disabled="!tainanGeoJSONData || !showTainanLayer">
            <i class="fas fa-expand-arrows-alt me-1"></i>
            顯示全部
          </button>
        </div>
      </div>
    </div>
    
    <!-- 🗺️ 地圖容器 -->
    <div id="leaflet-map" ref="mapContainer" class="h-100 w-100"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getColorByCount } from '../utils/dataProcessor.js'

// 修復 Leaflet 默認圖標問題
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
})

export default {
  name: 'MapView',
  props: {
    showTainanLayer: { type: Boolean, default: false },
    selectedFilter: { type: String, default: '' },
    selectedColorScheme: { type: String, default: 'viridis' },
    zoomLevel: { type: Number, default: 10 },
    tainanGeoJSONData: { type: Object, default: null },
    maxCount: { type: Number, default: 0 }
  },
  emits: ['update:zoomLevel', 'update:currentCoords', 'update:activeMarkers'],
  setup(props, { emit }) {
    const mapContainer = ref(null)
    const mapStatus = ref('初始化中...')
    const selectedBasemap = ref('osm')
    
    let map = null
    let tainanLayer = null
    let currentTileLayer = null
    
    // 底圖配置
    const basemaps = {
      osm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
      },
      satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '© Esri'
      },
      terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '© OpenTopoMap'
      },
      dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© CartoDB'
      }
    }
    
    // 根據數量值獲取徽章樣式類別
    const getCountBadgeClass = (count) => {
      if (!count || count === 0) return 'bg-secondary'
      if (count <= 10) return 'bg-success'
      if (count <= 50) return 'bg-warning text-dark'
      return 'bg-danger'
    }
    
    // 初始化地圖
    const initMap = () => {
      if (map) {
        console.log('地圖已存在，跳過初始化')
        return
      }
      
      try {
        console.log('開始初始化地圖...')
        mapStatus.value = '創建地圖實例...'
        
        // 創建地圖
        map = L.map(mapContainer.value, {
          center: [22.9908, 120.2133], // 台南市中心
          zoom: props.zoomLevel,
          zoomControl: true,
          attributionControl: true
        })
        
        mapStatus.value = '載入底圖...'
        
        // 載入初始底圖
        loadBasemap()
        
        // 地圖事件
        map.on('zoomend', () => {
          emit('update:zoomLevel', map.getZoom())
        })
        
        map.on('moveend', () => {
          const center = map.getCenter()
          emit('update:currentCoords', { lat: center.lat, lng: center.lng })
        })
        
        mapStatus.value = '地圖已就緒'
        console.log('地圖初始化完成')
        
      } catch (error) {
        console.error('地圖初始化錯誤:', error)
        mapStatus.value = '初始化失敗: ' + error.message
      }
    }
    
    // 載入底圖
    const loadBasemap = () => {
      if (currentTileLayer) {
        map.removeLayer(currentTileLayer)
      }
      
      const basemap = basemaps[selectedBasemap.value]
      currentTileLayer = L.tileLayer(basemap.url, {
        attribution: basemap.attribution,
        maxZoom: 18
      })
      
      currentTileLayer.addTo(map)
      console.log(`底圖已切換至: ${selectedBasemap.value}`)
    }
    
    // 切換底圖
    const changeBasemap = () => {
      if (map) {
        loadBasemap()
      }
    }
    
    // 創建台南圖層
    const createTainanLayer = () => {
      console.log('創建台南圖層...')
      
      // 清除現有圖層
      if (tainanLayer) {
        map.removeLayer(tainanLayer)
        tainanLayer = null
      }
      
      if (props.showTainanLayer && props.tainanGeoJSONData && map) {
        try {
          tainanLayer = L.geoJSON(props.tainanGeoJSONData, {
            style: (feature) => {
              const count = feature.properties.count || 0
              const color = getColorByCount(count, props.maxCount, props.selectedColorScheme)
              
              return {
                fillColor: color,
                weight: 2,
                opacity: 1,
                color: '#666',
                fillOpacity: 0.7
              }
            },
            onEachFeature: (feature, layer) => {
              const name = feature.properties.name || feature.properties.TOWNNAME || '未知區域'
              const count = feature.properties.count || 0
              const code = feature.properties.code2 || feature.properties.TOWNCODE || '未知代碼'
              
              // 綁定彈出視窗
              const popupContent = `
                <div class="map-popup">
                  <h6 class="text-primary mb-2">
                    <i class="fas fa-map-marker-alt"></i> ${name}
                  </h6>
                  <p class="mb-1"><strong>行政區代碼:</strong> ${code}</p>
                  <p class="mb-1">
                    <strong>登革熱案例數:</strong> 
                    <span class="badge ${getCountBadgeClass(count)}">${count.toLocaleString()}</span>
                  </p>
                  <p class="mb-0 text-muted">
                    <small>點擊可查看詳細資訊</small>
                  </p>
                </div>
              `
              layer.bindPopup(popupContent)
              
              // 綁定工具提示
              layer.bindTooltip(`${name}: ${count}`, {
                permanent: false,
                direction: 'center',
                className: 'custom-tooltip'
              })
              
              // 滑鼠事件處理
              layer.on({
                mouseover: function(e) {
                  const layer = e.target
                  layer.setStyle({
                    weight: 3,
                    color: '#333',
                    fillOpacity: 0.8
                  })
                  layer.bringToFront()
                },
                mouseout: function(e) {
                  tainanLayer.resetStyle(e.target)
                },
                click: function(e) {
                  const layer = e.target
                  map.fitBounds(layer.getBounds())
                  
                  const center = layer.getBounds().getCenter()
                  emit('update:currentCoords', { lat: center.lat, lng: center.lng })
                  
                  console.log(`點擊區域: ${name} (${code})`)
                }
              })
            }
          })
          
          tainanLayer.addTo(map)
          
          const featureCount = props.tainanGeoJSONData.features ? props.tainanGeoJSONData.features.length : 0
          emit('update:activeMarkers', featureCount)
          
          console.log(`台南圖層創建完成，包含 ${featureCount} 個區域`)
          
        } catch (error) {
          console.error('創建台南圖層錯誤:', error)
        }
      } else {
        emit('update:activeMarkers', 0)
      }
    }
    
    // 顯示所有要素
    const showAllFeatures = () => {
      if (map && tainanLayer) {
        try {
          const bounds = tainanLayer.getBounds()
          if (bounds.isValid()) {
            map.fitBounds(bounds, {
              paddingTopLeft: [20, 20],
              paddingBottomRight: [20, 80]
            })
          }
        } catch (error) {
          console.error('顯示全部功能錯誤:', error)
        }
      }
    }
    
    // 高亮功能
    const highlightFeature = (code2) => {
      if (!tainanLayer || !code2) return

      tainanLayer.eachLayer((layer) => {
        const feature = layer.feature
        if (feature && feature.properties && feature.properties.code2 === code2) {
          layer.setStyle({
            weight: 4,
            color: '#ff0000',
            dashArray: '5,5',
            fillOpacity: 0.9
          })
          
          map.fitBounds(layer.getBounds())
          layer.openPopup()
          
          console.log(`高亮區域: ${feature.properties.name || code2}`)
        }
      })
    }
    
    // 重置視圖
    const resetView = () => {
      if (map) {
        map.setView([22.9908, 120.2133], 10)
        console.log('地圖視圖已重置')
      }
    }
    
    // 適應台南邊界
    const fitToTainanBounds = () => {
      if (map && tainanLayer) {
        map.fitBounds(tainanLayer.getBounds())
        console.log('地圖已適應台南邊界')
      }
    }
    
    // 刷新地圖大小
    const invalidateSize = () => {
      if (map) {
        nextTick(() => {
          map.invalidateSize()
          console.log('地圖大小已刷新')
        })
      }
    }
    
    // 監聽屬性變化
    watch(() => props.showTainanLayer, () => {
      console.log('台南圖層顯示狀態變更:', props.showTainanLayer)
      createTainanLayer()
    })
    
    watch(() => props.tainanGeoJSONData, () => {
      console.log('台南GeoJSON數據變更')
      createTainanLayer()
    })
    
    watch(() => props.selectedColorScheme, () => {
      console.log('色票方案變更:', props.selectedColorScheme)
      createTainanLayer()
    })
    
    watch(() => props.maxCount, () => {
      console.log('最大計數值變更:', props.maxCount)
      createTainanLayer()
    })
    
    watch(() => props.zoomLevel, (newZoom) => {
      if (map && map.getZoom() !== newZoom) {
        map.setZoom(newZoom)
      }
    })
    
    // 組件掛載
    onMounted(() => {
      console.log('MapView 組件已掛載')
      nextTick(() => {
        initMap()
        createTainanLayer()
      })
    })
    
    // 組件卸載
    onUnmounted(() => {
      if (map) {
        map.remove()
        map = null
        console.log('地圖已清理')
      }
    })
    
    return {
      mapContainer,
      mapStatus,
      selectedBasemap,
      changeBasemap,
      highlightFeature,
      resetView,
      fitToTainanBounds,
      invalidateSize,
      showAllFeatures
    }
  }
}
</script>

<style scoped>
/* 地圖容器樣式 */
#map-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #f0f0f0;
}

#leaflet-map {
  height: 100% !important;
  width: 100% !important;
  z-index: 1;
}

/* 底圖控制樣式 */
.basemap-control {
  position: absolute;
  z-index: 1000;
  min-width: 160px;
}

.basemap-control select {
  font-size: 0.875rem;
}

/* 自定義工具提示樣式 */
:global(.custom-tooltip) {
  background-color: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  color: white !important;
  font-size: 12px !important;
  padding: 4px 8px !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
}

/* 地圖彈出視窗樣式 */
:global(.map-popup) {
  font-family: 'Noto Sans TC', sans-serif;
  min-width: 200px;
}

:global(.map-popup h6) {
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
  margin-bottom: 8px;
}

:global(.map-popup .badge) {
  font-size: 11px;
}

/* Leaflet 控制項樣式覆蓋 */
:global(.leaflet-control-zoom a) {
  background-color: white !important;
  border-color: #ccc !important;
  color: #333 !important;
}

:global(.leaflet-control-zoom a:hover) {
  background-color: #f4f4f4 !important;
}

:global(.leaflet-control-attribution) {
  background-color: rgba(255, 255, 255, 0.8) !important;
  color: #333 !important;
  font-size: 11px !important;
}
</style> 