<script>
  import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { useDataStore } from '@/stores/dataStore.js';

  // 修復 Leaflet 預設圖標問題
  import icon from 'leaflet/dist/images/marker-icon.png';
  import iconShadow from 'leaflet/dist/images/marker-shadow.png';
  import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  export default {
    name: 'MapView',
    props: {
      zoomLevel: { type: Number, default: 11 },
      showTainanLayer: { type: Boolean, default: false },
      selectedFilter: { type: String, default: '' },
      maxCount: { type: Number, default: 5000 },
      isPanelDragging: { type: Boolean, default: false },
    },
    emits: ['update:zoomLevel', 'update:currentCoords', 'update:activeMarkers', 'feature-selected'],

    setup(props, { emit }) {
      const dataStore = useDataStore();
      const mapContainer = ref(null);
      let mapInstance = null; // 使用普通變數而非 ref
      let currentTileLayer = null;
      let layerGroups = {}; // 存放圖層群組

      const selectedBasemap = ref('carto_light_labels');
      const isMapReady = ref(false);

      // 底圖配置
      const basemaps = {
        osm: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
        esri_street: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        },
        esri_topo: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        },
        esri_imagery: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        },
        google_road: { url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' },
        google_satellite: { url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' },
        nlsc_emap: {
          url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}',
        },
        nlsc_photo: {
          url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
        },
        terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
        aerial: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        },
        carto_light: { url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png' },
        carto_light_labels: {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        },
        carto_dark: { url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png' },
        carto_dark_labels: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
        carto_voyager: {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        },
        carto_positron: { url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' },
        carto_dark_matter: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
        carto_light_nolabels: {
          url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
        },
        carto_dark_nolabels: {
          url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
        },
        blank: { url: '' },
      };

      const isAnyLayerVisible = computed(() =>
        dataStore.getAllLayers().some((l) => l.visible && l.data)
      );

      // 創建地圖實例
      const createMap = () => {
        if (!mapContainer.value) return false;

        // 檢查容器尺寸
        const rect = mapContainer.value.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          console.warn('[MapView] 容器尺寸為零，延遲初始化');
          return false;
        }

        try {
          mapInstance = L.map(mapContainer.value, {
            center: [25.033, 121.5654],
            zoom: props.zoomLevel,
            zoomControl: false,
            attributionControl: false,
          });

          // 綁定事件 - 使用簡單的事件處理
          mapInstance.on('zoomend', handleZoomEnd);
          mapInstance.on('moveend', handleMoveEnd);

          isMapReady.value = true;
          console.log('[MapView] 地圖創建成功');
          return true;
        } catch (error) {
          console.error('[MapView] 地圖創建失敗:', error);
          return false;
        }
      };

      // 事件處理函數
      const handleZoomEnd = () => {
        if (mapInstance) {
          emit('update:zoomLevel', mapInstance.getZoom());
        }
      };

      const handleMoveEnd = () => {
        if (mapInstance) {
          emit('update:currentCoords', mapInstance.getCenter());
        }
      };

      // 設定底圖
      const setBasemap = () => {
        if (!mapInstance || !isMapReady.value) return;

        // 移除舊的底圖
        if (currentTileLayer) {
          mapInstance.removeLayer(currentTileLayer);
          currentTileLayer = null;
        }

        // 添加新的底圖
        const config = basemaps[selectedBasemap.value];
        if (config && config.url) {
          currentTileLayer = L.tileLayer(config.url, { attribution: '' });
          currentTileLayer.addTo(mapInstance);
        }
      };

      // 創建要素圖層
      const createFeatureLayer = (layer) => {
        if (!layer.data) return null;

        const { name, color, type } = layer;

        const geoJsonLayer = L.geoJSON(layer.data, {
          pointToLayer: (feature, latlng) => {
            if (type === 'point') {
              const icon = L.divIcon({
                html: `<div
                class="rounded-circle"
                style="
                   background-color: ${color};
                   width: 8x;
                   height: 8px;
                   box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                 ">
                 </div>`,
                className: 'custom-marker-icon',
                iconSize: [8, 8],
                iconAnchor: [4, 4],
                popupAnchor: [0, -4],
              });
              return L.marker(latlng, { icon });
            }
            return null;
          },
          style: (feature) => {
            // 默認樣式
            return {
              fillColor: feature.properties.fillColor,
              weight: 1,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.6,
            };
          },
          onEachFeature: (feature, layer) => {
            // 創建彈窗內容
            const properties = Object.entries(feature.properties.popupData)
              .map(
                ([key, value]) =>
                  `<div class="pb-2">
                     <div class="my-title-xs pb-1">${key}</div>
                     <div class="my-content-sm pb-1">${value}</div>
                   </div>`
              )
              .join('');

            const popupContent = `
              <div>
                <div class="my-title-sm pt-2">${name}</div>
                <hr class="">
                <div>
                  ${properties}
                </div>
              </div>
            `;

            layer.bindPopup(popupContent, {
              closeButton: true,
            });

            layer.on({
              mouseover: function () {
                if (type === 'point') {
                  const element = this.getElement();
                  if (element) {
                    // 找到我們自訂的圖標內部那個帶有樣式的 div
                    const innerIconDiv = element.querySelector('.custom-marker-icon > div');
                    if (innerIconDiv) {
                      innerIconDiv.style.transition = 'transform 0.04s ease-in-out';
                      innerIconDiv.style.transform = 'scale(1.6)';
                    }
                    // zIndex 仍然作用在最外層，確保整個圖標在最上層
                    element.style.zIndex = 1000;
                  }
                } else if (type === 'polygon') {
                  this.setStyle({
                    weight: 4,
                    color: 'white',
                    fillOpacity: 0.8,
                  });
                  this.bringToFront();
                }
              },
              mouseout: function () {
                if (type === 'point') {
                  const element = this.getElement();
                  if (element) {
                    // 同樣只重設內部 div 的樣式
                    const innerIconDiv = element.querySelector('.custom-marker-icon > div');
                    if (innerIconDiv) {
                      innerIconDiv.style.transform = ''; // 清除 transform 讓它恢復原狀
                    }
                    // 清除 zIndex
                    element.style.zIndex = '';
                  }
                } else if (type === 'polygon') {
                  geoJsonLayer.resetStyle(this);
                }
              },
              click: function () {
                dataStore.setSelectedFeature(feature);
                emit('feature-selected', feature);
              },
            });
          },
        });

        return geoJsonLayer;
      };

      // 同步圖層
      const syncLayers = () => {
        if (!mapInstance || !isMapReady.value) return;

        const storeLayers = dataStore.getAllLayers();
        const currentLayerIds = Object.keys(layerGroups);
        const visibleLayers = storeLayers.filter((l) => l.visible && l.data);

        // 移除所有現有圖層
        currentLayerIds.forEach((layerId) => {
          if (layerGroups[layerId]) {
            mapInstance.removeLayer(layerGroups[layerId]);
            delete layerGroups[layerId];
          }
        });

        // 按照順序重新添加圖層
        const reversedLayers = [...visibleLayers].reverse();

        reversedLayers.forEach((layer) => {
          const { layerId } = layer;

          try {
            const newLayer = createFeatureLayer(layer);
            if (newLayer) {
              newLayer.addTo(mapInstance);
              layerGroups[layerId] = newLayer;
              console.log(layer);
              console.log(`🗺️ 圖層 "${layer.name}" 已添加到地圖`);
            }
          } catch (error) {
            console.error(`添加圖層 "${layer.name}" 時發生錯誤:`, error);
          }
        });

        // 更新標記數量
        const totalMarkers = Object.values(layerGroups).reduce(
          (acc, layer) => acc + (layer.getLayers ? layer.getLayers().length : 0),
          0
        );
        emit('update:activeMarkers', totalMarkers);

        console.log(`🗺️ 圖層同步完成，共 ${visibleLayers.length} 個可見圖層`);
      };

      // 顯示全部要素
      const showAllFeatures = () => {
        if (!mapInstance || !isMapReady.value || !isAnyLayerVisible.value) return;

        const bounds = new L.LatLngBounds();
        let hasValidBounds = false;

        Object.values(layerGroups).forEach((layer) => {
          if (layer && layer.getBounds) {
            const layerBounds = layer.getBounds();
            if (layerBounds.isValid()) {
              bounds.extend(layerBounds);
              hasValidBounds = true;
            }
          }
        });

        if (hasValidBounds) {
          mapInstance.fitBounds(bounds, { padding: [50, 50] });
        }
      };

      // 高亮顯示特定要素
      const highlightFeature = (highlightData) => {
        console.log('🎯 開始高亮顯示要素:', highlightData);

        // 檢查地圖是否準備就緒
        if (!mapInstance || !isMapReady.value) {
          console.warn('⚠️ 地圖尚未準備就緒，延遲執行高亮顯示');
          setTimeout(() => highlightFeature(highlightData), 200);
          return;
        }

        // 檢查是否有圖層群組
        if (!layerGroups || Object.keys(layerGroups).length === 0) {
          console.warn('⚠️ 圖層群組尚未載入，延遲執行高亮顯示');
          setTimeout(() => highlightFeature(highlightData), 200);
          return;
        }

        // 解析高亮資料
        let targetLayerId, targetFeatureId;

        if (typeof highlightData === 'object' && highlightData !== null) {
          targetLayerId = highlightData.layerId;
          targetFeatureId = highlightData.id;
        } else {
          targetFeatureId = highlightData;
        }

        console.log(`🔍 尋找要素: layerId="${targetLayerId}", featureId="${targetFeatureId}"`);
        console.log('🔍 可用的圖層群組:', Object.keys(layerGroups));

        // 執行高亮顯示的核心邏輯
        const performHighlight = () => {
          // 重置所有圖層樣式
          Object.values(layerGroups).forEach((layerGroup) => {
            if (layerGroup && layerGroup.resetStyle) {
              layerGroup.resetStyle();
            }
          });

          // 尋找目標要素
          let targetLayer = null;
          let targetFeature = null;

          if (targetLayerId && layerGroups[targetLayerId]) {
            console.log(`🔍 在指定圖層 "${targetLayerId}" 中尋找要素`);
            const specificLayerGroup = layerGroups[targetLayerId];

            specificLayerGroup.eachLayer((layer) => {
              const feature = layer.feature;
              if (feature && feature.properties) {
                // 嘗試多種可能的 ID 屬性
                const featureId = feature.properties.id;

                console.log(`🔍 檢查要素 ID: ${featureId} (目標: ${targetFeatureId})`);

                if (String(featureId) === String(targetFeatureId)) {
                  targetLayer = layer;
                  targetFeature = feature;
                  console.log(`✅ 在圖層 "${targetLayerId}" 中找到要素 "${targetFeatureId}"`);
                  return;
                }
              }
            });
          } else {
            console.log('🔍 在所有圖層中尋找要素');
            // 在所有圖層中尋找
            for (const [layerId, layerGroup] of Object.entries(layerGroups)) {
              console.log(`🔍 檢查圖層: ${layerId}`);
              layerGroup.eachLayer((layer) => {
                const feature = layer.feature;
                if (feature && feature.properties) {
                  const featureId = feature.properties.id;

                  console.log(`🔍 檢查要素 ID: ${featureId} (目標: ${targetFeatureId})`);

                  if (String(featureId) === String(targetFeatureId)) {
                    targetLayer = layer;
                    targetFeature = feature;
                    targetLayerId = layerId;
                    console.log(`✅ 在圖層 "${layerId}" 中找到要素 "${targetFeatureId}"`);
                    return;
                  }
                }
              });
              if (targetLayer) break;
            }
          }

          if (targetLayer && targetFeature) {
            // 設置選中的特徵到 store
            dataStore.setSelectedFeature(targetFeature);
            console.log('🎯 設置選中特徵到 store');

            if (targetLayer.feature?.geometry?.type === 'Point') {
              const element = targetLayer.getElement();
              if (element) {
                // 找到我們自訂的圖標內部那個帶有樣式的 div
                const innerIconDiv = element.querySelector('.custom-marker-icon > div');
                if (innerIconDiv) {
                  innerIconDiv.style.transition = 'transform 0.04s ease-in-out';
                  innerIconDiv.style.transform = 'scale(1.6)';
                }
                // zIndex 仍然作用在最外層，確保整個圖標在最上層
                element.style.zIndex = 1000;
              }
            } else {
              // 面要素高亮 - 只對有 setStyle 方法的圖層調用
              if (targetLayer.setStyle) {
                targetLayer.setStyle({
                  weight: 4,
                  color: 'white',
                  fillOpacity: 0.8,
                });
              }
            }

            // 將圖層置於最前
            if (targetLayer.bringToFront) {
              targetLayer.bringToFront();
            }

            // 定位到要素
            let bounds;
            if (targetLayer.getBounds) {
              bounds = targetLayer.getBounds();
            } else if (targetLayer.getLatLng) {
              const latlng = targetLayer.getLatLng();
              bounds = L.latLngBounds([latlng, latlng]);
            }

            if (bounds && bounds.isValid()) {
              mapInstance.fitBounds(bounds, {
                maxZoom: 16,
                padding: [50, 50],
              });

              // 延遲打開彈窗
              setTimeout(() => {
                if (targetLayer.openPopup) {
                  targetLayer.openPopup();
                }
              }, 500);
            }

            console.log('✅ 顯示位置功能完成');
            return true; // 成功找到並高亮
          } else {
            console.warn(
              `❌ 找不到要素 "${targetFeatureId}"${targetLayerId ? ` 在圖層 "${targetLayerId}" 中` : ''}`
            );
            return false; // 未找到要素
          }
        };

        // 嘗試執行高亮顯示，如果失敗則重試
        const success = performHighlight();
        if (!success) {
          console.log('🔄 第一次高亮顯示失敗，1秒後重試...');
          setTimeout(() => {
            const retrySuccess = performHighlight();
            if (!retrySuccess) {
              console.error('❌ 重試後仍無法高亮顯示要素');
            }
          }, 1000);
        }
      };

      // 重設視圖
      const resetView = () => {
        if (mapInstance && isMapReady.value) {
          mapInstance.setView([22.9908, 120.2133], 10);
        }
      };

      // 刷新地圖尺寸
      const invalidateSize = () => {
        if (mapInstance && isMapReady.value) {
          nextTick(() => {
            try {
              mapInstance.invalidateSize();
              console.log('🗺️ 地圖尺寸已刷新');
            } catch (error) {
              console.error('❌ 刷新地圖尺寸時發生錯誤:', error);
            }
          });
        }
      };

      // 設置 ResizeObserver 監聽容器大小變化
      let resizeObserver = null;
      const setupResizeObserver = () => {
        if (mapContainer.value && window.ResizeObserver) {
          resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
              console.log('🔄 地圖容器大小變化:', entry.contentRect);
              // 延遲執行，確保DOM更新完成
              setTimeout(() => {
                invalidateSize();
              }, 100);
            }
          });
          resizeObserver.observe(mapContainer.value);
          console.log('✅ ResizeObserver 已設置');
        }
      };

      // 切換底圖
      const changeBasemap = (basemapValue) => {
        if (basemapValue) {
          selectedBasemap.value = basemapValue;
        }
        setBasemap();
      };

      // 獲取底圖標籤
      const getBasemapLabel = (value) => {
        const basemapLabels = {
          osm: 'OpenStreetMap',
          esri_street: 'Esri Street',
          esri_topo: 'Esri Topo',
          esri_imagery: 'Esri World Imagery',
          google_road: 'Google Maps 街道',
          google_satellite: 'Google Maps 衛星',
          nlsc_emap: '國土規劃中心電子地圖',
          nlsc_photo: '國土規劃中心正射影像',
          terrain: '地形圖',
          aerial: '空照圖 (Esri)',
          carto_light: 'Carto Light (無標籤)',
          carto_light_labels: 'Carto Light (有標籤)',
          carto_dark: 'Carto Dark (無標籤)',
          carto_dark_labels: 'Carto Dark (有標籤)',
          carto_voyager: 'Carto Voyager',
          carto_positron: 'Carto Positron',
          carto_dark_matter: 'Carto Dark Matter',
          carto_light_nolabels: 'Carto Light (無標籤)',
          carto_dark_nolabels: 'Carto Dark (無標籤)',
          blank: '空白無地圖',
        };
        return basemapLabels[value] || value;
      };

      // 初始化地圖
      const initMap = () => {
        let attempts = 0;
        const maxAttempts = 20;

        const tryInit = () => {
          if (attempts >= maxAttempts) {
            console.error('[MapView] 地圖初始化超時');
            return;
          }

          attempts++;

          if (createMap()) {
            setBasemap();
            syncLayers();
          } else {
            setTimeout(tryInit, 100);
          }
        };

        tryInit();
      };

      // 生命週期
      onMounted(() => {
        nextTick(() => {
          setTimeout(() => {
            initMap();
            // 地圖初始化完成後設置 ResizeObserver
            setTimeout(setupResizeObserver, 500);
          }, 100);
        });
      });

      onUnmounted(() => {
        // 清理 ResizeObserver
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
          console.log('🧹 ResizeObserver 已清理');
        }

        // 清理事件
        if (mapInstance) {
          mapInstance.off('zoomend', handleZoomEnd);
          mapInstance.off('moveend', handleMoveEnd);
          mapInstance.remove();
          mapInstance = null;
        }

        // 清理圖層
        layerGroups = {};
        currentTileLayer = null;
        isMapReady.value = false;
      });

      // 監聽器
      watch(() => dataStore.layers, syncLayers, { deep: true });

      return {
        mapContainer,
        selectedBasemap,
        changeBasemap,
        getBasemapLabel,
        showAllFeatures,
        isAnyLayerVisible,
        highlightFeature,
        resetView,
        invalidateSize,
      };
    },
  };
</script>

<template>
  <div id="map-container" class="h-100 w-100 position-relative">
    <div id="leaflet-map" ref="mapContainer" class="h-100 w-100"></div>

    <!-- ✨ 地圖底部控制項區域 (Bottom Map Controls Area) -->
    <div class="map-bottom-controls">
      <!-- 🗺️ 底圖選擇器群組 (Basemap Selector Group) -->
      <div class="basemap-select-group">
        <label class="form-label mb-0 small fw-medium me-2">底圖:</label>
        <div class="dropdown dropup">
          <button
            class="btn btn-outline-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="min-width: 150px; font-size: 0.875rem"
          >
            {{ getBasemapLabel(selectedBasemap) }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('osm')"
                >OpenStreetMap</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('esri_street')"
                >Esri Street</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('esri_topo')"
                >Esri Topo</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('esri_imagery')"
                >Esri World Imagery</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('google_road')"
                >Google Maps 街道</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('google_satellite')"
                >Google Maps 衛星</a
              >
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('nlsc_emap')"
                >國土規劃中心電子地圖</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('nlsc_photo')"
                >國土規劃中心正射影像</a
              >
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('terrain')">地形圖</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('aerial')"
                >空照圖 (Esri)</a
              >
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_light')"
                >Carto Light (無標籤)</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_light_labels')"
                >Carto Light (有標籤)</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_dark')"
                >Carto Dark (無標籤)</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_dark_labels')"
                >Carto Dark (有標籤)</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_voyager')"
                >Carto Voyager</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_positron')"
                >Carto Positron</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_dark_matter')"
                >Carto Dark Matter</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="changeBasemap('carto_light_nolabels')"
                >Carto Light (無標籤)</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="changeBasemap('carto_dark_nolabels')"
                >Carto Dark (無標籤)</a
              >
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('blank')"
                >空白無地圖</a
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- 🔍 顯示全部資料按鈕 (Show All Data Button) -->
      <!-- 將地圖視圖調整到包含所有可見圖層的範圍 -->
      <button
        class="btn btn-outline-primary btn-sm"
        @click="showAllFeatures"
        :disabled="!isAnyLayerVisible"
        title="顯示全部資料範圍"
      >
        顯示全部
      </button>
    </div>
  </div>
</template>

<style scoped>
  /**
 * 🎨 MapView 組件專屬樣式 (MapView Component Scoped Styles)
 */

  /* 🗺️ 地圖容器樣式 (Map Container Styles) */
  #map-container {
    background-color: white; /* 空白地圖時設為全白底圖 */
    /* 移除 min-height 限制，讓地圖能自由縮放 */
    position: relative; /* 確保子元素定位正確 */
    overflow: hidden; /* 防止內容溢出 */
    z-index: 0; /* 確保地圖在左側面板陰影下方 */
  }

  /* 🗺️ Leaflet 地圖容器樣式 (Leaflet Map Container Styles) */
  #leaflet-map {
    /* 移除 min-height 限制，讓地圖能自由縮放 */
    width: 100% !important; /* 強制寬度100% */
    height: 100% !important; /* 強制高度100% */
    position: relative; /* 確保正確的定位上下文 */
  }

  /* ✨ 地圖底部控制項樣式 (Map Bottom Controls Styles) */
  .map-bottom-controls {
    position: absolute;
    bottom: 10px; /* 距離地圖容器底部 10px */
    left: 50%; /* 水平置中 */
    transform: translateX(-50%); /* 完美水平置中 */
    z-index: 2000; /* 提高層級，確保在所有元素上方 */
    background: rgba(255, 255, 255, 0.85); /* 半透明白色背景 */
    padding: 6px 10px; /* 調整內邊距，在小高度時更緊湊 */
    border-radius: 8px; /* 圓角 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 增強陰影效果 */
    display: flex; /* 使用 Flexbox 佈局 */
    align-items: center; /* 垂直對齊 */
    gap: 10px; /* 減少子元素間距 */
    backdrop-filter: blur(12px) saturate(180%); /* 強化霧化效果 */
    -webkit-backdrop-filter: blur(12px) saturate(180%); /* Safari 支援 */
    pointer-events: auto; /* 確保控制項可以接收滑鼠事件 */
    min-width: 280px; /* 減少最小寬度 */
    max-width: 90%; /* 設定最大寬度，避免在小螢幕上溢出 */
    font-size: 0.875rem; /* 稍微減小字體大小 */
    transition: all 0.3s ease; /* 平滑過渡效果 */
    border: 1px solid rgba(255, 255, 255, 0.3); /* 半透明邊框增強玻璃效果 */
  }

  /* 當地圖容器高度很小時，調整控制條樣式但保持可見 */
  #map-container[style*='height: 1'] .map-bottom-controls,
  #map-container[style*='height: 2'] .map-bottom-controls,
  #map-container[style*='height: 3'] .map-bottom-controls,
  #map-container[style*='height: 4'] .map-bottom-controls,
  #map-container[style*='height: 5'] .map-bottom-controls {
    bottom: 3px; /* 減少底部距離 */
    padding: 3px 6px; /* 進一步減少內邊距 */
    font-size: 0.7rem; /* 更小的字體 */
    min-width: 200px; /* 更小的最小寬度 */
    gap: 4px; /* 更小的間距 */
    backdrop-filter: blur(8px) saturate(150%); /* 小尺寸時稍微減少模糊 */
    -webkit-backdrop-filter: blur(8px) saturate(150%); /* Safari 支援 */
  }

  /* 移除隱藏控制條的規則，確保控制條永遠可見 */

  /* 🗺️ 底圖選擇器群組樣式 (Basemap Selector Group Styles) */
  .basemap-select-group {
    display: flex; /* 使用 Flexbox 佈局 */
    align-items: center; /* 垂直對齊 */
    gap: 6px; /* 減少間距 */
  }

  .basemap-select-group .dropdown-toggle {
    font-size: 0.875rem; /* 減小選擇器字體大小 */
    padding: 0.25rem 0.5rem; /* 減少內邊距 */
  }

  .basemap-select-group .dropdown-menu {
    z-index: 9999; /* 確保下拉選單在最上層 */
    backdrop-filter: blur(8px) saturate(120%); /* 下拉選單也加上霧化效果 */
    -webkit-backdrop-filter: blur(8px) saturate(120%); /* Safari 支援 */
    background: rgba(255, 255, 255, 0.95); /* 半透明背景 */
    border: 1px solid rgba(0, 0, 0, 0.1); /* 淡邊框 */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); /* 增強陰影 */
  }

  .basemap-select-group .form-label {
    font-size: 0.875rem; /* 減小標籤字體大小 */
    margin-bottom: 0; /* 移除底部邊距 */
  }

  /* 🎯 不同幾何類型的特殊樣式 (Special Styles for Different Geometry Types) */
  .feature-point {
    transition: all 0.3s ease; /* 平滑過渡效果 */
  }

  .feature-point:hover {
    transform: scale(1.2); /* 懸停時放大 */
  }

  .feature-polygon {
    transition: all 0.2s ease; /* 多邊形過渡效果 */
  }

  /* 🎯 高亮動畫效果 (Highlight Animation) */
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.6);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(231, 76, 60, 0.8);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.6);
    }
  }

  .highlight-marker {
    animation: pulse 1.5s infinite;
  }

  /* ✨ 高亮狀態的動畫效果 (Highlight State Animation Effects) */
  @keyframes highlight-pulse {
    0% {
      opacity: 0.7;
    } /* 起始透明度 */
    50% {
      opacity: 1;
    } /* 中間透明度 */
    100% {
      opacity: 0.7;
    } /* 結束透明度 */
  }

  .leaflet-interactive[style*='dashArray'] {
    animation: highlight-pulse 2s infinite; /* 高亮時的脈衝動畫 */
  }
</style>
