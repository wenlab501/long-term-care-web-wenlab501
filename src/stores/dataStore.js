import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import {
  loadCommunityCareCenterData,
  loadCLevelUnitData,
  loadRespiteCareCPlusUnitData,
  //loadPublicElderlyWelfareInstitutionData,
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
  loadLanduseGeoJson,
  loadTaipeiDistrictGeoJson,
} from '../utils/dataProcessor.js';

// 主要數據存儲定義 (Main Data Store Definition)
export const useDataStore = defineStore(
  'data',
  () => {
    const layers = ref([
      {
        groupName: '居家式長照機構',
        groupLayers: [
          {
            layerId: '居家服務機構',
            layerName: '居家服務機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '居家護理所',
            layerName: '居家護理所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '居家物理治療所',
            layerName: '居家物理治療所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '居家職能治療所',
            layerName: '居家職能治療所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '居家呼吸照護所',
            layerName: '居家呼吸照護所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '居家語言治療所',
            layerName: '居家語言治療所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '心理諮商所',
            layerName: '心理諮商所',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '居家式喘息(GA09)及居家式短照(SC09)服務單位',
            layerName: '[不確定] 居家式喘息(GA09)及居家式短照(SC09)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
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
        groupName: '社區式長照機構 - 日間照顧',
        groupLayers: [
          {
            layerId: '小規模多機能服務',
            layerName: '小規模多機能服務',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '團體家屋',
            layerName: '團體家屋',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '家庭托顧',
            layerName: '家庭托顧',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '交通接送',
            layerName: '交通接送',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '社區式長照機構 - 社區據點',
        groupLayers: [
          {
            layerId: '社區照顧關懷據點',
            layerName: '社區照顧關懷據點',
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
            loader: loadCommunityCareCenterData,
            fileName: '台北市政府社會局/114年度臺北市社區照顧關懷據點㇐覽表_coord.csv',
            fieldName: null,
          },
          {
            layerId: '社區照顧關懷據點辦理社區喘息服務(C+單位)',
            layerName: '[不確定] 社區照顧關懷據點辦理社區喘息服務(C+單位)',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
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
            layerId: '失智社區服務據點',
            layerName: '失智社區服務據點',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '家庭照顧者支持服務據點',
            layerName: '家庭照顧者支持服務據點',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '社區照顧關懷據點暨C級巷弄長照站',
            layerName: '社區照顧關懷據點暨C級巷弄長照站',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: null,
            fieldName: null,
          },
          {
            layerId: '醫事C級巷弄長照站',
            layerName: '醫事C級巷弄長照站',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '社區整體照顧服務體系C級單位',
            layerName: '[不確定] 社區整體照顧服務體系C級單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadCLevelUnitData,
            fileName: '台北市政府社會局/114年臺北市社區整體照顧服務體系C級單位一覽表_coord.csv',
            fieldName: null,
          },
          {
            layerId: '巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務單位',
            layerName: '[不確定] 巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
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
            layerId: '社區式喘息(GA03/GA04/GA06)及社區式短照(SC03/SC04/SC06)服務單位',
            layerName: '[不確定] 社區式喘息(GA03/GA04/GA06)及社區式短照(SC03/SC04/SC06)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
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
            layerId: '原住民族文化健康站',
            layerName: '原住民族文化健康站',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '社區整合型服務中心(A單位)',
            layerName: '[不確定] 社區整合型服務中心(A單位)',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
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
        groupName: '機構式長照機構 - 老人福利機構',
        groupLayers: [
          {
            layerId: '安養機構',
            layerName: '安養機構',
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
            loader: loadElderlyWelfareInstitutionData,
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_安養.csv',
            fieldName: null,
          },
          {
            layerId: '養護機構',
            layerName: '養護機構',
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
            loader: loadElderlyWelfareInstitutionData,
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_養護.csv',
            fieldName: null,
          },
          {
            layerId: '長期照顧機構',
            layerName: '長期照顧機構',
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
            loader: loadElderlyWelfareInstitutionData,
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_長照.csv',
            fieldName: null,
          },
          {
            layerId: '失智照顧機構',
            layerName: '失智照顧機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          /*
          {
            layerId: '公辦民營老人福利機構',
            layerName: '公辦民營老人福利機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadPublicElderlyWelfareInstitutionData,
            fileName: '臺北市公辦民營老人福利機構一覽表_coord.csv',
            fieldName: null,
          },
          */
        ],
      },
      {
        groupName: '機構式長照機構 - 護理之家',
        groupLayers: [
          {
            layerId: '一般護理之家',
            layerName: '一般護理之家',
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
            loader: loadGeneralNursingHomeData,
            fileName: '台北市政府衛生局/臺北市立案一般護理之家一覽表_coord.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '機構式長照機構 - 法人長照機構',
        groupLayers: [
          {
            layerId: '社團法人長照機構',
            layerName: '社團法人長照機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '財團法人長照機構',
            layerName: '財團法人長照機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'gray-400',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: null,
            fileName: '',
            fieldName: null,
          },
          {
            layerId: '住宿式長照機構',
            layerName: '[不確定] 住宿式長照機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadResidentialLongTermCareData,
            fileName: '台北市政府衛生局/臺北市立案住宿式長照機構一覽表_coord.csv',
            fieldName: null,
          },
          {
            layerId: '住宿式喘息(GA05)及住宿式短照(SC05)服務單位',
            layerName: '[不確定] 住宿式喘息(GA05)及住宿式短照(SC05)服務單位',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: load66Data,
            fileName:
              '台北市政府衛生局/臺北市政府衛生局長照2.0住宿式喘息(GA05)及住宿式短照(SC05)服務單位一覽表_66_coord.csv',
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
            layerId: '土地利用',
            layerName: '土地利用',
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
            loader: loadLanduseGeoJson,
            fileName: 'Landuse2.geojson',
            fieldName: 'A0A14_CNT',
          },
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
      {
        groupName: '數據分析',
        groupLayers: [
          {
            layerId: 'analysis-layer',
            layerName: '數據分析圖層',
            visible: true, // 預設開啟
            isLoading: false,
            isLoaded: true, // 始終載入
            type: 'analysis',
            shape: 'mixed',
            colorName: 'red',
            geoJsonData: {
              type: 'FeatureCollection',
              features: [],
            },
            summaryData: {
              totalCount: 0,
              type: '分析點',
              description: '共 0 個分析點，每個點包含 2 公里分析範圍',
              lastUpdated: new Date().toISOString(),
              coverage: '0 平方公里',
            },
            tableData: [],
            legendData: null,
            loader: null, // 不需要載入器
            fileName: null,
            fieldName: null,
            isAnalysisLayer: true, // 標記為分析圖層
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

      // 如果圖層被開啟且尚未載入，則載入資料（分析圖層除外）
      if (layer.visible && !layer.isLoaded && !layer.isLoading && !layer.isAnalysisLayer) {
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

    // 🧮 計算兩點間距離 (Calculate Distance Between Two Points)
    // 使用 Haversine 公式計算地球表面兩點間的距離（公尺）
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371000; // 地球半徑（公尺）
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // 距離（公尺）
    };

    // 🔍 計算範圍內的點物件 (Calculate Points Within Range)
    const calculatePointsInRange = (centerLat, centerLng, radiusMeters = 2000) => {
      const pointsInRange = [];

      // 獲取所有可見且已載入的點類型圖層
      const visiblePointLayers = getAllLayers().filter(
        (layer) =>
          layer.visible &&
          layer.isLoaded &&
          layer.type === 'point' &&
          !layer.isAnalysisLayer &&
          layer.geoJsonData
      );

      console.log(
        '🔍 檢查可見的點圖層:',
        visiblePointLayers.map((l) => l.layerName)
      );

      visiblePointLayers.forEach((layer) => {
        if (layer.geoJsonData && layer.geoJsonData.features) {
          layer.geoJsonData.features.forEach((feature) => {
            if (feature.geometry.type === 'Point') {
              const [lng, lat] = feature.geometry.coordinates;
              const distance = calculateDistance(centerLat, centerLng, lat, lng);

              if (distance <= radiusMeters) {
                // 創建增強的 feature 物件，包含距離和圖層資訊
                const enhancedFeature = {
                  ...feature, // 保留原始 feature 的所有屬性
                  layerId: layer.layerId,
                  layerName: layer.layerName,
                  distance: Math.round(distance), // 添加距離資訊
                };
                pointsInRange.push(enhancedFeature);
              }
            }
          });
        }
      });

      // 按距離排序
      pointsInRange.sort((a, b) => a.distance - b.distance);

      console.log(`🎯 在 ${radiusMeters / 1000}公里範圍內找到 ${pointsInRange.length} 個點物件`);
      return pointsInRange;
    };

    const calculatePolygonInRange = (centerLat, centerLng, radiusMeters = 2000) => {
      const polygonInRange = [];

      // 獲取所有可見且已載入的區域類型圖層
      const visiblePolygonLayers = getAllLayers().filter(
        (layer) =>
          layer.visible &&
          layer.isLoaded &&
          layer.type === 'polygon' &&
          !layer.isAnalysisLayer &&
          layer.geoJsonData
      );

      console.log(
        '🔍 檢查可見的多邊形圖層:',
        visiblePolygonLayers.map((l) => l.layerName)
      );

      visiblePolygonLayers.forEach((layer) => {
        if (layer.geoJsonData && layer.geoJsonData.features) {
          layer.geoJsonData.features.forEach((feature) => {
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
              // 檢查多邊形是否與圓圈有重疊
              const hasOverlap = checkPolygonCircleOverlap(
                feature.geometry,
                centerLat,
                centerLng,
                radiusMeters
              );

              if (hasOverlap) {
                // 創建增強的 feature 物件，包含圖層資訊
                const enhancedFeature = {
                  ...feature, // 保留原始 feature 的所有屬性
                  layerId: layer.layerId,
                  layerName: layer.layerName,
                  overlapType: 'intersects', // 標記為相交
                };
                polygonInRange.push(enhancedFeature);
              }
            }
          });
        }
      });

      console.log(
        `🎯 在 ${radiusMeters / 1000}公里範圍內找到 ${polygonInRange.length} 個重疊多邊形`
      );
      return polygonInRange;
    };

    // 檢查多邊形與圓圈是否重疊的函數
    const checkPolygonCircleOverlap = (geometry, centerLat, centerLng, radiusMeters) => {
      const coordinates =
        geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;

      for (const polygon of coordinates) {
        for (const ring of polygon) {
          for (const [lng, lat] of ring) {
            const distance = calculateDistance(centerLat, centerLng, lat, lng);
            if (distance <= radiusMeters) {
              return true; // 如果任何一個頂點在圓內，就認為有重疊
            }
          }
        }
      }

      // 也可以檢查圓心是否在多邊形內，但這裡簡化處理
      return false;
    };

    // 分析圖層管理方法
    const updateAnalysisLayerData = (analysisLayer) => {
      // 獲取所有分析圓圈
      const analysisCircles = analysisLayer.geoJsonData.features.filter(
        (f) => f.properties.type === 'circle-analysis'
      );

      // 更新 summaryData
      analysisLayer.summaryData = {
        totalCount: analysisCircles.length,
      };

      // 更新 tableData
      analysisLayer.tableData = analysisCircles.map((feature) => ({
        '#': feature.properties.id,
        名稱: feature.properties.name,
        範圍內點位數: feature.properties.pointsInRange.length,
        範圍內面域數: feature.properties.polygonInRange.length,
      }));
    };

    const addAnalysisPoint = (lat, lng) => {
      const analysisLayer = findLayerById('analysis-layer');
      if (!analysisLayer) return;

      const pointId =
        analysisLayer.geoJsonData.features.filter((f) => f.properties.type === 'point-analysis')
          .length + 1;

      // 🎯 計算範圍內的點物件
      const pointsInRange = calculatePointsInRange(lat, lng, 2000);

      // 🎯 計算範圍內的多邊形物件
      const polygonInRange = calculatePolygonInRange(lat, lng, 2000);

      // 📊 統計各圖層的點數
      const layerStats = {};
      pointsInRange.forEach((feature) => {
        if (!layerStats[feature.layerName]) {
          layerStats[feature.layerName] = 0;
        }
        layerStats[feature.layerName]++;
      });

      // 📊 統計各圖層的多邊形數
      const polygonStats = {};
      polygonInRange.forEach((feature) => {
        if (!polygonStats[feature.layerName]) {
          polygonStats[feature.layerName] = 0;
        }
        polygonStats[feature.layerName]++;
      });

      const featureName = `分析範圍 ${pointId}`;

      // 創建圓圈要素（主要交互物件）
      const circleFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          id: pointId,
          layerId: 'analysis-layer', // 添加圖層ID
          type: 'circle-analysis',
          name: featureName,
          radius: 2000,
          pointsInRange: pointsInRange, // 存儲範圍內的點物件
          polygonInRange: polygonInRange, // 存儲範圍內的多邊形物件
          layerStats: layerStats, // 存儲各圖層統計
          polygonStats: polygonStats, // 存儲各多邊形圖層統計
          // 添加 propertyData 供 PropertiesTab 使用
          propertyData: {
            名稱: featureName,
            範圍內點位數: pointsInRange.length,
            範圍內多邊形數: polygonInRange.length,
          },
        },
      };

      // 創建分析點要素（僅用於顯示位置標記）
      const pointFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          id: `${pointId}_analysis_point`,
          layerId: 'analysis-layer',
          type: 'point-analysis',
          parentId: pointId,
        },
      };

      // 添加到分析圖層（圓圈在前，點在後，這樣圓圈會在下層，點在上層）
      analysisLayer.geoJsonData.features.push(circleFeature, pointFeature);

      // 更新圖層統計和表格數據
      updateAnalysisLayerData(analysisLayer);

      // 🎯 輸出範圍內點位物件的詳細信息
      // if (pointsInRange.length > 0) {
      //   console.log('🎯 範圍內的點物件:', pointsInRange);
      // }

      return {
        pointId,
        pointsInRange,
        polygonInRange,
        layerStats,
        polygonStats,
      };
    };

    const clearAnalysisLayer = () => {
      const analysisLayer = findLayerById('analysis-layer');
      if (analysisLayer) {
        analysisLayer.geoJsonData.features = [];

        // 更新圖層統計和表格數據
        updateAnalysisLayerData(analysisLayer);

        console.log('🗑️ 清除分析圖層數據');
      }
    };

    // 🗑️ 刪除單個分析點 (Delete Single Analysis Point)
    const deleteAnalysisPoint = (pointId) => {
      const analysisLayer = findLayerById('analysis-layer');
      if (!analysisLayer || !analysisLayer.geoJsonData) return;

      // 過濾掉指定的分析圓圈和其對應的點
      analysisLayer.geoJsonData.features = analysisLayer.geoJsonData.features.filter((feature) => {
        const isTargetCircle =
          feature.properties.type === 'circle-analysis' && feature.properties.id === pointId;
        const isTargetPoint =
          feature.properties.type === 'point-analysis' && feature.properties.parentId === pointId;
        return !isTargetCircle && !isTargetPoint;
      });

      // 更新圖層統計和表格數據
      updateAnalysisLayerData(analysisLayer);

      console.log('🗑️ 刪除分析點:', pointId);
    };

    return {
      layers,
      findLayerById, // 根據 ID 尋找圖層
      getAllLayers, // 獲取所有圖層的扁平陣列
      toggleLayerVisibility,
      selectedFeature,
      setSelectedFeature,
      clearSelectedFeature,
      addAnalysisPoint, // 添加分析點
      clearAnalysisLayer, // 清除分析圖層
      deleteAnalysisPoint, // 刪除單個分析點
      calculatePointsInRange, // 計算範圍內的點
      calculatePolygonInRange, // 計算範圍內的多邊形
      visibleLayers: computed(() => getAllLayers().filter((layer) => layer.visible)),
      loadingLayers: computed(() => getAllLayers().filter((layer) => layer.isLoading)),
    };
  },
  {
    persist: true,
  }
);
