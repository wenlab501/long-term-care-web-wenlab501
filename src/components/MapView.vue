<template>
  <div id="map-container" class="h-100 w-100 position-relative">
    <!-- 🗺️ 地圖容器 -->
    <div id="leaflet-map" ref="mapContainer" class="h-100 w-100"></div>

    <!-- ✨ 新的底部中央地圖控制項 ✨ -->
    <div class="map-bottom-controls">
      <div class="basemap-select-group">
        <label for="basemap-select" class="form-label mb-0 small fw-medium me-2">底圖:</label>
        <select 
          id="basemap-select"
          class="form-select form-select-sm" 
          v-model="selectedBasemap" 
          @change="changeBasemap"
          style="width: auto; min-width: 120px;">
          <option value="osm">OpenStreetMap</option>
          <option value="esri_street">Esri Street</option>
          <option value="esri_topo">Esri Topo</option>
          <option value="esri_imagery">Esri World Imagery</option>
          <option value="google_road">Google Maps 街道</option>
          <option value="google_satellite">Google Maps 衛星</option>
          <option value="nlsc_emap">國土規劃中心電子地圖</option>
          <option value="nlsc_photo">國土規劃中心正射影像</option>
          <option value="terrain">地形圖</option>
          <option value="aerial">空照圖 (Esri)</option>
          <option value="blank">空白無地圖</option>
        </select>
      </div>
      <button 
        class="btn btn-outline-primary btn-sm"
        @click="showAllFeatures"
        :disabled="!isAnyLayerVisible"
        title="顯示全部資料範圍">
        顯示全部
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getColorByCount } from '../utils/dataProcessor.js'
import { useDataStore } from '@/stores/dataStore.js'

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
    zoomLevel: {
      type: Number,
      default: 10
    },
    selectedColorScheme: {
      type: String,
      default: 'default'
    },
    maxCount: {
      type: Number,
      default: 100
    },
    selectedBorderColor: {
      type: String,
      default: '#007bff'
    },
    selectedBorderWeight: {
      type: Number,
      default: 2
    }
  },
  emits: ['update:zoomLevel', 'update:currentCoords', 'update:activeMarkers', 'feature-selected'],
  setup(props, { emit }) {
    const dataStore = useDataStore();

    const map = ref(null);
    const mapContainer = ref(null);
    const mapInitialized = ref(false);
    const currentTileLayer = ref(null);
    const selectedBasemap = ref('osm');
    
    // This will store Leaflet layer instances, keyed by our layer ID
    const leafletLayers = ref({});

    const isAnyLayerVisible = computed(() => dataStore.layers.some(l => l.visible && l.data));

    // 底圖配置
    const basemaps = {
      osm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      esri_street: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri'
      },
      esri_topo: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri'
      },
      esri_imagery: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri'
      },
      google_road: {
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attribution: '© Google'
      },
      google_satellite: {
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attribution: '© Google'
      },
      nlsc_emap: {
        url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}',
        attribution: '© NLSC'
      },
      nlsc_photo: {
        url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
        attribution: '© NLSC'
      },
      terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenTopoMap'
      },
      aerial: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri'
      },
      blank: {
        url: '',
        attribution: ''
      }
    };
    
    // 初始化地圖
    const initMap = () => {
      if (map.value) return;
      try {
        map.value = L.map(mapContainer.value, {
          center: [25.0330, 121.5654],
          zoom: props.zoomLevel,
          zoomControl: false,
          attributionControl: true,
          preferCanvas: true, // 使用 Canvas 渲染提高性能
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true
        });
        
        L.control.zoom({ position: 'bottomright' }).addTo(map.value);
        loadBasemap();
        
        // 安全地綁定事件，避免在動畫過程中觸發
        map.value.on('zoomend', () => {
          try {
            if (map.value && map.value.getZoom) {
              emit('update:zoomLevel', map.value.getZoom());
            }
          } catch (error) {
            console.warn('Error updating zoom level:', error);
          }
        });
        
        map.value.on('moveend', () => {
          try {
            if (map.value && map.value.getCenter) {
              emit('update:currentCoords', map.value.getCenter());
            }
          } catch (error) {
            console.warn('Error updating coordinates:', error);
          }
        });
        
        // 延遲設定初始化完成狀態
        setTimeout(() => {
          mapInitialized.value = true;
          console.log('✅ 地圖初始化完成');
        }, 100);
        
      } catch (error) {
        console.error('Map initialization failed:', error);
      }
    };
    
    // 載入底圖
    const loadBasemap = () => {
      if (currentTileLayer.value) map.value.removeLayer(currentTileLayer.value);
      const config = basemaps[selectedBasemap.value];
      if (!config || !config.url) return;
      currentTileLayer.value = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: 18
      }).addTo(map.value);
    };
    
    const changeBasemap = () => {
      if (map.value) loadBasemap();
    };
    
    const updateMapLayers = () => {
      if (!map.value || !mapInitialized.value) return;

      dataStore.layers.forEach(layerConfig => {
        const layerId = layerConfig.id;
        const existingLayer = leafletLayers.value[layerId];

        // Case 1: Layer should be visible
        if (layerConfig.visible && layerConfig.data) {
          // If it doesn't exist on the map, create and add it
          if (!existingLayer) {
            const newLeafletLayer = L.geoJSON(layerConfig.data, {
              pointToLayer: (feature, latlng) => {
                // 根據要素類型決定點的大小和樣式
                const geometryType = feature.geometry.type;
                const radius = geometryType === 'Point' ? 8 : 6;
                
                return L.circleMarker(latlng, { 
                  radius: radius,
                  className: `feature-${geometryType.toLowerCase()}`
                });
              },
              style: (feature) => {
                 // 智能識別數值屬性
                 const count = feature.properties.value || 
                              feature.properties.count || 
                              feature.properties['中位數'] || 
                              feature.properties.population || 
                              feature.properties.density ||
                              1; // 預設值為 1（對於點資料）
                              
                 // 根據幾何類型調整樣式
                 const geometryType = feature.geometry.type;
                 const baseStyle = {
                   fillColor: getColorByCount(count, props.maxCount, props.selectedColorScheme),
                   weight: props.selectedBorderWeight,
                   opacity: 1,
                   color: props.selectedBorderColor,
                   fillOpacity: geometryType === 'Point' ? 0.8 : 0.7
                 };
                 
                 // 針對不同幾何類型的特殊處理
                 if (geometryType === 'Point') {
                   baseStyle.radius = 8;
                 } else if (geometryType === 'MultiPolygon' || geometryType === 'Polygon') {
                   baseStyle.fillOpacity = 0.6;
                 }
                 
                 return baseStyle;
              },
              onEachFeature: (feature, leafletLayer) => {
                // 智能識別名稱屬性
                const name = feature.properties.name || 
                           feature.properties.PTVNAME || 
                           feature.properties.title ||
                           feature.properties.label ||
                           feature.properties.機構名稱 ||
                           '未知區域';
                           
                // 智能識別數值屬性
                const count = feature.properties.value || 
                             feature.properties.count || 
                             feature.properties['中位數'] || 
                             feature.properties.population || 
                             feature.properties.density ||
                             1;
                             
                // 識別幾何類型以便調整顯示
                const geometryType = feature.geometry.type;
                
                // 創建詳細的 popup 內容
                const isPoint = geometryType === 'Point';
                const popupContent = `
                  <div class="map-popup">
                    <h6 class="fw-bold text-primary mb-2">
                      <i class="fas fa-${isPoint ? 'map-marker-alt' : 'map'} me-1"></i>
                      ${name}
                    </h6>
                    <div class="popup-details">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="text-muted small">${isPoint ? '類型:' : '數值:'}</span>
                        <span class="fw-medium">${isPoint ? '點位置' : count.toLocaleString()}</span>
                      </div>
                      ${!isPoint && count > 1 ? `
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="text-muted small">幾何:</span>
                          <span class="fw-medium">${geometryType === 'Polygon' ? '多邊形' : geometryType === 'MultiPolygon' ? '複合多邊形' : geometryType}</span>
                        </div>
                      ` : ''}
                      ${feature.properties.address ? `
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="text-muted small">地址:</span>
                          <span class="fw-medium text-truncate" style="max-width: 150px;" title="${feature.properties.address}">${feature.properties.address}</span>
                        </div>
                      ` : ''}
                      ${feature.properties.area ? `
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="text-muted small">面積:</span>
                          <span class="fw-medium">${feature.properties.area} km²</span>
                        </div>
                      ` : ''}
                      ${feature.properties.phone ? `
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="text-muted small">電話:</span>
                          <span class="fw-medium">${feature.properties.phone}</span>
                        </div>
                      ` : ''}
                    </div>
                    <div class="text-center mt-2">
                      <small class="text-muted">點擊查看詳細資訊</small>
                    </div>
                  </div>
                `;
                
                leafletLayer.bindPopup(popupContent, {
                  maxWidth: 250,
                  className: 'custom-popup'
                });
                leafletLayer.bindTooltip(`${name}: ${count.toLocaleString()}`, {
                  direction: 'top',
                  offset: [0, -10]
                });
                leafletLayer.on({
                  mouseover: () => {
                    leafletLayer.setStyle({ weight: 3, color: '#333', fillOpacity: 0.8 }).bringToFront();
                  },
                  mouseout: () => {
                     // We need a way to reset style that doesn't rely on a single layer ref
                     newLeafletLayer.resetStyle(leafletLayer);
                  },
                  click: () => {
                    // 檢查地圖是否已初始化
                    if (!map.value || !mapInitialized.value) {
                      console.warn('地圖尚未初始化，無法執行操作');
                      return;
                    }

                    try {
                      const geometryType = feature.geometry.type;
                      
                      // 簡單的移動到中心，不縮放
                      if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                        // 點要素：移動到點位置
                        if (typeof leafletLayer.getLatLng === 'function') {
                          const latlng = leafletLayer.getLatLng();
                          if (latlng) {
                            map.value.panTo(latlng, {
                              animate: true,
                              duration: 0.5
                            });
                          }
                        }
                      } else {
                        // 面/線要素：移動到中心點
                        if (typeof leafletLayer.getBounds === 'function') {
                          const bounds = leafletLayer.getBounds();
                          if (bounds && bounds.isValid()) {
                            const center = bounds.getCenter();
                            map.value.panTo(center, {
                              animate: true,
                              duration: 0.5
                            });
                          }
                        }
                      }
                      
                      // 立即顯示 popup，不等待動畫
                      if (leafletLayer && leafletLayer.openPopup) {
                        leafletLayer.openPopup();
                      }
                      
                      // 發送選中事件
                      emit('feature-selected', leafletLayer.feature);
                      
                      console.log(`✅ 成功處理 ${geometryType} 類型要素點擊: ${name}`);
                    } catch (error) {
                      console.error('點擊要素時發生錯誤:', error);
                    }
                  }
                });
              }
            });
            newLeafletLayer.addTo(map.value);
            leafletLayers.value[layerId] = newLeafletLayer;
            console.log(`Layer "${layerId}" added to map.`);
          }
        } 
        // Case 2: Layer should NOT be visible
        else {
          // If it exists on the map, remove it
          if (existingLayer) {
            map.value.removeLayer(existingLayer);
            delete leafletLayers.value[layerId];
            console.log(`Layer "${layerId}" removed from map.`);
          }
        }
      });

      // Update total active markers
      const totalMarkers = Object.values(leafletLayers.value).reduce((acc, layer) => acc + (layer.getLayers ? layer.getLayers().length : 0), 0);
      emit('update:activeMarkers', totalMarkers);
    };

    // 顯示所有要素
    const showAllFeatures = () => {
       if (!map.value || !mapInitialized.value || !isAnyLayerVisible.value) return;
       try {
         const allBounds = new L.LatLngBounds();
         Object.values(leafletLayers.value).forEach(layer => {
           if (layer && layer.getBounds) {
             allBounds.extend(layer.getBounds());
           }
         });
         if (allBounds.isValid()) {
           // 簡化操作，只移動不縮放
           const center = allBounds.getCenter();
           map.value.panTo(center, { animate: true, duration: 0.8 });
         }
       } catch (error) {
         console.error('Error showing all features:', error);
       }
    };
    
    // 高亮功能
    const highlightFeature = (name) => {
        if (!map.value || !mapInitialized.value) return;
        try {
          console.log(`🔍 開始高亮顯示要素: ${name}`);
          let found = false;
          
          Object.values(leafletLayers.value).forEach(layer => {
            if (!layer) return;
            layer.eachLayer(leafletLayer => {
              if (!leafletLayer || !leafletLayer.feature) return;
              
              // 智能識別名稱屬性
              const featureName = leafletLayer.feature.properties.name || 
                                 leafletLayer.feature.properties.PTVNAME || 
                                 leafletLayer.feature.properties.title ||
                                 leafletLayer.feature.properties.label ||
                                 leafletLayer.feature.properties.機構名稱 ||
                                 '';
                                 
              if (featureName === name) {
                found = true;
                layer.resetStyle(leafletLayer); // Reset first
                
                // 根據幾何類型設定高亮樣式
                const geometryType = leafletLayer.feature.geometry.type;
                const highlightStyle = { 
                  weight: 4, 
                  color: '#ff0000', 
                  dashArray: '5,5', 
                  fillOpacity: geometryType === 'Point' ? 1.0 : 0.9
                };
                
                if (geometryType === 'Point') {
                  highlightStyle.radius = 12; // 放大點的半徑
                }
                
                leafletLayer.setStyle(highlightStyle);
                
                // 簡單移動到中心，不縮放
                if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                  // 點要素：移動到點位置
                  if (typeof leafletLayer.getLatLng === 'function') {
                    const latlng = leafletLayer.getLatLng();
                    if (latlng) {
                      map.value.panTo(latlng, { animate: true, duration: 0.8 });
                    }
                  }
                } else {
                  // 面/線要素：移動到中心點
                  if (typeof leafletLayer.getBounds === 'function') {
                    const bounds = leafletLayer.getBounds();
                    if (bounds && bounds.isValid()) {
                      const center = bounds.getCenter();
                      map.value.panTo(center, { animate: true, duration: 0.8 });
                    }
                  }
                }
                
                // 延遲顯示 popup
                setTimeout(() => {
                  if (leafletLayer.openPopup) {
                    leafletLayer.openPopup();
                  }
                }, 400);
                
                console.log(`✅ 成功高亮顯示 ${geometryType} 類型要素: ${name}`);
              } else {
                layer.resetStyle(leafletLayer);
              }
            });
          });
          
          if (!found) {
            console.warn(`⚠️ 未找到名稱為 "${name}" 的要素`);
          }
        } catch (error) {
          console.error('Error highlighting feature:', error);
        }
    };
    
    // 重置視圖
    const resetView = () => {
      if (!map.value || !mapInitialized.value) return;
      try {
        // 使用 panTo 而不是 setView 避免縮放
        map.value.panTo([22.9908, 120.2133], { animate: true, duration: 0.8 });
      } catch (error) {
        console.error('Error resetting view:', error);
      }
    };
    
    // 適應台南邊界
    const fitToTainanBounds = () => {
        if (!map.value || !mapInitialized.value || !leafletLayers.value['tainan']) return;
        try {
          const tainanBounds = leafletLayers.value['tainan'].getBounds();
          if (tainanBounds && tainanBounds.isValid()) {
            // 簡化操作，只移動到中心
            const center = tainanBounds.getCenter();
            map.value.panTo(center, { animate: true, duration: 0.8 });
          }
        } catch (error) {
          console.error('Error fitting to Tainan bounds:', error);
        }
    };
    
    // 刷新地圖大小
    const invalidateSize = () => {
      if (!map.value) return;
      try {
        nextTick(() => {
          if (map.value) {
            map.value.invalidateSize();
          }
        });
      } catch (error) {
        console.error('Error invalidating map size:', error);
      }
    };
    
    watch(() => dataStore.layers, updateMapLayers, { deep: true });
    
    watch([() => props.selectedColorScheme, () => props.maxCount, () => props.selectedBorderColor, () => props.selectedBorderWeight], () => {
        // Re-apply styles to all visible layers
        Object.values(leafletLayers.value).forEach(layer => {
          if (layer && layer.setStyle) {
            layer.setStyle((feature) => {
                // 智能識別數值屬性
                const count = feature.properties.value || 
                             feature.properties.count || 
                             feature.properties['中位數'] || 
                             feature.properties.population || 
                             feature.properties.density ||
                             1;
                             
                // 根據幾何類型調整樣式
                const geometryType = feature.geometry.type;
                const baseStyle = {
                   fillColor: getColorByCount(count, props.maxCount, props.selectedColorScheme),
                   weight: props.selectedBorderWeight,
                   opacity: 1,
                   color: props.selectedBorderColor,
                   fillOpacity: geometryType === 'Point' ? 0.8 : 0.7
                };
                
                // 針對不同幾何類型的特殊處理
                if (geometryType === 'Point') {
                  baseStyle.radius = 8;
                } else if (geometryType === 'MultiPolygon' || geometryType === 'Polygon') {
                  baseStyle.fillOpacity = 0.6;
                }
                
                return baseStyle;
            });
          }
        });
    }, { deep: true });

    onMounted(() => {
      initMap();
    });

    onUnmounted(() => {
      if (map.value) {
        map.value.remove();
        map.value = null;
      }
    });

    return {
      mapContainer,
      selectedBasemap,
      changeBasemap,
      showAllFeatures,
      isAnyLayerVisible,
      // Methods for parent to call
      highlightFeature,
      resetView,
      fitToTainanBounds,
      invalidateSize
    };
  }
}
</script>

<style scoped>
#map-container {
  background-color: #f0f0f0; /* Fallback for blank map */
}

.map-bottom-controls {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(5px);
}

.basemap-select-group {
  display: flex;
  align-items: center;
}
</style>

<style>
/* Global popup style override */
.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
}

.custom-popup .leaflet-popup-content {
  margin: 0;
  padding: 12px;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.custom-popup .leaflet-popup-tip {
  background: white;
  border: 1px solid #e0e0e0;
}

.map-popup {
  min-width: 200px;
}

.map-popup h6 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 4px;
}

.popup-details {
  margin: 8px 0;
}

.popup-details .d-flex {
  padding: 2px 0;
}

/* Tooltip styling */
.leaflet-tooltip {
  background: rgba(0, 0, 0, 0.8) !important;
  border: none !important;
  border-radius: 6px !important;
  color: white !important;
  font-size: 0.85rem !important;
  padding: 6px 10px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

.leaflet-tooltip-top:before {
  border-top-color: rgba(0, 0, 0, 0.8) !important;
}

/* 不同幾何類型的特殊樣式 */
.feature-point {
  transition: all 0.3s ease;
}

.feature-point:hover {
  transform: scale(1.2);
}

.feature-polygon {
  transition: all 0.2s ease;
}

.feature-multipolygon {
  transition: all 0.2s ease;
}

/* 高亮狀態的動畫效果 */
@keyframes highlight-pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1.0; }
  100% { opacity: 0.7; }
}

.leaflet-interactive[style*="dashArray"] {
  animation: highlight-pulse 2s infinite;
}
</style> 