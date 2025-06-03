<template>
  <div id="app">
    <!-- Loading Overlay -->
    <LoadingOverlay 
      :isVisible="isLoading" 
      :loadingText="loadingText"
      :progress="loadingProgress"
      :showProgress="showLoadingProgress"
      :subText="loadingSubText" />

    <!-- Top Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">
          <i class="fas fa-map-marked-alt"></i> 空間分析視覺化平台 - 驢子熱分析
        </span>
        <div class="navbar-nav ms-auto">
          <router-link to="/home" class="nav-link text-white" active-class="active">
            <i class="fas fa-home me-1"></i> 主頁
          </router-link>
          <router-link to="/data" class="nav-link text-white" active-class="active">
            <i class="fas fa-database me-1"></i> 資料檢視
          </router-link>
          <router-link to="/design" class="nav-link text-white" active-class="active">
            <i class="fas fa-palette me-1"></i> 設計系統
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <div class="main-content">
      <router-view v-if="$route.path !== '/'" />
      
      <!-- Home Content -->
      <div v-if="$route.path === '/'" class="container-fluid h-100 p-0">
        <div class="row h-100 g-0">
          <!-- Left Control Panel -->
          <div class="panel-left d-flex" :style="{ width: leftPanelWidth + 'px' }">
            <LeftPanel 
              :isLoadingData="isLoadingData"
              :canStartAnalysis="canStartAnalysis"
              :showLayer1="showLayer1"
              :showLayer2="showLayer2"
              :showTainanLayer="showTainanLayer"
              :selectedFilter="selectedFilter"
              :selectedColorScheme="selectedColorScheme"
              :leftPanelWidth="leftPanelWidth"
              :tainanDataSummary="tainanDataSummary"
              :analysisList="analysisList"
              @load-tainan-data="loadTainanData"
              @start-analysis="startAnalysis"
              @update:showLayer1="showLayer1 = $event"
              @update:showLayer2="showLayer2 = $event"
              @update:showTainanLayer="showTainanLayer = $event"
              @update:selectedFilter="selectedFilter = $event"
              @update:selectedColorScheme="selectedColorScheme = $event" />
            <!-- Left Resizer -->
            <div class="resizer resizer-vertical" 
                 @mousedown="startResize($event, 'left')"
                 title="拖曳調整面板寬度">
            </div>
          </div>

          <!-- Main Screen -->
          <div class="panel-main d-flex flex-column" :style="{ width: mainPanelWidth + 'px' }">
            <MainContent 
              ref="mainContent"
              :activeTab="activeTab"
              :mainPanelWidth="mainPanelWidth"
              :contentHeight="contentHeight"
              :showLayer1="showLayer1"
              :showLayer2="showLayer2"
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
            
            <!-- Horizontal Resizer -->
            <div class="resizer resizer-horizontal" 
                 @mousedown="startResize($event, 'horizontal')"
                 title="拖曳調整內容高度">
            </div>
            
            <!-- Bottom Control Panel with Tabs -->
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
              :showLayer1="showLayer1"
              :showLayer2="showLayer2"
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

          <!-- Right Control Panel with Tabs -->
          <div class="panel-right d-flex" :style="{ width: rightPanelWidth + 'px' }">
            <!-- Right Resizer -->
            <div class="resizer resizer-vertical" 
                 @mousedown="startResize($event, 'right')"
                 title="拖曳調整面板寬度">
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

    <!-- Footer -->
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { formatNumber } from './utils/utils.js'
import { loadTainanData as loadTainanDataUtil } from './utils/dataProcessor.js'
import LoadingOverlay from './components/LoadingOverlay.vue'
import LeftPanel from './components/LeftPanel.vue'
import MainContent from './components/MainContent.vue'
import BottomPanel from './components/BottomPanel.vue'
import RightPanel from './components/RightPanel.vue'

export default {
  name: 'App',
  components: {
    LoadingOverlay,
    LeftPanel,
    MainContent,
    BottomPanel,
    RightPanel
  },
  setup() {
    const mainContent = ref(null)

    // Tab states
    const activeTab = ref('map')
    const activeBottomTab = ref('table')
    const activeRightTab = ref('results')

    // Panel size state
    const leftPanelWidth = ref(250)
    const rightPanelWidth = ref(250)
    const bottomPanelHeight = ref(300)
    const windowWidth = ref(window.innerWidth)
    const windowHeight = ref(window.innerHeight)

    // Computed values
    const mainPanelWidth = computed(() => 
      windowWidth.value - leftPanelWidth.value - rightPanelWidth.value
    )
    const contentHeight = computed(() => 
      windowHeight.value - bottomPanelHeight.value - 156 // 增加footer高度
    )

    // Loading states
    const isLoading = ref(false)
    const isLoadingData = ref(false)
    const loadingText = ref('載入中...')
    const loadingProgress = ref(0)
    const showLoadingProgress = ref(false)
    const loadingSubText = ref('')

    // Reactive data
    const showLayer1 = ref(true)
    const showLayer2 = ref(false)
    const showTainanLayer = ref(false)
    const selectedFilter = ref('')
    const selectedColorScheme = ref('default')
    const zoomLevel = ref(10)
    const currentCoords = ref({ lat: 25.0330, lng: 121.5654 })
    const totalCount = ref(1250000)
    const selectedCount = ref(0)
    const activeMarkers = ref(0)
    
    // Tainan data related
    const tainanDataSummary = ref(null)
    const mergedTableData = ref([])
    const tableSearchQuery = ref('')
    const tainanGeoJSONData = ref(null)

    // Analysis related
    const analysisList = ref([])
    const selectedAnalysisId = ref(null)
    let analysisIdCounter = 1

    // Table sorting
    const sortField = ref('')
    const sortDirection = ref('asc')

    // Computed values for statistics
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

    // Table sorting functions
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

    // Analysis functions
    const startAnalysis = async () => {
      if (!canStartAnalysis.value) return

      // 顯示loading
      isLoading.value = true
      loadingText.value = '正在進行分析...'
      showLoadingProgress.value = true
      loadingSubText.value = '分析台南市數據分布'

      try {
        // 模擬分析過程
        for (let i = 0; i <= 100; i += 10) {
          loadingProgress.value = i
          await new Promise(resolve => setTimeout(resolve, 200))
        }

        // 創建新的分析項目
        const newAnalysis = {
          id: analysisIdCounter++,
          name: `台南市分析 #${analysisIdCounter - 1}`,
          createdAt: getCurrentTime(),
          dataCount: mergedTableData.value.length,
          status: '完成',
          data: [...mergedTableData.value]
        }

        analysisList.value.push(newAnalysis)
        selectedAnalysisId.value = newAnalysis.id

        // 切換到分析清單tab
        activeRightTab.value = 'list'

        console.log('分析完成:', newAnalysis)
      } catch (error) {
        console.error('分析失敗:', error)
        alert('分析過程中發生錯誤')
      } finally {
        isLoading.value = false
        loadingProgress.value = 0
        showLoadingProgress.value = false
      }
    }

    const selectAnalysis = (analysisId) => {
      selectedAnalysisId.value = analysisId
    }

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

    const deleteAnalysis = (analysisId) => {
      if (confirm('確定要刪除這個分析項目嗎？')) {
        analysisList.value = analysisList.value.filter(a => a.id !== analysisId)
        if (selectedAnalysisId.value === analysisId) {
          selectedAnalysisId.value = null
        }
      }
    }

    // Tainan data functions
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
        
        console.log('台南數據載入完成:', data.summary)
      } catch (error) {
        console.error('載入台南數據失敗:', error)
        alert('載入數據失敗，請檢查文件路徑和格式')
      } finally {
        isLoadingData.value = false
        isLoading.value = false
        loadingProgress.value = 0
        showLoadingProgress.value = false
      }
    }

    const clearTainanData = () => {
      if (confirm('確定要清除台南數據嗎？')) {
        // 清除數據
        tainanDataSummary.value = null
        mergedTableData.value = []
        tainanGeoJSONData.value = null
        tableSearchQuery.value = ''
        
        // 隱藏圖層
        showTainanLayer.value = false
        
        console.log('台南數據已清除')
      }
    }

    const highlightOnMap = (row) => {
      if (mainContent.value) {
        mainContent.value.highlightFeature(row.code2)
      }
    }

    const fitMapToData = () => {
      if (mainContent.value) {
        mainContent.value.fitToTainanBounds()
      }
    }

    const resetView = () => {
      if (mainContent.value) {
        mainContent.value.resetView()
      }
    }

    const switchToDashboard = () => {
      activeTab.value = 'dashboard'
    }

    const getCurrentTime = () => {
      return new Date().toLocaleString('zh-TW')
    }

    // Resize functionality
    let isResizing = false
    let resizeType = ''
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0

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
      event.preventDefault()
    }

    const handleResize = (event) => {
      if (!isResizing) return
      
      if (resizeType === 'left') {
        const deltaX = event.clientX - startX
        const newWidth = Math.max(150, Math.min(400, startWidth + deltaX))
        leftPanelWidth.value = newWidth
      } else if (resizeType === 'right') {
        const deltaX = event.clientX - startX
        const newWidth = Math.max(150, Math.min(400, startWidth - deltaX))
        rightPanelWidth.value = newWidth
      } else if (resizeType === 'horizontal') {
        const deltaY = event.clientY - startY
        const newHeight = Math.max(200, Math.min(600, startHeight - deltaY))
        bottomPanelHeight.value = newHeight
      }
    }

    const stopResize = () => {
      isResizing = false
      resizeType = ''
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }

    // Window resize handler
    const handleWindowResize = () => {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
    }

    onMounted(() => {
      // 監聽視窗大小變化
      window.addEventListener('resize', handleWindowResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowResize)
    })

    return {
      // Refs
      mainContent,
      
      // Tab states
      activeTab,
      activeBottomTab,
      activeRightTab,
      
      // Loading states
      isLoading,
      isLoadingData,
      loadingText,
      loadingProgress,
      showLoadingProgress,
      loadingSubText,
      
      // Layer states
      showLayer1,
      showLayer2,
      showTainanLayer,
      selectedFilter,
      selectedColorScheme,
      
      // Map states
      zoomLevel,
      currentCoords,
      
      // Statistics
      totalCount,
      totalDataPoints,
      selectedCount,
      activeMarkers,
      maxCount,
      averageCount,
      dataRegionsCount,
      
      // Panel sizes
      leftPanelWidth,
      rightPanelWidth,
      bottomPanelHeight,
      mainPanelWidth,
      contentHeight,
      
      // Tainan data
      tainanDataSummary,
      mergedTableData,
      tableSearchQuery,
      filteredTableData,
      sortedAndFilteredTableData,
      tainanGeoJSONData,
      
      // Table sorting
      sortField,
      sortDirection,
      
      // Analysis data
      analysisList,
      selectedAnalysisId,
      canStartAnalysis,
      
      // Analysis functions
      startAnalysis,
      selectAnalysis,
      viewAnalysis,
      deleteAnalysis,
      
      // Tainan data functions
      loadTainanData,
      clearTainanData,
      highlightOnMap,
      fitMapToData,
      resetView,
      switchToDashboard,
      
      // Table functions
      sortTable,
      
      // Resize functions
      startResize,
      
      // Utility functions
      formatNumber,
      getCurrentTime
    }
  }
}
</script>

<style>
@import './assets/css/common.css';
</style>
