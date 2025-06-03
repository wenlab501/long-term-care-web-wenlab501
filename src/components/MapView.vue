<template>
  <div id="map-container" class="h-100 w-100 position-relative">
    <!-- 底圖切換控制 -->
    <div class="basemap-control">
      <select v-model="selectedBasemap" @change="changeBasemap" class="form-select form-select-sm">
        <option value="osm">OpenStreetMap</option>
        <option value="satellite">衛星圖</option>
        <option value="terrain">地形圖</option>
        <option value="dark">深色模式</option>
      </select>
    </div>
    
    <div id="map" ref="mapContainer" class="h-100 w-100"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import { getColorByCount } from '../utils/dataProcessor.js'

// Leaflet圖標修復 - 解決默認標記圖標顯示問題
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'MapView',
  props: {
    // 圖層顯示控制
    showLayer1: {
      type: Boolean,
      default: false
    },
    showLayer2: {
      type: Boolean,
      default: false
    },
    showTainanLayer: {
      type: Boolean,
      default: false
    },
    // 篩選條件
    selectedFilter: {
      type: String,
      default: ''
    },
    // 色票選擇
    selectedColorScheme: {
      type: String,
      default: 'default'
    },
    // 地圖控制
    zoomLevel: {
      type: Number,
      default: 10
    },
    // 台南數據
    tainanGeoJSONData: {
      type: Object,
      default: null
    },
    maxCount: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'update:zoomLevel',
    'update:currentCoords', 
    'update:activeMarkers'
  ],
  setup(props, { emit }) {
    // 組件引用
    const mapContainer = ref(null)
    
    // 地圖實例和圖層
    let map = null
    let layer1Markers = []
    let layer2Polygons = []
    let tainanLayer = null
    let currentTileLayer = null
    
    // 底圖選擇
    const selectedBasemap = ref('osm')
    
    // 底圖配置
    const basemaps = {
      osm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          maxZoom: 18,
          attribution: '© OpenStreetMap contributors'
        }
      },
      satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 18,
          attribution: '© Esri, Maxar, Earthstar Geographics'
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
      }
    }

    /**
     * 切換底圖
     */
    const changeBasemap = () => {
      if (map && currentTileLayer) {
        map.removeLayer(currentTileLayer)
      }
      
      const basemap = basemaps[selectedBasemap.value]
      currentTileLayer = L.tileLayer(basemap.url, basemap.options)
      
      if (map) {
        currentTileLayer.addTo(map)
      }
      
      console.log(`底圖已切換至: ${selectedBasemap.value}`)
    }

    /**
     * 根據數量值獲取徽章樣式類別
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
     * 創建第一層標記（商店位置）
     * 根據篩選條件顯示不同類型的商店標記
     */
    const createLayer1Markers = () => {
      console.log('Creating Layer1 markers...')
      
      // 清除現有標記
      layer1Markers.forEach(marker => map.removeLayer(marker))
      layer1Markers = []

      if (props.showLayer1) {
        // 模擬商店位置數據
        const storeLocations = [
          { lat: 25.0330, lng: 121.5654, title: '7-11 台北車站店', type: 'convenience' },
          { lat: 25.0478, lng: 121.5319, title: '全家大安店', type: 'convenience' },
          { lat: 25.0853, lng: 121.5606, title: '家樂福中山店', type: 'supermarket' },
          { lat: 25.0412, lng: 121.5681, title: '麥當勞信義店', type: 'restaurant' },
          { lat: 25.0345, lng: 121.5789, title: '星巴克東區店', type: 'restaurant' }
        ]

        storeLocations.forEach(store => {
          // 應用篩選條件
          if (!props.selectedFilter || store.type === props.selectedFilter) {
            const marker = L.marker([store.lat, store.lng])
              .addTo(map)
              .bindPopup(`<b>${store.title}</b><br>類型: ${store.type}`)
              .bindTooltip(store.title, { permanent: false, direction: 'top' })
            layer1Markers.push(marker)
          }
        })
      }
      
      // 更新活躍標記數量
      emit('update:activeMarkers', layer1Markers.length)
      console.log(`Layer1 markers created: ${layer1Markers.length}`)
    }

    /**
     * 創建第二層多邊形（熱點區域）
     * 顯示商業活動熱點區域
     */
    const createLayer2Polygons = () => {
      console.log('Creating Layer2 polygons...')
      
      // 清除現有多邊形
      layer2Polygons.forEach(polygon => map.removeLayer(polygon))
      layer2Polygons = []

      if (props.showLayer2) {
        // 模擬熱點區域數據
        const heatAreas = [
          {
            coords: [[25.040, 121.550], [25.045, 121.550], [25.045, 121.555], [25.040, 121.555]],
            name: '商業熱點A',
            intensity: 85
          },
          {
            coords: [[25.080, 121.560], [25.085, 121.560], [25.085, 121.565], [25.080, 121.565]],
            name: '商業熱點B',
            intensity: 65
          }
        ]

        heatAreas.forEach(area => {
          const polygon = L.polygon(area.coords, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3
          }).addTo(map)
            .bindPopup(`<b>${area.name}</b><br>強度: ${area.intensity}%`)
            .bindTooltip(`${area.name} (${area.intensity}%)`, { permanent: false, direction: 'center' })
          layer2Polygons.push(polygon)
        })
      }
      
      console.log(`Layer2 polygons created: ${layer2Polygons.length}`)
    }

    /**
     * 創建台南地區GeoJSON圖層
     * 這是主要的數據視覺化圖層，顯示台南各區域的統計數據
     * 注意：現在所有 GeoJSON 數據都已經是 WGS84 格式
     */
    const createTainanLayer = () => {
      console.log('Creating Tainan layer...', {
        showTainanLayer: props.showTainanLayer,
        hasGeoJSONData: !!props.tainanGeoJSONData,
        featuresCount: props.tainanGeoJSONData?.features?.length || 0,
        maxCount: props.maxCount,
        colorScheme: props.selectedColorScheme,
        autoConverted: props.tainanGeoJSONData?._autoConverted,
        coordinateSystem: props.tainanGeoJSONData?._conversionInfo?.to || 'unknown'
      })
      
      // 清除現有圖層
      if (tainanLayer) {
        console.log('Removing existing Tainan layer')
        map.removeLayer(tainanLayer)
        tainanLayer = null
      }

      // 檢查顯示條件和數據完整性
      if (props.showTainanLayer && props.tainanGeoJSONData && map) {
        console.log('Creating Tainan layer with', props.tainanGeoJSONData.features.length, 'features')
        const maxCountValue = props.maxCount || 1

        try {
          // 🔥 數據已經在載入時轉換為 WGS84，直接使用
          const geojsonData = props.tainanGeoJSONData
          
          // 🔥 驗證座標系統（可選的安全檢查）
          if (geojsonData._autoConverted) {
            console.log('✅ 使用已自動轉換的 WGS84 座標')
          } else if (geojsonData._conversionInfo?.detected === 'WGS84') {
            console.log('✅ 使用原始 WGS84 座標')
          } else {
            console.log('⚠️ 座標系統狀態未知，假設為 WGS84')
          }

          // 創建GeoJSON圖層
          tainanLayer = L.geoJSON(geojsonData, {
            style: (feature) => {
              const count = feature.properties.count || 0
              const color = getColorByCount(count, maxCountValue, props.selectedColorScheme)
              return {
                fillColor: color,
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
              }
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties
              
              // 創建彈出窗口內容
              const popupContent = `
                <div class="p-2">
                  <h6 class="mb-2 text-primary">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    ${props.name || props.CODE2 || '未知區域'}
                  </h6>
                  <table class="table table-sm">
                    <tr>
                      <td><strong>代碼:</strong></td>
                      <td>${props.CODE2 || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>名稱:</strong></td>
                      <td>${props.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>數量:</strong></td>
                      <td><span class="badge ${getCountBadgeClass(props.count)}">${props.count || 0}</span></td>
                    </tr>
                    <tr>
                      <td><strong>合併狀態:</strong></td>
                      <td><span class="badge ${props._merged ? 'bg-success' : 'bg-warning'}">${props._merged ? '成功' : '失敗'}</span></td>
                    </tr>
                    <tr>
                      <td><strong>座標系統:</strong></td>
                      <td><span class="badge bg-info">WGS84</span></td>
                    </tr>
                  </table>
                </div>
              `
              layer.bindPopup(popupContent)
              
              // 添加懸停提示
              const tooltipContent = `${props.name || props.CODE2}: ${props.count || 0}`
              layer.bindTooltip(tooltipContent, { 
                permanent: false, 
                direction: 'center',
                className: 'custom-tooltip'
              })
            }
          })

          // 添加圖層到地圖
          if (tainanLayer) {
            tainanLayer.addTo(map)
            console.log('Tainan layer added to map successfully')
            
            // 延遲調整地圖視角，確保圖層已完全載入
            setTimeout(() => {
              if (tainanLayer && map) {
                const bounds = tainanLayer.getBounds()
                if (bounds.isValid()) {
                  map.fitBounds(bounds, { padding: [20, 20] })
                  console.log('Map fitted to Tainan bounds')
                } else {
                  console.warn('Tainan layer bounds are not valid')
                }
              }
            }, 500)
          }
        } catch (error) {
          console.error('Error creating Tainan layer:', error)
        }
      } else {
        console.log('Tainan layer not created due to missing conditions')
      }
    }

    /**
     * 高亮顯示特定區域
     * @param {string} code2 - 區域代碼
     */
    const highlightFeature = (code2) => {
      if (!tainanLayer || !map) {
        console.warn('Cannot highlight feature: layer or map not available')
        return
      }

      console.log('Highlighting feature with code2:', code2)
      
      tainanLayer.eachLayer((layer) => {
        if (layer.feature.properties.CODE2 === code2) {
          // 設置高亮樣式
          layer.setStyle({
            fillColor: 'yellow',
            weight: 4,
            color: 'red',
            fillOpacity: 0.9
          })
          
          // 調整地圖視角並顯示彈出窗口
          map.fitBounds(layer.getBounds())
          layer.openPopup()
          
          // 3秒後恢復原始樣式（使用正確的色票）
          setTimeout(() => {
            const count = layer.feature.properties.count || 0
            const color = getColorByCount(count, props.maxCount, props.selectedColorScheme)
            layer.setStyle({
              fillColor: color,
              weight: 1,
              color: 'white',
              fillOpacity: 0.7
            })
          }, 3000)
          
          console.log('Feature highlighted successfully')
        }
      })
    }

    /**
     * 初始化地圖
     * 設置基礎地圖圖層和事件監聽器
     */
    const initializeMap = () => {
      if (!mapContainer.value) {
        console.error('Map container not found')
        return
      }

      console.log('Initializing map...')
      
      // 創建地圖實例（以台北為初始中心）
      map = L.map(mapContainer.value).setView([25.0330, 121.5654], 10)

      // 添加初始底圖
      const basemap = basemaps[selectedBasemap.value]
      currentTileLayer = L.tileLayer(basemap.url, basemap.options).addTo(map)

      // 創建初始圖層
      createLayer1Markers()
      createLayer2Polygons()

      // 監聽滑鼠移動事件以更新座標顯示
      map.on('mousemove', (e) => {
        emit('update:currentCoords', {
          lat: e.latlng.lat.toFixed(4),
          lng: e.latlng.lng.toFixed(4)
        })
      })

      // 監聽縮放變化事件
      map.on('zoomend', () => {
        emit('update:zoomLevel', map.getZoom())
      })

      console.log('Map initialized successfully')
    }

    /**
     * 強制重新計算地圖尺寸
     * 當容器大小變化時調用
     */
    const invalidateSize = () => {
      if (map) {
        map.invalidateSize()
      }
    }

    /**
     * 調整地圖視角以適應台南數據範圍
     */
    const fitToTainanBounds = () => {
      if (tainanLayer && map) {
        const bounds = tainanLayer.getBounds()
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] })
          console.log('Map fitted to Tainan bounds')
        } else {
          console.warn('Cannot fit to Tainan bounds: bounds not valid')
        }
      } else {
        console.warn('Cannot fit to Tainan bounds: layer or map not available')
      }
    }

    /**
     * 重置地圖視圖
     * 如果有台南數據則適應台南範圍，否則回到台北
     */
    const resetView = () => {
      if (map) {
        if (tainanLayer) {
          fitToTainanBounds()
        } else {
          map.setView([25.0330, 121.5654], 10)
          emit('update:zoomLevel', 10)
        }
        console.log('Map view reset')
      }
    }

    // 監聽屬性變化
    watch(() => props.showLayer1, () => {
      console.log('Layer1 visibility changed:', props.showLayer1)
      createLayer1Markers()
    })
    
    watch(() => props.showLayer2, () => {
      console.log('Layer2 visibility changed:', props.showLayer2)
      createLayer2Polygons()
    })
    
    watch(() => props.selectedFilter, () => {
      console.log('Filter changed:', props.selectedFilter)
      createLayer1Markers()
    })
    
    watch(() => props.showTainanLayer, () => {
      console.log('Tainan layer visibility changed:', props.showTainanLayer)
      createTainanLayer()
    })
    
    // 監聽色票變化
    watch(() => props.selectedColorScheme, () => {
      console.log('Color scheme changed:', props.selectedColorScheme)
      if (props.showTainanLayer && props.tainanGeoJSONData) {
        createTainanLayer()
      }
    })
    
    // 重要：監聽GeoJSON數據變化
    watch(() => props.tainanGeoJSONData, (newData) => {
      console.log('Tainan GeoJSON data changed:', newData ? 'Data loaded' : 'Data cleared')
      if (newData) {
        // 數據載入後創建圖層
        nextTick(() => {
          createTainanLayer()
        })
      }
    }, { deep: true })
    
    // 監聽maxCount變化（影響顏色計算）
    watch(() => props.maxCount, () => {
      console.log('Max count changed:', props.maxCount)
      if (props.showTainanLayer && props.tainanGeoJSONData) {
        createTainanLayer()
      }
    })
    
    // 監聽縮放級別變化
    watch(() => props.zoomLevel, (newZoom) => {
      if (map && map.getZoom() !== newZoom && newZoom >= 1 && newZoom <= 18) {
        map.setZoom(newZoom)
        console.log('Zoom level updated:', newZoom)
      }
    })

    // 組件掛載時初始化地圖
    onMounted(() => {
      nextTick(() => {
        setTimeout(initializeMap, 100)
      })
    })

    // 組件卸載時清理資源
    onUnmounted(() => {
      if (map) {
        map.remove()
        console.log('Map removed')
      }
    })

    // 暴露給父組件的方法
    return {
      mapContainer,
      selectedBasemap,
      changeBasemap,
      invalidateSize,
      fitToTainanBounds,
      highlightFeature,
      resetView
    }
  }
}
</script>

<style scoped>
/* 地圖容器樣式 */
#map {
  border: none;
  overflow: hidden;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* 底圖切換控制器 */
.basemap-control {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.basemap-control select {
  border: none;
  background: transparent;
  font-size: 0.875rem;
  min-width: 120px;
}

/* 自定義tooltip樣式 */
:deep(.custom-tooltip) {
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
}
</style> 