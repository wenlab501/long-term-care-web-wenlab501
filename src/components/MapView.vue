<template>
  <div id="map-container" class="h-100 w-100 position-relative">
    <!-- 🎛️ 底圖控制區 (Basemap Control) - 使用Bootstrap卡片樣式 -->
    <div class="basemap-control card shadow-sm">
      <div class="card-body p-2">
        <!-- 🗺️ 底圖選擇器 (Basemap Selector) -->
        <label for="basemap-select" class="form-label mb-1 small fw-medium">底圖選擇</label>
        <select 
          id="basemap-select"
          class="form-select form-select-sm" 
          :value="selectedBasemap" 
          @change="changeBasemap">
          <option value="osm">OpenStreetMap</option>
          <option value="google-roadmap">Google 道路圖</option>
          <option value="google-satellite">Google 衛星圖</option>
          <option value="google-hybrid">Google 混合圖</option>
          <option value="esri-world">Esri 世界地圖</option>
          <option value="esri-satellite">Esri 衛星圖</option>
          <option value="esri-topo">Esri 地形圖</option>
          <option value="bing-roadmap">Bing 道路圖</option>
          <option value="bing-aerial">Bing 航空圖</option>
          <option value="terrain">OpenTopo 地形圖</option>
          <option value="dark">深色模式</option>
          <option value="blank">空白地圖</option>
        </select>
        
        <!-- 🎯 顯示全部按鈕 (Show All Features Button) - 使用Bootstrap按鈕樣式 -->
        <div class="mt-2">
          <button 
            class="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center"
            @click="showAllFeatures"
            :disabled="!tainanGeoJSONData || !showTainanLayer"
            title="縮放地圖以顯示所有載入的地理要素"
          >
            <i class="fas fa-expand-arrows-alt me-1"></i>
            <span>顯示全部</span>
          </button>
          
          <!-- 📊 數據狀態提示 (Data Status Indicator) -->
          <div v-if="!tainanGeoJSONData" class="mt-1">
            <small class="text-muted d-block text-center">
              <i class="fas fa-info-circle me-1"></i>
              請先載入數據
            </small>
          </div>
          <div v-else-if="showTainanLayer && tainanGeoJSONData" class="mt-1">
            <small class="text-success d-block text-center">
              <i class="fas fa-check-circle me-1"></i>
              {{ getTotalFeatureCount() }} 個要素已載入
            </small>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 🗺️ 地圖容器 (Map Container) -->
    <div id="map" ref="mapContainer" class="h-100 w-100"></div>
  </div>
</template>

<script>
/**
 * 🗺️ MapView.vue - 地圖視圖組件
 * 
 * 功能說明：
 * 1. 🗺️ 提供Leaflet地圖基礎功能
 * 2. 🎨 支援多種底圖切換（OSM、衛星圖、地形圖、深色模式）
 * 3. 📊 顯示台南市GeoJSON數據與視覺化
 * 4. 🎨 支援多種色票方案（Python matplotlib等）
 * 5. 🔍 提供數據篩選功能
 * 6. 🎯 支援地圖互動和高亮功能
 */
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import L from 'leaflet'
import { getColorByCount } from '../utils/dataProcessor.js'

// 🔧 Leaflet圖標修復 - 解決默認標記圖標顯示問題
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'MapView',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 🗺️ 台南圖層顯示狀態 */
    showTainanLayer: {
      type: Boolean,
      default: false,
      required: true
    },
    
    /** 🔍 數據篩選條件 */
    selectedFilter: {
      type: String,
      default: '',
      required: true
    },
    
    /** 🎨 色票方案選擇 */
    selectedColorScheme: {
      type: String,
      default: 'viridis',
      required: true
    },
    
    /** 🔍 地圖縮放級別 */
    zoomLevel: {
      type: Number,
      default: 10,
      required: true
    },
    
    /** 📊 台南GeoJSON數據 */
    tainanGeoJSONData: {
      type: Object,
      default: null
    },
    
    /** 📊 最大計數值（用於標準化顏色） */
    maxCount: {
      type: Number,
      default: 0,
      required: true
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   */
  emits: [
    'update:zoomLevel',
    'update:currentCoords', 
    'update:activeMarkers'
  ],
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup(props, { emit }) {
    // 📚 組件引用 (Component References)
    const mapContainer = ref(null)
    
    // 🗺️ 地圖實例和圖層 (Map Instance and Layers)
    let map = null
    let tainanLayer = null
    let currentTileLayer = null
    let highlightedFeature = null
    
    // 🎨 底圖選擇 (Basemap Selection)
    const selectedBasemap = ref('osm')
    
    // 🗺️ 底圖配置 (Basemap Configuration)
    const basemaps = {
      osm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          maxZoom: 18,
          attribution: '© OpenStreetMap contributors'
        }
      },
      'google-roadmap': {
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        options: {
          maxZoom: 20,
          attribution: '© Google Maps'
        }
      },
      'google-satellite': {
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        options: {
          maxZoom: 20,
          attribution: '© Google Maps'
        }
      },
      'google-hybrid': {
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        options: {
          maxZoom: 20,
          attribution: '© Google Maps'
        }
      },
      'esri-world': {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 19,
          attribution: '© Esri'
        }
      },
      'esri-satellite': {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 19,
          attribution: '© Esri, Maxar, Earthstar Geographics'
        }
      },
      'esri-topo': {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 19,
          attribution: '© Esri'
        }
      },
      'bing-roadmap': {
        url: 'https://ecn.t3.tiles.virtualearth.net/tiles/r{q}?g=1',
        options: {
          maxZoom: 19,
          attribution: '© Microsoft Bing Maps',
          quadkey: true // Bing Maps 使用 quadkey 系統
        }
      },
      'bing-aerial': {
        url: 'https://ecn.t3.tiles.virtualearth.net/tiles/a{q}?g=1',
        options: {
          maxZoom: 19,
          attribution: '© Microsoft Bing Maps',
          quadkey: true
        }
      },
      terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        options: {
          maxZoom: 17,
          attribution: '© OpenTopoMap contributors'
        }
      },
      dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        options: {
          maxZoom: 18,
          attribution: '© CartoDB contributors'
        }
      },
      blank: {
        url: null, // 空白地圖不需要底圖圖磚
        options: {
          maxZoom: 18,
          attribution: '© 空間分析視覺化平台'
        }
      }
    }

    /**
     * 🔄 切換底圖 (Change Basemap)
     */
    const changeBasemap = () => {
      if (map && currentTileLayer) {
        map.removeLayer(currentTileLayer)
        currentTileLayer = null
      }
      
      const basemap = basemaps[selectedBasemap.value]
      
      // 空白地圖不需要底圖圖磚
      if (selectedBasemap.value === 'blank') {
        // 設置地圖容器背景色為淺灰色
        if (map) {
          const mapContainer = map.getContainer()
          mapContainer.style.backgroundColor = '#f8f9fa'
        }
        console.log('🗺️ 已切換至空白地圖模式')
      } else {
        // 恢復地圖容器背景色
        if (map) {
          const mapContainer = map.getContainer()
          mapContainer.style.backgroundColor = ''
        }
        
        // 創建新的圖磚圖層
        if (basemap.options.quadkey) {
          // Bing Maps 使用特殊的 quadkey 系統
          currentTileLayer = L.tileLayer(basemap.url, {
            ...basemap.options,
            tileSize: 256,
            zoomOffset: 0,
            // 自定義 getTileUrl 方法處理 quadkey
            getTileUrl: function (coords) {
              const quadkey = tileToQuadKey(coords.x, coords.y, coords.z)
              return basemap.url.replace('{q}', quadkey)
            }
          })
        } else {
          // 標準圖磚系統
          currentTileLayer = L.tileLayer(basemap.url, basemap.options)
        }
        
        if (map) {
          currentTileLayer.addTo(map)
        }
        console.log(`🗺️ 底圖已切換至: ${selectedBasemap.value}`)
      }
    }

    /**
     * 🔧 將瓦片坐標轉換為 Bing Maps quadkey
     * @param {number} x - X 坐標
     * @param {number} y - Y 坐標
     * @param {number} z - 縮放級別
     * @returns {string} quadkey 字串
     */
    const tileToQuadKey = (x, y, z) => {
      let quadkey = ''
      for (let i = z; i > 0; i--) {
        let digit = 0
        const mask = 1 << (i - 1)
        if ((x & mask) !== 0) digit++
        if ((y & mask) !== 0) digit += 2
        quadkey += digit.toString()
      }
      return quadkey
    }

    /**
     * 🎨 根據數量值獲取徽章樣式類別 (Get Count Badge Class)
     * @param {number} count - 數量值
     * @returns {string} Bootstrap徽章類別
     */
    const getCountBadgeClass = (count) => {
      if (!count || count === 0) return 'bg-secondary'
      if (count <= 10) return 'bg-success'
      if (count <= 50) return 'bg-warning text-dark'
      return 'bg-danger'
    }

    /**
     * 🗺️ 創建台南圖層 (Create Tainan Layer)
     * 根據GeoJSON數據創建台南市行政區域圖層
     */
    const createTainanLayer = () => {
      console.log('🗺️ 正在創建台南圖層...')
      
      // 清除現有圖層
      if (tainanLayer) {
        map.removeLayer(tainanLayer)
        tainanLayer = null
      }

      if (props.showTainanLayer && props.tainanGeoJSONData) {
        tainanLayer = L.geoJSON(props.tainanGeoJSONData, {
          style: (feature) => {
            const count = feature.properties.count || 0
            const color = getColorByCount(count, props.maxCount, props.selectedColorScheme)
            
            return {
              fillColor: color,
              weight: 2,
              opacity: 1,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7
            }
          },
          onEachFeature: (feature, layer) => {
            const props_data = feature.properties
            const count = props_data.count || 0
            const name = props_data.name || props_data.TOWNNAME || '未知區域'
            const code = props_data.code2 || props_data.TOWNCODE || '未知代碼'
            
            // 🏷️ 綁定彈出視窗 (Bind Popup)
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
            
            // 🏷️ 綁定工具提示 (Bind Tooltip)
            layer.bindTooltip(`${name}: ${count}`, {
              permanent: false,
              direction: 'center',
              className: 'custom-tooltip'
            })
            
            // 🖱️ 滑鼠事件處理 (Mouse Event Handlers)
            layer.on({
              mouseover: function(e) {
                const layer = e.target
                layer.setStyle({
                  weight: 3,
                  color: '#333',
                  dashArray: '',
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
                
                // 發送座標更新事件
                const center = layer.getBounds().getCenter()
                emit('update:currentCoords', { lat: center.lat, lng: center.lng })
                
                console.log(`🎯 點擊區域: ${name} (${code})`)
              }
            })
          }
        })
        
        // 添加圖層到地圖
        tainanLayer.addTo(map)
        
        // 更新活躍標記數量
        const featureCount = props.tainanGeoJSONData.features ? props.tainanGeoJSONData.features.length : 0
        emit('update:activeMarkers', featureCount)
        
        console.log(`✅ 台南圖層創建完成，包含 ${featureCount} 個區域`)
      } else {
        // 隱藏圖層時重置活躍標記數量
        emit('update:activeMarkers', 0)
        console.log('❌ 台南圖層已隱藏')
      }
    }

    /**
     * 🚀 初始化地圖 (Initialize Map)
     * 創建Leaflet地圖實例並設定基本配置
     */
    const initMap = () => {
      if (map) {
        console.log('⚠️ 地圖已存在，跳過初始化')
        return
      }

      console.log('🚀 正在初始化地圖...')
      
      // 創建地圖實例
      map = L.map(mapContainer.value, {
        center: [22.9908, 120.2133], // 台南市中心座標
        zoom: props.zoomLevel,
        zoomControl: true,
        attributionControl: true
      })

      // 添加初始底圖（會根據selectedBasemap決定是否為空白地圖）
      changeBasemap()

      // 地圖事件監聽
      map.on('zoomend', () => {
        const currentZoom = map.getZoom()
        emit('update:zoomLevel', currentZoom)
        console.log(`🔍 縮放級別變更: ${currentZoom}`)
      })

      map.on('moveend', () => {
        const center = map.getCenter()
        emit('update:currentCoords', { lat: center.lat, lng: center.lng })
      })

      // 為空白地圖模式添加特殊處理
      if (selectedBasemap.value === 'blank') {
        const mapContainer = map.getContainer()
        mapContainer.style.backgroundColor = '#f8f9fa'
        console.log('🗺️ 地圖初始化為空白模式')
      }

      console.log('✅ 地圖初始化完成')
    }

    /**
     * 🎯 高亮顯示特定區域 (Highlight Feature)
     * @param {string} code2 - 行政區代碼
     */
    const highlightFeature = (code2) => {
      if (!tainanLayer || !code2) return

      tainanLayer.eachLayer((layer) => {
        const feature = layer.feature
        if (feature && feature.properties && feature.properties.code2 === code2) {
          // 重置之前的高亮
          if (highlightedFeature) {
            tainanLayer.resetStyle(highlightedFeature)
          }
          
          // 設定新的高亮樣式
          layer.setStyle({
            weight: 4,
            color: '#ff0000',
            dashArray: '5,5',
            fillOpacity: 0.9
          })
          
          // 移動到該區域
          map.fitBounds(layer.getBounds())
          
          // 顯示彈出視窗
          layer.openPopup()
          
          highlightedFeature = layer
          console.log(`🎯 高亮區域: ${feature.properties.name || code2}`)
        }
      })
    }

    /**
     * 🔄 重置地圖視圖 (Reset Map View)
     */
    const resetView = () => {
      if (map) {
        map.setView([22.9908, 120.2133], 10)
        
        // 重置高亮
        if (highlightedFeature && tainanLayer) {
          tainanLayer.resetStyle(highlightedFeature)
          highlightedFeature = null
        }
        
        console.log('🔄 地圖視圖已重置')
      }
    }

    /**
     * 🗺️ 適應台南邊界 (Fit to Tainan Bounds)
     */
    const fitToTainanBounds = () => {
      if (map && tainanLayer) {
        map.fitBounds(tainanLayer.getBounds())
        console.log('🗺️ 地圖已適應台南邊界')
      }
    }

    /**
     * 📏 刷新地圖大小 (Invalidate Map Size)
     * 當容器大小變化時調用
     */
    const invalidateSize = () => {
      if (map) {
        nextTick(() => {
          map.invalidateSize()
          console.log('📏 地圖大小已刷新')
        })
      }
    }

    /**
     * 🎯 顯示所有要素 (Show All Features)
     * 縮放地圖以顯示所有載入的地理要素，確保用戶能看到完整的數據範圍
     */
    const showAllFeatures = () => {
      try {
        // 檢查台南圖層是否存在且有效
        if (!tainanLayer) {
          console.warn('⚠️ 台南圖層未載入，無法執行顯示全部功能')
          return
        }

        // 檢查地圖實例是否存在
        if (!map) {
          console.warn('⚠️ 地圖實例不存在，無法執行顯示全部功能')
          return
        }

        // 檢查圖層是否有邊界數據
        const bounds = tainanLayer.getBounds()
        if (!bounds.isValid()) {
          console.warn('⚠️ 圖層邊界無效，無法執行顯示全部功能')
          return
        }

        // 縮放到圖層邊界，添加適當的內邊距
        const padding = {
          paddingTopLeft: [20, 20],      // 左上角內邊距
          paddingBottomRight: [20, 80]   // 右下角內邊距（為底圖控制留空間）
        }

        map.fitBounds(bounds, padding)
        
        // 記錄成功執行
        const featureCount = props.tainanGeoJSONData?.features?.length || 0
        console.log(`🗺️ 地圖已適應所有要素 (${featureCount} 個要素)`)
        console.log('📍 邊界範圍:', bounds.toBBoxString())
        
        // 發出事件通知父組件
        const center = map.getCenter()
        const zoomLevel = map.getZoom()
        emit('update:zoomLevel', zoomLevel)
        emit('update:currentCoords', { lat: center.lat, lng: center.lng })
        
      } catch (error) {
        console.error('❌ 執行顯示全部功能時發生錯誤:', error)
      }
    }

    // 👀 監聽屬性變化 (Watch Props Changes)
    
    /**
     * 👀 監聽台南圖層顯示狀態
     */
    watch(() => props.showTainanLayer, () => {
      console.log('🗺️ 台南圖層顯示狀態變更:', props.showTainanLayer)
      createTainanLayer()
    })

    /**
     * 👀 監聽台南數據變化
     */
    watch(() => props.tainanGeoJSONData, () => {
      console.log('📊 台南GeoJSON數據變更')
      createTainanLayer()
    })

    /**
     * 👀 監聽色票方案變化
     */
    watch(() => props.selectedColorScheme, () => {
      console.log('🎨 色票方案變更:', props.selectedColorScheme)
      createTainanLayer()
    })

    /**
     * 👀 監聽最大計數值變化
     */
    watch(() => props.maxCount, () => {
      console.log('📊 最大計數值變更:', props.maxCount)
      createTainanLayer()
    })

    /**
     * 👀 監聽縮放級別變化
     */
    watch(() => props.zoomLevel, (newZoom) => {
      if (map && map.getZoom() !== newZoom) {
        map.setZoom(newZoom)
      }
    })

    /**
     * 🚀 組件掛載 (Component Mounted)
     */
    onMounted(() => {
      nextTick(() => {
        initMap()
        createTainanLayer()
      })
    })

    /**
     * 🗑️ 組件卸載 (Component Unmounted)
     */
    onUnmounted(() => {
      if (map) {
        map.remove()
        map = null
        console.log('🗑️ 地圖已清理')
      }
    })

    // 📤 返回數據和方法 (Return Data and Methods)
    return {
      mapContainer,
      selectedBasemap,
      changeBasemap,
      highlightFeature,
      resetView,
      fitToTainanBounds,
      invalidateSize,
      showAllFeatures,
      // 🗺️ 暴露tainanLayer狀態給模板使用
      tainanLayer: computed(() => tainanLayer),
      getTotalFeatureCount: () => {
        if (props.tainanGeoJSONData && props.tainanGeoJSONData.features) {
          return props.tainanGeoJSONData.features.length
        }
        return 0
      }
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 地圖視圖樣式 (Map View Styles)
 */

/* 🗺️ 地圖容器樣式 */
#map-container {
  position: relative;
  background-color: var(--my-map-bg);
}

#map {
  z-index: 1;
}

/* 🗺️ 空白地圖樣式 */
#map.blank-map {
  background-color: #f8f9fa !important;
}

#map.blank-map .leaflet-tile-pane {
  display: none; /* 隱藏底圖圖磚 */
}

#map.blank-map .leaflet-control-attribution {
  background-color: rgba(248, 249, 250, 0.8);
  color: #495057;
}

/* 🎛️ 底圖控制樣式 */
.basemap-control {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: var(--my-panel-bg);
  padding: var(--my-spacing-2);
  border-radius: var(--my-radius-base);
  box-shadow: var(--my-shadow-md);
}

.basemap-control select {
  border: 1px solid var(--my-border-color);
  font-size: var(--my-font-size-small);
  min-width: 120px;
}

/* 🏷️ 自定義工具提示樣式 */
:global(.custom-tooltip) {
  background-color: var(--my-panel-bg) !important;
  border: 1px solid var(--my-border-color) !important;
  border-radius: var(--my-radius-sm) !important;
  color: var(--my-text-primary) !important;
  font-size: var(--my-font-size-small) !important;
  padding: var(--my-spacing-1) var(--my-spacing-2) !important;
  box-shadow: var(--my-shadow-sm) !important;
}

/* 🗺️ 地圖彈出視窗樣式 */
:global(.map-popup) {
  font-family: var(--my-font-family-primary);
  min-width: 200px;
}

:global(.map-popup h6) {
  border-bottom: 1px solid var(--my-border-light);
  padding-bottom: var(--my-spacing-1);
}

:global(.map-popup .badge) {
  font-size: var(--my-font-size-xs);
}

/* 🎨 Leaflet控制項樣式覆蓋 */
:global(.leaflet-control-zoom a) {
  background-color: var(--my-panel-bg) !important;
  border-color: var(--my-border-color) !important;
  color: var(--my-text-primary) !important;
}

:global(.leaflet-control-zoom a:hover) {
  background-color: var(--my-panel-hover) !important;
}

:global(.leaflet-control-attribution) {
  background-color: var(--my-panel-bg) !important;
  color: var(--my-text-secondary) !important;
  font-size: var(--my-font-size-xs) !important;
}
</style> 