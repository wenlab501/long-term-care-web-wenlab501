import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { defaultColorConfig, ColorSchemeUtils } from '@/utils/pythonColorSchemes.js'
import { loadTainanData as loadTainanDataUtil, loadMedicalData } from '../utils/dataProcessor.js'

export const useDataStore = defineStore('data', () => {
  // ==================== 圖層管理 (Centralized Layer Management) ====================
  const layers = ref([
    {
      id: 'tainan',
      name: '臺北市_村里_綜稅綜合所得總額',
      visible: false,
      isLoading: false,
      isLoaded: false,
      data: null, // Will hold the GeoJSON data for this layer
      summary: null,
      tableData: null,
      loader: loadTainanDataUtil,
    },
    {
      id: 'medical',
      name: '醫療院所分布',
      visible: false,
      isLoading: false,
      isLoaded: false,
      data: null, // Will hold the GeoJSON data for this layer
      summary: null,
      tableData: null,
      loader: loadMedicalData,
    }
  ]);

  const toggleLayerVisibility = async (layerId) => {
    const layer = layers.value.find(l => l.id === layerId);
    if (!layer) {
      console.error(`Layer with id "${layerId}" not found.`);
      return;
    }

    // Toggle visibility
    layer.visible = !layer.visible;

    // 如果開啟圖層，設定為最後開啟的圖層
    if (layer.visible) {
      lastOpenedLayerId.value = layerId;
      console.log(`🔄 設定最後開啟圖層: ${layerId}`);
    }

    // Load data if it's being turned on and hasn't been loaded yet
    if (layer.visible && !layer.isLoaded && !layer.isLoading) {
      try {
        layer.isLoading = true;
        const result = await layer.loader();
        
        // Store data directly on the layer object
        layer.data = result.mergedGeoJSON || result.rawGeoJSON;
        layer.tableData = result.tableData;
        layer.summary = result.summary;
        layer.isLoaded = true;

        // --- Compatibility with old structure ---
        // To avoid breaking components that still rely on the old data structure,
        // we will update them here. This should be phased out over time.
        if (layer.id === 'tainan') {
          storeLoadedData(result);
        } else if (layer.id === 'medical') {
          storeMedicalData(result);
        }
        // --- End Compatibility ---

      } catch (error) {
        console.error(`Failed to load data for layer "${layer.name}":`, error);
        layer.visible = false; // Revert visibility on failure
      } finally {
        layer.isLoading = false;
      }
    }
  };

  // ==================== 原始資料狀態 (Legacy) ====================
  const rawData = ref({
    geojson: null,
    csvData: [],
    excelData: [],
    spatialData: [],
    metadata: {
      tainan: { timestamp: null, source: null, description: null },
      medical: { timestamp: null, source: null, description: null }
    }
  });

  // ==================== 處理後資料狀態 (Legacy) ====================
  const processedData = ref({
    transformedGeojson: null,
    spatialAnalysisResults: {},
    statisticsResults: {},
    clusteringResults: {},
    heatmapData: [],
    boundaryData: {},
    loadedAndMergedGeoJSON: null,
    loadedAndMergedTableData: null,
    convertedGeoJSON: null,
    medicalData: null
  });

  // ==================== 選中物件狀態 ====================
  const selectedFeature = ref(null);

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
  });

  // ==================== 分析參數 ====================
  const analysisParameters = ref({
    spatialAnalysis: {
      kValue: 5,
      weightType: 'inverse_distance',
      threshold: 0.5,
      bufferRadius: 1000
    },
    clustering: {
      method: 'kmeans',
      numClusters: 5,
      eps: 0.5,
      minPts: 5
    },
    heatmap: {
      radius: 500,
      gridSize: 50,
      intensity: 1.0
    }
  });

  // ==================== 計算屬性 & GETTERS ====================
  const dataSummary = computed(() => {
    // This could be enhanced to summarize from the new `layers` array
    const summary = {
      totalFeatures: 0,
      totalPoints: 0,
      dataTypes: [],
      coordinateSystem: 'unknown',
      boundingBox: null
    };

    if (processedData.value.loadedAndMergedGeoJSON) {
      summary.totalFeatures = processedData.value.loadedAndMergedGeoJSON.features?.length || 0;
      summary.dataTypes.push('GeoJSON');
    }
    return summary;
  });
  
  // 儲存最後開啟的圖層 ID
  const lastOpenedLayerId = ref(null);

  const activeTableData = computed(() => {
    // 只顯示最後開啟的圖層資料
    if (lastOpenedLayerId.value) {
      const lastLayer = layers.value.find(l => l.id === lastOpenedLayerId.value);
      if (lastLayer && lastLayer.visible && lastLayer.tableData) {
        return lastLayer.tableData;
      }
    }
    return [];
  });

  // Legacy loading flags
  const isDataLoaded = computed(() => layers.value.find(l => l.id === 'tainan')?.isLoaded || false);
  const isMedicalDataLoaded = computed(() => layers.value.find(l => l.id === 'medical')?.isLoaded || false);

  // ==================== ACTIONS & MUTATIONS ====================
  
  // Legacy function for compatibility
  const storeLoadedData = (data) => {
    if (data) {
      processedData.value.loadedAndMergedGeoJSON = data.loadedAndMergedGeoJSON;
      console.log('✅ (Legacy) Tainan data stored in Pinia.');
    }
  };
  
  // Legacy function for compatibility
  const storeMedicalData = (data) => {
     if (data) {
      processedData.value.medicalData = { ...data };
      console.log('✅ (Legacy) Medical data stored in Pinia.');
    }
  };

  // Keep this for components that haven't been updated yet.
  // This is the crucial fix: make the legacy property reactive to the new system.
  processedData.value.loadedAndMergedTableData = activeTableData;

  const setSelectedFeature = (feature) => {
    selectedFeature.value = feature;
  };
  
  const clearData = (key) => {
    // This function might need rethinking in the context of the new layer structure
    console.warn(`clearData for key "${key}" may not be fully supported with the new layer structure.`);
    if (key in processedData.value) {
      processedData.value[key] = null;
    }
    if (key in rawData.value) {
      rawData.value[key] = null;
    }
  };
  
  const clearAllData = () => {
    layers.value.forEach(layer => {
        layer.visible = false;
        layer.isLoading = false;
        layer.isLoaded = false;
        layer.data = null;
        layer.summary = null;
        layer.tableData = null;
    });
    // Clear legacy structures as well
    Object.keys(processedData.value).forEach(key => processedData.value[key] = null);
    Object.keys(rawData.value).forEach(key => {
        if (Array.isArray(rawData.value[key])) rawData.value[key] = [];
        else if (typeof rawData.value[key] === 'object' && rawData.value[key] !== null) {
            if (key === 'metadata') {
                // don't clear metadata structure
            } else {
                 rawData.value[key] = null;
            }
        }
        else rawData.value[key] = null;
    });
    selectedFeature.value = null;
    console.log('All layer data and legacy stores have been cleared.');
  };

  // Other functions (unchanged for now)
  const setRawData = (dataType, data, metadata = {}) => {
    if (dataType in rawData.value) {
      rawData.value[dataType] = data;
      console.log(`Raw data for ${dataType} updated.`);
    }
    if (metadata.source) {
      // Basic metadata update
    }
  };

  const setProcessedData = (dataType, data) => {
    if (dataType in processedData.value) {
      processedData.value[dataType] = data;
      console.log(`Processed data for ${dataType} updated.`);
    }
  };

  const updateVisualizationSettings = (settingType, newSettings) => {
    Object.assign(visualizationSettings[settingType], newSettings);
  };
  
  const updateAnalysisParameters = (paramType, newParams) => {
    Object.assign(analysisParameters.value[paramType], newParams);
  };

  const exportDataAsJSON = () => {
    const exportData = {
      layers: layers.value,
      visualizationSettings: visualizationSettings,
      analysisParameters: analysisParameters.value
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importDataFromJSON = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.layers) layers.value = data.layers;
      if (data.visualizationSettings) Object.assign(visualizationSettings, data.visualizationSettings);
      if (data.analysisParameters) analysisParameters.value = data.analysisParameters;
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  const getData = (dataType, processed = false) => {
    if (processed) {
      return processedData.value[dataType];
    }
    return rawData.value[dataType];
  };

  const hasData = (dataType, processed = false) => {
    if (processed) {
      return !!processedData.value[dataType];
    }
    return !!rawData.value[dataType];
  };

  const updateColorScheme = (scheme, library = 'matplotlib', type = 'sequential') => {
    const colors = ColorSchemeUtils.getColorScheme(scheme, library);
    visualizationSettings.colors.currentScheme = {
      name: scheme,
      library: library,
      colors: colors,
      type: type
    };
    return colors;
  };

  const getRecommendedColorSchemes = (dataType) => {
    const recommendations = {
      spatial: ['viridis', 'plasma', 'magma'],
      categorical: ['tab10', 'Set3', 'Paired'],
      sequential: ['viridis', 'plasma', 'inferno'],
      diverging: ['RdBu', 'Spectral', 'coolwarm']
    };
    return recommendations[dataType] || recommendations.sequential;
  };

  const applyTheme = (themeName) => {
    const theme = visualizationSettings.themes.available[themeName];
    if (theme) {
      visualizationSettings.themes.current = themeName;
      visualizationSettings.colors.levels = theme.colors;
      return true;
    }
    return false;
  };

  const triggerVisualizationUpdate = () => {
    // This function can be used to trigger a re-render of visualizations
    // For now, we'll just emit a console log
    console.log('Visualization update triggered');
  };

  const getAllAvailableColorSchemes = () => {
    return {
      matplotlib: ColorSchemeUtils.getAvailableSchemes('matplotlib'),
      seaborn: ColorSchemeUtils.getAvailableSchemes('seaborn')
    };
  };

  const mapValueToColor = (value, min, max, scheme = null, library = null) => {
    const currentScheme = scheme ? 
      ColorSchemeUtils.getColorScheme(scheme, library) : 
      visualizationSettings.colors.currentScheme.colors;
    
    const normalizedValue = (value - min) / (max - min);
    const colorIndex = Math.floor(normalizedValue * (currentScheme.length - 1));
    return currentScheme[colorIndex];
  };

  const fetchLatestData = async () => { /* ... */ };
  const clearSelectedFeature = () => { selectedFeature.value = null; };

  // ==================== EXPORTS ====================
  return {
    // Centralized Layer Management
    layers,
    toggleLayerVisibility,
    lastOpenedLayerId,
    activeTableData,

    // Legacy State & Actions (for compatibility)
    rawData,
    processedData,
    selectedFeature,
    visualizationSettings,
    analysisParameters,
    dataSummary,
    isDataLoaded,
    isMedicalDataLoaded,
    storeLoadedData,
    storeMedicalData,

    // Actions
    setRawData,
    setProcessedData,
    updateVisualizationSettings,
    updateAnalysisParameters,
    clearData,
    clearAllData,
    setSelectedFeature,
    clearSelectedFeature,

    // Other functions
    exportDataAsJSON,
    importDataFromJSON,
    getData,
    hasData,
    updateColorScheme,
    getRecommendedColorSchemes,
    applyTheme,
    triggerVisualizationUpdate,
    getAllAvailableColorSchemes,
    mapValueToColor,
    fetchLatestData
  }
},
{
  persist: true
}) 