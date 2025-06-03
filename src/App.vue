<template>
  <div id="app">
    <!-- 📥 載入覆蓋層 (Loading Overlay) -->
    <LoadingOverlay 
      :isVisible="isLoading" 
      :loadingText="loadingText"
      :progress="loadingProgress"
      :showProgress="showLoadingProgress"
      :subText="loadingSubText" />

    <!-- 📱 主要內容區域 (Main Content Area) -->
    <div class="main-content">
      
      <!-- 🚀 路由視圖（非首頁） -->
      <router-view v-if="$route.path !== '/'" />
      
      <!-- 🏠 首頁內容（空間分析平台） -->
      <div v-if="$route.path === '/'" class="container-fluid h-100 p-0">
        <div class="row h-100 g-0">
          
          <!-- 🎛️ 左側控制面板 (Left Control Panel) -->
          <div class="panel-left d-flex" :style="{ width: leftPanelWidthPx }">
            <LeftPanel 
              :isLoadingData="isLoadingData"
              :canStartAnalysis="canStartAnalysis"
              :showTainanLayer="showTainanLayer"
              :selectedFilter="selectedFilter"
              :leftPanelWidth="leftPanelWidth"
              :tainanDataSummary="tainanDataSummary"
              :analysisList="analysisList"
              @load-tainan-data="loadTainanData"
              @start-analysis="startAnalysis"
              @update:showTainanLayer="showTainanLayer = $event"
              @update:selectedFilter="selectedFilter = $event" />
            
            <!-- 🔧 左側拖曳調整器 (Left Resizer) -->
            <div class="resizer resizer-vertical" 
                 @mousedown="startResize($event, 'left')"
                 title="拖曳調整左側面板寬度 (0-100%)">
            </div>
          </div>

          <!-- 🗺️ 主要顯示區域 (Main Display Area) -->
          <div class="panel-main d-flex flex-column" :style="{ width: mainPanelWidthPx }">
            <MainContent 
              ref="mainContent"
              :activeTab="activeTab"
              :mainPanelWidth="mainPanelWidth"
              :contentHeight="contentHeight"
              :showTainanLayer="showTainanLayer"
              :selectedFilter="selectedFilter"
              :selectedColorScheme="selectedColorScheme"
              :zoomLevel="zoomLevel"
              :tainanGeoJSONData="tainanGeoJSONData"
              :maxCount="maxCount"
              :mergedTableData="mergedTableData"
              :averageCount="averageCount"
              :dataRegionsCount="dataRegionsCount"
              @update:activeTab="activeTab = $event"
              @update:zoomLevel="zoomLevel = $event"
              @update:currentCoords="currentCoords = $event"
              @update:activeMarkers="activeMarkers = $event" />
            
            <!-- 🔧 水平拖曳調整器 (Horizontal Resizer) -->
            <div class="resizer resizer-horizontal" 
                 @mousedown="startResize($event, 'horizontal')"
                 title="拖曳調整內容高度 (0-100%)">
            </div>
            
            <!-- 📊 底部控制面板 (Bottom Control Panel) -->
            <BottomPanel 
              :activeBottomTab="activeBottomTab"
              :bottomPanelHeight="bottomPanelHeight"
              :mergedTableData="mergedTableData"
              :sortedAndFilteredTableData="sortedAndFilteredTableData"
              :tableSearchQuery="tableSearchQuery"
              :sortField="sortField"
              :sortDirection="sortDirection"
              :zoomLevel="zoomLevel"
              :currentCoords="currentCoords"
              :isLoadingData="isLoadingData"
              :showTainanLayer="showTainanLayer"
              :selectedColorScheme="selectedColorScheme"
              :maxCount="maxCount"
              @update:activeBottomTab="activeBottomTab = $event"
              @update:tableSearchQuery="tableSearchQuery = $event"
              @sort-table="sortTable"
              @highlight-on-map="highlightOnMap"
              @update:zoomLevel="zoomLevel = $event"
              @update:selectedColorScheme="selectedColorScheme = $event"
              @reset-view="resetView" />
          </div>

          <!-- 📈 右側控制面板 (Right Control Panel) -->
          <div class="panel-right d-flex" :style="{ width: rightPanelWidthPx }">
            
            <!-- 🔧 右側拖曳調整器 (Right Resizer) -->
            <div class="resizer resizer-vertical" 
                 @mousedown="startResize($event, 'right')"
                 title="拖曳調整右側面板寬度 (0-100%)">
            </div>
            
            <RightPanel 
              :activeRightTab="activeRightTab"
              :totalCount="totalCount"
              :activeMarkers="activeMarkers"
              :tainanDataSummary="tainanDataSummary"
              :mergedTableData="mergedTableData"
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

    <!-- 🦶 頁腳區域 (Footer Area) -->
    <footer class="app-footer">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 text-md-start text-center">
            <small>© 2024 空間分析視覺化平台. All rights reserved.</small>
          </div>
          <div class="col-md-6 text-md-end text-center">
            <small>
              Powered by <a href="https://vuejs.org/" target="_blank">Vue.js</a> & 
              <a href="https://leafletjs.com/" target="_blank">Leaflet</a> & 
              <a href="https://d3js.org/" target="_blank">D3.js</a>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { formatNumber } from './utils/utils.js'
import { loadTainanData as loadTainanDataUtil } from './utils/dataProcessor.js'
import { performCompleteSpatialAnalysis } from './utils/spatialAnalysis.js'

// 🧩 組件引入
import LoadingOverlay from './components/LoadingOverlay.vue'
import LeftPanel from './components/LeftPanel.vue'
import MainContent from './components/MainContent.vue'
import BottomPanel from './components/BottomPanel.vue'
import RightPanel from './components/RightPanel.vue'

export default {
  name: 'App',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   */
  components: {
    LoadingOverlay,
    LeftPanel,
    MainContent,
    BottomPanel,
    RightPanel
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup() {
    // 📚 元件引用 (Component References)
    const mainContent = ref(null)

    // 📑 分頁狀態 (Tab States)
    const activeTab = ref('map')
    const activeBottomTab = ref('table')
    const activeRightTab = ref('results')

    // 📏 面板大小狀態 - 使用百分比系統 (Panel Size States - Percentage Based)
    const leftPanelWidth = ref(20)        // 左側面板寬度百分比 (0-100%)
    const rightPanelWidth = ref(20)       // 右側面板寬度百分比 (0-100%)
    const bottomPanelHeight = ref(300)    // 底部面板高度像素值
    const windowWidth = ref(window.innerWidth)
    const windowHeight = ref(window.innerHeight)

    // 🧮 計算屬性 - 面板尺寸 (Computed Properties - Panel Dimensions)
    const leftPanelWidthPx = computed(() => `${leftPanelWidth.value}%`)
    const rightPanelWidthPx = computed(() => `${rightPanelWidth.value}%`)
    const mainPanelWidth = computed(() => 100 - leftPanelWidth.value - rightPanelWidth.value)
    const mainPanelWidthPx = computed(() => `${mainPanelWidth.value}%`)
    const contentHeight = computed(() => 
      windowHeight.value - bottomPanelHeight.value - 116 // 扣除導航欄和頁腳高度
    )

    // ⏳ 載入狀態 (Loading States)
    const isLoading = ref(false)
    const isLoadingData = ref(false)
    const loadingText = ref('載入中...')
    const loadingProgress = ref(0)
    const showLoadingProgress = ref(false)
    const loadingSubText = ref('')

    // 🗺️ 地圖和圖層狀態 (Map and Layer States)
    // 注意：已移除showLayer1和showLayer2（商店標記和熱點區域）
    const showTainanLayer = ref(false)
    const selectedFilter = ref('')
    const selectedColorScheme = ref('viridis')
    const zoomLevel = ref(10)
    const currentCoords = ref({ lat: 25.0330, lng: 121.5654 })
    const totalCount = ref(1250000)
    const selectedCount = ref(0)
    const activeMarkers = ref(0)
    
    // 📊 台南數據相關 (Tainan Data Related)
    const tainanDataSummary = ref(null)
    const mergedTableData = ref([])
    const tableSearchQuery = ref('')
    const tainanGeoJSONData = ref(null)

    // 📈 分析相關 (Analysis Related)
    const analysisList = ref([])
    const selectedAnalysisId = ref(null)
    let analysisIdCounter = 1

    // 📋 表格排序 (Table Sorting)
    const sortField = ref('')
    const sortDirection = ref('asc')

    // 🧮 統計計算屬性 (Statistical Computed Properties)
    const totalDataPoints = computed(() => {
      return mergedTableData.value.length || totalCount.value
    })

    const maxCount = computed(() => {
      if (mergedTableData.value.length === 0) return 0
      return Math.max(...mergedTableData.value.map(row => row.count || 0))
    })

    const averageCount = computed(() => {
      if (mergedTableData.value.length === 0) return 0
      const counts = mergedTableData.value.map(row => row.count || 0)
      return counts.reduce((a, b) => a + b, 0) / counts.length
    })

    const dataRegionsCount = computed(() => {
      return mergedTableData.value.filter(row => row.count > 0).length
    })

    // 🔍 表格篩選和排序 (Table Filtering and Sorting)
    const filteredTableData = computed(() => {
      if (!tableSearchQuery.value) return mergedTableData.value
      const query = tableSearchQuery.value.toLowerCase()
      return mergedTableData.value.filter(row => 
        (row.code2 && row.code2.toLowerCase().includes(query)) ||
        (row.name && row.name.toLowerCase().includes(query)) ||
        (row.count && row.count.toString().includes(query))
      )
    })

    const sortedAndFilteredTableData = computed(() => {
      let data = filteredTableData.value
      
      if (sortField.value) {
        data = [...data].sort((a, b) => {
          let aVal = a[sortField.value]
          let bVal = b[sortField.value]
          
          // 處理數字類型
          if (sortField.value === 'count' || sortField.value === 'id') {
            aVal = Number(aVal) || 0
            bVal = Number(bVal) || 0
          } else {
            // 字串類型
            aVal = String(aVal || '').toLowerCase()
            bVal = String(bVal || '').toLowerCase()
          }
          
          if (sortDirection.value === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
          }
        })
      }
      
      return data
    })

    const canStartAnalysis = computed(() => {
      return mergedTableData.value.length > 0 && !isLoadingData.value
    })

    // 📋 表格排序函數 (Table Sorting Functions)
    const sortTable = (field) => {
      if (sortField.value === field) {
        // 切換排序方向
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        // 新欄位，預設升序
        sortField.value = field
        sortDirection.value = 'asc'
      }
    }

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
        
        const analysisPoints = mergedTableData.value.map((row, index) => ({
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
          dataCount: mergedTableData.value.length,
          analysisPoints: analysisPoints.length,
          status: '完成',
          data: [...mergedTableData.value],
          results: analysisResults,
          summary: {
            moransI: analysisResults.moransI?.global?.observedI?.toFixed(4) || 'N/A',
            significance: analysisResults.moransI?.global?.significance?.significance || 'unknown',
            clusters: analysisResults.moransI?.summary?.clusters || 0,
            outliers: analysisResults.moransI?.summary?.outliers || 0,
            spatialPattern: analysisResults.moransI?.global?.interpretation || '無法判斷'
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
      isLoadingData.value = true
      isLoading.value = true
      loadingText.value = '載入台南市數據...'
      showLoadingProgress.value = true
      loadingSubText.value = '正在讀取 GeoJSON 和 Excel 文件'

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

        const data = await loadTainanDataUtil()
        
        loadingProgress.value = 100
        loadingSubText.value = '數據載入完成'

        tainanDataSummary.value = data.summary
        mergedTableData.value = data.tableData
        tainanGeoJSONData.value = data.mergedGeoJSON
        
        // 自動顯示台南圖層
        showTainanLayer.value = true
        
        // 切換到表格tab
        activeBottomTab.value = 'table'
        
        console.log('✅ 台南數據載入完成:', data.summary)
      } catch (error) {
        console.error('❌ 載入台南數據失敗:', error)
        alert('載入數據失敗，請檢查文件路徑和格式')
      } finally {
        isLoadingData.value = false
        isLoading.value = false
        loadingProgress.value = 0
        showLoadingProgress.value = false
      }
    }

    /**
     * 🗑️ 清除台南數據 (Clear Tainan Data)
     */
    const clearTainanData = () => {
      if (confirm('確定要清除台南數據嗎？')) {
        // 清除數據
        tainanDataSummary.value = null
        mergedTableData.value = []
        tainanGeoJSONData.value = null
        tableSearchQuery.value = ''
        
        // 隱藏圖層
        showTainanLayer.value = false
        
        console.log('✅ 台南數據已清除')
      }
    }

    // 🗺️ 地圖互動函數 (Map Interaction Functions)
    
    /**
     * 🎯 在地圖上高亮顯示 (Highlight on Map)
     */
    const highlightOnMap = (row) => {
      if (mainContent.value) {
        mainContent.value.highlightFeature(row.code2)
      }
    }

    /**
     * 🗺️ 適應地圖到數據範圍 (Fit Map to Data)
     */
    const fitMapToData = () => {
      if (mainContent.value) {
        mainContent.value.fitToTainanBounds()
      }
    }

    /**
     * 🔄 重置地圖視圖 (Reset Map View)
     */
    const resetView = () => {
      if (mainContent.value) {
        mainContent.value.resetView()
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

    // 🔧 拖拉調整功能 - 支援0-100%範圍 (Resize Functionality - 0-100% Range)
    let isResizing = false
    let resizeType = ''
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0

    /**
     * 🔧 開始拖拉調整 (Start Resize)
     * @param {Event} event - 滑鼠事件
     * @param {string} type - 調整類型 ('left', 'right', 'horizontal')
     */
    const startResize = (event, type) => {
      isResizing = true
      resizeType = type
      startX = event.clientX
      startY = event.clientY
      
      if (type === 'left') {
        startWidth = leftPanelWidth.value
      } else if (type === 'right') {
        startWidth = rightPanelWidth.value
      } else if (type === 'horizontal') {
        startHeight = bottomPanelHeight.value
      }
      
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
      document.body.classList.add('no-select')  // 防止拖拉時選取文字
      event.preventDefault()
    }

    /**
     * 🔧 處理拖拉調整 (Handle Resize)
     * 支援完全彈性的0-100%範圍調整
     */
    const handleResize = (event) => {
      if (!isResizing) return
      
      if (resizeType === 'left') {
        // 左側面板：計算百分比變化
        const deltaX = event.clientX - startX
        const deltaPercent = (deltaX / windowWidth.value) * 100
        const newWidth = Math.max(0, Math.min(100, startWidth + deltaPercent))
        leftPanelWidth.value = newWidth
      } else if (resizeType === 'right') {
        // 右側面板：計算百分比變化（反向）
        const deltaX = event.clientX - startX
        const deltaPercent = (deltaX / windowWidth.value) * 100
        const newWidth = Math.max(0, Math.min(100, startWidth - deltaPercent))
        rightPanelWidth.value = newWidth
      } else if (resizeType === 'horizontal') {
        // 底部面板：像素調整
        const deltaY = event.clientY - startY
        const newHeight = Math.max(50, Math.min(windowHeight.value * 0.8, startHeight - deltaY))
        bottomPanelHeight.value = newHeight
      }
    }

    /**
     * 🔧 停止拖拉調整 (Stop Resize)
     */
    const stopResize = () => {
      isResizing = false
      resizeType = ''
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
      document.body.classList.remove('no-select')
    }

    // 📏 視窗大小變化處理 (Window Resize Handler)
    const handleWindowResize = () => {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
    }

    /**
     * 🚀 組件掛載 (Component Mounted)
     */
    onMounted(() => {
      window.addEventListener('resize', handleWindowResize)
      console.log('🚀 空間分析平台已初始化')
    })

    /**
     * 🗑️ 組件卸載 (Component Unmounted)
     */
    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowResize)
    })

    // 📤 返回響應式數據和函數 (Return Reactive Data and Functions)
    return {
      // 📚 元件引用
      mainContent,
      
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
      bottomPanelHeight,
      leftPanelWidthPx,
      rightPanelWidthPx,
      mainPanelWidth,
      mainPanelWidthPx,
      contentHeight,
      
      // 📊 台南數據
      tainanDataSummary,
      mergedTableData,
      tableSearchQuery,
      filteredTableData,
      sortedAndFilteredTableData,
      tainanGeoJSONData,
      
      // 📋 表格排序
      sortField,
      sortDirection,
      
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
      
      // 📋 表格功能
      sortTable,
      
      // 🔧 拖拉調整功能
      startResize,
      
      // 🛠️ 工具函數
      formatNumber,
      getCurrentTime
    }
  }
}
</script>

<style>
/**
 * 🎨 應用程式全域樣式 (Application Global Styles)
 * 
 * 引入共用CSS並定義全域樣式
 */
@import './assets/css/common.css';

/* 📱 全域防止選取樣式 (Global No-Select Style) */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 🔧 拖拉調整時的游標樣式 (Cursor Styles During Resize) */
.resizer-vertical {
  cursor: col-resize;
}

.resizer-horizontal {
  cursor: row-resize;
}

/* 📱 響應式調整 (Responsive Adjustments) */
@media (max-width: 768px) {
  .panel-left,
  .panel-right {
    min-width: 0;  /* 允許在小螢幕上完全摺疊 */
  }
  
  .resizer {
    width: 8px;    /* 在小螢幕上增加拖拉區域 */
    height: 8px;
  }
}
</style>
