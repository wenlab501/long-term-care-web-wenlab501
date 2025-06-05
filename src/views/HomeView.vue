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
              :isLoadingData="isLoadingData"
              :canStartAnalysis="canStartAnalysis"
              :showTainanLayer="showTainanLayer"
              :selectedFilter="selectedFilter"
              :leftPanelWidth="leftPanelWidth"
              :zoomLevel="zoomLevel"
              :activeMarkers="activeMarkers"
              :tainanDataSummary="tainanDataSummary"
              :analysisList="analysisList"
              :mergedTableData="storeMergedTableData"
              @load-tainan-data="loadTainanData"
              @start-analysis="startAnalysis"
              @update:showTainanLayer="showTainanLayer = $event"
              @update:selectedFilter="selectedFilter = $event"
              @fit-map-to-data="fitMapToData"
              @clear-tainan-data="clearTainanData"
              @switch-to-dashboard="switchToDashboard"
            />
        </div>
        
          <!-- 🔧 左側拖曳調整器 (Left Resizer) - Now a direct child of the flex row -->
          <div class="my-resizer my-resizer-vertical border-start border-end" 
               :class="{ 'dragging': isSidePanelDragging }"
               @mousedown="startResize('left', $event)"
               title="拖曳調整左側面板寬度">
            </div>
            
          <!-- 🌟 新的主要顯示區域組件 (New Main Display Area Component) -->
          <MainDisplayArea
            ref="mainDisplayAreaRef"
            class="d-flex flex-column flex-grow-1 overflow-hidden h-100"
            :style="{ width: mainPanelWidthPx, 'min-width': '0px' }"
            :dynamicMainAreaHeight="calculatedMainDisplayAreaHeight"
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
          />

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
              :analysisList="analysisList"
              :selectedAnalysisId="selectedAnalysisId"
              :rightPanelWidth="rightPanelWidth"
              @update:activeRightTab="activeRightTab = $event"
              @fit-map-to-data="fitMapToData"
              @clear-tainan-data="clearTainanData"
              @switch-to-dashboard="switchToDashboard"
              @select-analysis="selectAnalysis"
              @view-analysis="viewAnalysis"
              @delete-analysis="deleteAnalysis" />
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
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { formatNumber } from '../utils/utils.js'
import { loadTainanData as loadTainanDataUtil } from '../utils/dataProcessor.js'
import { performCompleteSpatialAnalysis } from '../utils/spatialAnalysis.js'
import { useDataStore } from '@/stores/dataStore'

// 🧩 組件引入
import LoadingOverlay from '../components/LoadingOverlay.vue'
import LeftPanel from '../components/LeftPanel.vue'
import MainDisplayArea from '../components/MainDisplayArea.vue'
import RightPanel from '../components/RightPanel.vue'

export default {
  name: 'App',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   */
  components: {
    LoadingOverlay,
    LeftPanel,
    MainDisplayArea,
    RightPanel
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup() {
    const dataStore = useDataStore()

    // 📚 元件引用 (Component References)
    const mainDisplayAreaRef = ref(null)
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

    const calculatedMainDisplayAreaHeight = computed(() => {
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
    const storeTainanDataSummary = computed(() => {
      // 假設 summary 也應該從 store 來，或者 dataStore 內部有一個 summary 的 computed
      // 暫時保持 tainanDataSummary.value = data.summary 的賦值，或者將其也存入 store
      // 如果 dataStore.dataSummary 是有效的，則使用它
      return dataStore.dataSummary; 
    });

    // 📈 分析相關 (Analysis Related)
    const analysisList = ref([])
    const selectedAnalysisId = ref(null)
    let analysisIdCounter = 1

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

    const canStartAnalysis = computed(() => {
      return storeMergedTableData.value && storeMergedTableData.value.length > 0 && !isLoadingData.value;
    })

    // 📈 分析功能函數 (Analysis Functions)
    
    /**
     * 🔬 開始空間分析 (Start Spatial Analysis)
     * 執行完整的Moran's I空間自相關分析
     */
    const startAnalysis = async () => {
      if (!canStartAnalysis.value) return

      // 顯示載入進度
      isLoading.value = true
      loadingText.value = '正在進行空間分析...'
      showLoadingProgress.value = true
      loadingSubText.value = '準備數據...'

      try {
        // 步驟1：準備分析數據
        loadingProgress.value = 10
        loadingSubText.value = '轉換數據格式...'
        
        const analysisPoints = storeMergedTableData.value.map((row, index) => ({
          lng: 120.2 + Math.random() * 0.5, // 模擬台南座標範圍
          lat: 22.9 + Math.random() * 0.3,
          value: row.count || Math.random() * 100,
          id: index,
          properties: row
        }))

        // 步驟2：執行Moran's I分析
        loadingProgress.value = 30
        loadingSubText.value = '執行 Moran\'s I 空間自相關分析...'
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 步驟3：進行聚集模式分析
        loadingProgress.value = 50
        loadingSubText.value = '分析空間聚集模式...'
        await new Promise(resolve => setTimeout(resolve, 800))

        // 步驟4：計算空間統計
        loadingProgress.value = 70
        loadingSubText.value = '計算空間統計指標...'
        await new Promise(resolve => setTimeout(resolve, 600))

        // 步驟5：執行完整分析
        loadingProgress.value = 85
        loadingSubText.value = '生成分析報告...'
        
        const analysisResults = performCompleteSpatialAnalysis(analysisPoints, {
          kNeighbors: 8,
          includeKNN: true,
          includeMoransI: true,
          includeClusters: true,
          includeHotspots: false  // 已移除熱點分析功能
        })

        loadingProgress.value = 100
        loadingSubText.value = '分析完成'

        // 創建新的分析項目
        const newAnalysis = {
          id: analysisIdCounter++,
          name: `台南市空間分析 #${analysisIdCounter - 1}`,
          type: 'spatial_analysis',
          createdAt: getCurrentTime(),
          dataCount: storeMergedTableData.value.length,
          analysisPoints: analysisPoints.length,
          status: '完成',
          data: [...storeMergedTableData.value],
          results: analysisResults,
          summary: {
            moransI: analysisResults.moransI?.global?.observedI?.toFixed(4) || 'N/A',
            significance: analysisResults.moransI?.global?.significance?.significance || 'unknown',
            clusters: analysisResults.moransI?.summary?.clusters || 0,
            outliers: analysisResults.moransI?.summary?.outliers || 0,
            spatialPattern: analysisResults.moransI?.global?.interpretation || '無法判斷',
            randomValue1: (Math.random() * 100).toFixed(2),
            randomValue2: Math.floor(Math.random() * 50) + 1
          }
        }

        analysisList.value.push(newAnalysis)
        selectedAnalysisId.value = newAnalysis.id

        // 切換到分析結果tab
        activeRightTab.value = 'results'

        console.log('✅ 空間分析完成:', newAnalysis.summary)
      } catch (error) {
        console.error('❌ 分析失敗:', error)
        alert('分析過程中發生錯誤: ' + error.message)
      } finally {
        isLoading.value = false
        loadingProgress.value = 0
        showLoadingProgress.value = false
      }
    }

    /**
     * 📋 選擇分析項目 (Select Analysis Item)
     */
    const selectAnalysis = (analysisId) => {
      selectedAnalysisId.value = analysisId
    }

    /**
     * 👁️ 查看分析結果 (View Analysis Results)
     */
    const viewAnalysis = (analysisId) => {
      const analysis = analysisList.value.find(a => a.id === analysisId)
      if (analysis) {
        selectedAnalysisId.value = analysisId
        // 切換到分析結果tab
        activeRightTab.value = 'results'
        // 也可以切換到地圖或儀表板查看結果
        activeTab.value = 'dashboard'
      }
    }

    /**
     * 🗑️ 刪除分析項目 (Delete Analysis Item)
     */
    const deleteAnalysis = (analysisId) => {
      if (confirm('確定要刪除這個分析項目嗎？')) {
        analysisList.value = analysisList.value.filter(a => a.id !== analysisId)
        if (selectedAnalysisId.value === analysisId) {
          selectedAnalysisId.value = null
        }
      }
    }

    // 📥 台南數據功能函數 (Tainan Data Functions)
    
    /**
     * 📥 載入台南數據 (Load Tainan Data)
     * 載入GeoJSON和Excel文件並進行數據合併
     */
    const loadTainanData = async () => {
      console.log('HomeView.vue: loadTainanData function CALLED');
      isLoadingData.value = true;
      isLoading.value = true;
      loadingText.value = '載入數據...';
      showLoadingProgress.value = true;
      loadingSubText.value = '正在讀取 GeoJSON 和 Excel 文件';

      try {
        // 模擬載入進度
        loadingProgress.value = 20
        loadingSubText.value = '讀取 GeoJSON 文件...'
        await new Promise(resolve => setTimeout(resolve, 500))

        loadingProgress.value = 50
        loadingSubText.value = '讀取 Excel 文件...'
        await new Promise(resolve => setTimeout(resolve, 500))

        loadingProgress.value = 80
        loadingSubText.value = '合併數據...'
        await new Promise(resolve => setTimeout(resolve, 500))

        const data = await loadTainanDataUtil();
        console.log('HomeView.vue: Data received from loadTainanDataUtil:', data);
        console.log('HomeView.vue: data.tableData:', data.tableData);
        console.log('HomeView.vue: Is data.tableData an array?', Array.isArray(data.tableData));
        
        // 將數據存儲到 Pinia store
        dataStore.storeLoadedTainanData(data);

        // tainanDataSummary 仍然可以局部更新，或者也從 store 中讀取 (如上面的 computed)
        tainanDataSummary.value = data.summary; 
        // tableData.value 的賦值也需要重新評估，是否也應該從 store 管理
        // 暫時保留，但注意其數據源現在應該與 storeMergedTableData 一致
        tableData.value = Array.isArray(data.tableData) ? data.tableData : [];

        loadingProgress.value = 100;
        loadingSubText.value = '數據載入完成';
        showTainanLayer.value = true;
        activeBottomTab.value = 'table';
        selectedFilter.value = '';
        console.log('✅ 台南數據載入完成並已存儲到 Pinia:', data.summary);
      } catch (error) {
        console.error('❌ 載入台南數據失敗:', error);
        alert('載入數據失敗，請檢查文件路徑和格式');
      } finally {
        isLoadingData.value = false;
        isLoading.value = false;
        loadingProgress.value = 0;
        showLoadingProgress.value = false;
      }
    };

    /**
     * 🗑️ 清除台南數據 (Clear Tainan Data)
     */
    const clearTainanData = () => {
      if (confirm('確定要清除台南數據嗎？')) {
        dataStore.clearData('loadedAndMergedGeoJSON'); // 假設 clearData 可以處理 processedData 子屬性
        dataStore.clearData('loadedAndMergedTableData');
        // 或者一個更通用的 clearProcessedSubData('loadedAndMergedGeoJSON')
        // 並且也清理 rawData.geojson (如果 storeLoadedTainanData 也更新了它)
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
      console.log('🎯 highlightOnMap 被調用:', row)
      console.log('🎯 row.code2:', row.code2)
      console.log('🎯 mainDisplayAreaRef.value:', mainDisplayAreaRef.value)
      
      if (mainDisplayAreaRef.value) {
        // 先切換到地圖分頁（如果當前不在地圖分頁）
        if (activeTab.value !== 'map') {
          console.log('🎯 切換到地圖分頁...')
          activeTab.value = 'map'
          
          // 等待分頁切換完成後再進行高亮
          setTimeout(() => {
            console.log('🎯 延遲調用 highlightFeature...')
            mainDisplayAreaRef.value.highlightFeature(row.code2)
          }, 300)
        } else {
          console.log('🎯 直接調用 highlightFeature...')
          mainDisplayAreaRef.value.highlightFeature(row.code2)
        }
        
        console.log(`🎯 定位到 ${row.name || row.code2} via MainDisplayArea`)
      } else {
        console.error('❌ mainDisplayAreaRef.value 為 null for highlightOnMap')
      }
    }

    /**
     * 🗺️ 適應地圖到數據範圍 (Fit Map to Data)
     */
    const fitMapToData = () => {
      if (mainDisplayAreaRef.value) {
        mainDisplayAreaRef.value.fitToTainanBounds()
      }
    }

    /**
     * 🔄 重置地圖視圖 (Reset Map View)
     */
    const resetView = () => {
      if (mainDisplayAreaRef.value) {
        mainDisplayAreaRef.value.resetMapView()
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
      window.addEventListener('resize', handleResize);
      handleResize();
      // loadTainanData(); // Removed to prevent automatic data loading
      console.log('🚀 空間分析平台已初始化')
    })

    /**
     * 🗑️ 組件卸載 (Component Unmounted)
     */
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    })

    // 📤 返回響應式數據和函數 (Return Reactive Data and Functions)
    return {
      // 📚 元件引用
      mainDisplayAreaRef,
      
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
      
      // 📈 分析數據
      analysisList,
      selectedAnalysisId,
      canStartAnalysis,
      
      // 📈 分析功能
      startAnalysis,
      selectAnalysis,
      viewAnalysis,
      deleteAnalysis,
      
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
      calculatedMainDisplayAreaHeight,
      storeMergedTableData
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
