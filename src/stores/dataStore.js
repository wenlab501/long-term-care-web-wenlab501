import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import {
  loadCommunityCareCenterData,
  loadCLevelUnitData,
  loadRespiteCareCPlusUnitData,
  loadPublicElderlyWelfareInstitutionData,
  loadElderlyWelfareInstitutionData,
  loadCommunityIntegrationServiceCenterData,
  loadGeneralNursingHomeData,
  loadResidentialLongTermCareData,
  load66Data,
  load142Data,
  load25Data,
  load41Data,
  loadHospitalClinicData,
  loadHealthcareFacilityPharmacyData,
  loadPopulation3LevelsGeoJson,
  loadIncomeGeoJson,
  loadConvenienceStoreData,
  loadMRTStationGeoJson,
  loadBusStopGeoJson,
  loadTaipeiDistrictGeoJson,
} from '../utils/dataProcessor.js';

// 主要數據存儲定義 (Main Data Store Definition)
export const useDataStore = defineStore(
  'data',
  () => {
    const layers = ref([
      {
        groupName: '老人福利機構',
        groupLayers: [
          {
            layerId: '公辦民營老人福利機構',
            layerName: '公辦民營老人福利機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadPublicElderlyWelfareInstitutionData,
            fileName: '臺北市公辦民營老人福利機構一覽表_coord.csv',
            fieldName: null,
          },
          {
            layerId: '老人福利機構',
            layerName: '老人福利機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadElderlyWelfareInstitutionData,
            fileName: '臺北市老人福利機構名冊1140201_coord.csv',
            fieldName: null,
          },
          {
            layerId: '一般護理之家',
            layerName: '一般護理之家',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadGeneralNursingHomeData,
            fileName: '台北市政府衛生局/臺北市立案一般護理之家一覽表_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '社區式長照',
        groupLayers: [
          {
            layerId: '社區照顧關懷據點',
            layerName: '社區照顧關懷據點',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadCommunityCareCenterData,
            fileName: '114年度臺北市社區照顧關懷據點㇐覽表_coord.csv',
            fieldName: null,
          },
          {
            layerId: '社區整體照顧服務體系C級單位',
            layerName: '社區整體照顧服務體系C級單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadCLevelUnitData,
            fileName: '114年臺北市社區整體照顧服務體系C級單位一覽表_coord.csv',
            fieldName: null,
          },
          {
            layerId: '社區照顧關懷據點辦理社區喘息服務(C+單位)',
            layerName: '社區照顧關懷據點辦理社區喘息服務(C+單位)',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadRespiteCareCPlusUnitData,
            fileName:
              '臺北市政府社會局114年度社區照顧關懷據點辦理社區喘息服務(C+單位)一覽表_coord.csv',
            fieldName: null,
          },
          {
            layerId: '社區整合型服務中心(A單位)',
            layerName: '社區整合型服務中心(A單位)',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadCommunityIntegrationServiceCenterData,
            fileName: '台北市政府衛生局/臺北市社區整合型服務中心(A單位)一覽表_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '住宿式長照',
        groupLayers: [
          {
            layerId: '住宿式長照機構',
            layerName: '住宿式長照機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadResidentialLongTermCareData,
            fileName: '台北市政府衛生局/臺北市立案住宿式長照機構一覽表_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '喘息服務',
        groupLayers: [
          {
            layerId: '社區式喘息(GA03/GA04/GA06)及社區式短照(SC03/SC04/SC06)服務單位',
            layerName: '社區式喘息(GA03/GA04/GA06)及社區式短照(SC03/SC04/SC06)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: load41Data,
            fileName:
              '台北市政府衛生局/臺北市政府衛生局長照2.0社區式喘息(GA03_GA04_GA06)及社區式短照(SC03_SC04_SC06)服務單位一覽表_41_coord.csv',
            fieldName: null,
          },
          {
            layerId: '住宿式喘息(GA05)及住宿式短照(SC05)服務單位',
            layerName: '住宿式喘息(GA05)及住宿式短照(SC05)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: load66Data,
            fileName:
              '台北市政府衛生局/臺北市政府衛生局長照2.0住宿式喘息(GA05)及住宿式短照(SC05)服務單位一覽表_66_coord.csv',
            fieldName: null,
          },
          {
            layerId: '巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務單位',
            layerName: '巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: load25Data,
            fileName:
              '台北市政府衛生局/臺北市政府衛生局長照2.0巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務 單位一覽表_25_coord.csv',
            fieldName: null,
          },
          {
            layerId: '居家式喘息(GA09)及居家式短照(SC09)服務單位',
            layerName: '居家式喘息(GA09)及居家式短照(SC09)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'orange',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: load142Data,
            fileName:
              '台北市政府衛生局/臺北市政府衛生局長照2.0居家式喘息(GA09)及居家式短照(SC09)服務單位一覽表_142_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '基礎設施',
        groupLayers: [
          {
            layerId: '醫院',
            layerName: '醫院',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
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
            shape: 'circle',
            colorName: 'lime',
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
            shape: 'circle',
            colorName: 'green',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadHealthcareFacilityPharmacyData,
            fileName: '健保特約醫事機構-藥局_coord.csv',
            fieldName: null,
          },
          {
            layerId: '四大超商',
            layerName: '四大超商',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: null,
            colorName: 'cyan',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadConvenienceStoreData,
            fileName: '全國5大超商資料集_coord.csv',
            fieldName: null,
          },
          {
            layerId: '捷運站點',
            layerName: '捷運站點',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: null,
            colorName: 'blue',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadMRTStationGeoJson,
            fileName: 'TpeMrtStations_TWD97_FIDCODE.geojson',
            fieldName: null,
          },
          {
            layerId: '公車站點',
            layerName: '公車站點',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: null,
            colorName: 'blue',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadBusStopGeoJson,
            fileName: 'busstop.geojson',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '地理統計資料',
        groupLayers: [
          {
            layerId: '人口統計-14歲以下',
            layerName: '人口統計-14歲以下',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            shape: null,
            colorName: 'deeppurple',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadPopulation3LevelsGeoJson,
            fileName: '113年12月行政區三段年齡組性別人口統計_村里_WGS84_臺北市.geojson',
            fieldName: 'A0A14_CNT',
          },
          {
            layerId: '人口統計-15~64歲',
            layerName: '人口統計-15~64歲',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            shape: null,
            colorName: 'deeppurple',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadPopulation3LevelsGeoJson,
            fileName: '113年12月行政區三段年齡組性別人口統計_村里_WGS84_臺北市.geojson',
            fieldName: 'A15A64_CNT',
          },
          {
            layerId: '人口統計-65歲以上',
            layerName: '人口統計-65歲以上',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            shape: null,
            colorName: 'deeppurple',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadPopulation3LevelsGeoJson,
            fileName: '113年12月行政區三段年齡組性別人口統計_村里_WGS84_臺北市.geojson',
            fieldName: 'A65UP_CNT',
          },
          {
            layerId: '綜稅綜合所得總額-中位數',
            layerName: '綜稅綜合所得總額-中位數',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            shape: null,
            colorName: 'purple',
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
            shape: null,
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
      {
        groupName: '基礎地理資料',
        groupLayers: [
          {
            layerId: '行政區界',
            layerName: '行政區界',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'polygon',
            shape: null,
            colorName: 'brown',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadTaipeiDistrictGeoJson,
            fileName: '臺北市區界圖_20220915.geojson',
            fieldName: 'A0A14_CNT',
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
      console.log('🔧 DataStore: toggleLayerVisibility 被調用', layerId);
      const layer = findLayerById(layerId);
      if (!layer) {
        console.error(`Layer with id "${layerId}" not found.`);
        return;
      }

      console.log('🔧 DataStore: 找到圖層', layer.layerName, '當前狀態:', layer.visible);
      // 切換可見性狀態
      layer.visible = !layer.visible;
      console.log('🔧 DataStore: 新狀態:', layer.visible);

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
