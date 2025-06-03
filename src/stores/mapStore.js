import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMapStore = defineStore('map', () => {
  // 面板尺寸狀態
  const leftPanelWidth = ref(250)
  const rightPanelWidth = ref(250)
  const bottomPanelHeight = ref(200)
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)

  // 地圖和控制項狀態
  const showLayer1 = ref(true)
  const showLayer2 = ref(false)
  const selectedFilter = ref('')
  const timeRange = ref(50)
  const zoomLevel = ref(10)
  const currentCoords = ref({ lat: 25.0330, lng: 121.5654 })
  const totalCount = ref(1250000)
  const selectedCount = ref(0)
  const chartType = ref('bar')

  // 計算屬性
  const mainPanelWidth = computed(() => 
    windowWidth.value - leftPanelWidth.value - rightPanelWidth.value
  )
  const mapHeight = computed(() => 
    windowHeight.value - bottomPanelHeight.value
  )

  // 更新視窗尺寸
  const updateWindowSize = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  // 重置面板尺寸
  const resetPanelSizes = () => {
    leftPanelWidth.value = 250
    rightPanelWidth.value = 250
    bottomPanelHeight.value = 200
  }

  // 更新左側面板寬度
  const updateLeftPanelWidth = (width) => {
    const maxWidth = windowWidth.value - rightPanelWidth.value - 200 // 保留右側面板和最小主畫面寬度
    leftPanelWidth.value = Math.max(0, Math.min(maxWidth, width))
  }

  // 更新右側面板寬度
  const updateRightPanelWidth = (width) => {
    const maxWidth = windowWidth.value - leftPanelWidth.value - 200 // 保留左側面板和最小主畫面寬度
    rightPanelWidth.value = Math.max(0, Math.min(maxWidth, width))
  }

  // 更新底部面板高度
  const updateBottomPanelHeight = (height) => {
    const maxHeight = windowHeight.value - 100 // 保留最小地圖高度
    bottomPanelHeight.value = Math.max(0, Math.min(maxHeight, height))
  }

  // 更新地圖相關狀態
  const updateMapState = (newState) => {
    if (newState.zoomLevel !== undefined) zoomLevel.value = newState.zoomLevel
    if (newState.currentCoords !== undefined) currentCoords.value = newState.currentCoords
  }

  // 更新圖層狀態
  const updateLayerState = (layer, visible) => {
    if (layer === 'layer1') showLayer1.value = visible
    if (layer === 'layer2') showLayer2.value = visible
  }

  // 更新統計數據
  const updateStatistics = (newStats) => {
    if (newStats.totalCount !== undefined) totalCount.value = newStats.totalCount
    if (newStats.selectedCount !== undefined) selectedCount.value = newStats.selectedCount
  }

  // 更新圖表類型
  const updateChartType = (type) => {
    chartType.value = type
  }

  return {
    // 狀態
    leftPanelWidth,
    rightPanelWidth,
    bottomPanelHeight,
    windowWidth,
    windowHeight,
    showLayer1,
    showLayer2,
    selectedFilter,
    timeRange,
    zoomLevel,
    currentCoords,
    totalCount,
    selectedCount,
    chartType,
    
    // 計算屬性
    mainPanelWidth,
    mapHeight,
    
    // 方法
    updateWindowSize,
    resetPanelSizes,
    updateLeftPanelWidth,
    updateRightPanelWidth,
    updateBottomPanelHeight,
    updateMapState,
    updateLayerState,
    updateStatistics,
    updateChartType
  }
}) 