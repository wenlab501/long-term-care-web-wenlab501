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
            layerName: '老人福利機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
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
            layerName: '醫院',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            colorName: 'lime',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadHospitalClinicData,
            fileName: '112年12月醫療院所分布圖_全國_醫院_coord.csv',
            fieldName: null,
          },
          {
            layerId: '診所',
            layerName: '診所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            colorName: 'green',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadHospitalClinicData,
            fileName: '112年12月醫療院所分布圖_全國_診所_coord.csv',
            fieldName: null,
          },
          {
            layerId: '健保特約藥局',
            layerName: '健保特約藥局',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            colorName: 'cyan',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
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
            layerName: '綜稅綜合所得總額-中位數',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            colorName: 'deeppurple',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadIncomeGeoJson,
            fileName: '臺北市_村里_綜稅綜合所得總額.geojson',
            fieldName: '中位數',
          },
          {
            layerId: '綜稅綜合所得總額-平均數',
            layerName: '綜稅綜合所得總額-平均數',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            colorName: 'purple',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadIncomeGeoJson,
            fileName: '臺北市_村里_綜稅綜合所得總額.geojson',
            fieldName: '平均數',
          },
        ],
      },
    ]);

    // 在新的分組結構中搜尋指定 ID 的圖層
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

    // 從分組結構中提取所有圖層的扁平陣列
    const getAllLayers = () => {
      const allLayers = [];
      for (const group of layers.value) {
        allLayers.push(...group.groupLayers);
      }
      return allLayers;
    };

    // 控制圖層的顯示/隱藏，並在需要時自動載入資料
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
          const result = await layer.loader(layer);

          // 將載入的資料直接存儲在圖層物件中
          layer.geoJsonData = result.geoJsonData;
          layer.tableData = result.tableData;
          layer.summaryData = result.summaryData;
          layer.legendData = result.legendData || null;
          layer.isLoaded = true;

          // 🔄 強制觸發響應式更新
          console.log(
            `✅ 圖層 "${layer.layerName}" 載入完成 (${result.geoJsonData?.features?.length || 0} 筆資料)`
          );
          console.log(`📊 圖層摘要資料:`, layer.summaryData);
        } catch (error) {
          console.error(`Failed to load data for layer "${layer.layerName}":`, error);
          layer.visible = false; // 載入失敗時恢復可見性狀態
        } finally {
          layer.isLoading = false;
        }
      }
    };

    // ------------------------------------------------------------
    // 選中的地圖物件
    const selectedFeature = ref(null);

    const setSelectedFeature = (feature) => {
      selectedFeature.value = feature;
    };

    const clearSelectedFeature = () => {
      selectedFeature.value = null;
    };

    return {
      layers,
      findLayerById, // 根據 ID 尋找圖層
      getAllLayers, // 獲取所有圖層的扁平陣列
      toggleLayerVisibility,
      selectedFeature,
      setSelectedFeature,
      clearSelectedFeature,
      visibleLayers: computed(() => getAllLayers().filter((layer) => layer.visible)),
      loadingLayers: computed(() => getAllLayers().filter((layer) => layer.isLoading)),
    };
  },
  {
    persist: true,
  }
);
