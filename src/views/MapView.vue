<template>
  <!-- 🗺️ MapView.vue - 地圖視圖組件 (Map View Component) -->
  <!-- 提供基於 Leaflet 的互動式地圖功能，包含多種底圖選擇和地理資料視覺化 -->
  <div id="map-container" class="h-100 w-100 position-relative">
    <!-- 🗺️ Leaflet 地圖容器 (Leaflet Map Container) -->
    <!-- 實際的地圖渲染區域，使用 Bootstrap 滿版尺寸 -->
    <div id="leaflet-map" ref="mapContainer" class="h-100 w-100"></div>

    <!-- ✨ 地圖底部控制項區域 (Bottom Map Controls Area) -->
    <!-- 包含底圖選擇器和地圖操作按鈕 -->
    <div class="map-bottom-controls">
      <!-- 🗺️ 底圖選擇器群組 (Basemap Selector Group) -->
      <div class="basemap-select-group">
        <label for="basemap-select" class="form-label mb-0 small fw-medium me-2">底圖:</label>
        <select
          id="basemap-select"
          class="form-select form-select-sm"
          v-model="selectedBasemap"
          @change="changeBasemap"
          style="width: auto; min-width: 120px"
        >
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

<script>
  /**
   * 🗺️ MapView.vue - 地圖視圖組件
   *
   * 功能說明：
   * 1. 🗺️ 整合 Leaflet 地圖引擎，提供互動式地圖功能
   * 2. 🎨 支援多種底圖來源（OSM、Esri、Google Maps、國土測繪中心等）
   * 3. 📊 視覺化地理資料，支援 GeoJSON 格式
   * 4. 🎯 處理地圖互動事件（點擊、縮放、移動等）
   * 5. 🎨 整合色彩方案系統，動態渲染資料視覺化
   * 6. 📡 與 Pinia store 整合，管理圖層狀態和資料
   * 7. 🔧 提供高亮顯示、特徵選擇等進階功能
   *
   * 技術架構：
   * - 使用 Leaflet.js 作為地圖引擎
   * - Vue 3 Composition API 管理組件狀態
   * - Canvas 渲染模式提升效能
   * - 響應式設計，支援多種裝置
   *
   * 設計理念：
   * - 效能優先：使用 Canvas 渲染和事件防抖
   * - 用戶體驗：平滑動畫和直觀的控制介面
   * - 可擴展性：支援多種底圖和資料格式
   */

  // 🔧 Vue Composition API 引入
  import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
  // 🗺️ Leaflet 地圖庫引入
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  // 🛠️ 工具函數引入
  import { getColorByCount } from '../utils/dataProcessor.js';
  // 📦 Pinia 狀態管理引入
  import { useDataStore } from '@/stores/dataStore.js';

  // 🔧 修復 Leaflet 預設圖標問題 (Fix Leaflet Default Icon Issue)
  // 解決 Webpack 打包後圖標路徑錯誤的問題
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

    /**
     * 📥 組件屬性定義 (Component Props)
     */
    props: {
      zoomLevel: { type: Number, default: 10 },
      selectedColorScheme: { type: String, default: 'default' },
      maxCount: { type: Number, default: 100 },
      selectedBorderColor: { type: String, default: '#007bff' },
      selectedBorderWeight: { type: Number, default: 2 },
    },

    /**
     * 📤 組件事件定義 (Component Events)
     */
    emits: ['update:zoomLevel', 'update:currentCoords', 'update:activeMarkers', 'feature-selected'],

    /**
     * 🔧 組件設定函數 (Component Setup)
     */
    setup(props, { emit }) {
      // 📦 取得 Pinia 數據存儲實例
      const dataStore = useDataStore();

      // 📚 組件引用和狀態 (Component References and States)
      /** 🗺️ Leaflet 地圖實例 */
      const map = ref(null);
      /** 🗺️ 地圖 DOM 容器引用 */
      const mapContainer = ref(null);
      /** ✅ 地圖是否已初始化 */
      const mapInitialized = ref(false);
      /** 🗺️ 當前底圖圖層實例 */
      const currentTileLayer = ref(null);
      /** 🗺️ 選定的底圖類型 */
      const selectedBasemap = ref('osm');

      /** 📊 Leaflet 圖層實例儲存 (按圖層 ID 分類) */
      const leafletLayers = ref({});

      /** 📊 是否有任何圖層可見 */
      const isAnyLayerVisible = computed(() =>
        dataStore.getAllLayers().some((l) => l.visible && l.data)
      );

      // 🗺️ 底圖配置物件 (Basemap Configuration)
      /**
       * 🗺️ 支援的底圖服務配置
       * 包含各種國內外地圖服務提供商
       */
      const basemaps = {
        osm: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '',
        },
        esri_street: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: '',
        },
        esri_topo: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: '',
        },
        esri_imagery: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '',
        },
        google_road: {
          url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          attribution: '',
        },
        google_satellite: {
          url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          attribution: '',
        },
        nlsc_emap: {
          url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}',
          attribution: '',
        },
        nlsc_photo: {
          url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
          attribution: '',
        },
        terrain: {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: '',
        },
        aerial: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '',
        },
        blank: {
          url: '',
          attribution: '',
        },
      };

      /**
       * 🚀 初始化地圖 (Initialize Map)
       * 建立 Leaflet 地圖實例和基本設定
       */
      const initMap = () => {
        if (map.value) return;
        try {
          // 建立地圖實例
          map.value = L.map(mapContainer.value, {
            center: [25.033, 121.5654], // 台灣台北市中心座標
            zoom: props.zoomLevel,
            zoomControl: false, // 停用預設縮放控制項
            attributionControl: false, // 停用版權資訊
            preferCanvas: true, // 使用 Canvas 渲染提高效能
            zoomAnimation: true, // 啟用縮放動畫
            fadeAnimation: true, // 啟用淡入淡出動畫
            markerZoomAnimation: true, // 啟用標記縮放動畫
          });
          // 載入預設底圖
          loadBasemap();

          // 📡 安全地綁定地圖事件，避免在動畫過程中觸發錯誤
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

          // ⏰ 延遲設定初始化完成狀態，確保地圖完全載入
          setTimeout(() => {
            mapInitialized.value = true;
            console.log('✅ 地圖初始化完成');
          }, 100);
        } catch (error) {
          console.error('❌ 地圖初始化失敗:', error);
        }
      };

      /**
       * 🗺️ 載入底圖 (Load Basemap)
       * 根據選定的底圖類型載入對應的圖磚服務
       */
      const loadBasemap = () => {
        // 移除現有底圖圖層
        if (currentTileLayer.value) map.value.removeLayer(currentTileLayer.value);

        const config = basemaps[selectedBasemap.value];
        if (!config || !config.url) return;

        // 建立新的圖磚圖層
        currentTileLayer.value = L.tileLayer(config.url, {
          attribution: config.attribution,
          maxZoom: 18,
        }).addTo(map.value);
      };

      /**
       * 🗺️ 變更底圖 (Change Basemap)
       * 當使用者選擇不同底圖時觸發
       */
      const changeBasemap = () => {
        if (map.value) loadBasemap();
      };

      /**
       * 📊 更新地圖圖層 (Update Map Layers)
       * 根據 Pinia store 中的圖層狀態更新地圖顯示
       */
      const updateMapLayers = () => {
        if (!map.value || !mapInitialized.value) return;

        dataStore.getAllLayers().forEach((layerConfig) => {
          const layerId = layerConfig.id;
          const existingLayer = leafletLayers.value[layerId];

          if (layerConfig.visible && layerConfig.data) {
            if (!existingLayer) {
              // 如果地圖上不存在該圖層，創建並添加
              const newLeafletLayer = L.geoJSON(layerConfig.data, {
                pointToLayer: (feature, latlng) => {
                  const geometryType = feature.geometry.type;
                  const radius = 8;

                  return L.circleMarker(latlng, {
                    radius: radius,
                    className: `feature-${geometryType.toLowerCase()}`,
                  });
                },
                style: (feature) => {
                  const count = feature.properties.value;

                  // 根據幾何類型調整樣式
                  const geometryType = feature.geometry.type;
                  const baseStyle = {
                    fillColor: getColorByCount(count, props.maxCount, props.selectedColorScheme),
                    weight: props.selectedBorderWeight,
                    opacity: 1,
                    color: props.selectedBorderColor,
                    fillOpacity: 0.8,
                  };

                  // 針對不同幾何類型的特殊處理
                  if (geometryType === 'point') {
                    baseStyle.radius = 8;
                  } else if (geometryType === 'polygon') {
                    baseStyle.fillOpacity = 0.6;
                  }

                  return baseStyle;
                },
                onEachFeature: (feature, leafletLayer) => {
                  const name = feature.properties.name;

                  const propertiesHtml = Object.entries(feature.properties)
                    .map(([key, value]) => {
                      // 為了讓顯示更穩定，先處理 value 的格式
                      let displayValue = value;
                      if (value === null || value === undefined) {
                        displayValue = 'N/A'; // 如果值是空的，顯示 N/A
                      } else if (typeof value === 'object') {
                        // 如果值是物件，轉成文字顯示，避免出現 [object Object]
                        displayValue = JSON.stringify(value);
                      }

                      // 返回一個符合您指定結構的 HTML 字串
                      return `
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="text-muted small text-capitalize">${key}</span>
                          <span class="fw-medium text-truncate" style="max-width: 150px;" title="${displayValue}">${displayValue}</span>
                        </div>
                      `;
                    })
                    .join(''); // 3. 將所有產生的 HTML 組合起來

                  const popupContent = `
                    <div class="map-popup">
                      <h6 class="text-primary mb-2">
                        ${name}
                      </h6>
                      <div class="popup-details" style="max-height: 200px; overflow-y: auto;">
                        ${propertiesHtml}
                      </div>
                    </div>
                  `;

                  // 🎨 綁定彈出視窗和工具提示
                  leafletLayer.bindPopup(popupContent, {
                    maxWidth: 250,
                    className: 'custom-popup',
                  });
                  leafletLayer.bindTooltip(`${name}`, {
                    direction: 'top',
                    offset: [0, -10],
                  });

                  // 📡 綁定滑鼠和點擊事件
                  leafletLayer.on({
                    /**
                     * 🖱️ 滑鼠懸停事件 (Mouse Over Event)
                     */
                    mouseover: () => {
                      leafletLayer
                        .setStyle({ weight: 3, color: '#333', fillOpacity: 0.8 })
                        .bringToFront();
                    },
                    /**
                     * 🖱️ 滑鼠離開事件 (Mouse Out Event)
                     */
                    mouseout: () => {
                      newLeafletLayer.resetStyle(leafletLayer);
                    },
                    /**
                     * 🖱️ 點擊事件 (Click Event)
                     * 處理特徵點擊，包含地圖定位和事件發送
                     */
                    click: () => {
                      // 檢查地圖是否已初始化
                      if (!map.value || !mapInitialized.value) {
                        console.warn('地圖尚未初始化，無法執行操作');
                        return;
                      }

                      try {
                        const geometryType = feature.geometry.type;

                        // 🎯 根據幾何類型定位地圖
                        if (geometryType === 'point') {
                          // 點要素：移動到點位置
                          if (typeof leafletLayer.getLatLng === 'function') {
                            const latlng = leafletLayer.getLatLng();
                            if (latlng) {
                              map.value.panTo(latlng, {
                                animate: true,
                                duration: 0.5,
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
                                duration: 0.5,
                              });
                            }
                          }
                        }

                        // 立即顯示 popup，不等待動畫
                        if (leafletLayer && leafletLayer.openPopup) {
                          leafletLayer.openPopup();
                        }

                        // 📡 發送選中事件到父組件
                        emit('feature-selected', leafletLayer.feature);

                        console.log(`✅ 成功處理 ${geometryType} 類型要素點擊: ${name}`);
                      } catch (error) {
                        console.error('點擊要素時發生錯誤:', error);
                      }
                    },
                  });
                },
              });

              newLeafletLayer.addTo(map.value);
              leafletLayers.value[layerId] = newLeafletLayer;
            }
          } else {
            // 如果地圖上存在該圖層，移除它
            if (existingLayer) {
              map.value.removeLayer(existingLayer);
              delete leafletLayers.value[layerId];
            }
          }
        });

        // 📊 更新作用中標記總數
        const totalMarkers = Object.values(leafletLayers.value).reduce(
          (acc, layer) => acc + (layer.getLayers ? layer.getLayers().length : 0),
          0
        );
        emit('update:activeMarkers', totalMarkers);
      };

      /**
       * 🔍 顯示所有要素 (Show All Features)
       * 調整地圖視圖以包含所有可見圖層的範圍
       */
      const showAllFeatures = () => {
        if (!map.value || !mapInitialized.value || !isAnyLayerVisible.value) return;
        try {
          const allBounds = new L.LatLngBounds();
          Object.values(leafletLayers.value).forEach((layer) => {
            if (layer && layer.getBounds) {
              allBounds.extend(layer.getBounds());
            }
          });
          if (allBounds.isValid()) {
            // 移動到所有要素的中心點，不進行縮放
            const center = allBounds.getCenter();
            map.value.panTo(center, { animate: true, duration: 0.8 });
          }
        } catch (error) {
          console.error('顯示所有要素時發生錯誤:', error);
        }
      };

      /**
       * 🎯 高亮顯示特徵 (Highlight Feature)
       * 根據名稱在地圖上高亮顯示指定的地理特徵
       * @param {string} id - 要高亮顯示的特徵名稱
       * @param {Object} layerInfo - 圖層資訊（可選）
       */
      const highlightFeature = (id, layerInfo = null) => {
        if (!map.value || !mapInitialized.value) return;
        try {
          console.log(`🔍 開始高亮顯示要素: ${id}`, layerInfo);
          let found = false;

          // 🔍 如果有指定圖層資訊，優先在該圖層中尋找
          if (layerInfo && layerInfo.layerId) {
            const targetLayerName = layerInfo.layerId;
            const targetLayer = leafletLayers.value[targetLayerName];

            if (targetLayer) {
              console.log(`🎯 在指定圖層 "${targetLayerName}" 中尋找要素 "${id}"`);
              targetLayer.eachLayer((leafletLayer) => {
                if (!leafletLayer || !leafletLayer.feature) return;

                // 🏷️ 智能識別名稱屬性
                if (leafletLayer.feature.properties.id === id) {
                  found = true;
                  performHighlight(leafletLayer, targetLayer, id, layerInfo);
                }
              });
            }
          }

          // 🔍 如果在指定圖層中沒找到，或沒有指定圖層，則遍歷所有圖層
          if (!found) {
            Object.values(leafletLayers.value).forEach((layer) => {
              if (!layer) return;
              layer.eachLayer((leafletLayer) => {
                if (!leafletLayer || !leafletLayer.feature) return;

                // 🏷️ 智能識別名稱屬性
                if (leafletLayer.feature.properties.id === id) {
                  found = true;
                  performHighlight(leafletLayer, layer, id, layerInfo);
                } else {
                  // 重設其他特徵的樣式
                  layer.resetStyle(leafletLayer);
                }
              });
            });
          }

          if (!found) {
            console.warn(`⚠️ 未找到ID為 "${id}" 的要素`);
          }
        } catch (error) {
          console.error('高亮顯示特徵時發生錯誤:', error);
        }
      };

      /**
       * 🎨 執行高亮顯示 (Perform Highlight)
       * 將高亮邏輯抽取為獨立函數，提高程式碼複用性
       */
      const performHighlight = (leafletLayer, layer, id, layerInfo) => {
        layer.resetStyle(leafletLayer); // 先重設樣式

        // 🎨 根據幾何類型設定高亮樣式
        const geometryType = leafletLayer.feature.geometry.type;
        const highlightStyle = {
          weight: 4,
          color: '#ff0000',
          dashArray: '5,5',
          fillOpacity: 1.0,
        };

        if (geometryType === 'Point') {
          highlightStyle.radius = 12; // 放大點的半徑
        }

        leafletLayer.setStyle(highlightStyle);

        // 🎯 根據幾何類型移動地圖到特徵位置並zoom in
        if (geometryType === 'Point') {
          // 點要素：移動到點位置並zoom in
          if (typeof leafletLayer.getLatLng === 'function') {
            const latlng = leafletLayer.getLatLng();
            if (latlng) {
              map.value.setView(latlng, Math.max(map.value.getZoom(), 15), {
                animate: true,
                duration: 1.0,
              });
            }
          }
        } else {
          // 面/線要素：fit到邊界並適當zoom in
          if (typeof leafletLayer.getBounds === 'function') {
            const bounds = leafletLayer.getBounds();
            if (bounds && bounds.isValid()) {
              map.value.fitBounds(bounds, {
                animate: true,
                duration: 1.0,
                padding: [20, 20],
                maxZoom: 16,
              });
            }
          }
        }

        // ⏰ 延遲顯示 tooltip，等待地圖移動完成
        setTimeout(() => {
          if (leafletLayer.openTooltip) {
            leafletLayer.openTooltip();
          }
          if (leafletLayer.openPopup) {
            leafletLayer.openPopup();
          }
        }, 600);

        const layerName = layerInfo ? layerInfo.layerName : '未知圖層';
        console.log(`✅ 成功在圖層 "${layerName}" 中高亮顯示 ${geometryType} 類型要素: ${id}`);
      };

      /**
       * 🔄 重置地圖視圖 (Reset Map View)
       * 將地圖恢復到預設的台灣中心位置
       */
      const resetView = () => {
        if (!map.value || !mapInitialized.value) return;
        try {
          // 移動到台灣中南部中心位置，不改變縮放等級
          map.value.panTo([22.9908, 120.2133], { animate: true, duration: 0.8 });
        } catch (error) {
          console.error('重置視圖時發生錯誤:', error);
        }
      };

      /**
       * 🗺️ 適應台南邊界 (Fit to Tainan Bounds)
       * 將地圖視圖調整到台南市的地理範圍
       */
      const fitToTainanBounds = () => {
        if (!map.value || !mapInitialized.value || !leafletLayers.value['tainan']) return;
        try {
          const tainanBounds = leafletLayers.value['tainan'].getBounds();
          if (tainanBounds && tainanBounds.isValid()) {
            // 移動到台南邊界的中心點
            const center = tainanBounds.getCenter();
            map.value.panTo(center, { animate: true, duration: 0.8 });
          }
        } catch (error) {
          console.error('適應台南邊界時發生錯誤:', error);
        }
      };

      /**
       * 🔄 刷新地圖大小 (Invalidate Map Size)
       * 當容器大小改變時更新地圖顯示
       */
      const invalidateSize = () => {
        if (!map.value) return;
        try {
          nextTick(() => {
            if (map.value) {
              map.value.invalidateSize();
            }
          });
        } catch (error) {
          console.error('刷新地圖大小時發生錯誤:', error);
        }
      };

      // 👀 監聽器設定 (Watchers Setup)

      /**
       * 👀 監聽 Pinia store 圖層變化 (Watch Pinia Store Layers Changes)
       * 當圖層狀態改變時自動更新地圖顯示
       * 注意：由於新的分組結構，我們仍然監聽 dataStore.layers，因為它包含完整的分組結構
       */
      watch(() => dataStore.layers, updateMapLayers, { deep: true });

      /**
       * 👀 監聽樣式屬性變化 (Watch Style Properties Changes)
       * 當色彩方案、邊框等樣式改變時重新套用到所有圖層
       */
      watch(
        [
          () => props.selectedColorScheme,
          () => props.maxCount,
          () => props.selectedBorderColor,
          () => props.selectedBorderWeight,
        ],
        () => {
          // 🎨 重新套用樣式到所有可見圖層
          Object.values(leafletLayers.value).forEach((layer) => {
            if (layer && layer.setStyle) {
              layer.setStyle((feature) => {
                // 📊 智能識別數值屬性
                const count =
                  feature.properties.value ||
                  feature.properties.count ||
                  feature.properties['中位數'] ||
                  feature.properties.population ||
                  feature.properties.density ||
                  1;

                // 🎨 根據幾何類型調整樣式
                const geometryType = feature.geometry.type;
                const baseStyle = {
                  fillColor: getColorByCount(count, props.maxCount, props.selectedColorScheme),
                  weight: props.selectedBorderWeight,
                  opacity: 1,
                  color: props.selectedBorderColor,
                  fillOpacity: geometryType === 'Point' ? 0.8 : 0.7,
                };

                // 🎯 針對不同幾何類型的特殊處理
                if (geometryType === 'Point') {
                  baseStyle.radius = 8;
                } else if (geometryType === 'MultiPolygon' || geometryType === 'Polygon') {
                  baseStyle.fillOpacity = 0.6;
                }

                return baseStyle;
              });
            }
          });
        },
        { deep: true }
      );

      // 🚀 生命週期事件處理 (Lifecycle Event Handlers)

      /**
       * 🚀 組件掛載事件 (Component Mounted Event)
       * 初始化地圖實例
       */
      onMounted(() => {
        initMap();
      });

      /**
       * 🗑️ 組件卸載事件 (Component Unmounted Event)
       * 清理地圖實例和釋放記憶體
       */
      onUnmounted(() => {
        if (map.value) {
          map.value.remove();
          map.value = null;
        }
      });

      // 📤 返回給模板和父組件使用的方法和數據 (Return Methods and Data for Template and Parent)
      return {
        // 📚 模板引用
        mapContainer, // 地圖容器 DOM 引用

        // 🗺️ 底圖控制
        selectedBasemap, // 選定的底圖類型
        changeBasemap, // 變更底圖方法

        // 🔍 地圖操作
        showAllFeatures, // 顯示所有要素方法
        isAnyLayerVisible, // 是否有圖層可見狀態

        // 🎯 供父組件呼叫的方法 (Methods for parent to call)
        highlightFeature, // 高亮顯示特徵方法
        resetView, // 重置視圖方法
        fitToTainanBounds, // 適應台南邊界方法
        invalidateSize, // 刷新地圖大小方法
      };
    },
  };
</script>

<style scoped>
  /**
 * 🎨 MapView 組件專屬樣式 (MapView Component Scoped Styles)
 */

  /* 🗺️ 地圖容器樣式 (Map Container Styles) */
  #map-container {
    background-color: #f0f0f0; /* 空白地圖時的後備背景色 */
  }

  /* ✨ 地圖底部控制項樣式 (Map Bottom Controls Styles) */
  .map-bottom-controls {
    position: absolute;
    bottom: 10px; /* 距離底部 10px */
    left: 50%; /* 水平置中 */
    transform: translateX(-50%); /* 完美水平置中 */
    z-index: 1000; /* 確保在地圖上方 */
    background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
    padding: 8px; /* 內邊距 */
    border-radius: 8px; /* 圓角邊框 */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* 陰影效果 */
    display: flex; /* 使用 Flexbox 佈局 */
    align-items: center; /* 垂直對齊 */
    gap: 15px; /* 子元素間距 */
    backdrop-filter: blur(5px); /* 背景模糊效果 */
  }

  /* 🗺️ 底圖選擇器群組樣式 (Basemap Selector Group Styles) */
  .basemap-select-group {
    display: flex; /* 使用 Flexbox 佈局 */
    align-items: center; /* 垂直對齊 */
  }
</style>

<style>
  /**
 * 🎨 MapView 全域樣式覆寫 (MapView Global Style Overrides)
 * 影響 Leaflet 插件和全域元素的樣式
 */

  /* 🎨 自訂彈出視窗樣式覆寫 (Custom Popup Style Override) */
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 12px; /* 圓角邊框 */
    padding: 0; /* 移除預設內邊距 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 陰影效果 */
    border: 1px solid #e0e0e0; /* 邊框顏色 */
  }

  .custom-popup .leaflet-popup-content {
    margin: 0; /* 移除外邊距 */
    padding: 12px; /* 設定內邊距 */
    font-size: 0.9rem; /* 字體大小 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .custom-popup .leaflet-popup-tip {
    background: white; /* 箭頭背景色 */
    border: 1px solid #e0e0e0; /* 箭頭邊框 */
  }

  /* 🎨 地圖彈出視窗內容樣式 (Map Popup Content Styles) */
  .map-popup {
    min-width: 200px; /* 最小寬度 */
  }

  .map-popup h6 {
    margin: 0 0 8px 0; /* 外邊距設定 */
    font-size: 1rem; /* 標題字體大小 */
    border-bottom: 1px solid #e9ecef; /* 底部邊框 */
    padding-bottom: 4px; /* 底部內邊距 */
  }

  .popup-details {
    margin: 8px 0; /* 詳細資訊外邊距 */
  }

  .popup-details .d-flex {
    padding: 2px 0; /* 每列的內邊距 */
  }

  /* 🏷️ 工具提示樣式 (Tooltip Styling) */
  .leaflet-tooltip {
    background: rgba(0, 0, 0, 0.8) !important; /* 深色半透明背景 */
    border: none !important; /* 移除邊框 */
    border-radius: 6px !important; /* 圓角 */
    color: white !important; /* 白色文字 */
    font-size: 0.85rem !important; /* 字體大小 */
    padding: 6px 10px !important; /* 內邊距 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important; /* 陰影 */
  }

  .leaflet-tooltip-top:before {
    border-top-color: rgba(0, 0, 0, 0.8) !important; /* 箭頭顏色 */
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

  .feature-multipolygon {
    transition: all 0.2s ease; /* 複合多邊形過渡效果 */
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
