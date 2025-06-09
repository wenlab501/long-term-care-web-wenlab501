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
          attributionControl: true
        });
        L.control.zoom({ position: 'bottomright' }).addTo(map.value);
        loadBasemap();
        map.value.on('zoomend', () => emit('update:zoomLevel', map.value.getZoom()));
        map.value.on('moveend', () => emit('update:currentCoords', map.value.getCenter()));
        mapInitialized.value = true;
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
      if (!map.value) return;

      dataStore.layers.forEach(layerConfig => {
        const layerId = layerConfig.id;
        const existingLayer = leafletLayers.value[layerId];

        // Case 1: Layer should be visible
        if (layerConfig.visible && layerConfig.data) {
          // If it doesn't exist on the map, create and add it
          if (!existingLayer) {
            const newLeafletLayer = L.geoJSON(layerConfig.data, {
              style: (feature) => {
                 const count = feature.properties.中位數 || 0
                 return {
                   fillColor: getColorByCount(count, props.maxCount, props.selectedColorScheme),
                   weight: props.selectedBorderWeight,
                   opacity: 1,
                   color: props.selectedBorderColor,
                   fillOpacity: 0.7
                 }
              },
              onEachFeature: (feature, leafletLayer) => {
                const name = feature.properties.PTVNAME || feature.properties.HospName || '未知區域';
                const count = feature.properties.中位數 || 0;
                leafletLayer.bindPopup(`<div class="map-popup"><h6>${name}</h6><p>中位數: ${count}</p></div>`);
                leafletLayer.bindTooltip(`${name}: ${count}`);
                leafletLayer.on({
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 3, color: '#333', fillOpacity: 0.8 }).bringToFront();
                  },
                  mouseout: (e) => {
                     // We need a way to reset style that doesn't rely on a single layer ref
                     newLeafletLayer.resetStyle(e.target);
                  },
                  click: (e) => {
                    const center = e.target.getBounds().getCenter();
                    map.value.panTo(center, { animate: true, duration: 0.5 });
                    emit('feature-selected', e.target.feature);
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
       if (!map.value || !isAnyLayerVisible.value) return;
       try {
         const allBounds = new L.LatLngBounds();
         Object.values(leafletLayers.value).forEach(layer => {
           if (layer && layer.getBounds) {
             allBounds.extend(layer.getBounds());
           }
         });
         if (allBounds.isValid()) {
           map.value.fitBounds(allBounds, { padding: [50, 50] });
         }
       } catch (error) {
         console.error('Error showing all features:', error);
       }
    };
    
    // 高亮功能
    const highlightFeature = (name) => {
        if (!map.value) return;
        try {
          Object.values(leafletLayers.value).forEach(layer => {
            if (!layer) return;
            layer.eachLayer(leafletLayer => {
              if (!leafletLayer || !leafletLayer.feature) return;
              const featureName = leafletLayer.feature.properties.PTVNAME || leafletLayer.feature.properties.HospName;
              if (featureName === name) {
                layer.resetStyle(leafletLayer); // Reset first
                leafletLayer.setStyle({ weight: 4, color: '#ff0000', dashArray: '5,5', fillOpacity: 0.9 });
                const bounds = leafletLayer.getBounds();
                if (bounds && bounds.isValid()) {
                  map.value.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.0 });
                }
                leafletLayer.openPopup();
              } else {
                layer.resetStyle(leafletLayer);
              }
            });
          });
        } catch (error) {
          console.error('Error highlighting feature:', error);
        }
    };
    
    // 重置視圖
    const resetView = () => {
      if (!map.value) return;
      try {
        map.value.setView([22.9908, 120.2133], 10);
      } catch (error) {
        console.error('Error resetting view:', error);
      }
    };
    
    // 適應台南邊界
    const fitToTainanBounds = () => {
        if (!map.value || !leafletLayers.value['tainan']) return;
        try {
          const tainanBounds = leafletLayers.value['tainan'].getBounds();
          if (tainanBounds && tainanBounds.isValid()) {
            map.value.fitBounds(tainanBounds);
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
    
    watch([() => props.selectedColorScheme, () => props.selectedBorderColor, () => props.selectedBorderWeight], () => {
        // Re-apply styles to all visible layers
        Object.values(leafletLayers.value).forEach(layer => layer.setStyle({
            color: props.selectedBorderColor,
            weight: props.selectedBorderWeight
        }));
    });

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
.map-popup .leaflet-popup-content-wrapper {
  border-radius: 8px;
  padding: 1rem;
}
.map-popup .leaflet-popup-content {
  margin: 0;
  font-size: 0.9rem;
}
</style> 