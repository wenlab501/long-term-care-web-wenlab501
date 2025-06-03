import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { defaultColorConfig, ColorSchemeUtils } from '@/utils/pythonColorSchemes.js'

export const useDataStore = defineStore('data', () => {
  // ==================== 原始資料狀態 ====================
  const rawData = ref({
    geojson: null,        // 原始GeoJSON資料
    csvData: [],          // CSV資料
    excelData: [],        // Excel資料
    spatialData: [],      // 空間分析資料
    metadata: {}          // 資料元資訊
  })

  // ==================== 處理後資料狀態 ====================
  const processedData = ref({
    transformedGeojson: null,    // 座標轉換後的GeoJSON
    spatialAnalysisResults: {},  // 空間分析結果
    statisticsResults: {},       // 統計分析結果
    clusteringResults: {},       // 聚類分析結果
    heatmapData: [],            // 熱力圖資料
    boundaryData: {}            // 邊界資料
  })

  // ==================== 視覺化設定 ====================
  const visualizationSettings = reactive({
    colors: {
      levels: defaultColorConfig.levels,
      pythonSchemes: {
        default: defaultColorConfig.default,
        spatial: defaultColorConfig.spatial,
        heatmap: defaultColorConfig.heatmap,
        categorical: defaultColorConfig.categorical
      },
      currentScheme: {
        name: 'viridis',
        library: 'matplotlib',
        colors: defaultColorConfig.default,
        type: 'sequential'
      },
      100: '#dbeafe',
      200: '#93c5fd',
      400: '#3b82f6',
      800: '#1e40af'
    },
    charts: {
      defaultType: 'bar',
      animationEnabled: true,
      showLegend: true,
      colorScheme: {
        name: 'tab10',
        library: 'matplotlib',
        colors: ColorSchemeUtils.getColorScheme('tab10', 'matplotlib')
      }
    },
    maps: {
      defaultStyle: 'openstreetmap',
      showControls: true,
      enableClustering: false,
      colorMapping: {
        scheme: 'spectral',
        library: 'matplotlib',
        colors: ColorSchemeUtils.getColorScheme('spectral', 'matplotlib'),
        interpolation: 'linear'
      }
    },
    themes: {
      current: 'default',
      available: {
        default: {
          name: '預設主題',
          description: '使用 Viridis 色票的科學視覺化主題',
          colors: ColorSchemeUtils.generateFourLevelColors(
            ColorSchemeUtils.getColorScheme('viridis', 'matplotlib')
          )
        },
        scientific: {
          name: '科學期刊',
          description: '適合科學期刊發表的專業色票',
          colors: ColorSchemeUtils.generateFourLevelColors(
            ColorSchemeUtils.getColorScheme('plasma', 'matplotlib')
          )
        },
        colorblind: {
          name: '色盲友好',
          description: '適合色盲使用者的友好色票',
          colors: ColorSchemeUtils.generateFourLevelColors(
            ColorSchemeUtils.getColorScheme('colorblind', 'seaborn')
          )
        },
        presentation: {
          name: '簡報展示',
          description: '適合簡報和展示的高對比色票',
          colors: ColorSchemeUtils.generateFourLevelColors(
            ColorSchemeUtils.getColorScheme('bright', 'seaborn')
          )
        }
      }
    }
  })

  // ==================== 分析參數 ====================
  const analysisParameters = ref({
    spatialAnalysis: {
      kValue: 5,           // K最近鄰的K值
      weightType: 'inverse_distance', // 權重類型
      threshold: 0.5,      // 聚集檢測閾值
      bufferRadius: 1000   // 緩衝區半徑（公尺）
    },
    clustering: {
      method: 'kmeans',    // 聚類方法
      numClusters: 5,      // 聚類數量
      eps: 0.5,           // DBSCAN參數
      minPts: 5           // DBSCAN最小點數
    },
    heatmap: {
      radius: 500,        // 影響半徑（公尺）
      gridSize: 50,       // 網格大小
      intensity: 1.0      // 強度
    }
  })

  // ==================== 計算屬性 ====================
  
  // 資料統計摘要
  const dataSummary = computed(() => {
    const summary = {
      totalFeatures: 0,
      totalPoints: 0,
      dataTypes: [],
      coordinateSystem: 'unknown',
      boundingBox: null
    }

    if (rawData.value.geojson) {
      summary.totalFeatures = rawData.value.geojson.features?.length || 0
      summary.dataTypes.push('GeoJSON')
      
      // 檢測座標系統
      if (rawData.value.geojson.features?.length > 0) {
        const firstCoord = rawData.value.geojson.features[0].geometry?.coordinates
        if (firstCoord && Array.isArray(firstCoord)) {
          const coord = Array.isArray(firstCoord[0]) ? firstCoord[0][0] : firstCoord[0]
          summary.coordinateSystem = coord > 180 ? 'TWD97' : 'WGS84'
        }
      }
    }

    if (rawData.value.csvData.length > 0) {
      summary.totalPoints += rawData.value.csvData.length
      summary.dataTypes.push('CSV')
    }

    if (rawData.value.excelData.length > 0) {
      summary.totalPoints += rawData.value.excelData.length
      summary.dataTypes.push('Excel')
    }

    return summary
  })

  // 可用的分析方法
  const availableAnalysisMethods = computed(() => {
    const methods = []
    
    if (rawData.value.geojson || rawData.value.spatialData.length > 0) {
      methods.push(
        'spatial_autocorrelation',
        'cluster_detection', 
        'nearest_neighbor',
        'spatial_lag',
        'hotspot_analysis'
      )
    }

    if (rawData.value.csvData.length > 0 || rawData.value.excelData.length > 0) {
      methods.push(
        'descriptive_statistics',
        'correlation_analysis',
        'clustering'
      )
    }

    return methods
  })

  // ==================== 資料操作方法 ====================

  /**
   * 設定原始資料
   */
  const setRawData = (dataType, data, metadata = {}) => {
    rawData.value[dataType] = data
    rawData.value.metadata[dataType] = {
      ...metadata,
      timestamp: new Date().toISOString(),
      size: JSON.stringify(data).length
    }
    
    console.log(`✅ 資料已存入 Store: ${dataType}`, {
      dataSize: data?.length || Object.keys(data || {}).length,
      metadata: rawData.value.metadata[dataType]
    })
  }

  /**
   * 設定處理後資料
   */
  const setProcessedData = (dataType, data, analysisInfo = {}) => {
    processedData.value[dataType] = data
    processedData.value[`${dataType}_info`] = {
      ...analysisInfo,
      timestamp: new Date().toISOString(),
      parameters: { ...analysisParameters.value }
    }

    console.log(`✅ 處理後資料已存入 Store: ${dataType}`, {
      resultSize: data?.length || Object.keys(data || {}).length,
      analysisInfo
    })
  }

  /**
   * 更新視覺化設定
   */
  const updateVisualizationSettings = (settingType, newSettings) => {
    if (visualizationSettings[settingType]) {
      Object.assign(visualizationSettings[settingType], newSettings)
    }
  }

  /**
   * 更新分析參數
   */
  const updateAnalysisParameters = (paramType, newParams) => {
    if (analysisParameters.value[paramType]) {
      analysisParameters.value[paramType] = {
        ...analysisParameters.value[paramType],
        ...newParams
      }
    }
  }

  /**
   * 清除特定類型資料
   */
  const clearData = (dataType) => {
    if (rawData.value[dataType] !== undefined) {
      rawData.value[dataType] = dataType === 'metadata' ? {} : 
                                (Array.isArray(rawData.value[dataType]) ? [] : null)
    }
    
    if (processedData.value[dataType] !== undefined) {
      processedData.value[dataType] = Array.isArray(processedData.value[dataType]) ? [] : {}
    }
  }

  /**
   * 清除所有資料
   */
  const clearAllData = () => {
    Object.keys(rawData.value).forEach(key => {
      rawData.value[key] = key === 'metadata' ? {} : 
                           (Array.isArray(rawData.value[key]) ? [] : null)
    })
    
    Object.keys(processedData.value).forEach(key => {
      processedData.value[key] = Array.isArray(processedData.value[key]) ? [] : {}
    })
  }

  /**
   * 匯出資料為JSON
   */
  const exportDataAsJSON = () => {
    return {
      rawData: rawData.value,
      processedData: processedData.value,
      visualizationSettings: visualizationSettings,
      analysisParameters: analysisParameters.value,
      exportTimestamp: new Date().toISOString()
    }
  }

  /**
   * 從JSON匯入資料
   */
  const importDataFromJSON = (jsonData) => {
    try {
      if (jsonData.rawData) rawData.value = jsonData.rawData
      if (jsonData.processedData) processedData.value = jsonData.processedData
      if (jsonData.visualizationSettings) Object.assign(visualizationSettings, jsonData.visualizationSettings)
      if (jsonData.analysisParameters) analysisParameters.value = jsonData.analysisParameters
      
      console.log('✅ 資料已從JSON匯入')
      return true
    } catch (error) {
      console.error('❌ JSON匯入失敗:', error)
      return false
    }
  }

  /**
   * 取得特定資料
   */
  const getData = (dataType, processed = false) => {
    const source = processed ? processedData.value : rawData.value
    return source[dataType]
  }

  /**
   * 檢查資料是否存在
   */
  const hasData = (dataType, processed = false) => {
    const data = getData(dataType, processed)
    return data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
  }

  /**
   * 🔥 新增：更新色票設定
   * @param {string} scheme - 色票名稱
   * @param {string} library - 色票庫
   * @param {string} type - 色票類型
   */
  const updateColorScheme = (scheme, library = 'matplotlib', type = 'sequential') => {
    try {
      const colors = ColorSchemeUtils.getColorScheme(scheme, library)
      
      visualizationSettings.colors.currentScheme = {
        name: scheme,
        library: library,
        colors: colors,
        type: type
      }
      
      // 🔥 同時更新四級色彩系統
      const fourLevelColors = ColorSchemeUtils.generateFourLevelColors(colors)
      Object.assign(visualizationSettings.colors.levels, fourLevelColors)
      
      console.log(`🎨 色票更新成功: ${library}.${scheme} (${type})`)
      
      // 觸發視覺化更新
      triggerVisualizationUpdate()
      
    } catch (error) {
      console.error('❌ 色票更新失敗:', error)
    }
  }
  
  /**
   * 🔥 新增：根據資料類型取得推薦色票
   * @param {string} dataType - 資料類型
   * @returns {Array} 推薦色票列表
   */
  const getRecommendedColorSchemes = (dataType) => {
    return ColorSchemeUtils.getRecommendedSchemes(dataType)
  }
  
  /**
   * 🔥 新增：應用主題配置
   * @param {string} themeName - 主題名稱
   */
  const applyTheme = (themeName) => {
    const theme = visualizationSettings.themes.available[themeName]
    if (!theme) {
      console.warn(`⚠️ 主題 ${themeName} 不存在`)
      return
    }
    
    visualizationSettings.themes.current = themeName
    Object.assign(visualizationSettings.colors.levels, theme.colors)
    
    console.log(`🎨 主題應用成功: ${theme.name}`)
    triggerVisualizationUpdate()
  }
  
  /**
   * 🔥 新增：觸發視覺化更新（通知其他組件）
   */
  const triggerVisualizationUpdate = () => {
    // 可以在這裡加入事件發送邏輯
    console.log('🔄 視覺化設定已更新，觸發重繪')
  }
  
  /**
   * 🔥 新增：取得所有可用色票
   * @returns {Object} 所有色票的分類列表
   */
  const getAllAvailableColorSchemes = () => {
    return ColorSchemeUtils.getAllColorSchemes()
  }
  
  /**
   * 🔥 新增：數值映射到色彩
   * @param {number} value - 數值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @param {string} scheme - 色票名稱（可選）
   * @param {string} library - 色票庫（可選）
   * @returns {string} 映射的色彩
   */
  const mapValueToColor = (value, min, max, scheme = null, library = null) => {
    const currentScheme = scheme ? 
      ColorSchemeUtils.getColorScheme(scheme, library || 'matplotlib') :
      visualizationSettings.colors.currentScheme.colors
      
    return ColorSchemeUtils.mapValueToColor(value, min, max, currentScheme)
  }

  return {
    // 狀態
    rawData,
    processedData,
    visualizationSettings,
    analysisParameters,
    
    // 計算屬性
    dataSummary,
    availableAnalysisMethods,
    
    // 方法
    setRawData,
    setProcessedData,
    updateVisualizationSettings,
    updateAnalysisParameters,
    clearData,
    clearAllData,
    exportDataAsJSON,
    importDataFromJSON,
    getData,
    hasData,
    
    // 🔥 新增：Python 色票相關 API
    updateColorScheme,
    getRecommendedColorSchemes,
    applyTheme,
    getAllAvailableColorSchemes,
    mapValueToColor,
    
    // 🔥 新增：色票工具類別（給組件直接使用）
    ColorSchemeUtils: ColorSchemeUtils
  }
}) 