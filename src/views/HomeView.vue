<template>
  <!-- 🏠 App.vue - 主應用程式組件，使用Bootstrap實現滿版無空隙佈局 -->
  <div id="app" class="d-flex flex-column vh-100">
    
    <!-- 📥 載入覆蓋層 (Loading Overlay) -->
    <LoadingOverlay 
      :isVisible="isLoading" 
      :loadingText="loadingText"
      :progress="loadingProgress"
      :showProgress="showLoadingProgress"
      :subText="loadingSubText" />

    <!-- 📱 主要內容區域 (Main Content Area) - 使用Bootstrap flex-grow-1佔滿剩餘空間 -->
    <div class="flex-grow-1 d-flex flex-column overflow-hidden">
      
      <!-- 🚀 路由視圖（非首頁） - 使用Bootstrap佈局 -->
      <div v-if="$route.path !== '/'" class="flex-grow-1">
        <router-view />
      </div>
          
      <!-- 🏠 首頁內容（空間分析平台） - 使用Bootstrap grid系統 -->
      <div v-if="$route.path === '/'" class="flex-grow-1 d-flex flex-column overflow-hidden">
        <div class="d-flex flex-row flex-grow-1 overflow-hidden">
          
          <!-- 🎛️ 左側控制面板 (Left Control Panel) - Wrapper for content only -->
          <div class="h-100 overflow-auto" :style="{ width: leftPanelWidthPx }" v-if="leftPanelWidth > 0">
            <LeftPanel 
              :showTainanLayer="showTainanLayer"
              :showMedicalLayer="showMedicalLayer"
              :isLoadingData="isLoadingMedical"
              @update:showTainanLayer="showTainanLayer = $event"
              @update:showMedicalLayer="handleMedicalLayerToggle"
              @load-data="loadTainanData"
              :current-coords="currentCoords"
              :active-markers="activeMarkers"
              @update:currentCoords="updateCurrentCoords"
            />
          </div>
        
          <!-- 🔧 左側拖曳調整器 (Left Resizer) - Now a direct child of the flex row -->
          <div class="my-resizer my-resizer-vertical border-start border-end" 
               :class="{ 'dragging': isSidePanelDragging }"
               @mousedown="startResize('left', $event)"
               title="拖曳調整左側面板寬度">
          </div>
            
          <!-- 🌟 新的主要顯示區域組件 (New Main Display Area Component) -->
          <MiddlePanel
            ref="middlePanelRef"
            class="d-flex flex-column flex-grow-1 overflow-hidden h-100"
            :style="{ width: mainPanelWidthPx, 'min-width': '0px' }"
            :dynamicMainAreaHeight="calculatedMiddlePanelHeight"
            :activeTab="activeTab"
            :activeBottomTab="activeBottomTab"
            :mainPanelWidth="mainPanelWidth" 
            :showTainanLayer="showTainanLayer"
            :selectedFilter="selectedFilter"
            :selectedColorScheme="selectedColorScheme"
            :selectedBorderColor="selectedBorderColor"
            :selectedBorderWeight="selectedBorderWeight"
            :zoomLevel="zoomLevel"
            :currentCoords="currentCoords"
            :tainanGeoJSONData="storeTainanGeoJSONData"
            :maxCount="maxCount"
            :mergedTableData="storeMergedTableData"
            :averageCount="averageCount"
            :dataRegionsCount="dataRegionsCount"
            :activeMarkers="activeMarkers"
            :isLoadingData="isLoadingData"
            :tableData="tableData"
            :isSidePanelDragging="isSidePanelDragging"
            :totalCount="totalCount"
            :tainanDataSummary="storeTainanDataSummary"
            @update:activeTab="activeTab = $event"
            @update:activeBottomTab="activeBottomTab = $event"
            @update:zoomLevel="zoomLevel = $event"
            @update:currentCoords="currentCoords = $event"
            @update:activeMarkers="activeMarkers = $event"
            @update:selectedColorScheme="selectedColorScheme = $event"
            @update:selectedBorderColor="selectedBorderColor = $event"
            @update:selectedBorderWeight="selectedBorderWeight = $event"
            @reset-view="resetView"
            @highlight-on-map="highlightOnMap"
            @highlight-feature="handleHighlight"
          >
            <template #map>
              <div class="map-container" ref="mapContainer">
                <MapView
                  :tainan-geo-json-data="storeTainanGeoJSONData"
                  :show-tainan-layer="showTainanLayer"
                  :medical-data="medicalData"
                  :show-medical-layer="showMedicalLayer"
                  @update:current-coords="updateCurrentCoords"
                  @update:active-markers="updateActiveMarkers"
                />
                
                <!-- 圖層控制面板 -->
                <div class="layer-control-panel">
                  <div class="layer-control">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :checked="showTainanLayer"
                        @change="loadTainanData"
                        id="tainanLayerCheck"
                      >
                      <label class="form-check-label" for="tainanLayerCheck">
                        台南市圖層
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :checked="showMedicalLayer"
                        @change="loadMedicalData"
                        id="medicalLayerCheck"
                      >
                      <label class="form-check-label" for="medicalLayerCheck">
                        醫療院所分布
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </MiddlePanel>

          <!-- 🔧 右側拖曳調整器 (Right Resizer) - Now a direct child of the flex row -->
          <div class="my-resizer my-resizer-vertical border-start border-end" 
               :class="{ 'dragging': isSidePanelDragging }"
               @mousedown="startResize('right', $event)"
               title="拖曳調整右側面板寬度">
          </div>

          <!-- 📈 右側控制面板 (Right Control Panel) - Wrapper for content only -->
          <div class="h-100 overflow-auto" :style="{ width: rightPanelWidthPx }" v-if="rightPanelWidth > 0">
            <RightPanel 
              :activeRightTab="activeRightTab"
              :totalCount="totalCount"
              :activeMarkers="activeMarkers"
              :tainanDataSummary="storeTainanDataSummary"
              :mergedTableData="storeMergedTableData"
              :maxCount="maxCount"
              :averageCount="averageCount"
              :dataRegionsCount="dataRegionsCount"
              :showTainanLayer="showTainanLayer"
              :rightPanelWidth="rightPanelWidth"
              @update:activeRightTab="activeRightTab = $event"
              @fit-map-to-data="fitMapToData"
              @clear-tainan-data="clearTainanData"
              @switch-to-dashboard="switchToDashboard"
              @highlight-feature="handleHighlight"
              :current-coords="currentCoords"
              @update:current-coords="updateCurrentCoords"
            />
          </div>
        </div>
      </div>
    </div>
            
    <!-- 🦶 頁腳區域 (Footer Area) - Bootstrap sticky footer，緊貼底部無空隙 -->
    <footer class="my-app-footer bg-dark text-light py-2 mt-auto" ref="appFooterRef">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 text-md-start text-center">
            <small>© 2024 空間分析視覺化平台. All rights reserved.</small>
          </div>
          <div class="col-md-6 text-md-end text-center">
            <small>
              Powered by <a href="https://vuejs.org/" target="_blank" class="text-light text-decoration-none">Vue.js</a> & 
              <a href="https://leafletjs.com/" target="_blank" class="text-light text-decoration-none">Leaflet</a> & 
              <a href="https://d3js.org/" target="_blank" class="text-light text-decoration-none">D3.js</a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
/**
 * 🏠 App.vue - 應用程式主組件
 * 
 * 功能說明：
 * 1. 📱 提供響應式三面板佈局系統（左中右，支援0-100%調整）
 * 2. 🗺️ 整合地圖視覺化與空間分析功能
 * 3. 📊 管理台南市登革熱數據的載入、處理與分析
 * 4. 🎨 提供多種Python matplotlib色票方案
 * 5. 🔧 支援拖拉調整面板大小（完全彈性0-100%範圍）
 * 6. 📈 執行Moran's I空間自相關分析
 */
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { formatNumber } from '../utils/utils.js'
import { loadTainanData as loadTainanDataUtil } from '../utils/dataProcessor.js'
import { useDataStore } from '@/stores/dataStore'
import { loadCSVData } from '@/utils/loadCSVData'

// 🧩 組件引入
import LoadingOverlay from '../components/LoadingOverlay.vue'
import LeftPanel from '../components/LeftPanel.vue'
import RightPanel from '../components/RightPanel.vue'
import MiddlePanel from '../components/MiddlePanel.vue'
import MapView from '../components/MapView.vue'

export default {
  name: 'HomeView',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   */
  components: {
    LoadingOverlay,
    LeftPanel,
    RightPanel,
    MiddlePanel,
    MapView
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup() {
    const dataStore = useDataStore()

    // 📚 元件引用 (Component References)
    const middlePanelRef = ref(null)
    const appFooterRef = ref(null)

    // 📑 分頁狀態 (Tab States)
    const activeTab = ref('map')
    const activeBottomTab = ref('table')
    const activeRightTab = ref('results')

    // 📏 面板大小狀態 - 使用百分比系統 (Panel Size States - Percentage Based)
    const MIN_LEFT_PANEL_WIDTH_PERCENT = 5; // Define minimum width for left panel
    const leftPanelWidth = ref(20)        // 左側面板寬度百分比 (0-100%)
    const rightPanelWidth = ref(20)       // 右側面板寬度百分比 (0-100%)
    const windowWidth = ref(window.innerWidth)
    const windowHeight = ref(window.innerHeight)
    const footerHeight = ref(0)

    // 🧮 計算屬性 - 面板尺寸 (Computed Properties - Panel Dimensions)
    const leftPanelWidthPx = computed(() => `${leftPanelWidth.value}%`)
    const rightPanelWidthPx = computed(() => `${rightPanelWidth.value}%`)
    const mainPanelWidth = computed(() => 100 - leftPanelWidth.value - rightPanelWidth.value)
    const mainPanelWidthPx = computed(() => `${mainPanelWidth.value}%`)

    const calculatedMiddlePanelHeight = computed(() => {
      return windowHeight.value - footerHeight.value;
    });

    // ⏳ 載入狀態 (Loading States)
    const isLoading = ref(false)
    const isLoadingData = ref(false)
    const loadingText = ref('載入中...')
    const loadingProgress = ref(0)
    const showLoadingProgress = ref(false)
    const loadingSubText = ref('')

    // 🗺️ 地圖和圖層狀態 (Map and Layer States)
    const showTainanLayer = ref(false)
    const selectedFilter = ref('')
    const selectedColorScheme = ref('viridis')
    const selectedBorderColor = ref('#666666')
    const selectedBorderWeight = ref(1)
    const zoomLevel = ref(10)
    const currentCoords = ref({ lat: 25.0330, lng: 121.5654 })
    const totalCount = ref(1250000)
    const selectedCount = ref(0)
    const activeMarkers = ref(0)
    
    // 📊 台南數據相關 (Tainan Data Related)
    const tainanDataSummary = ref(null)
    const tableData = ref([])

    // 從 Pinia store 獲取數據的 computed 屬性
    const storeMergedTableData = computed(() => dataStore.processedData.loadedAndMergedTableData);
    const storeTainanGeoJSONData = computed(() => dataStore.processedData.loadedAndMergedGeoJSON);
    const storeTainanDataSummary = computed(() => dataStore.dataSummary);

    // 🔧 拖曳狀態 (Drag States)
    const isSidePanelDragging = ref(false)

    // 🧮 統計計算屬性 (Statistical Computed Properties)
    const totalDataPoints = computed(() => {
      return storeMergedTableData.value.length || totalCount.value
    })

    const maxCount = computed(() => {
      if (!storeMergedTableData.value || storeMergedTableData.value.length === 0) return 0;
      return Math.max(...storeMergedTableData.value.map(row => row.count || 0));
    })

    const averageCount = computed(() => {
      if (!storeMergedTableData.value || storeMergedTableData.value.length === 0) return 0;
      const counts = storeMergedTableData.value.map(row => row.count || 0);
      return counts.reduce((a, b) => a + b, 0) / counts.length;
    })

    const dataRegionsCount = computed(() => {
      if (!storeMergedTableData.value) return 0;
      return storeMergedTableData.value.filter(row => row.count > 0).length;
    })

    // 在 setup 函數中添加新的狀態
    const showMedicalLayer = ref(false)
    const medicalData = ref(null)
    const isLoadingMedical = ref(false)

    // 📥 台南數據功能函數 (Tainan Data Functions)
    
    /**
     * 📥 載入台南數據 (Load Tainan Data)
     * 載入GeoJSON和Excel文件並進行數據合併
     */
    const loadTainanData = async () => {
      // 如果數據已經載入過，直接顯示圖層
      if (dataStore.isDataLoaded) {
        showTainanLayer.value = true
        return
      }

      try {
        isLoading.value = true
        loadingText.value = '載入台南數據中...'
        loadingSubText.value = '正在處理地理資訊...'
        
        const data = await loadTainanDataUtil()
        console.log('載入的數據:', data) // 添加日誌
        
        // 確保數據正確存儲
        dataStore.storeLoadedData({
          loadedAndMergedGeoJSON: data.mergedGeoJSON,
          loadedAndMergedTableData: data.tableData
        })
        
        showTainanLayer.value = true
        
        loadingText.value = '載入完成'
        loadingSubText.value = `已載入 ${data.tableData.length} 個區域`
        
        // 延遲一下再關閉載入視窗，讓用戶看到完成訊息
        setTimeout(() => {
          isLoading.value = false
        }, 1000)
      } catch (error) {
        console.error('載入台南數據失敗:', error)
        loadingText.value = '載入失敗'
        loadingSubText.value = error.message
        // 延遲一下再關閉載入視窗，讓用戶看到錯誤訊息
        setTimeout(() => {
          isLoading.value = false
        }, 2000)
      }
    }

    /**
     * 🗑️ 清除台南數據 (Clear Tainan Data)
     */
    const clearTainanData = () => {
      if (confirm('確定要清除台南數據嗎？')) {
        dataStore.clearData('loadedAndMergedGeoJSON'); // 假設 clearData 可以處理 processedData 子屬性
        dataStore.clearData('loadedAndMergedTableData');
        // 或者一個更通用的 clearProcessedSubData('loadedAndMergedGeoJSON')
        dataStore.clearData('geojson'); 

        tainanDataSummary.value = null;
        // local mergedTableData 和 tainanGeoJSONData 因為是 computed，會自動更新
        selectedFilter.value = '';
        showTainanLayer.value = false;
        console.log('✅ 台南數據已從 Pinia Store 和局部狀態中清除');
      }
    };

    // 🗺️ 地圖互動函數 (Map Interaction Functions)
    
    /**
     * 🎯 在地圖上高亮顯示 (Highlight on Map)
     * 專注於地圖定位和tooltip顯示
     */
    const highlightOnMap = (row) => {
      if (!row || !row.name) {
        console.warn('無法高亮顯示：資料或名稱為空')
        return
      }

      console.log('🎯 高亮顯示區域:', row.name)
      
      if (middlePanelRef.value) {
        middlePanelRef.value.highlightFeature(row.name)
      } else {
        console.warn('❌ middlePanelRef 未定義')
      }
    }

    /**
     * 🗺️ 適應地圖到數據範圍 (Fit Map to Data)
     */
    const fitMapToData = () => {
      if (middlePanelRef.value) {
        middlePanelRef.value.fitToTainanBounds()
      }
    }

    /**
     * 🔄 重置地圖視圖 (Reset Map View)
     */
    const resetView = () => {
      if (middlePanelRef.value) {
        middlePanelRef.value.resetMapView()
      }
    }

    /**
     * 📊 切換到儀表板 (Switch to Dashboard)
     */
    const switchToDashboard = () => {
      activeTab.value = 'dashboard'
    }

    /**
     * 🕐 取得當前時間 (Get Current Time)
     */
    const getCurrentTime = () => {
      return new Date().toLocaleString('zh-TW')
    }

    // 🔧 拖拽調整功能 (Drag Resize Functions)
    
    /**
     * 🔧 開始調整面板大小 (Start Panel Resize)
     * 改進版本的拖曳系統，提供更流暢的體驗
     */
    const startResize = (direction, event) => {
      event.preventDefault()
      event.stopPropagation()
      
      isSidePanelDragging.value = true
      document.body.classList.add('my-no-select')
      
      // 記錄初始位置和面板尺寸
      const startX = event.clientX
      const startLeftWidth = leftPanelWidth.value
      const startRightWidth = rightPanelWidth.value
      
      // 獲取窗口尺寸以計算百分比
      const currentWindowWidth = windowWidth.value
      
      console.log(`🔧 開始調整 ${direction} 方向，初始值:`, {
        leftWidth: startLeftWidth,
        rightWidth: startRightWidth,
      })

      const handleMouseMove = (moveEvent) => {
        moveEvent.preventDefault()
        
        const deltaX = moveEvent.clientX - startX
        const deltaXPercent = (deltaX / currentWindowWidth) * 100
        
        if (direction === 'left') {
          let newWidth = startLeftWidth + deltaXPercent
          // Clamp newWidth: min is MIN_LEFT_PANEL_WIDTH_PERCENT, max is 100 - current rightPanelWidth (ensuring main panel isn't negative)
          newWidth = Math.max(MIN_LEFT_PANEL_WIDTH_PERCENT, Math.min(100 - rightPanelWidth.value, newWidth))
          leftPanelWidth.value = newWidth
        } else if (direction === 'right') {
          let newWidth = startRightWidth - deltaXPercent
          // Clamp newWidth: min is 0, max is 100 - current leftPanelWidth (ensuring main panel isn't negative)
          // For now, right panel can still be 0. If needed, apply similar min width logic.
          newWidth = Math.max(0, Math.min(100 - leftPanelWidth.value, newWidth))
          rightPanelWidth.value = newWidth
        }
      }

      const handleMouseUp = () => {
        isSidePanelDragging.value = false
        document.body.classList.remove('my-no-select')
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        
        // 驗證最終尺寸
        validatePanelSizes()
        
        console.log('✅ 拖曳調整完成，最終值:', {
          leftWidth: leftPanelWidth.value,
          rightWidth: rightPanelWidth.value,
          mainWidth: mainPanelWidth.value
        })
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    /**
     * ✅ 驗證面板尺寸 (Validate Panel Sizes)
     * 確保面板尺寸在合理範圍內 (0-100%)
     */
    const validatePanelSizes = () => {
      // 確保各面板在0-100%範圍內 (左右面板的最小寬度仍可討論，暫定0)
      // Apply MIN_LEFT_PANEL_WIDTH_PERCENT for left panel
      leftPanelWidth.value = Math.max(MIN_LEFT_PANEL_WIDTH_PERCENT, Math.min(100, leftPanelWidth.value))
      rightPanelWidth.value = Math.max(0, Math.min(100, rightPanelWidth.value)) // Right panel can still be 0
      
      // 四捨五入到一位小數
      leftPanelWidth.value = Math.round(leftPanelWidth.value * 10) / 10
      rightPanelWidth.value = Math.round(rightPanelWidth.value * 10) / 10
    }

    // 📏 視窗大小變化處理 (Window Resize Handler)
    const handleResize = () => {
      windowWidth.value = window.innerWidth;
      windowHeight.value = window.innerHeight;
      nextTick(() => {
        if (appFooterRef.value) {
          footerHeight.value = appFooterRef.value.offsetHeight;
        }
      });
    };

    /**
     * 🚀 組件掛載 (Component Mounted)
     */
    onMounted(() => {
      // 移除自動載入數據
      console.log('🚀 空間分析平台已初始化')
    })

    /**
     * 🗑️ 組件卸載 (Component Unmounted)
     */
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    })

    // 處理高亮顯示
    const handleHighlight = (name) => {
      if (middlePanelRef.value) {
        middlePanelRef.value.highlightFeature(name)
      }
    }

    // 添加醫療院所圖層切換處理函數
    const handleMedicalLayerToggle = (value) => {
      console.log('HomeView: 醫療院所圖層狀態變更:', value)
      if (value) {
        // 顯示載入中
        isLoading.value = true
        loadingText.value = '載入醫療院所資料中...'
        loadingSubText.value = '正在處理醫療院所分布數據...'
        loadingProgress.value = 0
        showLoadingProgress.value = true

        // 加載數據
        loadMedicalData()
      } else {
        showMedicalLayer.value = false
        // 更新表格數據
        if (storeMergedTableData.value) {
          storeMergedTableData.value = storeMergedTableData.value.filter(row => !row.isMedical)
        }
      }
    }

    // 添加加載醫療院所數據的函數
    const loadMedicalData = async () => {
      console.log('開始加載醫療院所數據...')
      
      if (dataStore.isMedicalDataLoaded) {
        console.log('醫療院所數據已加載，切換顯示狀態')
        showMedicalLayer.value = true
        isLoading.value = false
        return
      }

      try {
        console.log('嘗試加載 CSV 文件...')
        const result = await loadCSVData('data/csv/112年12月醫療院所分布圖_全國.csv')
        console.log('CSV 加載成功，數據內容:', {
          totalRows: result.length,
          sampleData: result.slice(0, 3),
          columns: Object.keys(result[0] || {})
        })
        
        // 更新載入進度
        loadingProgress.value = 30
        loadingSubText.value = '正在處理醫療院所位置數據...'
        
        // 轉換數據格式
        const medicalPoints = result.map(row => {
          // 解析 WKT 格式的點位數據
          const wktMatch = row.WKT.match(/POINT \(([^ ]+) ([^ ]+)\)/)
          if (!wktMatch) {
            console.warn('無法解析坐標:', row.WKT)
            return null
          }
          
          // WKT 格式是 (經度 緯度)
          const lng = parseFloat(wktMatch[1])  // 第一個是經度
          const lat = parseFloat(wktMatch[2])  // 第二個是緯度
          
          if (isNaN(lng) || isNaN(lat)) {
            console.warn('無效的坐標值:', { lng, lat, WKT: row.WKT })
            return null
          }

          // console.log('解析坐標:', {
          //   WKT: row.WKT,
          //   lng,
          //   lat,
          //   name: row.醫療院所
          // })

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]  // GeoJSON 格式也是 [經度, 緯度]
            },
            properties: {
              name: row.醫療院所 || '',
              city: row.縣市 || '',
              district: row.鄉鎮市區 || '',
              address: row.地址 || '',
              phone: row.電話 || '',
              isMedical: true
            }
          }
        }).filter(point => point !== null)

        console.log('轉換後的點位數據:', {
          totalPoints: medicalPoints.length,
          samplePoints: medicalPoints.slice(0, 3),
          coordinateRange: {
            minLng: Math.min(...medicalPoints.map(p => p.geometry.coordinates[0])),
            maxLng: Math.max(...medicalPoints.map(p => p.geometry.coordinates[0])),
            minLat: Math.min(...medicalPoints.map(p => p.geometry.coordinates[1])),
            maxLat: Math.max(...medicalPoints.map(p => p.geometry.coordinates[1]))
          }
        })

        const medicalGeoJSON = {
          type: 'FeatureCollection',
          features: medicalPoints
        }

        // 更新載入進度
        loadingProgress.value = 90
        loadingSubText.value = '正在更新地圖和表格...'

        // 更新數據
        medicalData.value = medicalGeoJSON
        dataStore.storeMedicalData(medicalGeoJSON)
        showMedicalLayer.value = true

        // 更新表格數據
        const medicalTableData = medicalPoints.map(point => {
          // 打印每個表格數據的詳細信息
          // console.log('HomeView: 添加表格數據:', {
          //   name: point.properties.name,
          //   city: point.properties.city,
          //   district: point.properties.district,
          //   address: point.properties.address,
          //   phone: point.properties.phone,
          //   coordinates: point.geometry.coordinates
          // })

          return {
            name: point.properties.name,
            city: point.properties.city,
            district: point.properties.district,
            address: point.properties.address,
            phone: point.properties.phone,
            isMedical: true
          }
        })

        // 更新合併後的表格數據
        if (storeMergedTableData.value) {
          // 先移除舊的醫療院所數據
          const filteredData = storeMergedTableData.value.filter(row => !row.isMedical)
          // 添加新的醫療院所數據
          storeMergedTableData.value = [...filteredData, ...medicalTableData]
          console.log('HomeView: 更新表格數據完成，當前表格數據數量:', storeMergedTableData.value.length)
        } else {
          storeMergedTableData.value = medicalTableData
          console.log('HomeView: 初始化表格數據，數據數量:', medicalTableData.length)
        }

        console.log('醫療院所數據處理完成:', {
          totalFeatures: medicalGeoJSON.features.length,
          isVisible: showMedicalLayer.value,
          isStored: !!dataStore.processedData.medicalData,
          tableDataCount: medicalTableData.length
        })

        // 完成載入
        loadingProgress.value = 100
        loadingText.value = '載入完成'
        loadingSubText.value = '醫療院所數據已成功載入'
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('載入醫療院所數據失敗:', error)
        loadingText.value = '載入失敗'
        loadingSubText.value = '醫療院所數據載入失敗，請稍後再試'
        await new Promise(resolve => setTimeout(resolve, 2000))
      } finally {
        isLoading.value = false
        showLoadingProgress.value = false
      }
    }

    // 監聽醫療院所圖層顯示狀態
    watch(() => showMedicalLayer.value, (newValue) => {
      console.log('HomeView: 醫療院所圖層顯示狀態變更:', newValue)
      if (newValue) {
        loadMedicalData()
      }
    })

    // 添加更新坐標和標記數量的函數
    const updateCurrentCoords = (coords) => {
      currentCoords.value = coords
    }

    const updateActiveMarkers = (count) => {
      activeMarkers.value = count
    }

    // 📤 返回響應式數據和函數 (Return Reactive Data and Functions)
    return {
      // 📚 元件引用
      middlePanelRef,
      
      // 📑 分頁狀態
      activeTab,
      activeBottomTab,
      activeRightTab,
      
      // ⏳ 載入狀態
      isLoading,
      isLoadingData,
      loadingText,
      loadingProgress,
      showLoadingProgress,
      loadingSubText,
      
      // 🗺️ 圖層狀態（已移除showLayer1和showLayer2）
      showTainanLayer,
      selectedFilter,
      selectedColorScheme,
      selectedBorderColor,
      selectedBorderWeight,
      
      // 🗺️ 地圖狀態
      zoomLevel,
      currentCoords,
      
      // 📊 統計數據
      totalCount,
      totalDataPoints,
      selectedCount,
      activeMarkers,
      maxCount,
      averageCount,
      dataRegionsCount,
      
      // 📏 面板尺寸（百分比系統）
      leftPanelWidth,
      rightPanelWidth,
      leftPanelWidthPx,
      rightPanelWidthPx,
      mainPanelWidth,
      mainPanelWidthPx,
      
      // 📊 台南數據
      tainanDataSummary,
      tableData,
      storeTainanGeoJSONData,
      storeTainanDataSummary,
      
      
      // 📥 台南數據功能
      loadTainanData,
      clearTainanData,
      highlightOnMap,
      fitMapToData,
      resetView,
      switchToDashboard,
      
      // 🔧 拖拽調整功能
      startResize,
      isSidePanelDragging,
      validatePanelSizes,
      
      // 🛠️ 工具函數
      formatNumber,
      getCurrentTime,
      appFooterRef,
      calculatedMiddlePanelHeight,
      storeMergedTableData,
      handleHighlight,

      // 新的狀態
      showMedicalLayer,
      medicalData,
      isLoadingMedical,
      loadMedicalData,

      // 新的函數
      updateCurrentCoords,
      updateActiveMarkers,
      handleMedicalLayerToggle
    }
  }
}
</script>

<style>
/**
 * 🎨 應用程式全域樣式 (Application Global Styles)
 * 
 * 引入共用CSS並定義全域樣式，主要使用Bootstrap佈局系統
 */
@import '../assets/css/common.css';

/* 📱 全域防止選取樣式 (Global No-Select Style) - 拖曳時使用 */
.my-no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 🔧 拖拉調整器樣式 (Resize Handle Styles) */
/* 🔧 垂直拖曳調整器 (Vertical Resizer) */
.my-resizer-vertical {
  min-width: 4px;
  max-width: 4px;
  cursor: col-resize;
  background-color: #dee2e6;
  transition: all 0.2s ease;
}

.my-resizer-vertical:hover,
.my-resizer-vertical.dragging {
  min-width: 6px;
  max-width: 6px;
  background-color: #007bff;
}

/* 🔧 水平拖曳調整器 (Horizontal Resizer) */
.my-resizer-horizontal {
  min-height: 4px;
  max-height: 4px;
  cursor: row-resize;
  background-color: #dee2e6;
  transition: all 0.2s ease;
}

.my-resizer-horizontal:hover,
.my-resizer-horizontal.dragging {
  min-height: 6px;
  max-height: 6px;
  background-color: #007bff;
}

/* 🔧 拖拉時的全域樣式 (Global Dragging Styles) */
body.my-no-select {
  cursor: inherit !important;
}

body.my-no-select * {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

/* 📱 響應式設計 (Responsive Design) - 使用Bootstrap斷點 */
@media (max-width: 768px) {
  .my-resizer-vertical {
    min-width: 6px;
    max-width: 6px;
  }
  
  .my-resizer-horizontal {
    min-height: 6px;
    max-height: 6px;
  }
  
  .my-resizer-vertical:hover,
  .my-resizer-vertical.dragging {
    min-width: 8px;
    max-width: 8px;
  }
  
  .my-resizer-horizontal:hover,
  .my-resizer-horizontal.dragging {
    min-height: 8px;
    max-height: 8px;
  }
}
</style>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.layer-control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.layer-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-check-input {
  margin: 0;
}

.form-check-label {
  margin: 0;
  font-size: 14px;
  color: #333;
}
</style> 
