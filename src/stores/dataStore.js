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
            colorName: 'green',
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
          // 🚗 等時圈分析圖層 - 基於真實交通網路的可達性分析
          {
            /**
             * 等時圈分析圖層配置
             *
             * @description 此圖層提供基於真實交通網路的等時圈分析功能，
             * 使用 OpenRouteService API 計算從指定起點在指定時間內可到達的所有區域，
             * 並分析範圍內的長照設施和相關統計數據。
             *
             * 功能特色：
             * - 🌐 調用 ORS API 獲取真實的等時圈多邊形
             * - 🎯 精確計算等時圈範圍內的設施數量
             * - 🔄 API 失敗時提供圓圈分析回退方案
             * - 📊 生成詳細的統計報告和表格數據
             * - 🎨 支援多邊形和圓圈兩種視覺表示方式
             */
            layerId: 'isochrone-analysis-layer',
            layerName: '等時圈分析圖層',
            visible: true, // 預設開啟，讓使用者可以立即使用
            isLoading: false, // 初始無加載狀態
            isLoaded: true, // 標記為已載入（分析圖層總是可用的）
            type: 'isochrone-analysis', // 特殊圖層類型
            shape: 'mixed', // 混合形狀：包含點標記和多邊形/圓圈
            colorName: 'blue', // 藍色主題，與數據分析圖層的紅色區分

            // GeoJSON 數據容器，存儲所有等時圈分析結果
            geoJsonData: {
              type: 'FeatureCollection',
              features: [], // 初始為空，分析點會動態添加到此陣列
            },

            // 摘要統計數據（顯示在圖層面板中）
            summaryData: {
              totalCount: 0, // 總等時圈分析數量
              type: '等時分析點', // 分析類型描述
              description: '共 0 個等時分析點，每個點包含等時圈分析範圍', // 詳細描述
              lastUpdated: new Date().toISOString(), // 最後更新時間
              coverage: '0 平方公里', // 覆蓋範圍（暫未實現）
            },

            tableData: [], // 表格數據（用於 DataTableTab 顯示）
            legendData: null, // 圖例數據（等時圈分析不需要圖例）
            loader: null, // 不需要數據載入器（分析是即時生成的）
            fileName: null, // 不對應實體檔案
            fieldName: null, // 不需要欄位映射

            // 🔍 特殊標記：標識此圖層為等時圈分析圖層
            // 此標記用於：
            // 1. 在圖層過濾時排除此圖層
            // 2. 在事件處理中識別分析圖層
            // 3. 在視覺渲染中應用特殊樣式
            isIsochroneAnalysisLayer: true,
          },
          // 🗺️ 路徑規劃圖層 - 多點路徑規劃功能
          {
            /**
             * 路徑規劃圖層配置
             *
             * @description 此圖層提供多點路徑規劃功能，
             * 使用者可以在地圖上點選多個路徑規劃點，
             * 系統將記錄這些點位並提供路徑規劃相關功能。
             *
             * 功能特色：
             * - 🎯 支援多點路徑規劃點選
             * - 📍 無數量限制的路徑點添加
             * - 🎨 清晰的路徑點視覺化
             * - 🔄 靈活的路徑點管理
             * - 📊 路徑點統計和列表顯示
             */
            layerId: 'route-planning-layer',
            layerName: '路徑規劃圖層',
            visible: true, // 預設開啟
            isLoading: false, // 初始無加載狀態
            isLoaded: true, // 標記為已載入（路徑規劃圖層總是可用的）
            type: 'route-planning', // 特殊圖層類型
            shape: 'point', // 點狀圖層：路徑規劃點
            colorName: 'orange', // 橘色主題，與其他分析圖層區分

            // GeoJSON 數據容器，存儲所有路徑規劃點
            geoJsonData: {
              type: 'FeatureCollection',
              features: [], // 初始為空，路徑點會動態添加到此陣列
            },

            // 摘要統計數據（顯示在圖層面板中）
            summaryData: {
              totalCount: 0, // 總路徑規劃點數量
              type: '路徑規劃點', // 類型描述
              description: '共 0 個路徑規劃點，點選完成後可進行路徑規劃', // 詳細描述
              lastUpdated: new Date().toISOString(), // 最後更新時間
              coverage: '0 個路徑點', // 覆蓋範圍描述
            },

            tableData: [], // 表格數據（用於 DataTableTab 顯示）
            legendData: null, // 圖例數據（路徑規劃不需要圖例）
            loader: null, // 不需要數據載入器（路徑點是即時生成的）
            fileName: null, // 不對應實體檔案
            fieldName: null, // 不需要欄位映射

            // 🔍 特殊標記：標識此圖層為路徑規劃圖層
            // 此標記用於：
            // 1. 在圖層過濾時排除此圖層
            // 2. 在事件處理中識別路徑規劃圖層
            // 3. 在視覺渲染中應用特殊樣式
            // 4. 在點擊模式中識別路徑規劃模式
            isRoutePlanningLayer: true,
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
      if (
        layer.visible &&
        !layer.isLoaded &&
        !layer.isLoading &&
        !layer.isAnalysisLayer &&
        !layer.isIsochroneAnalysisLayer
      ) {
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
          !layer.isIsochroneAnalysisLayer &&
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
          !layer.isIsochroneAnalysisLayer &&
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

    // 等時圈分析圖層管理方法
    /**
     * 更新等時圈分析圖層的統計數據和表格數據
     *
     * @description 此函數負責更新等時圈分析圖層的所有統計資訊，
     * 包括摘要數據（summaryData）和表格數據（tableData）。
     * 支援兩種類型的等時圈要素：真實的多邊形和回退的圓圈。
     *
     * @param {Object} isochroneLayer - 等時圈分析圖層物件
     *
     * @note 此函數會在以下情況被調用：
     * 1. 新增等時圈分析點後
     * 2. 刪除等時圈分析點後
     * 3. 清空等時圈分析圖層後
     *
     * @example
     * const isochroneLayer = findLayerById('isochrone-analysis-layer');
     * updateIsochroneAnalysisLayerData(isochroneLayer);
     */
    const updateIsochroneAnalysisLayerData = (isochroneLayer) => {
      // 獲取所有等時圈分析要素（包括多邊形和圓圈兩種類型）
      const isochroneFeatures = isochroneLayer.geoJsonData.features.filter(
        (f) =>
          f.properties.type === 'isochrone-circle-analysis' || // 回退模式的圓圈
          f.properties.type === 'isochrone-polygon-analysis' // API 模式的多邊形
      );

      // 更新摘要統計數據
      isochroneLayer.summaryData = {
        totalCount: isochroneFeatures.length, // 總等時圈分析數量
      };

      // 更新表格顯示數據（用於 DataTableTab）
      isochroneLayer.tableData = isochroneFeatures.map((feature) => ({
        '#': feature.properties.id, // 分析編號
        名稱: feature.properties.name, // 分析名稱
        // 根據要素類型顯示不同的標籤
        類型:
          feature.properties.type === 'isochrone-polygon-analysis'
            ? '等時圈多邊形' // 來自 ORS API 的真實等時圈
            : '預估圓圈', // 回退模式的圓圈分析
        // 顯示車程時間或預估標籤
        車程時間: feature.properties.travelTime ? `${feature.properties.travelTime}分鐘` : '預估',
        // 範圍內的點設施數量
        範圍內點位數: feature.properties.pointsInRange
          ? feature.properties.pointsInRange.length
          : 0,
        // 範圍內的多邊形區域數量
        範圍內面域數: feature.properties.polygonInRange
          ? feature.properties.polygonInRange.length
          : 0,
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

    // 🌐 調用 OpenRouteService API 獲取等時圈數據
    /**
     * 從 OpenRouteService API 獲取等時圈（Isochrone）數據
     *
     * @description 此函數向 ORS API 發送請求，獲取從指定起點在指定時間內可到達的所有區域
     * 等時圈是指從某一點出發，在相同時間內可以到達的所有地點連成的邊界線
     *
     * @param {number} lat - 起點緯度（WGS84 坐標系）
     * @param {number} lng - 起點經度（WGS84 坐標系）
     * @param {number} travelTimeMinutes - 旅行時間（分鐘），默認為 10 分鐘
     *
     * @returns {Promise<Object>} 返回 GeoJSON 格式的等時圈數據
     * @throws {Error} 當 API 調用失敗時拋出錯誤
     *
     * @example
     * // 獲取台北 101 周邊 15 分鐘車程的等時圈
     * const isochrone = await fetchIsochroneData(25.034, 121.565, 15);
     */
    const fetchIsochroneData = async (lat, lng, travelTimeMinutes = 10) => {
      // OpenRouteService API 金鑰（免費額度：每日 2000 次請求）
      const apiKey = '5b3ce3597851110001cf6248cd3e1a052bec45bc8410b037091bb766';

      // ORS API 要求坐標格式為 [經度, 緯度]（與常見的 [緯度, 經度] 相反）
      const startPoint = [lng, lat];

      try {
        // 向 ORS Isochrones API 發送 POST 請求
        // https://openrouteservice.org/dev/#/api-docs/v2/isochrones/{profile}/post
        const response = await fetch(
          'https://api.openrouteservice.org/v2/isochrones/driving-car', // driving-car // cycling-electric
          {
            method: 'POST',
            headers: {
              // API 身份驗證標頭
              Authorization: apiKey,
              // 指定請求內容類型為 JSON
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // 起點坐標陣列（可以同時計算多個起點，這裡只有一個）
              locations: [startPoint],
              // 時間範圍陣列，單位為秒（可以同時計算多個時間範圍）
              range: [travelTimeMinutes * 60],
              // 範圍類型：'time' 表示時間等時圈，'distance' 表示距離等時圈
              range_type: 'time',
            }),
          }
        );

        // 檢查 HTTP 響應狀態
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析 JSON 響應數據
        const data = await response.json();

        // 返回的數據格式為 GeoJSON FeatureCollection
        // 包含一個或多個 Polygon 要素，代表等時圈區域
        return data;
      } catch (error) {
        console.error('獲取等時圈數據失敗:', error);
        throw error;
      }
    };

    // 🎯 計算等時圈多邊形範圍內的點物件
    /**
     * 計算等時圈多邊形範圍內的所有點物件（長照設施等）
     *
     * @description 此函數遍歷所有可見的點圖層，檢查每個點是否位於等時圈多邊形內部
     * 使用射線投射算法（Ray Casting Algorithm）判斷點是否在多邊形內
     *
     * @param {Object} isochroneData - 來自 ORS API 的等時圈 GeoJSON 數據
     * @param {number} centerLat - 等時圈中心點緯度（用於計算距離）
     * @param {number} centerLng - 等時圈中心點經度（用於計算距離）
     *
     * @returns {Array} 包含所有在等時圈內的點物件陣列，每個物件包含：
     *   - 原始 GeoJSON feature 數據
     *   - layerId: 圖層 ID
     *   - layerName: 圖層名稱
     *   - distance: 與中心點的直線距離（公尺）
     *
     * @example
     * const pointsInRange = calculatePointsInIsochronePolygon(isochroneData, 25.034, 121.565);
     * console.log(`找到 ${pointsInRange.length} 個設施`);
     */
    const calculatePointsInIsochronePolygon = (isochroneData, centerLat, centerLng) => {
      const pointsInRange = [];

      // 檢查等時圈數據是否有效
      if (!isochroneData.features || isochroneData.features.length === 0) {
        console.warn('等時圈數據無效或為空');
        return pointsInRange;
      }

      // 取得第一個（通常也是唯一的）等時圈多邊形
      const isochronePolygon = isochroneData.features[0];

      // 獲取所有符合條件的點圖層：
      // 1. 必須是可見的 (visible = true)
      // 2. 必須已載入數據 (isLoaded = true)
      // 3. 必須是點類型 (type = 'point')
      // 4. 排除分析圖層（避免計算分析點本身）
      // 5. 必須有實際的 GeoJSON 數據
      const visiblePointLayers = getAllLayers().filter(
        (layer) =>
          layer.visible &&
          layer.isLoaded &&
          layer.type === 'point' &&
          !layer.isAnalysisLayer &&
          !layer.isIsochroneAnalysisLayer &&
          layer.geoJsonData
      );

      console.log(
        '🔍 檢查等時圈範圍內的點圖層:',
        visiblePointLayers.map((l) => l.layerName)
      );

      // 🚨 診斷：如果沒有找到符合條件的點圖層，提供詳細的診斷資訊
      if (visiblePointLayers.length === 0) {
        console.warn('⚠️ 沒有找到符合條件的點圖層進行等時圈分析！');

        // 檢查所有點圖層的狀態
        const allPointLayers = getAllLayers().filter((layer) => layer.type === 'point');
        console.log('📊 所有點圖層狀態診斷:');
        allPointLayers.forEach((layer) => {
          const status = [];
          if (!layer.visible) status.push('不可見');
          if (!layer.isLoaded) status.push('未載入');
          if (!layer.geoJsonData) status.push('無數據');

          console.log(
            `  - ${layer.layerName}: ${status.length > 0 ? status.join(', ') : '✅ 符合條件'}`
          );
        });

        console.log('💡 解決方案：');
        console.log('   1. 在左側圖層面板中開啟需要分析的點圖層（如醫院、診所等）');
        console.log('   2. 等待圖層載入完成後再進行等時圈分析');
        console.log('   3. 或者可以考慮自動載入相關圖層');

        return pointsInRange;
      }

      // 遍歷每個符合條件的圖層
      visiblePointLayers.forEach((layer) => {
        if (layer.geoJsonData && layer.geoJsonData.features) {
          // 遍歷圖層中的每個地理要素
          layer.geoJsonData.features.forEach((feature) => {
            // 只處理點類型的要素
            if (feature.geometry.type === 'Point') {
              // 取得點的坐標 [經度, 緯度]
              const [lng, lat] = feature.geometry.coordinates;

              // 使用點在多邊形內判斷算法檢查此點是否在等時圈內
              if (isPointInPolygon([lng, lat], isochronePolygon.geometry)) {
                // 計算點與等時圈中心的直線距離（雖然不是實際行車距離，但可作為參考）
                const distance = calculateDistance(centerLat, centerLng, lat, lng);

                // 創建增強的要素物件，包含原始數據和額外資訊
                const enhancedFeature = {
                  ...feature, // 保留原始 GeoJSON feature 的所有屬性
                  layerId: layer.layerId, // 添加圖層 ID
                  layerName: layer.layerName, // 添加圖層名稱（供顯示用）
                  distance: Math.round(distance), // 添加與中心點的距離（四捨五入到公尺）
                };
                pointsInRange.push(enhancedFeature);
              }
            }
          });
        }
      });

      // 按與中心點的距離排序（最近的在前面）
      pointsInRange.sort((a, b) => a.distance - b.distance);

      console.log(`🎯 在等時圈範圍內找到 ${pointsInRange.length} 個點物件`);
      return pointsInRange;
    };

    // 🎯 計算等時圈多邊形範圍內的多邊形物件
    /**
     * 計算與等時圈多邊形有重疊的所有多邊形物件（如行政區界、統計區域等）
     *
     * @description 此函數檢查所有可見的多邊形圖層，找出與等時圈有交集的多邊形
     * 使用簡化的重疊檢測算法：檢查多邊形頂點是否有任何一個落在等時圈內
     *
     * @param {Object} isochroneData - 來自 ORS API 的等時圈 GeoJSON 數據
     *
     * @returns {Array} 包含所有與等時圈重疊的多邊形物件陣列，每個物件包含：
     *   - 原始 GeoJSON feature 數據
     *   - layerId: 圖層 ID
     *   - layerName: 圖層名稱
     *   - overlapType: 重疊類型（'intersects'）
     *
     * @example
     * const overlappingPolygons = calculatePolygonInIsochronePolygon(isochroneData);
     * console.log(`找到 ${overlappingPolygons.length} 個重疊的行政區`);
     */
    const calculatePolygonInIsochronePolygon = (isochroneData) => {
      const polygonInRange = [];

      // 檢查等時圈數據是否有效
      if (!isochroneData.features || isochroneData.features.length === 0) {
        console.warn('等時圈數據無效或為空，無法計算多邊形重疊');
        return polygonInRange;
      }

      // 取得第一個等時圈多邊形
      const isochronePolygon = isochroneData.features[0];

      // 獲取所有符合條件的多邊形圖層：
      // 1. 必須是可見的 (visible = true)
      // 2. 必須已載入數據 (isLoaded = true)
      // 3. 必須是多邊形類型 (type = 'polygon')
      // 4. 排除分析圖層（避免與分析多邊形本身比較）
      // 5. 必須有實際的 GeoJSON 數據
      const visiblePolygonLayers = getAllLayers().filter(
        (layer) =>
          layer.visible &&
          layer.isLoaded &&
          layer.type === 'polygon' &&
          !layer.isAnalysisLayer &&
          !layer.isIsochroneAnalysisLayer &&
          layer.geoJsonData
      );

      // 遍歷每個符合條件的多邊形圖層
      visiblePolygonLayers.forEach((layer) => {
        if (layer.geoJsonData && layer.geoJsonData.features) {
          // 遍歷圖層中的每個地理要素
          layer.geoJsonData.features.forEach((feature) => {
            // 只處理 Polygon 和 MultiPolygon 類型的要素
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
              // 檢查此多邊形是否與等時圈有重疊
              const hasOverlap = checkPolygonIsochroneOverlap(
                feature.geometry,
                isochronePolygon.geometry
              );

              if (hasOverlap) {
                // 創建增強的要素物件，包含重疊資訊
                const enhancedFeature = {
                  ...feature, // 保留原始 GeoJSON feature 的所有屬性
                  layerId: layer.layerId, // 添加圖層 ID
                  layerName: layer.layerName, // 添加圖層名稱
                  overlapType: 'intersects', // 標記重疊類型
                };
                polygonInRange.push(enhancedFeature);
              }
            }
          });
        }
      });

      console.log(`🎯 在等時圈範圍內找到 ${polygonInRange.length} 個重疊多邊形`);
      return polygonInRange;
    };

    // 檢查點是否在多邊形內（射線投射算法）
    /**
     * 使用射線投射算法（Ray Casting Algorithm）判斷點是否在多邊形內部
     *
     * @description 此算法的基本原理：
     * 1. 從測試點向任意方向（通常是水平向右）發射一條射線
     * 2. 計算射線與多邊形邊界的交點數量
     * 3. 如果交點數量為奇數，則點在多邊形內；偶數則在外
     *
     * @param {Array} point - 測試點坐標 [經度, 緯度]
     * @param {Object} polygon - GeoJSON 多邊形幾何物件
     *
     * @returns {boolean} true 表示點在多邊形內，false 表示在外
     *
     * @example
     * const isInside = isPointInPolygon([121.565, 25.034], polygonGeometry);
     * console.log(isInside ? '在多邊形內' : '在多邊形外');
     *
     * @note 此實現為簡化版本，僅處理多邊形的外環，未考慮內環（洞）
     */
    const isPointInPolygon = (point, polygon) => {
      const [x, y] = point; // 測試點的 x, y 坐標
      let coordinates;

      // 根據多邊形類型獲取坐標陣列
      if (polygon.type === 'Polygon') {
        // 單一多邊形：取外環坐標（第一個陣列）
        coordinates = polygon.coordinates[0];
      } else if (polygon.type === 'MultiPolygon') {
        // 多重多邊形：取第一個多邊形的外環坐標
        coordinates = polygon.coordinates[0][0];
      } else {
        // 不支援的幾何類型
        console.warn(`不支援的多邊形類型: ${polygon.type}`);
        return false;
      }

      let inside = false; // 初始假設點在多邊形外

      // 遍歷多邊形的每條邊
      for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
        const [xi, yi] = coordinates[i]; // 當前頂點
        const [xj, yj] = coordinates[j]; // 前一個頂點

        // 檢查射線是否與此邊相交
        // 條件：
        // 1. 邊的兩個端點 y 坐標一個在測試點上方，一個在下方
        // 2. 交點的 x 坐標在測試點右側
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside; // 每次相交都切換內外狀態
        }
      }

      return inside;
    };

    // 檢查多邊形與等時圈是否重疊（簡化版本）
    /**
     * 檢查兩個多邊形是否有重疊或相交
     *
     * @description 此函數使用簡化的重疊檢測算法：
     * 檢查測試多邊形的所有頂點，如果有任何一個頂點落在等時圈多邊形內，
     * 就認為兩個多邊形有重疊。這是一個快速但不完美的方法。
     *
     * @param {Object} polygon - 要檢測的多邊形幾何物件
     * @param {Object} isochronePolygon - 等時圈多邊形幾何物件
     *
     * @returns {boolean} true 表示有重疊，false 表示無重疊
     *
     * @note 限制：
     * 1. 此方法只檢查頂點，可能遺漏某些邊緣相交的情況
     * 2. 不處理一個多邊形完全包含另一個的情況
     * 3. 完整的多邊形相交算法會更複雜，需要考慮所有邊的交點
     *
     * @example
     * const hasOverlap = checkPolygonIsochroneOverlap(districtGeometry, isochroneGeometry);
     * if (hasOverlap) console.log('行政區與等時圈有重疊');
     */
    const checkPolygonIsochroneOverlap = (polygon, isochronePolygon) => {
      let coordinates;

      // 根據多邊形類型獲取坐標陣列
      if (polygon.type === 'Polygon') {
        // 單一多邊形：取外環坐標
        coordinates = polygon.coordinates[0];
      } else if (polygon.type === 'MultiPolygon') {
        // 多重多邊形：取第一個多邊形的外環坐標
        coordinates = polygon.coordinates[0][0];
      } else {
        // 不支援的幾何類型
        console.warn(`不支援的多邊形類型用於重疊檢測: ${polygon.type}`);
        return false;
      }

      // 遍歷多邊形的所有頂點
      for (const [lng, lat] of coordinates) {
        // 如果任何一個頂點在等時圈內，就認為有重疊
        if (isPointInPolygon([lng, lat], isochronePolygon)) {
          return true;
        }
      }

      // 所有頂點都在等時圈外，認為無重疊
      // 注意：這可能會遺漏某些邊緣相交的情況
      return false;
    };

    /**
     * 自動載入重要的長照設施圖層用於等時圈分析
     *
     * @description 為了確保等時圈分析能夠計算到範圍內的設施，
     * 此函數會自動載入一些重要的長照相關圖層
     *
     * @returns {Promise<void>} 完成所有圖層載入的 Promise
     */
    const autoLoadImportantLayersForAnalysis = async () => {
      // 定義重要的長照設施圖層 ID（按重要性排序）
      const importantLayerIds = [
        '醫院',
        '診所',
        '藥局',
        '社區照顧關懷據點',
        '社區整合型服務中心(A單位)',
        '一般護理之家',
        '住宿式長照機構',
      ];

      const layersToLoad = [];

      // 檢查哪些重要圖層需要載入
      importantLayerIds.forEach((layerId) => {
        const layer = findLayerById(layerId);
        if (layer && !layer.isLoaded && !layer.isLoading) {
          layersToLoad.push(layer);
        }
      });

      if (layersToLoad.length > 0) {
        console.log(
          `🚀 自動載入 ${layersToLoad.length} 個重要圖層用於等時圈分析:`,
          layersToLoad.map((l) => l.layerName)
        );

        // 並行載入所有圖層
        const loadPromises = layersToLoad.map(async (layer) => {
          try {
            layer.isLoading = true;
            layer.visible = true; // 設為可見

            if (layer.loader) {
              const data = await layer.loader(layer.fileName);
              layer.geoJsonData = data.geoJsonData;
              layer.summaryData = data.summaryData;
              layer.tableData = data.tableData;
              layer.legendData = data.legendData;
              layer.isLoaded = true;
              console.log(`✅ 已載入圖層: ${layer.layerName}`);
            }
          } catch (error) {
            console.error(`❌ 載入圖層失敗: ${layer.layerName}`, error);
          } finally {
            layer.isLoading = false;
          }
        });

        await Promise.all(loadPromises);
        console.log('🎉 重要圖層載入完成，可以進行等時圈分析');
      } else {
        console.log('✅ 重要圖層已經載入，無需額外載入');
      }
    };

    /**
     * 添加等時圈分析點 - 核心功能函數
     *
     * @description 這是等時圈分析功能的主要入口點。此函數會：
     * 1. 調用 OpenRouteService API 獲取真實的等時圈數據
     * 2. 計算等時圈範圍內的所有長照設施和相關區域
     * 3. 創建可視化的等時圈多邊形和分析點
     * 4. 生成統計數據和報告
     * 5. 在 API 失敗時提供回退方案
     *
     * @param {number} lat - 分析起點的緯度（WGS84 坐標系）
     * @param {number} lng - 分析起點的經度（WGS84 坐標系）
     * @param {number} travelTimeMinutes - 等時圈時間範圍（分鐘），預設 10 分鐘
     *
     * @returns {Promise<Object>} 分析結果物件，包含：
     *   - pointId: 分析點編號
     *   - pointsInRange: 範圍內的點設施陣列
     *   - polygonInRange: 範圍內的多邊形區域陣列
     *   - layerStats: 各圖層的統計數據
     *   - polygonStats: 多邊形圖層的統計數據
     *   - isochroneData: 原始等時圈 API 數據
     *
     * @throws {Error} 當 API 調用失敗且回退方案也失敗時拋出錯誤
     *
     * @example
     * // 在台北 101 創建 15 分鐘車程的等時圈分析
     * const result = await addIsochroneAnalysisPoint(25.034, 121.565, 15);
     * console.log(`找到 ${result.pointsInRange.length} 個長照設施`);
     */
    const addIsochroneAnalysisPoint = async (lat, lng, travelTimeMinutes = 10) => {
      // 獲取等時圈分析圖層實例
      const isochroneLayer = findLayerById('isochrone-analysis-layer');
      if (!isochroneLayer) {
        console.error('找不到等時圈分析圖層');
        return;
      }

      // 🚀 自動載入重要的長照設施圖層
      await autoLoadImportantLayersForAnalysis();

      // 計算新的分析點編號（基於現有分析點數量）
      const pointId =
        isochroneLayer.geoJsonData.features.filter(
          (f) => f.properties.type === 'isochrone-point-analysis'
        ).length + 1;

      try {
        // 🚀 第一階段：調用 OpenRouteService API 獲取等時圈數據
        isochroneLayer.isLoading = true; // 設置圖層加載狀態，用於 UI 顯示
        console.log(`🌐 正在獲取 ${travelTimeMinutes} 分鐘車程的等時圈數據...`);

        // 調用 ORS API 獲取實際的等時圈多邊形
        const isochroneData = await fetchIsochroneData(lat, lng, travelTimeMinutes);

        // 🎯 第二階段：基於等時圈多邊形計算範圍內的設施和區域
        const pointsInRange = calculatePointsInIsochronePolygon(isochroneData, lat, lng);
        const polygonInRange = calculatePolygonInIsochronePolygon(isochroneData);

        // 📊 第三階段：統計各圖層的設施數量
        const layerStats = {};
        pointsInRange.forEach((feature) => {
          if (!layerStats[feature.layerName]) {
            layerStats[feature.layerName] = 0;
          }
          layerStats[feature.layerName]++;
        });

        // 📊 統計各多邊形圖層的重疊數量
        const polygonStats = {};
        polygonInRange.forEach((feature) => {
          if (!polygonStats[feature.layerName]) {
            polygonStats[feature.layerName] = 0;
          }
          polygonStats[feature.layerName]++;
        });

        // 🏷️ 第四階段：創建分析結果的顯示名稱
        const featureName = `等時分析範圍 ${pointId} (${travelTimeMinutes}分鐘車程)`;

        // 🗺️ 第五階段：創建等時圈多邊形要素（用於地圖顯示）
        const isochronePolygonFeature = {
          type: 'Feature',
          geometry: isochroneData.features[0].geometry, // 直接使用 ORS API 返回的多邊形幾何
          properties: {
            id: pointId, // 唯一識別編號
            layerId: 'isochrone-analysis-layer', // 所屬圖層
            type: 'isochrone-polygon-analysis', // 要素類型標記
            name: featureName, // 顯示名稱
            travelTime: travelTimeMinutes, // 旅行時間
            pointsInRange: pointsInRange, // 範圍內的點設施
            polygonInRange: polygonInRange, // 範圍內的多邊形區域
            layerStats: layerStats, // 圖層統計
            polygonStats: polygonStats, // 多邊形統計
            // 為屬性面板準備的格式化數據
            propertyData: {
              名稱: featureName,
              車程時間: `${travelTimeMinutes} 分鐘`,
              範圍內點位數: pointsInRange.length,
              範圍內多邊形數: polygonInRange.length,
            },
          },
        };

        // 📍 創建等時圈分析點要素（用於標記分析起點）
        const pointFeature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat], // 分析起點坐標
          },
          properties: {
            id: `${pointId}_isochrone_analysis_point`, // 唯一識別編號
            layerId: 'isochrone-analysis-layer',
            type: 'isochrone-point-analysis', // 點標記類型
            parentId: pointId, // 關聯的多邊形 ID
          },
        };

        // 🔄 第六階段：將新創建的要素添加到圖層
        isochroneLayer.geoJsonData.features.push(isochronePolygonFeature, pointFeature);

        // 📊 更新圖層統計和表格數據
        updateIsochroneAnalysisLayerData(isochroneLayer);

        console.log(`✅ 成功創建等時圈分析 ${pointId}，包含 ${pointsInRange.length} 個點位`);

        // 返回完整的分析結果
        return {
          pointId,
          pointsInRange,
          polygonInRange,
          layerStats,
          polygonStats,
          isochroneData,
        };
      } catch (error) {
        console.error('創建等時圈分析失敗:', error);
        // 🔄 錯誤處理：API 失敗時回退到簡單圓圈分析
        console.log('🔄 回退到簡單圓圈分析模式');
        return addSimpleIsochroneAnalysisPoint(lat, lng, pointId);
      } finally {
        // 🧹 清理：無論成功或失敗都要清除加載狀態
        isochroneLayer.isLoading = false;
      }
    };

    // 🔄 回退方案：簡單圓圈分析（當 API 失敗時使用）
    /**
     * 簡單圓圈分析 - API 失敗時的回退方案
     *
     * @description 當 OpenRouteService API 調用失敗時（如網路錯誤、API 限制等），
     * 使用此函數提供基本的分析功能。以指定半徑的圓圈代替等時圈多邊形，
     * 雖然不如真實等時圈精確，但仍能提供基本的距離分析。
     *
     * @param {number} lat - 分析起點緯度
     * @param {number} lng - 分析起點經度
     * @param {number} pointId - 分析點編號
     *
     * @returns {Object} 簡化的分析結果物件
     *
     * @note 使用固定的 3 公里半徑作為預估等時圈範圍
     * 這個距離大約對應 10-15 分鐘的車程（視交通狀況而定）
     */
    const addSimpleIsochroneAnalysisPoint = (lat, lng, pointId) => {
      const isochroneLayer = findLayerById('isochrone-analysis-layer');
      if (!isochroneLayer) {
        console.error('回退方案：找不到等時圈分析圖層');
        return;
      }

      // 使用原有的圓圈範圍計算函數，半徑設為 3 公里
      const FALLBACK_RADIUS = 3000; // 3 公里，作為等時圈的粗略估計

      console.log('🔄 回退模式：使用圓圈分析計算範圍內設施');
      const pointsInRange = calculatePointsInRange(lat, lng, FALLBACK_RADIUS);
      const polygonInRange = calculatePolygonInRange(lat, lng, FALLBACK_RADIUS);

      console.log(
        `🔄 回退模式結果：找到 ${pointsInRange.length} 個點設施，${polygonInRange.length} 個多邊形區域`
      );

      // 統計各圖層的設施數量
      const layerStats = {};
      pointsInRange.forEach((feature) => {
        if (!layerStats[feature.layerName]) {
          layerStats[feature.layerName] = 0;
        }
        layerStats[feature.layerName]++;
      });

      // 統計各多邊形圖層的重疊數量
      const polygonStats = {};
      polygonInRange.forEach((feature) => {
        if (!polygonStats[feature.layerName]) {
          polygonStats[feature.layerName] = 0;
        }
        polygonStats[feature.layerName]++;
      });

      // 創建回退模式的顯示名稱
      const featureName = `等時分析範圍 ${pointId} (預估範圍)`;

      // 創建圓圈要素（回退模式下的視覺表示）
      const circleFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point', // 使用點幾何，在渲染時轉換為圓圈
          coordinates: [lng, lat],
        },
        properties: {
          id: pointId,
          layerId: 'isochrone-analysis-layer',
          type: 'isochrone-circle-analysis', // 標記為圓圈類型（非多邊形）
          name: featureName,
          radius: FALLBACK_RADIUS, // 圓圈半徑
          pointsInRange: pointsInRange,
          polygonInRange: polygonInRange,
          layerStats: layerStats,
          polygonStats: polygonStats,
          // 屬性面板數據（簡化版）
          propertyData: {
            名稱: featureName,
            範圍內點位數: pointsInRange.length,
            範圍內多邊形數: polygonInRange.length,
          },
        },
      };

      // 創建分析點標記
      const pointFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          id: `${pointId}_isochrone_analysis_point`,
          layerId: 'isochrone-analysis-layer',
          type: 'isochrone-point-analysis',
          parentId: pointId,
        },
      };

      // 添加要素到圖層
      isochroneLayer.geoJsonData.features.push(circleFeature, pointFeature);

      // 更新圖層統計
      updateIsochroneAnalysisLayerData(isochroneLayer);

      console.log(
        `🔄 回退方案：創建 ${FALLBACK_RADIUS / 1000}km 圓圈分析，包含 ${pointsInRange.length} 個點位`
      );

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

    /**
     * 清除等時圈分析圖層的所有數據
     *
     * @description 此函數會移除等時圈分析圖層中的所有分析結果，
     * 包括等時圈多邊形、分析點標記和相關統計數據。
     * 通常在使用者需要重新開始分析或清空地圖時調用。
     *
     * @note 此操作無法撤銷，清除後需要重新創建分析點
     *
     * @example
     * // 清除所有等時圈分析
     * clearIsochroneAnalysisLayer();
     */
    const clearIsochroneAnalysisLayer = () => {
      const isochroneLayer = findLayerById('isochrone-analysis-layer');
      if (isochroneLayer) {
        // 清空圖層中的所有要素
        isochroneLayer.geoJsonData.features = [];

        // 重新計算並更新圖層統計和表格數據
        updateIsochroneAnalysisLayerData(isochroneLayer);

        console.log('🗑️ 清除等時圈分析圖層數據');
      } else {
        console.warn('找不到等時圈分析圖層，無法執行清除操作');
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

    // 🗑️ 刪除單個等時圈分析點 (Delete Single Isochrone Analysis Point)
    /**
     * 刪除指定的等時圈分析點及其相關要素
     *
     * @description 此函數會移除指定編號的等時圈分析結果，包括：
     * 1. 等時圈多邊形或圓圈（分析範圍的視覺表示）
     * 2. 分析點標記（藍色加號圖標）
     * 3. 更新相關的統計數據和表格數據
     *
     * @param {number|string} pointId - 要刪除的分析點編號
     *
     * @note 此操作會同時處理兩種類型的等時圈要素：
     * - isochrone-polygon-analysis: 來自 ORS API 的真實等時圈多邊形
     * - isochrone-circle-analysis: 回退模式的圓圈分析
     *
     * @example
     * // 刪除編號為 3 的等時圈分析
     * deleteIsochroneAnalysisPoint(3);
     */
    const deleteIsochroneAnalysisPoint = (pointId) => {
      const isochroneLayer = findLayerById('isochrone-analysis-layer');
      if (!isochroneLayer || !isochroneLayer.geoJsonData) {
        console.warn('找不到等時圈分析圖層或其數據，無法執行刪除操作');
        return;
      }

      // 過濾並移除指定的等時圈分析要素
      // 需要移除三種相關的要素：
      isochroneLayer.geoJsonData.features = isochroneLayer.geoJsonData.features.filter(
        (feature) => {
          // 1. 回退模式的圓圈分析
          const isTargetCircle =
            feature.properties.type === 'isochrone-circle-analysis' &&
            feature.properties.id === pointId;

          // 2. API 模式的多邊形分析
          const isTargetPolygon =
            feature.properties.type === 'isochrone-polygon-analysis' &&
            feature.properties.id === pointId;

          // 3. 分析點標記（藍色加號）
          const isTargetPoint =
            feature.properties.type === 'isochrone-point-analysis' &&
            feature.properties.parentId === pointId;

          // 保留不匹配的要素（即刪除匹配的要素）
          return !isTargetCircle && !isTargetPolygon && !isTargetPoint;
        }
      );

      // 重新計算並更新圖層統計和表格數據
      updateIsochroneAnalysisLayerData(isochroneLayer);

      console.log('🗑️ 刪除等時圈分析點:', pointId);
    };

    // 🗺️ ============ 路徑規劃圖層相關函數 (Route Planning Layer Functions) ============

    /**
     * 更新路徑規劃圖層的統計數據和表格數據
     *
     * @description 計算路徑規劃圖層中的路徑點數量，更新摘要統計和表格顯示數據。
     * 路徑規劃在點選完成前被視為一筆資料，表格只顯示一筆記錄包含所有路徑點。
     * 這個函數會在以下情況被調用：
     * 1. 添加新的路徑規劃點後
     * 2. 刪除路徑規劃點後
     * 3. 清空路徑規劃圖層後
     *
     * @param {Object} routePlanningLayer - 路徑規劃圖層物件
     *
     * @example
     * const routeLayer = findLayerById('route-planning-layer');
     * updateRoutePlanningLayerData(routeLayer);
     */
    const updateRoutePlanningLayerData = (routePlanningLayer) => {
      // 獲取所有路徑規劃點（過濾出 route-planning-point 類型的要素）
      const routePoints = routePlanningLayer.geoJsonData.features.filter(
        (f) => f.properties.type === 'route-planning-point'
      );

      // 更新摘要統計數據
      if (routePoints.length > 0) {
        routePlanningLayer.summaryData = {
          totalCount: 1, // 表格只顯示一筆資料
          type: '路徑規劃',
          description: `正在規劃路徑，已選擇 ${routePoints.length} 個路徑點`,
          lastUpdated: new Date().toISOString(),
          coverage: `${routePoints.length} 個路徑點`,
        };

        // 更新表格數據（只顯示一筆記錄，包含所有路徑點信息）
        const firstPoint = routePoints[0];
        const lastPoint = routePoints[routePoints.length - 1];
        routePlanningLayer.tableData = [
          {
            '#': 1, // 序號固定為1
            名稱: `路徑規劃 (${routePoints.length}個點)`, // 顯示包含的點數
            類型: '路徑規劃', // 固定類型
            起點: `${firstPoint.properties.name}`, // 起點名稱
            終點: routePoints.length > 1 ? `${lastPoint.properties.name}` : '同起點', // 終點名稱
            路徑點數: routePoints.length, // 路徑點總數
            建立時間: new Date(firstPoint.properties.createdAt).toLocaleString('zh-TW'), // 建立時間
            狀態: '規劃中', // 當前狀態
          },
        ];
      } else {
        routePlanningLayer.summaryData = {
          totalCount: 0, // 沒有路徑點時
          type: '路徑規劃',
          description: '尚未選擇路徑點，點選地圖開始規劃路徑',
          lastUpdated: new Date().toISOString(),
          coverage: '0 個路徑點',
        };

        routePlanningLayer.tableData = [];
      }
    };

    /**
     * 添加路徑規劃點到地圖
     *
     * @description 在指定的經緯度位置添加一個路徑規劃點。
     * 路徑規劃點將按添加順序進行編號，支援無限數量的路徑點添加。
     *
     * @param {number} lat - 緯度
     * @param {number} lng - 經度
     * @returns {string|null} - 成功時返回路徑點ID，失敗時返回null
     *
     * @example
     * // 添加路徑規劃點
     * const pointId = addRoutePlanningPoint(25.0330, 121.5654);
     * if (pointId) {
     *   console.log('成功添加路徑點:', pointId);
     * }
     */
    const addRoutePlanningPoint = (lat, lng) => {
      // 獲取路徑規劃圖層實例
      const routePlanningLayer = findLayerById('route-planning-layer');
      if (!routePlanningLayer) {
        console.error('找不到路徑規劃圖層');
        return null;
      }

      // 計算當前路徑點數量，用於生成順序編號
      const currentPoints = routePlanningLayer.geoJsonData.features.filter(
        (f) => f.properties.type === 'route-planning-point'
      );
      const nextOrder = currentPoints.length + 1;

      // 生成唯一的路徑點ID
      const pointId = `route_point_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 生成路徑點名稱
      const pointName = `路徑點 ${nextOrder}`;

      // 創建路徑規劃點的 GeoJSON 要素
      const routePlanningPointFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat], // GeoJSON 格式：[經度, 緯度]
        },
        properties: {
          id: pointId, // 唯一識別編號
          layerId: 'route-planning-layer', // 所屬圖層
          type: 'route-planning-point', // 要素類型標記
          name: pointName, // 顯示名稱
          order: nextOrder, // 路徑點順序
          latitude: lat, // 緯度（便於存取）
          longitude: lng, // 經度（便於存取）
          createdAt: new Date().toISOString(), // 建立時間
        },
      };

      // 將新的路徑點添加到圖層數據中
      routePlanningLayer.geoJsonData.features.push(routePlanningPointFeature);

      // 更新圖層統計和表格數據
      updateRoutePlanningLayerData(routePlanningLayer);

      console.log(
        `🗺️ 添加路徑規劃點 ${nextOrder}:`,
        pointName,
        `(${lat.toFixed(6)}, ${lng.toFixed(6)})`
      );

      return pointId;
    };

    /**
     * 清空路徑規劃圖層中的所有路徑點
     *
     * @description 移除路徑規劃圖層中的所有路徑規劃點，重置圖層狀態。
     * 這個函數通常在用戶想要重新開始路徑規劃時使用。
     *
     * @example
     * // 清空所有路徑規劃點
     * clearRoutePlanningLayer();
     */
    const clearRoutePlanningLayer = () => {
      // 獲取路徑規劃圖層實例
      const routePlanningLayer = findLayerById('route-planning-layer');
      if (routePlanningLayer) {
        // 清空圖層中的所有要素
        routePlanningLayer.geoJsonData.features = [];

        // 重新計算並更新圖層統計和表格數據
        updateRoutePlanningLayerData(routePlanningLayer);

        console.log('🗑️ 已清空路徑規劃圖層');
      }
    };

    /**
     * 刪除指定的路徑規劃點
     *
     * @description 根據點ID刪除特定的路徑規劃點，並重新整理剩餘路徑點的順序編號。
     *
     * @param {string} pointId - 要刪除的路徑點ID
     *
     * @example
     * // 刪除特定的路徑規劃點
     * deleteRoutePlanningPoint('route_point_1234567890_abc123');
     */
    const deleteRoutePlanningPoint = (pointId) => {
      // 獲取路徑規劃圖層實例
      const routePlanningLayer = findLayerById('route-planning-layer');
      if (!routePlanningLayer || !routePlanningLayer.geoJsonData) {
        console.warn('找不到路徑規劃圖層或其數據，無法執行刪除操作');
        return;
      }

      // 過濾並移除指定的路徑規劃點
      const originalCount = routePlanningLayer.geoJsonData.features.length;
      routePlanningLayer.geoJsonData.features = routePlanningLayer.geoJsonData.features.filter(
        (feature) => feature.properties.id !== pointId
      );

      // 檢查是否成功刪除
      const newCount = routePlanningLayer.geoJsonData.features.length;
      if (originalCount === newCount) {
        console.warn('找不到指定的路徑規劃點:', pointId);
        return;
      }

      // 重新整理剩餘路徑點的順序編號
      const remainingPoints = routePlanningLayer.geoJsonData.features.filter(
        (f) => f.properties.type === 'route-planning-point'
      );

      remainingPoints.forEach((point, index) => {
        const newOrder = index + 1;
        point.properties.order = newOrder;
        point.properties.name = `路徑點 ${newOrder}`;
      });

      // 重新計算並更新圖層統計和表格數據
      updateRoutePlanningLayerData(routePlanningLayer);

      console.log('🗑️ 刪除路徑規劃點:', pointId);
    };

    /**
     * 獲取所有路徑規劃點的坐標列表
     *
     * @description 返回當前所有路徑規劃點的坐標陣列，按順序排列，
     * 可用於後續的路徑規劃API調用。
     *
     * @returns {Array<Array<number>>} - 坐標陣列，格式為 [[lng, lat], [lng, lat], ...]
     *
     * @example
     * // 獲取路徑點坐標用於路徑規劃
     * const coordinates = getRoutePlanningCoordinates();
     * console.log('路徑點坐標:', coordinates);
     * // 輸出: [[121.5654, 25.0330], [121.5700, 25.0350], ...]
     */
    const getRoutePlanningCoordinates = () => {
      const routePlanningLayer = findLayerById('route-planning-layer');
      if (!routePlanningLayer) {
        console.warn('找不到路徑規劃圖層');
        return [];
      }

      // 獲取所有路徑規劃點，並按順序排序
      const routePoints = routePlanningLayer.geoJsonData.features
        .filter((f) => f.properties.type === 'route-planning-point')
        .sort((a, b) => a.properties.order - b.properties.order);

      // 提取坐標陣列
      const coordinates = routePoints.map((point) => point.geometry.coordinates);

      console.log(`📍 獲取 ${coordinates.length} 個路徑點坐標`);
      return coordinates;
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
      addIsochroneAnalysisPoint, // 添加等時圈分析點
      clearIsochroneAnalysisLayer, // 清除等時圈分析圖層
      deleteIsochroneAnalysisPoint, // 刪除單個等時圈分析點
      addRoutePlanningPoint, // 添加路徑規劃點
      clearRoutePlanningLayer, // 清除路徑規劃圖層
      deleteRoutePlanningPoint, // 刪除單個路徑規劃點
      getRoutePlanningCoordinates, // 獲取路徑規劃點坐標
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
