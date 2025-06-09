/**
 * 🗺️ mapStore.js - 地圖與面板佈局狀態管理模組
 * 
 * 🎯 功能說明：
 * 1. 📐 管理響應式面板佈局系統（左中右、上下分割）
 * 2. 🗺️ 處理地圖狀態和互動控制
 * 3. 📱 提供 Bootstrap RWD 響應式斷點管理
 * 4. 🔧 支援拖曳調整面板大小功能
 * 5. 🎨 管理圖層顯示和視覺化控制
 * 6. 📊 處理座標系統轉換和統計資料
 * 
 * 🏗️ 架構說明：
 * - 面板尺寸管理：leftPanelWidth, rightPanelWidth, bottomPanelHeight
 * - 地圖狀態控制：zoomLevel, currentCoords, mapLayers
 * - 響應式斷點：自動適應不同螢幕尺寸
 * - 圖層管理：geojsonLayer, pointLayer, heatmapLayer 等
 * 
 * 💡 設計理念：
 * - 使用 Pinia Composition API 模式
 * - 支援 Bootstrap 5 響應式設計
 * - 提供流暢的拖曳調整體驗
 * - 整合地圖和面板的協調控制
 */

// 🔧 Vue Composition API 引入
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 🗺️ 地圖與面板存儲定義 (Map and Panel Store Definition)
 * 統一管理地圖狀態和響應式面板佈局
 */
export const useMapStore = defineStore('map', () => {
  // ==================== 📐 面板尺寸狀態 (Panel Size States) ====================
  const leftPanelWidth = ref(300)
  const rightPanelWidth = ref(300)
  const bottomPanelHeight = ref(250)
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)

  // ==================== 地圖和控制項狀態 ====================
  const showLayer1 = ref(true)
  const showLayer2 = ref(false)
  const selectedFilter = ref('')
  const timeRange = ref(50)
  const zoomLevel = ref(10)
  const currentCoords = ref({ lat: 25.0330, lng: 121.5654 })
  const totalCount = ref(1250000)
  const selectedCount = ref(0)
  const chartType = ref('bar')

  // ==================== 地圖圖層狀態 ====================
  const mapLayers = ref({
    geojsonLayer: null,
    pointLayer: null,
    heatmapLayer: null,
    clusterLayer: null,
    bufferLayer: null
  })

  // ==================== 座標轉換狀態 ====================
  const coordinateSystem = ref('WGS84') // 'WGS84' 或 'TWD97'
  const transformedData = ref(null)

  // ==================== Bootstrap RWD 斷點 ====================
  const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  }

  // ==================== 計算屬性 ====================
  
  // 主要面板寬度（考慮Bootstrap col-12）
  const mainPanelWidth = computed(() => {
    const availableWidth = windowWidth.value - leftPanelWidth.value - rightPanelWidth.value
    return Math.max(200, availableWidth) // 確保最小寬度
  })

  // 地圖高度（確保能完整顯示）
  const mapHeight = computed(() => {
    const availableHeight = windowHeight.value - bottomPanelHeight.value - 60 // 60px for header
    return Math.max(300, availableHeight) // 確保最小高度
  })

  // 當前 Bootstrap 斷點
  const currentBreakpoint = computed(() => {
    const width = windowWidth.value
    if (width >= breakpoints.xxl) return 'xxl'
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    return 'xs'
  })

  // 是否為移動裝置
  const isMobile = computed(() => {
    return currentBreakpoint.value === 'xs' || currentBreakpoint.value === 'sm'
  })

  // 響應式面板設定
  const responsivePanelSizes = computed(() => {
    const bp = currentBreakpoint.value
    
    if (bp === 'xs' || bp === 'sm') {
      // 小螢幕：面板可收合，滿版顯示
      return {
        leftPanel: 0,
        rightPanel: 0,
        bottomPanel: 200,
        collapsible: true
      }
    } else if (bp === 'md') {
      // 中等螢幕：縮小面板
      return {
        leftPanel: 250,
        rightPanel: 250,
        bottomPanel: 200,
        collapsible: true
      }
    } else {
      // 大螢幕：正常面板大小
      return {
        leftPanel: 300,
        rightPanel: 300,
        bottomPanel: 250,
        collapsible: false
      }
    }
  })

  // ==================== 方法 ====================

  /**
   * 更新視窗尺寸並調整面板
   */
  const updateWindowSize = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    
    // 根據新的視窗大小調整面板
    adjustPanelsForBreakpoint()
  }

  /**
   * 根據斷點調整面板大小
   */
  const adjustPanelsForBreakpoint = () => {
    const responsive = responsivePanelSizes.value
    
    if (responsive.collapsible) {
      // 在小螢幕上收合面板
      leftPanelWidth.value = 0
      rightPanelWidth.value = 0
    } else {
      leftPanelWidth.value = responsive.leftPanel
      rightPanelWidth.value = responsive.rightPanel
    }
    
    bottomPanelHeight.value = responsive.bottomPanel
  }

  /**
   * 重置面板尺寸
   */
  const resetPanelSizes = () => {
    const responsive = responsivePanelSizes.value
    leftPanelWidth.value = responsive.leftPanel
    rightPanelWidth.value = responsive.rightPanel
    bottomPanelHeight.value = responsive.bottomPanel
  }

  /**
   * 更新左側面板寬度（確保不會超出邊界）
   */
  const updateLeftPanelWidth = (width) => {
    const maxWidth = windowWidth.value - rightPanelWidth.value - 300 // 保留右側面板和最小主畫面寬度
    leftPanelWidth.value = Math.max(0, Math.min(maxWidth, width))
  }

  /**
   * 更新右側面板寬度（確保不會超出邊界）
   */
  const updateRightPanelWidth = (width) => {
    const maxWidth = windowWidth.value - leftPanelWidth.value - 300 // 保留左側面板和最小主畫面寬度
    rightPanelWidth.value = Math.max(0, Math.min(maxWidth, width))
  }

  /**
   * 更新底部面板高度（確保不會超出邊界）
   */
  const updateBottomPanelHeight = (height) => {
    const maxHeight = windowHeight.value - 150 // 保留最小地圖高度
    bottomPanelHeight.value = Math.max(0, Math.min(maxHeight, height))
  }

  /**
   * 切換面板顯示/隱藏
   */
  const togglePanel = (panelType) => {
    switch (panelType) {
      case 'left':
        leftPanelWidth.value = leftPanelWidth.value > 0 ? 0 : responsivePanelSizes.value.leftPanel
        break
      case 'right':
        rightPanelWidth.value = rightPanelWidth.value > 0 ? 0 : responsivePanelSizes.value.rightPanel
        break
      case 'bottom':
        bottomPanelHeight.value = bottomPanelHeight.value > 0 ? 0 : responsivePanelSizes.value.bottomPanel
        break
    }
  }

  /**
   * 更新地圖相關狀態
   */
  const updateMapState = (newState) => {
    if (newState.zoomLevel !== undefined) zoomLevel.value = newState.zoomLevel
    if (newState.currentCoords !== undefined) currentCoords.value = newState.currentCoords
  }

  /**
   * 更新圖層狀態
   */
  const updateLayerState = (layer, visible) => {
    if (layer === 'layer1') showLayer1.value = visible
    if (layer === 'layer2') showLayer2.value = visible
  }

  /**
   * 設定地圖圖層
   */
  const setMapLayer = (layerType, layer) => {
    mapLayers.value[layerType] = layer
    console.log(`✅ 地圖圖層已設定: ${layerType}`)
  }

  /**
   * 移除地圖圖層
   */
  const removeMapLayer = (layerType) => {
    if (mapLayers.value[layerType]) {
      mapLayers.value[layerType] = null
      console.log(`✅ 地圖圖層已移除: ${layerType}`)
    }
  }

  /**
   * 更新統計數據
   */
  const updateStatistics = (newStats) => {
    if (newStats.totalCount !== undefined) totalCount.value = newStats.totalCount
    if (newStats.selectedCount !== undefined) selectedCount.value = newStats.selectedCount
  }

  /**
   * 更新圖表類型
   */
  const updateChartType = (type) => {
    chartType.value = type
  }


  /**
   * 處理 GeoJSON 載入（自動轉換座標）
   * @param {Object} geojson - GeoJSON 物件
   * @returns {Object} 處理後的 GeoJSON
   */
  const processGeoJSONLoad = (geojson) => {
    transformedData.value = geojson
    return geojson
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
    mapLayers,
    coordinateSystem,
    transformedData,
    
    // 計算屬性
    mainPanelWidth,
    mapHeight,
    currentBreakpoint,
    isMobile,
    responsivePanelSizes,
    
    // 方法
    updateWindowSize,
    adjustPanelsForBreakpoint,
    resetPanelSizes,
    updateLeftPanelWidth,
    updateRightPanelWidth,
    updateBottomPanelHeight,
    togglePanel,
    updateMapState,
    updateLayerState,
    setMapLayer,
    removeMapLayer,
    updateStatistics,
    updateChartType,
    processGeoJSONLoad
  }
}) 