/**
 * 📊 dataStore.js - 核心數據狀態管理模組
 *
 * 🎯 功能說明：
 * 1. 🗂️ 統一管理應用程式中的所有數據狀態
 * 2. 🔄 提供數據載入、處理、轉換的核心功能
 * 3. 🗺️ 管理圖層系統和地理資訊數據
 * 4. 🎨 整合色彩方案和視覺化設定
 * 5. 📊 處理空間分析和統計計算
 * 6. 💾 支援數據持久化和匯入匯出功能
 *
 * 🏗️ 架構說明：
 * - 圖層管理系統：layers[] 陣列管理所有圖層狀態
 * - 原始數據存儲：rawData 管理未處理的原始數據
 * - 處理數據存儲：processedData 管理已處理的數據
 * - 視覺化設定：visualizationSettings 管理色彩和樣式
 * - 分析參數：analysisParameters 管理空間分析設定
 *
 * 💡 設計理念：
 * - 使用 Pinia Composition API 模式
 * - 支援數據持久化 (persist: true)
 * - 提供完整的 getter/setter 介面
 * - 整合 Python 風格色彩方案系統
 */

// 🔧 Vue 和 Pinia 核心模組引入
import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';

// 🎨 色票和視覺化工具引入
import { defaultColorConfig, ColorSchemeUtils } from '@/utils/pythonColorSchemes.js';

// 📊 資料處理工具引入
import { loadTainanData as loadTainanDataUtil, loadMedicalData } from '../utils/dataProcessor.js';

/**
 * 📊 主要數據存儲定義 (Main Data Store Definition)
 * 使用 Pinia Composition API 語法創建中央化狀態管理
 */
export const useDataStore = defineStore(
  'data',
  () => {
    // ==================== 🗺️ 圖層管理系統 (Centralized Layer Management System) ====================

    /**
     * 🗺️ 圖層配置陣列 (Layers Configuration Array)
     * 集中管理所有可用圖層的狀態、資料和載入器
     *
     * 新的分組結構：
     * - groupName: 圖層群組名稱
     * - groupLayers: 該群組內的圖層陣列
     *
     * 每個圖層包含：
     * - id: 唯一識別碼
     * - name: 顯示名稱
     * - visible: 是否可見
     * - isLoading: 是否正在載入
     * - isLoaded: 是否已載入完成
     * - data: 圖層資料（GeoJSON 等）
     * - summary: 資料摘要統計
     * - tableData: 表格資料
     * - loader: 資料載入函數
     */
    const layers = ref([
      {
        groupName: '基礎地理資料',
        groupLayers: [
          {
            id: 'tainan',
            name: '臺北市_村里_綜稅綜合所得總額',
            visible: false,
            isLoading: false,
            isLoaded: false,
            data: null, // 存放 GeoJSON 資料
            summary: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadTainanDataUtil, // 資料載入函數
          },
        ],
      },
      {
        groupName: '醫療設施',
        groupLayers: [
          {
            id: 'medical',
            name: '醫療院所分布',
            visible: false,
            isLoading: false,
            isLoaded: false,
            data: null, // 存放 GeoJSON 資料
            summary: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadMedicalData, // 資料載入函數
          },
        ],
      },
    ]);

    /**
     * 📊 最後開啟的圖層 ID (Last Opened Layer ID)
     * 追蹤最近開啟的圖層，用於決定主要顯示的資料
     */
    const lastOpenedLayerId = ref(null);

    /**
     * 🔍 根據 ID 尋找圖層 (Find Layer by ID)
     * 在新的分組結構中搜尋指定 ID 的圖層
     *
     * @param {string} layerId - 圖層 ID
     * @returns {object|null} 找到的圖層物件或 null
     */
    const findLayerById = (layerId) => {
      for (const group of layers.value) {
        for (const layer of group.groupLayers) {
          if (layer.id === layerId) {
            return layer;
          }
        }
      }
      return null;
    };

    /**
     * 📋 獲取所有圖層 (Get All Layers)
     * 從分組結構中提取所有圖層的扁平陣列
     *
     * @returns {Array} 所有圖層的陣列
     */
    const getAllLayers = () => {
      const allLayers = [];
      for (const group of layers.value) {
        allLayers.push(...group.groupLayers);
      }
      return allLayers;
    };

    /**
     * 🔄 切換圖層可見性 (Toggle Layer Visibility)
     * 控制圖層的顯示/隱藏，並在需要時自動載入資料
     *
     * @param {string} layerId - 圖層 ID
     */
    const toggleLayerVisibility = async (layerId) => {
      const layer = findLayerById(layerId);
      if (!layer) {
        console.error(`Layer with id "${layerId}" not found.`);
        return;
      }

      // 切換可見性狀態
      layer.visible = !layer.visible;

      // 如果開啟圖層，設定為最後開啟的圖層
      if (layer.visible) {
        lastOpenedLayerId.value = layerId;
        console.log(`🔄 設定最後開啟圖層: ${layerId}`);
      }

      // 如果圖層被開啟且尚未載入，則載入資料
      if (layer.visible && !layer.isLoaded && !layer.isLoading) {
        try {
          layer.isLoading = true;
          const result = await layer.loader();

          // 將載入的資料直接存儲在圖層物件中
          layer.data = result.mergedGeoJSON || result.rawGeoJSON;
          layer.tableData = result.tableData;
          layer.summary = result.summary;
          layer.isLoaded = true;

          // --- 🔄 與舊版結構的相容性處理 (Compatibility with Legacy Structure) ---
          // 為了避免破壞仍依賴舊資料結構的組件，在此更新舊結構
          // 這部分應該隨著時間逐步淘汰
          if (layer.id === 'tainan') {
            storeLoadedData(result);
          } else if (layer.id === 'medical') {
            storeMedicalData(result);
          }
          // --- 相容性處理結束 ---
        } catch (error) {
          console.error(`Failed to load data for layer "${layer.name}":`, error);
          layer.visible = false; // 載入失敗時恢復可見性狀態
        } finally {
          layer.isLoading = false;
        }
      }
    };

    // ==================== 📊 原始資料狀態 (Raw Data State - Legacy) ====================

    /**
     * 📊 原始資料存儲 (Raw Data Storage)
     * 保存未經處理的原始資料，包含各種格式的地理和表格資料
     *
     * 注意：這是舊版結構，新功能應使用圖層管理系統
     */
    const rawData = ref({
      geojson: null, // 原始 GeoJSON 資料
      csvData: [], // CSV 表格資料
      excelData: [], // Excel 表格資料
      spatialData: [], // 空間資料
      metadata: {
        // 資料元資訊
        tainan: { timestamp: null, source: null, description: null },
        medical: { timestamp: null, source: null, description: null },
      },
    });

    // ==================== 🔄 處理後資料狀態 (Processed Data State - Legacy) ====================

    /**
     * 🔄 處理後資料存儲 (Processed Data Storage)
     * 保存經過轉換、分析和處理的資料
     *
     * 注意：這是舊版結構，新功能應使用圖層管理系統
     */
    const processedData = ref({
      transformedGeojson: null, // 轉換後的 GeoJSON
      spatialAnalysisResults: {}, // 空間分析結果
      statisticsResults: {}, // 統計分析結果
      clusteringResults: {}, // 聚類分析結果
      heatmapData: [], // 熱力圖資料
      boundaryData: {}, // 邊界資料
      loadedAndMergedGeoJSON: null, // 載入並合併的 GeoJSON
      loadedAndMergedTableData: null, // 載入並合併的表格資料
      convertedGeoJSON: null, // 轉換後的 GeoJSON
      medicalData: null, // 醫療資料
    });

    // ==================== 🎯 選中物件狀態 (Selected Feature State) ====================

    /**
     * 🎯 選中的地圖物件 (Selected Map Feature)
     * 存儲用戶在地圖上點擊選中的地理物件
     */
    const selectedFeature = ref(null);

    // ==================== 🎨 視覺化設定 (Visualization Settings) ====================

    /**
     * 🎨 視覺化配置物件 (Visualization Configuration Object)
     * 管理所有視覺化相關的設定，包含色票、圖表、地圖樣式等
     */
    const visualizationSettings = reactive({
      // 🎨 色彩配置 (Color Configuration)
      colors: {
        levels: defaultColorConfig.levels,
        pythonSchemes: {
          default: defaultColorConfig.default,
          spatial: defaultColorConfig.spatial,
          heatmap: defaultColorConfig.heatmap,
          categorical: defaultColorConfig.categorical,
        },
        currentScheme: {
          name: 'viridis',
          library: 'matplotlib',
          colors: defaultColorConfig.default,
          type: 'sequential',
        },
        // Bootstrap 色彩等級
        100: '#dbeafe',
        200: '#93c5fd',
        400: '#3b82f6',
        800: '#1e40af',
      },

      // 📊 圖表配置 (Chart Configuration)
      charts: {
        defaultType: 'bar',
        animationEnabled: true,
        showLegend: true,
        colorScheme: {
          name: 'tab10',
          library: 'matplotlib',
          colors: ColorSchemeUtils.getColorScheme('tab10', 'matplotlib'),
        },
      },

      // 🗺️ 地圖配置 (Map Configuration)
      maps: {
        defaultStyle: 'openstreetmap',
        showControls: true,
        enableClustering: false,
        colorMapping: {
          scheme: 'spectral',
          library: 'matplotlib',
          colors: ColorSchemeUtils.getColorScheme('spectral', 'matplotlib'),
          interpolation: 'linear',
        },
      },

      // 🎭 主題配置 (Theme Configuration)
      themes: {
        current: 'default',
        available: {
          default: {
            name: '預設主題',
            description: '使用 Viridis 色票的科學視覺化主題',
            colors: ColorSchemeUtils.generateFourLevelColors(
              ColorSchemeUtils.getColorScheme('viridis', 'matplotlib')
            ),
          },
          scientific: {
            name: '科學期刊',
            description: '適合科學期刊發表的專業色票',
            colors: ColorSchemeUtils.generateFourLevelColors(
              ColorSchemeUtils.getColorScheme('plasma', 'matplotlib')
            ),
          },
          colorblind: {
            name: '色盲友好',
            description: '適合色盲使用者的友好色票',
            colors: ColorSchemeUtils.generateFourLevelColors(
              ColorSchemeUtils.getColorScheme('colorblind', 'seaborn')
            ),
          },
          presentation: {
            name: '簡報展示',
            description: '適合簡報和展示的高對比色票',
            colors: ColorSchemeUtils.generateFourLevelColors(
              ColorSchemeUtils.getColorScheme('bright', 'seaborn')
            ),
          },
        },
      },
    });

    // ==================== ⚙️ 分析參數 (Analysis Parameters) ====================

    /**
     * ⚙️ 分析參數配置 (Analysis Parameters Configuration)
     * 存儲各種空間分析和統計分析的參數設定
     */
    const analysisParameters = ref({
      // 🗺️ 空間分析參數 (Spatial Analysis Parameters)
      spatialAnalysis: {
        kValue: 5, // K 值（鄰近分析）
        weightType: 'inverse_distance', // 權重類型
        threshold: 0.5, // 閾值
        bufferRadius: 1000, // 緩衝區半徑（公尺）
      },

      // 🔍 聚類分析參數 (Clustering Parameters)
      clustering: {
        method: 'kmeans', // 聚類方法
        numClusters: 5, // 聚類數量
        eps: 0.5, // DBSCAN epsilon 參數
        minPts: 5, // DBSCAN 最小點數
      },

      // 🔥 熱力圖參數 (Heatmap Parameters)
      heatmap: {
        radius: 20, // 熱力圖半徑
        blur: 15, // 模糊程度
        maxZoom: 18, // 最大縮放等級
        gradient: {
          // 漸層色彩
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red',
        },
      },
    });

    // ==================== 🧮 計算屬性 (Computed Properties) ====================

    /**
     * 📊 資料摘要計算屬性 (Data Summary Computed Property)
     * 根據最後開啟的圖層提供資料摘要
     */
    const dataSummary = computed(() => {
      if (!lastOpenedLayerId.value) return null;
      const layer = findLayerById(lastOpenedLayerId.value);
      return layer?.summary || null;
    });

    // ==================== 🛠️ 資料操作方法 (Data Manipulation Methods) ====================

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
    // processedData.value.loadedAndMergedTableData = activeTableData.value;

    const setSelectedFeature = (feature) => {
      selectedFeature.value = feature;
    };

    const clearData = (key) => {
      // This function might need rethinking in the context of the new layer structure
      console.warn(
        `clearData for key "${key}" may not be fully supported with the new layer structure.`
      );
      if (key in processedData.value) {
        processedData.value[key] = null;
      }
      if (key in rawData.value) {
        rawData.value[key] = null;
      }
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
        analysisParameters: analysisParameters.value,
      };
      return JSON.stringify(exportData, null, 2);
    };

    const importDataFromJSON = (jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        if (data.layers) layers.value = data.layers;
        if (data.visualizationSettings)
          Object.assign(visualizationSettings, data.visualizationSettings);
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
        type: type,
      };
      return colors;
    };

    const getRecommendedColorSchemes = (dataType) => {
      const recommendations = {
        spatial: ['viridis', 'plasma', 'magma'],
        categorical: ['tab10', 'Set3', 'Paired'],
        sequential: ['viridis', 'plasma', 'inferno'],
        diverging: ['RdBu', 'Spectral', 'coolwarm'],
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
        seaborn: ColorSchemeUtils.getAvailableSchemes('seaborn'),
      };
    };

    const mapValueToColor = (value, min, max, scheme = null, library = null) => {
      const currentScheme = scheme
        ? ColorSchemeUtils.getColorScheme(scheme, library)
        : visualizationSettings.colors.currentScheme.colors;

      const normalizedValue = (value - min) / (max - min);
      const colorIndex = Math.floor(normalizedValue * (currentScheme.length - 1));
      return currentScheme[colorIndex];
    };

    /**
     * 📊 活躍資料表格計算屬性 (Active Table Data Computed Property)
     * 根據最後開啟的圖層提供表格資料
     * 用於資料表格分頁的資料來源
     */
    const activeTableData = computed(() => {
      if (lastOpenedLayerId.value) {
        const lastLayer = findLayerById(lastOpenedLayerId.value);
        if (lastLayer && lastLayer.visible && lastLayer.tableData) {
          return lastLayer.tableData;
        }
      }
      return [];
    });

    const fetchLatestData = async () => {
      /* ... */
    };
    const clearSelectedFeature = () => {
      selectedFeature.value = null;
    };

    // ==================== EXPORTS ====================
    return {
      // Centralized Layer Management
      layers,
      toggleLayerVisibility,
      lastOpenedLayerId,
      activeTableData, // ✅ 活躍表格資料計算屬性

      // Legacy State & Actions (for compatibility)
      rawData,
      processedData,
      selectedFeature,
      visualizationSettings,
      analysisParameters,
      dataSummary,
      // isDataLoaded,
      // isMedicalDataLoaded,
      storeLoadedData,
      storeMedicalData,

      // Actions
      setRawData,
      setProcessedData,
      updateVisualizationSettings,
      updateAnalysisParameters,
      clearData,
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
      fetchLatestData,

      // 📊 Computed properties for visibility (使用 computed 確保其他組件可以使用)
      visibleLayers: computed(() => getAllLayers().filter((layer) => layer.visible)),
      loadingLayers: computed(() => getAllLayers().filter((layer) => layer.isLoading)),

      // 🛠️ 新增的輔助函數 (New Helper Functions)
      findLayerById, // 根據 ID 尋找圖層
      getAllLayers, // 獲取所有圖層的扁平陣列
    };
  },
  {
    persist: true,
  }
);
