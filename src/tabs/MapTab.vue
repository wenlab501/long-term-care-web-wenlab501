<script>
  // 🔧 Vue Composition API 引入 (Vue Composition API Imports)
  import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'; // 引入 Vue 3 響應式 API
  import L from 'leaflet'; // 引入 Leaflet 地圖庫
  import 'leaflet/dist/leaflet.css'; // 引入 Leaflet 預設樣式
  import { useDataStore } from '@/stores/dataStore.js'; // 引入資料存儲

  // 🔧 修復 Leaflet 預設圖標問題 (Fix Leaflet Default Icon Issues)
  import icon from 'leaflet/dist/images/marker-icon.png'; // 引入標準標記圖標
  import iconShadow from 'leaflet/dist/images/marker-shadow.png'; // 引入標記陰影圖標
  import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'; // 引入高解析度標記圖標

  // 刪除預設圖標 URL 獲取方法，避免 webpack 打包問題
  delete L.Icon.Default.prototype._getIconUrl;
  // 重新設定 Leaflet 預設圖標配置
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina, // 高解析度圖標 URL
    iconUrl: icon, // 標準圖標 URL
    shadowUrl: iconShadow, // 陰影圖標 URL
  });

  export default {
    name: 'MapTab', // 組件名稱

    // 🔧 組件屬性定義 (Component Props Definition)
    props: {
      zoomLevel: { type: Number, default: 11 }, // 地圖縮放等級，預設為 11
      isPanelDragging: { type: Boolean, default: false }, // 面板是否正在拖曳，預設為 false
    },

    // 📡 組件事件定義 (Component Events Definition)
    emits: ['update:zoomLevel', 'update:currentCoords', 'update:activeMarkers', 'feature-selected'],

    // 🔧 組件設定函數 (Component Setup Function)
    setup(props, { emit }) {
      // 📦 資料存儲實例 (Data Store Instance)
      const dataStore = useDataStore(); // 獲取 Pinia 資料存儲實例

      // 🗺️ 地圖相關變數 (Map Related Variables)
      const mapContainer = ref(null); // 地圖容器 DOM 元素引用
      let mapInstance = null; // 地圖實例，使用普通變數而非 ref 避免響應式開銷
      let currentTileLayer = null; // 當前底圖圖層實例
      let layerGroups = {}; // 存放所有圖層群組的物件

      // 🎛️ 地圖控制狀態 (Map Control States)
      const selectedBasemap = ref('carto_light_labels'); // 選定的底圖類型，預設為 Carto Light 有標籤版本
      const isMapReady = ref(false); // 地圖是否已準備就緒的狀態標記

      // 🗺️ 底圖配置物件 (Basemap Configuration Object)
      const basemaps = {
        // OpenStreetMap 開源地圖
        osm: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
        // Esri 街道地圖
        esri_street: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        },
        // Esri 地形地圖
        esri_topo: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        },
        // Esri 衛星影像地圖
        esri_imagery: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        },
        // Google Maps 街道地圖
        google_road: { url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' },
        // Google Maps 衛星地圖
        google_satellite: { url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' },
        // 國土測繪中心電子地圖
        nlsc_emap: {
          url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}',
        },
        // 國土測繪中心正射影像
        nlsc_photo: {
          url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
        },
        // OpenTopoMap 地形圖
        terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
        // Esri 空照圖
        aerial: {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        },
        // Carto Light 無標籤版本
        carto_light: { url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png' },
        // Carto Light 有標籤版本
        carto_light_labels: {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        },
        // Carto Dark 無標籤版本
        carto_dark: { url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png' },
        // Carto Dark 有標籤版本
        carto_dark_labels: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
        // Carto Voyager 探險風格
        carto_voyager: {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        },
        // Carto Positron 正電子風格
        carto_positron: { url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' },
        // Carto Dark Matter 暗物質風格
        carto_dark_matter: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
        // Carto Light 無標籤版本（重複定義）
        carto_light_nolabels: {
          url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
        },
        // Carto Dark 無標籤版本（重複定義）
        carto_dark_nolabels: {
          url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
        },
        // 空白地圖（無底圖）
        blank: { url: '' },
      };

      // 📊 計算屬性：檢查是否有任何圖層可見 (Computed Property: Check if Any Layer is Visible)
      const isAnyLayerVisible = computed(
        () => dataStore.getAllLayers().some((l) => l.visible && l.geoJsonData) // 檢查所有圖層中是否有可見且有資料的圖層
      );

      // 🏗️ 創建地圖實例函數 (Create Map Instance Function)
      const createMap = () => {
        // 檢查地圖容器是否存在
        if (!mapContainer.value) return false;

        // 檢查容器尺寸是否有效
        const rect = mapContainer.value.getBoundingClientRect(); // 獲取容器的邊界矩形
        if (rect.width === 0 || rect.height === 0) {
          // 如果寬度或高度為零
          console.warn('[MapTab] 容器尺寸為零，延遲初始化'); // 輸出警告訊息
          return false; // 返回失敗狀態
        }

        try {
          // 創建 Leaflet 地圖實例
          mapInstance = L.map(mapContainer.value, {
            center: [25.033, 121.5654], // 設定地圖中心點（台北市座標）
            zoom: props.zoomLevel, // 設定初始縮放等級
            zoomControl: false, // 禁用預設縮放控制項
            attributionControl: false, // 禁用預設版權資訊控制項
          });

          // 綁定地圖事件處理器
          mapInstance.on('zoomend', handleZoomEnd); // 縮放結束事件
          mapInstance.on('moveend', handleMoveEnd); // 移動結束事件

          // 設定地圖準備就緒狀態
          isMapReady.value = true; // 標記地圖已準備就緒
          console.log('[MapTab] 地圖創建成功'); // 輸出成功訊息
          return true; // 返回成功狀態
        } catch (error) {
          console.error('[MapTab] 地圖創建失敗:', error); // 輸出錯誤訊息
          return false; // 返回失敗狀態
        }
      };

      // 📡 地圖事件處理函數 (Map Event Handler Functions)

      // 處理縮放結束事件
      const handleZoomEnd = () => {
        if (mapInstance) {
          // 確保地圖實例存在
          emit('update:zoomLevel', mapInstance.getZoom()); // 發送縮放等級更新事件
        }
      };

      // 處理移動結束事件
      const handleMoveEnd = () => {
        if (mapInstance) {
          // 確保地圖實例存在
          emit('update:currentCoords', mapInstance.getCenter()); // 發送座標更新事件
        }
      };

      // 🗺️ 設定底圖函數 (Set Basemap Function)
      const setBasemap = () => {
        // 檢查地圖實例和準備狀態
        if (!mapInstance || !isMapReady.value) return;

        // 移除舊的底圖圖層
        if (currentTileLayer) {
          // 如果存在當前底圖圖層
          mapInstance.removeLayer(currentTileLayer); // 從地圖中移除
          currentTileLayer = null; // 清空引用
        }

        // 添加新的底圖圖層
        const config = basemaps[selectedBasemap.value]; // 獲取選定底圖的配置
        if (config && config.url) {
          // 如果配置存在且有 URL
          currentTileLayer = L.tileLayer(config.url, { attribution: '' }); // 創建新的瓦片圖層
          currentTileLayer.addTo(mapInstance); // 添加到地圖實例
        }
      };

      // 🎨 創建要素圖層函數 (Create Feature Layer Function)
      const createFeatureLayer = (layer) => {
        // 檢查圖層是否有資料
        if (!layer.geoJsonData) return null;

        // 解構圖層屬性
        const { name, colorName, type } = layer; // 獲取圖層名稱、顏色和類型

        // 創建 GeoJSON 圖層
        const geoJsonLayer = L.geoJSON(layer.geoJsonData, {
          // 點要素轉換函數
          pointToLayer: (feature, latlng) => {
            if (type === 'point') {
              // 如果是點類型
              // 創建自訂圖標
              const icon = L.divIcon({
                html: `<div
                class="rounded-circle"
                style="
                   background-color: var(--my-color-${colorName});
                   width: 8x;
                   height: 8px;
                   box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                 ">
                 </div>`, // HTML 內容：圓形標記
                className: 'custom-marker-icon', // CSS 類名
                iconSize: [8, 8], // 圖標尺寸
                iconAnchor: [4, 4], // 圖標錨點
                popupAnchor: [0, -4], // 彈窗錨點
              });
              return L.marker(latlng, { icon }); // 返回標記實例
            }
            return null; // 非點類型返回 null
          },
          // 樣式設定函數
          style: (feature) => {
            // 返回預設樣式物件
            return {
              fillColor: feature.properties.fillColor, // 填充顏色
              weight: 1, // 邊框粗細
              opacity: 1, // 邊框透明度
              color: 'white', // 邊框顏色
              fillOpacity: 0.6, // 填充透明度
            };
          },
          // 每個要素的處理函數
          onEachFeature: (feature, layer) => {
            // 創建彈窗內容 HTML
            const properties = Object.entries(feature.properties.popupData) // 獲取彈窗資料項目
              .map(
                ([key, value]) =>
                  `<div class="pb-2">
                     <div class="my-title-xs-gray pb-1">${key}</div>
                     <div class="my-content-sm-black pb-1">${value}</div>
                   </div>` // 格式化每個資料項目
              )
              .join(''); // 合併所有項目

            // 綁定彈窗到圖層
            layer.bindPopup(`
              <div class="p-2">
                <div class="my-title-sm-gray pb-2">${name}</div>
                ${properties}
              </div>
            `); // 設定彈窗內容

            // 綁定滑鼠事件
            layer.on({
              // 滑鼠懸停事件
              mouseover: function () {
                if (type === 'point') {
                  // 點類型處理
                  const element = this.getElement(); // 獲取 DOM 元素
                  if (element) {
                    // 找到自訂圖標內部的樣式 div
                    const innerIconDiv = element.querySelector('.custom-marker-icon > div');
                    if (innerIconDiv) {
                      innerIconDiv.style.transition = 'transform 0.04s ease-in-out'; // 設定過渡動畫
                      innerIconDiv.style.transform = 'scale(1.6)'; // 放大效果
                    }
                    // 設定最高層級確保圖標在最上方
                    element.style.zIndex = 1000;
                  }
                } else if (type === 'polygon') {
                  // 多邊形類型處理
                  this.setStyle({
                    weight: 4, // 增加邊框粗細
                    color: 'white', // 設定邊框顏色
                    fillOpacity: 0.8, // 增加填充透明度
                  });
                  this.bringToFront(); // 將圖層移到最前方
                }
              },
              // 滑鼠離開事件
              mouseout: function () {
                if (type === 'point') {
                  // 點類型處理
                  const element = this.getElement(); // 獲取 DOM 元素
                  if (element) {
                    // 重設內部 div 的樣式
                    const innerIconDiv = element.querySelector('.custom-marker-icon > div');
                    if (innerIconDiv) {
                      innerIconDiv.style.transform = ''; // 清除變形效果
                    }
                    // 清除層級設定
                    element.style.zIndex = '';
                  }
                } else if (type === 'polygon') {
                  // 多邊形類型處理
                  geoJsonLayer.resetStyle(this); // 重設為預設樣式
                }
              },
              // 點擊事件
              click: function () {
                dataStore.setSelectedFeature(feature); // 設定選中的要素到資料存儲
                emit('feature-selected', feature); // 發送要素選中事件
              },
            });
          },
        });

        return geoJsonLayer; // 返回創建的 GeoJSON 圖層
      };

      // 🔄 同步圖層函數 (Sync Layers Function)
      const syncLayers = () => {
        // 檢查地圖實例和準備狀態
        if (!mapInstance || !isMapReady.value) return;

        // 獲取資料存儲中的所有圖層
        const storeLayers = dataStore.getAllLayers();
        // 獲取當前地圖上的圖層 ID 列表
        const currentLayerIds = Object.keys(layerGroups);
        // 篩選出可見且有資料的圖層
        const visibleLayers = storeLayers.filter((l) => l.visible && l.geoJsonData);

        // 移除所有現有圖層
        currentLayerIds.forEach((layerId) => {
          if (layerGroups[layerId]) {
            // 如果圖層群組存在
            mapInstance.removeLayer(layerGroups[layerId]); // 從地圖中移除
            delete layerGroups[layerId]; // 從群組物件中刪除
          }
        });

        // 按照順序重新添加圖層（反轉順序確保正確的層疊順序）
        const reversedLayers = [...visibleLayers].reverse();

        // 遍歷每個可見圖層
        reversedLayers.forEach((layer) => {
          const { layerId } = layer; // 獲取圖層 ID

          try {
            // 創建新的要素圖層
            const newLayer = createFeatureLayer(layer);
            if (newLayer) {
              // 如果成功創建
              newLayer.addTo(mapInstance); // 添加到地圖實例
              layerGroups[layerId] = newLayer; // 存儲到圖層群組物件
              console.log(layer); // 輸出圖層資訊
              console.log(`🗺️ 圖層 "${layer.name}" 已添加到地圖`); // 輸出成功訊息
            }
          } catch (error) {
            console.error(`添加圖層 "${layer.name}" 時發生錯誤:`, error); // 輸出錯誤訊息
          }
        });

        // 計算並更新標記總數
        const totalMarkers = Object.values(layerGroups).reduce(
          (acc, layer) => acc + (layer.getLayers ? layer.getLayers().length : 0), // 累加每個圖層的要素數量
          0 // 初始值為 0
        );
        emit('update:activeMarkers', totalMarkers); // 發送標記數量更新事件

        console.log(`🗺️ 圖層同步完成，共 ${visibleLayers.length} 個可見圖層`); // 輸出同步完成訊息
      };

      // 🔍 顯示全部要素函數 (Show All Features Function)
      const showAllFeatures = () => {
        // 檢查地圖實例、準備狀態和圖層可見性
        if (!mapInstance || !isMapReady.value || !isAnyLayerVisible.value) return;

        // 創建邊界框物件用於計算所有要素的範圍
        const bounds = new L.LatLngBounds(); // 初始化 Leaflet 邊界框
        let hasValidBounds = false; // 標記是否有有效的邊界

        // 遍歷所有圖層群組計算邊界
        Object.values(layerGroups).forEach((layer) => {
          if (layer && layer.getBounds) {
            // 檢查圖層是否有 getBounds 方法
            const layerBounds = layer.getBounds(); // 獲取圖層邊界
            if (layerBounds.isValid()) {
              // 檢查邊界是否有效
              bounds.extend(layerBounds); // 擴展總邊界框
              hasValidBounds = true; // 標記有有效邊界
            }
          }
        });

        // 如果有有效邊界，調整地圖視圖以包含所有要素
        if (hasValidBounds) {
          mapInstance.fitBounds(bounds, { padding: [50, 50] }); // 設定地圖視圖並添加內邊距
        }
      };

      // 🎯 高亮顯示特定要素函數 (Highlight Specific Feature Function)
      const highlightFeature = (highlightData) => {
        console.log('🎯 開始高亮顯示要素:', highlightData); // 輸出開始高亮的訊息

        // 檢查地圖是否準備就緒
        if (!mapInstance || !isMapReady.value) {
          console.warn('⚠️ 地圖尚未準備就緒，延遲執行高亮顯示'); // 輸出警告訊息
          setTimeout(() => highlightFeature(highlightData), 200); // 延遲 200ms 後重試
          return;
        }

        // 檢查是否有圖層群組
        if (!layerGroups || Object.keys(layerGroups).length === 0) {
          console.warn('⚠️ 圖層群組尚未載入，延遲執行高亮顯示'); // 輸出警告訊息
          setTimeout(() => highlightFeature(highlightData), 200); // 延遲 200ms 後重試
          return;
        }

        // 解析高亮資料
        let targetLayerId, targetFeatureId; // 宣告目標圖層 ID 和要素 ID

        // 檢查高亮資料是否為物件格式
        if (typeof highlightData === 'object' && highlightData !== null) {
          targetLayerId = highlightData.layerId; // 從物件中獲取圖層 ID
          targetFeatureId = highlightData.id; // 從物件中獲取要素 ID
        } else {
          targetFeatureId = highlightData; // 直接使用作為要素 ID
        }

        console.log(`🔍 尋找要素: layerId="${targetLayerId}", featureId="${targetFeatureId}"`); // 輸出搜尋資訊
        console.log('🔍 可用的圖層群組:', Object.keys(layerGroups)); // 輸出可用圖層列表

        // 執行高亮顯示的核心邏輯函數
        const performHighlight = () => {
          // 重置所有圖層樣式
          Object.values(layerGroups).forEach((layerGroup) => {
            if (layerGroup && layerGroup.resetStyle) {
              // 檢查圖層是否有重置樣式方法
              layerGroup.resetStyle(); // 重置圖層樣式
            }
          });

          // 初始化目標要素搜尋變數
          let targetLayer = null; // 目標圖層實例
          let targetFeature = null; // 目標要素物件

          // 如果指定了圖層 ID，在特定圖層中搜尋
          if (targetLayerId && layerGroups[targetLayerId]) {
            console.log(`🔍 在指定圖層 "${targetLayerId}" 中尋找要素`); // 輸出搜尋訊息
            const specificLayerGroup = layerGroups[targetLayerId]; // 獲取指定圖層群組

            // 遍歷圖層中的每個要素
            specificLayerGroup.eachLayer((layer) => {
              const feature = layer.feature; // 獲取要素物件
              if (feature && feature.properties) {
                // 檢查要素是否有屬性
                // 獲取要素 ID
                const featureId = feature.properties.id;

                console.log(`🔍 檢查要素 ID: ${featureId} (目標: ${targetFeatureId})`); // 輸出檢查訊息

                // 比較要素 ID（轉換為字串進行比較）
                if (String(featureId) === String(targetFeatureId)) {
                  targetLayer = layer; // 設定目標圖層
                  targetFeature = feature; // 設定目標要素
                  console.log(`✅ 在圖層 "${targetLayerId}" 中找到要素 "${targetFeatureId}"`); // 輸出找到訊息
                  return;
                }
              }
            });
          } else {
            console.log('🔍 在所有圖層中尋找要素'); // 輸出搜尋訊息
            // 在所有圖層中尋找要素
            for (const [layerId, layerGroup] of Object.entries(layerGroups)) {
              console.log(`🔍 檢查圖層: ${layerId}`); // 輸出當前檢查的圖層
              // 遍歷圖層中的每個要素
              layerGroup.eachLayer((layer) => {
                const feature = layer.feature; // 獲取要素物件
                if (feature && feature.properties) {
                  // 檢查要素是否有屬性
                  const featureId = feature.properties.id; // 獲取要素 ID

                  console.log(`🔍 檢查要素 ID: ${featureId} (目標: ${targetFeatureId})`); // 輸出檢查訊息

                  // 比較要素 ID（轉換為字串進行比較）
                  if (String(featureId) === String(targetFeatureId)) {
                    targetLayer = layer; // 設定目標圖層
                    targetFeature = feature; // 設定目標要素
                    targetLayerId = layerId; // 設定目標圖層 ID
                    console.log(`✅ 在圖層 "${layerId}" 中找到要素 "${targetFeatureId}"`); // 輸出找到訊息
                    return;
                  }
                }
              });
              if (targetLayer) break; // 如果找到目標圖層，跳出迴圈
            }
          }

          // 如果找到目標圖層和要素，執行高亮顯示
          if (targetLayer && targetFeature) {
            // 設置選中的特徵到資料存儲
            dataStore.setSelectedFeature(targetFeature); // 更新選中要素狀態
            console.log('🎯 設置選中特徵到 store'); // 輸出設置訊息

            // 根據要素類型執行不同的高亮效果
            if (targetLayer.feature?.geometry?.type === 'Point') {
              // 點要素處理
              const element = targetLayer.getElement(); // 獲取 DOM 元素
              if (element) {
                // 找到自訂圖標內部的樣式 div
                const innerIconDiv = element.querySelector('.custom-marker-icon > div');
                if (innerIconDiv) {
                  innerIconDiv.style.transition = 'transform 0.04s ease-in-out'; // 設定過渡動畫
                  innerIconDiv.style.transform = 'scale(1.6)'; // 放大效果
                }
                // 設定最高層級確保圖標在最上方
                element.style.zIndex = 1000;
              }
            } else {
              // 面要素處理
              // 面要素高亮 - 只對有 setStyle 方法的圖層調用
              if (targetLayer.setStyle) {
                targetLayer.setStyle({
                  weight: 4, // 增加邊框粗細
                  color: 'white', // 設定邊框顏色
                  fillOpacity: 0.8, // 增加填充透明度
                });
              }
            }

            // 將圖層置於最前方
            if (targetLayer.bringToFront) {
              // 檢查圖層是否有置前方法
              targetLayer.bringToFront(); // 將圖層移到最前方
            }

            // 定位到要素位置
            let bounds; // 宣告邊界變數
            if (targetLayer.getBounds) {
              // 如果圖層有 getBounds 方法（面要素）
              bounds = targetLayer.getBounds(); // 獲取圖層邊界
            } else if (targetLayer.getLatLng) {
              // 如果圖層有 getLatLng 方法（點要素）
              const latlng = targetLayer.getLatLng(); // 獲取點座標
              bounds = L.latLngBounds([latlng, latlng]); // 創建點的邊界框
            }

            // 如果有有效邊界，調整地圖視圖
            if (bounds && bounds.isValid()) {
              mapInstance.fitBounds(bounds, {
                maxZoom: 16, // 最大縮放等級限制
                padding: [50, 50], // 邊界內邊距
              });

              // 延遲打開彈窗以確保地圖移動完成
              setTimeout(() => {
                if (targetLayer.openPopup) {
                  // 檢查圖層是否有打開彈窗方法
                  targetLayer.openPopup(); // 打開彈窗
                }
              }, 500); // 延遲 500ms
            }

            console.log('✅ 顯示位置功能完成'); // 輸出完成訊息
            return true; // 返回成功狀態
          } else {
            // 如果未找到目標要素，輸出警告訊息
            console.warn(
              `❌ 找不到要素 "${targetFeatureId}"${targetLayerId ? ` 在圖層 "${targetLayerId}" 中` : ''}`
            );
            return false; // 返回失敗狀態
          }
        };

        // 嘗試執行高亮顯示，如果失敗則重試
        const success = performHighlight(); // 執行高亮顯示
        if (!success) {
          // 如果第一次失敗
          console.log('🔄 第一次高亮顯示失敗，1秒後重試...'); // 輸出重試訊息
          setTimeout(() => {
            const retrySuccess = performHighlight(); // 重試執行高亮顯示
            if (!retrySuccess) {
              // 如果重試仍失敗
              console.error('❌ 重試後仍無法高亮顯示要素'); // 輸出錯誤訊息
            }
          }, 1000); // 延遲 1 秒重試
        }
      };

      // 🔄 重設視圖函數 (Reset View Function)
      const resetView = () => {
        // 檢查地圖實例和準備狀態
        if (mapInstance && isMapReady.value) {
          mapInstance.setView([22.9908, 120.2133], 10); // 重設地圖視圖到台南市中心，縮放等級 10
        }
      };

      // 🔄 刷新地圖尺寸函數 (Invalidate Map Size Function)
      const invalidateSize = () => {
        // 檢查地圖實例和準備狀態
        if (mapInstance && isMapReady.value) {
          nextTick(() => {
            // 等待 DOM 更新完成
            try {
              mapInstance.invalidateSize(); // 刷新地圖尺寸
              console.log('🗺️ 地圖尺寸已刷新'); // 輸出成功訊息
            } catch (error) {
              console.error('❌ 刷新地圖尺寸時發生錯誤:', error); // 輸出錯誤訊息
            }
          });
        }
      };

      // 📏 設置 ResizeObserver 監聽容器大小變化 (Setup ResizeObserver)
      let resizeObserver = null; // 宣告 ResizeObserver 實例變數
      const setupResizeObserver = () => {
        // 檢查容器存在且瀏覽器支援 ResizeObserver
        if (mapContainer.value && window.ResizeObserver) {
          // 創建 ResizeObserver 實例
          resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
              // 遍歷所有變化的元素
              console.log('🔄 地圖容器大小變化:', entry.contentRect); // 輸出容器尺寸變化資訊
              // 延遲執行，確保 DOM 更新完成
              setTimeout(() => {
                invalidateSize(); // 刷新地圖尺寸
              }, 100); // 延遲 100ms
            }
          });
          resizeObserver.observe(mapContainer.value); // 開始觀察地圖容器
          console.log('✅ ResizeObserver 已設置'); // 輸出設置成功訊息
        }
      };

      // 🗺️ 切換底圖函數 (Change Basemap Function)
      const changeBasemap = (basemapValue) => {
        if (basemapValue) {
          // 如果提供了底圖值
          selectedBasemap.value = basemapValue; // 更新選定的底圖
        }
        setBasemap(); // 應用底圖變更
      };

      // 🏷️ 獲取底圖標籤函數 (Get Basemap Label Function)
      const getBasemapLabel = (value) => {
        // 底圖標籤對應表
        const basemapLabels = {
          osm: 'OpenStreetMap', // OpenStreetMap 開源地圖
          esri_street: 'Esri Street', // Esri 街道地圖
          esri_topo: 'Esri Topo', // Esri 地形地圖
          esri_imagery: 'Esri World Imagery', // Esri 世界影像地圖
          google_road: 'Google Maps 街道', // Google Maps 街道地圖
          google_satellite: 'Google Maps 衛星', // Google Maps 衛星地圖
          nlsc_emap: '國土規劃中心電子地圖', // 國土測繪中心電子地圖
          nlsc_photo: '國土規劃中心正射影像', // 國土測繪中心正射影像
          terrain: '地形圖', // 地形圖
          aerial: '空照圖 (Esri)', // Esri 空照圖
          carto_light: 'Carto Light (無標籤)', // Carto Light 無標籤版本
          carto_light_labels: 'Carto Light (有標籤)', // Carto Light 有標籤版本
          carto_dark: 'Carto Dark (無標籤)', // Carto Dark 無標籤版本
          carto_dark_labels: 'Carto Dark (有標籤)', // Carto Dark 有標籤版本
          carto_voyager: 'Carto Voyager', // Carto Voyager 探險風格
          carto_positron: 'Carto Positron', // Carto Positron 正電子風格
          carto_dark_matter: 'Carto Dark Matter', // Carto Dark Matter 暗物質風格
          carto_light_nolabels: 'Carto Light (無標籤)', // Carto Light 無標籤版本（重複）
          carto_dark_nolabels: 'Carto Dark (無標籤)', // Carto Dark 無標籤版本（重複）
          blank: '空白無地圖', // 空白地圖
        };
        return basemapLabels[value] || value; // 返回對應標籤或原始值
      };

      // 🚀 初始化地圖函數 (Initialize Map Function)
      const initMap = () => {
        let attempts = 0; // 初始化嘗試次數計數器
        const maxAttempts = 20; // 最大嘗試次數

        // 嘗試初始化函數
        const tryInit = () => {
          if (attempts >= maxAttempts) {
            // 如果超過最大嘗試次數
            console.error('[MapTab] 地圖初始化超時'); // 輸出超時錯誤
            return;
          }

          attempts++; // 增加嘗試次數

          if (createMap()) {
            // 嘗試創建地圖
            setBasemap(); // 設定底圖
            syncLayers(); // 同步圖層
          } else {
            setTimeout(tryInit, 100); // 延遲 100ms 後重試
          }
        };

        tryInit(); // 開始嘗試初始化
      };

      // 🔄 生命週期：組件掛載 (Lifecycle: Component Mounted)
      onMounted(() => {
        nextTick(() => {
          // 等待 DOM 更新完成
          setTimeout(() => {
            // 延遲執行確保容器準備就緒
            initMap(); // 初始化地圖
            // 地圖初始化完成後設置 ResizeObserver
            setTimeout(setupResizeObserver, 500); // 延遲 500ms 設置尺寸觀察器
          }, 100); // 延遲 100ms
        });
      });

      // 🧹 生命週期：組件卸載 (Lifecycle: Component Unmounted)
      onUnmounted(() => {
        // 清理 ResizeObserver
        if (resizeObserver) {
          // 如果 ResizeObserver 存在
          resizeObserver.disconnect(); // 停止觀察
          resizeObserver = null; // 清空引用
          console.log('🧹 ResizeObserver 已清理'); // 輸出清理訊息
        }

        // 清理地圖事件和實例
        if (mapInstance) {
          // 如果地圖實例存在
          mapInstance.off('zoomend', handleZoomEnd); // 移除縮放結束事件監聽器
          mapInstance.off('moveend', handleMoveEnd); // 移除移動結束事件監聽器
          mapInstance.remove(); // 移除地圖實例
          mapInstance = null; // 清空引用
        }

        // 清理圖層相關變數
        layerGroups = {}; // 清空圖層群組物件
        currentTileLayer = null; // 清空當前底圖圖層引用
        isMapReady.value = false; // 重設地圖準備狀態
      });

      // 👀 監聽器：監聽資料存儲中的圖層變化 (Watcher: Watch Data Store Layers)
      watch(() => dataStore.layers, syncLayers, { deep: true }); // 深度監聽圖層變化並同步

      // 📤 返回組件公開的屬性和方法 (Return Component Public Properties and Methods)
      return {
        mapContainer, // 地圖容器 DOM 元素引用
        selectedBasemap, // 選定的底圖類型響應式變數
        changeBasemap, // 切換底圖函數
        getBasemapLabel, // 獲取底圖標籤函數
        showAllFeatures, // 顯示全部要素函數
        isAnyLayerVisible, // 檢查是否有可見圖層的計算屬性
        highlightFeature, // 高亮顯示特定要素函數
        resetView, // 重設地圖視圖函數
        invalidateSize, // 刷新地圖尺寸函數
      };
    },
  };
</script>

<template>
  <!-- 🗺️ 地圖主容器 (Main Map Container) -->
  <div id="map-container" class="h-100 w-100 position-relative">
    <!-- 🗺️ Leaflet 地圖容器 (Leaflet Map Container) -->
    <!-- 這是 Leaflet 地圖實際渲染的 DOM 元素 -->
    <div id="leaflet-map" ref="mapContainer" class="h-100 w-100"></div>

    <!-- ✨ 地圖底部控制項區域 (Bottom Map Controls Area) -->
    <!-- 浮動在地圖底部中央，提供底圖選擇和功能按鈕 -->
    <div class="map-bottom-controls my-blur-strong">
      <!-- 🗺️ 底圖選擇器群組 (Basemap Selector Group) -->
      <!-- 使用 Bootstrap 下拉選單提供多種底圖選擇 -->
      <div class="basemap-select-group">
        <!-- 底圖選擇器標籤 -->
        <label class="form-label mb-0 small fw-medium me-2">底圖:</label>
        <!-- Bootstrap 下拉選單容器 -->
        <div class="dropdown dropup">
          <!-- 下拉選單觸發按鈕，顯示當前選定的底圖名稱 -->
          <button
            class="btn btn-outline-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="min-width: 150px; font-size: 0.875rem"
          >
            {{ getBasemapLabel(selectedBasemap) }}
          </button>
          <!-- 下拉選單項目列表 -->
          <ul class="dropdown-menu dropdown-menu-end my-blur-light">
            <!-- OpenStreetMap 開源地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('osm')"
                >OpenStreetMap</a
              >
            </li>
            <!-- Esri 街道地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('esri_street')"
                >Esri Street</a
              >
            </li>
            <!-- Esri 地形地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('esri_topo')"
                >Esri Topo</a
              >
            </li>
            <!-- Esri 世界影像地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('esri_imagery')"
                >Esri World Imagery</a
              >
            </li>
            <!-- Google Maps 街道地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('google_road')"
                >Google Maps 街道</a
              >
            </li>
            <!-- Google Maps 衛星地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('google_satellite')"
                >Google Maps 衛星</a
              >
            </li>
            <!-- 分隔線 -->
            <li><hr class="dropdown-divider" /></li>
            <!-- 國土測繪中心電子地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('nlsc_emap')"
                >國土規劃中心電子地圖</a
              >
            </li>
            <!-- 國土測繪中心正射影像選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('nlsc_photo')"
                >國土規劃中心正射影像</a
              >
            </li>
            <!-- 分隔線 -->
            <li><hr class="dropdown-divider" /></li>
            <!-- 地形圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('terrain')">地形圖</a>
            </li>
            <!-- Esri 空照圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('aerial')"
                >空照圖 (Esri)</a
              >
            </li>
            <!-- 分隔線 -->
            <li><hr class="dropdown-divider" /></li>
            <!-- Carto Light 無標籤版本選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_light')"
                >Carto Light (無標籤)</a
              >
            </li>
            <!-- Carto Light 有標籤版本選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_light_labels')"
                >Carto Light (有標籤)</a
              >
            </li>
            <!-- Carto Dark 無標籤版本選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_dark')"
                >Carto Dark (無標籤)</a
              >
            </li>
            <!-- Carto Dark 有標籤版本選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_dark_labels')"
                >Carto Dark (有標籤)</a
              >
            </li>
            <!-- Carto Voyager 探險風格選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_voyager')"
                >Carto Voyager</a
              >
            </li>
            <!-- Carto Positron 正電子風格選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_positron')"
                >Carto Positron</a
              >
            </li>
            <!-- Carto Dark Matter 暗物質風格選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('carto_dark_matter')"
                >Carto Dark Matter</a
              >
            </li>
            <!-- Carto Light 無標籤版本選項（重複定義） -->
            <li>
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="changeBasemap('carto_light_nolabels')"
                >Carto Light (無標籤)</a
              >
            </li>
            <!-- Carto Dark 無標籤版本選項（重複定義） -->
            <li>
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="changeBasemap('carto_dark_nolabels')"
                >Carto Dark (無標籤)</a
              >
            </li>
            <!-- 分隔線 -->
            <li><hr class="dropdown-divider" /></li>
            <!-- 空白地圖選項 -->
            <li>
              <a class="dropdown-item" href="#" @click.prevent="changeBasemap('blank')"
                >空白無地圖</a
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- 🔍 顯示全部資料按鈕 (Show All Data Button) -->
      <!-- 點擊後將地圖視圖調整到包含所有可見圖層的範圍 -->
      <!-- 當沒有可見圖層時按鈕會被禁用 -->
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
 * 🎨 MapTab 組件專屬樣式 (MapTab Component Scoped Styles)
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
</style>
