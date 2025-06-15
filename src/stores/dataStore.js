import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import {
  loadIncomeGeoJson,
  loadElderlyWelfareInstitutionData,
  loadHealthcareFacilityPharmacyData,
  loadHospitalClinicData,
} from '../utils/dataProcessor.js';

// 主要數據存儲定義 (Main Data Store Definition)
export const useDataStore = defineStore(
  'data',
  () => {
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
            colorName: 'orange',
            data: null,
            summaryData: null,
            tableData: null,
            loader: loadElderlyWelfareInstitutionData,
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
            colorName: 'green',
            data: null,
            summaryData: null,
            tableData: null,
            loader: loadHospitalClinicData,
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
            colorName: 'green',
            data: null,
            summaryData: null,
            tableData: null,
            loader: loadHospitalClinicData,
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
            colorName: 'green',
            data: null,
            summaryData: null,
            tableData: null,
            loader: loadHealthcareFacilityPharmacyData,
            fileName: '健保特約醫事機構-藥局_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '基礎地理資料',
        groupLayers: [
          {
            layerId: '綜稅綜合所得總額-中位數',
            name: '綜稅綜合所得總額-中位數',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            colorName: 'green',
            data: null,
            summaryData: null,
            tableData: null,
            loader: loadIncomeGeoJson,
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
            colorName: 'green',
            data: null,
            summaryData: null,
            tableData: null,
            loader: loadIncomeGeoJson,
            fileName: '臺北市_村里_綜稅綜合所得總額.geojson',
            fieldName: '平均數',
          },
        ],
      },
    ]);

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

    // ==================== 🎯 選中物件狀態 (Selected Feature State) ====================

    /**
     * 🎯 選中的地圖物件 (Selected Map Feature)
     * 存儲用戶在地圖上點擊選中的地理物件
     */
    const selectedFeature = ref(null);

    // ==================== 🛠️ 資料操作方法 (Data Manipulation Methods) ====================

    // Keep this for components that haven't been updated yet.
    // This is the crucial fix: make the legacy property reactive to the new system.

    const setSelectedFeature = (feature) => {
      selectedFeature.value = feature;
    };

    const clearSelectedFeature = () => {
      selectedFeature.value = null;
    };

    // ==================== EXPORTS ====================
    return {
      // Centralized Layer Management
      layers,
      toggleLayerVisibility,

      // Legacy State & Actions (for compatibility)
      selectedFeature,

      // Actions
      setSelectedFeature,
      clearSelectedFeature,

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
