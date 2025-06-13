import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import {
  loadIncomeGeoJson,
  loadElderlyWelfareInstitutionData,
  loadHealthcareFacilityPharmacyData,
  loadHospitalClinicData,
} from '../utils/dataProcessor.js';

import { generateLayerColors } from '../utils/utils.js';

// 主要數據存儲定義 (Main Data Store Definition)
export const useDataStore = defineStore(
  'data',
  () => {
    // 🎨 計算所有圖層總數並預生成顏色
    const allLayerConfigs = [
      // 長照機構
      {
        layerId: '老人福利機構',
        name: '老人福利機構',
        type: 'point',
        loader: loadElderlyWelfareInstitutionData,
        fileName: '臺北市老人福利機構名冊1140201_coord.csv',
      },
      // 醫療設施
      {
        layerId: '醫院',
        name: '醫院',
        type: 'point',
        loader: loadHospitalClinicData,
        fileName: '112年12月醫療院所分布圖_全國_醫院_coord.csv',
      },
      {
        layerId: '診所',
        name: '診所',
        type: 'point',
        loader: loadHospitalClinicData,
        fileName: '112年12月醫療院所分布圖_全國_診所_coord.csv',
      },
      {
        layerId: '健保特約藥局',
        name: '健保特約藥局',
        type: 'point',
        loader: loadHealthcareFacilityPharmacyData,
        fileName: '健保特約醫事機構-藥局_coord.csv',
      },
      // 基礎地理資料
      {
        layerId: '三段年齡組性別人口統計',
        name: '三段年齡組性別人口統計',
        type: 'polygon',
        loader: loadIncomeGeoJson,
        fileName: '113年12月行政區三段年齡組性別人口統計_村里_WGS84_臺北市.geojson',
      },
      {
        layerId: '五歲年齡組性別人口統計',
        name: '五歲年齡組性別人口統計',
        type: 'polygon',
        loader: loadIncomeGeoJson,
        fileName: '113年12月行政區五歲年齡組性別人口統計_村里_WGS84_臺北市.geojson',
      },
      {
        layerId: '十歲年齡組性別人口統計',
        name: '十歲年齡組性別人口統計',
        type: 'polygon',
        loader: loadIncomeGeoJson,
        fileName: '113年12月行政區十歲年齡組性別人口統計_村里_WGS84_臺北市.geojson',
      },
      {
        layerId: '綜稅綜合所得總額',
        name: '綜稅綜合所得總額',
        type: 'polygon',
        loader: loadIncomeGeoJson,
        fileName: '臺北市_村里_綜稅綜合所得總額.geojson',
      },
    ];

    // 🎨 預生成所有圖層的顏色，確保顏色分布均勻
    const layerColors = generateLayerColors(allLayerConfigs.length);

    const layers = ref([
      {
        groupName: '長照機構',
        groupLayers: [
          {
            layerId: '老人福利機構',
            name: '老人福利機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            color: layerColors[0], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadElderlyWelfareInstitutionData, // 資料載入函數
            fileName: '臺北市老人福利機構名冊1140201_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '醫療設施',
        groupLayers: [
          {
            layerId: '醫院',
            name: '醫院',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            color: layerColors[1], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadHospitalClinicData, // 資料載入函數
            fileName: '112年12月醫療院所分布圖_全國_醫院_coord.csv',
            fieldName: null,
          },
          {
            layerId: '診所',
            name: '診所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            color: layerColors[2], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadHospitalClinicData, // 資料載入函數
            fileName: '112年12月醫療院所分布圖_全國_診所_coord.csv',
            fieldName: null,
          },
          {
            layerId: '健保特約藥局',
            name: '健保特約藥局',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            color: layerColors[3], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadHealthcareFacilityPharmacyData, // 資料載入函數
            fileName: '健保特約醫事機構-藥局_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '基礎地理資料',
        groupLayers: [
          /*
          {
            layerId: '三段年齡組性別人口統計',
            name: '三段年齡組性別人口統計',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            color: layerColors[4], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadIncomeGeoJson, // 資料載入函數
            fileName: '113年12月行政區三段年齡組性別人口統計_村里_WGS84_臺北市.geojson',

          },
          {
            layerId: '五歲年齡組性別人口統計',
            name: '五歲年齡組性別人口統計',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            color: layerColors[5], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadIncomeGeoJson, // 資料載入函數
            fileName: '113年12月行政區五歲年齡組性別人口統計_村里_WGS84_臺北市.geojson',

          },
          {
            layerId: '十歲年齡組性別人口統計',
            name: '十歲年齡組性別人口統計',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            color: layerColors[6], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadIncomeGeoJson, // 資料載入函數
            fileName: '113年12月行政區十歲年齡組性別人口統計_村里_WGS84_臺北市.geojson',

          },
          */
          {
            layerId: '綜稅綜合所得總額-中位數',
            name: '綜稅綜合所得總額-中位數',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            color: layerColors[7], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadIncomeGeoJson, // 資料載入函數
            fileName: '臺北市_村里_綜稅綜合所得總額.geojson',
            fieldName: '中位數',
          },
          {
            layerId: '綜稅綜合所得總額-平均數',
            name: '綜稅綜合所得總額-平均數',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            color: layerColors[7], // 智能分配的顏色
            data: null, // 存放 GeoJSON 資料
            summaryData: null, // 存放資料摘要
            tableData: null, // 存放表格資料
            loader: loadIncomeGeoJson, // 資料載入函數
            fileName: '臺北市_村里_綜稅綜合所得總額.geojson',
            fieldName: '平均數',
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
          if (layer.layerId === layerId) {
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
          const result = await layer.loader(layer.layerId, layer.fileName, layer.fieldName);

          // 將載入的資料直接存儲在圖層物件中
          layer.data = result.geoJsonText;
          layer.tableData = result.tableData;
          layer.summaryData = result.summaryData;
          layer.isLoaded = true;

          // 🔄 強制觸發響應式更新
          console.log(
            `✅ 圖層 "${layer.name}" 載入完成 (${result.geoJsonText?.features?.length || 0} 筆資料)`
          );
          console.log(`📊 圖層摘要資料:`, layer.summaryData);
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
      loadedAndMergedGeoJSON: null, // 載入並合併的 GeoJSON
    });

    // ==================== 🎯 選中物件狀態 (Selected Feature State) ====================

    /**
     * 🎯 選中的地圖物件 (Selected Map Feature)
     * 存儲用戶在地圖上點擊選中的地理物件
     */
    const selectedFeature = ref(null);

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

    // Keep this for components that haven't been updated yet.
    // This is the crucial fix: make the legacy property reactive to the new system.

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

    const updateAnalysisParameters = (paramType, newParams) => {
      Object.assign(analysisParameters.value[paramType], newParams);
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
      analysisParameters,
      dataSummary,

      // Actions
      setRawData,
      setProcessedData,
      updateAnalysisParameters,
      clearData,
      setSelectedFeature,
      clearSelectedFeature,

      // Other functions
      getData,
      hasData,
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
