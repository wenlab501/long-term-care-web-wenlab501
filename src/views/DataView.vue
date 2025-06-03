<template>
  <!-- =======================================================================
       DataView.vue - 資料檢視頁面
       =======================================================================
       功能：自動顯示 Pinia Store 中的所有 JSON 資料
       支援：格式化 JSON、表格檢視、地圖檢視、座標轉換
       ======================================================================= -->
  <div class="container-fluid px-0 full-height">
    <div class="row no-gutters full-height">
      
      <!-- =================================================================
           左側資料總覽側邊欄
           ================================================================= -->
      <div class="col-12 col-lg-3 panel-container">
        <div class="card h-100">
          <!-- 側邊欄標題 -->
          <div class="card-header panel-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-database me-2"></i>資料總覽
            </h5>
            <!-- 工具按鈕組 -->
            <div class="btn-group" role="group">
              <button 
                class="btn btn-outline-primary btn-sm"
                @click="exportAllData"
                :disabled="!hasAnyData"
                title="匯出所有資料"
              >
                <i class="fas fa-download"></i>
              </button>
              <button 
                class="btn btn-outline-secondary btn-sm"
                @click="refreshData"
                title="重新整理資料"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
          
          <div class="card-body panel-body p-0">
            <!-- 資料統計卡片區域 -->
            <div class="p-3">
              <div class="row g-2">
                <!-- 原始資料統計 -->
                <div class="col-6">
                  <div class="card bg-light border-0">
                    <div class="card-body p-2 text-center">
                      <h6 class="card-title color-level-800 mb-1">
                        <i class="fas fa-layer-group"></i>
                      </h6>
                      <p class="card-text small mb-0">原始資料</p>
                      <strong class="color-level-800">{{ rawDataCount }}</strong>
                    </div>
                  </div>
                </div>
                <!-- 處理資料統計 -->
                <div class="col-6">
                  <div class="card bg-light border-0">
                    <div class="card-body p-2 text-center">
                      <h6 class="card-title color-level-800 mb-1">
                        <i class="fas fa-chart-line"></i>
                      </h6>
                      <p class="card-text small mb-0">處理資料</p>
                      <strong class="color-level-800">{{ processedDataCount }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 資料類型選擇列表 -->
            <div class="list-group list-group-flush">
              <template v-for="(dataType, key) in dataTypes" :key="key">
                <button 
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  :class="{ 'active': selectedDataType === key }"
                  @click="selectDataType(key)"
                >
                  <!-- 資料類型名稱和圖示 -->
                  <div class="d-flex align-items-center">
                    <i :class="dataType.icon" class="me-2"></i>
                    <span>{{ dataType.label }}</span>
                  </div>
                  <!-- 資料數量標籤 -->
                  <div class="d-flex align-items-center">
                    <span class="badge bg-secondary me-1" title="原始資料數量">{{ getDataCount(key, false) }}</span>
                    <span class="badge bg-primary" title="處理資料數量">{{ getDataCount(key, true) }}</span>
                  </div>
                </button>
              </template>
            </div>

            <!-- 無資料時的提示 -->
            <div v-if="!hasAnyData" class="p-3 text-center text-muted">
              <i class="fas fa-inbox fa-2x mb-2"></i>
              <p class="mb-0">目前沒有任何資料</p>
              <small>請先載入資料文件</small>
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================================
           右側資料詳細內容區域
           ================================================================= -->
      <div class="col-12 col-lg-9 panel-container">
        <div class="card h-100">
          <!-- 內容區域標題 -->
          <div class="card-header panel-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i :class="selectedDataTypeInfo?.icon || 'fas fa-file-alt'" class="me-2"></i>
              {{ selectedDataTypeInfo?.label || '選擇資料類型' }}
            </h5>
            <!-- 檢視模式切換按鈕 -->
            <div class="btn-group" role="group" v-if="selectedData">
              <button 
                class="btn btn-outline-secondary btn-sm"
                :class="{ 'active': viewMode === 'raw' }"
                @click="viewMode = 'raw'"
                title="原始資料"
              >
                <i class="fas fa-database"></i>
                原始
              </button>
              <button 
                class="btn btn-outline-secondary btn-sm"
                :class="{ 'active': viewMode === 'processed' }"
                @click="viewMode = 'processed'"
                title="處理資料"
                :disabled="!hasProcessedData"
              >
                <i class="fas fa-cogs"></i>
                處理
              </button>
            </div>
          </div>
          
          <div class="card-body panel-body p-0">
            <!-- 未選擇資料時的提示 -->
            <div v-if="!selectedData" class="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
              <i class="fas fa-mouse-pointer fa-3x mb-3"></i>
              <h6>請從左側選擇資料類型</h6>
              <p class="text-center">選擇資料類型以查看詳細內容</p>
            </div>

            <!-- 有選擇資料時的內容區域 -->
            <div v-else class="h-100">
              <!-- 資料摘要資訊 -->
              <div class="bg-light border-bottom p-3">
                <div class="row g-3">
                  <div class="col-md-3">
                    <small class="text-muted">資料類型</small>
                    <div class="fw-bold">{{ selectedDataType.toUpperCase() }}</div>
                  </div>
                  <div class="col-md-3" v-if="selectedData.metadata">
                    <small class="text-muted">載入時間</small>
                    <div class="fw-bold">{{ formatDate(selectedData.metadata.timestamp) }}</div>
                  </div>
                  <div class="col-md-3" v-if="selectedData.metadata?.size">
                    <small class="text-muted">資料大小</small>
                    <div class="fw-bold">{{ formatSize(selectedData.metadata.size) }}</div>
                  </div>
                  <div class="col-md-3">
                    <small class="text-muted">項目數量</small>
                    <div class="fw-bold">{{ getItemCount(selectedData) }}</div>
                  </div>
                </div>
              </div>

              <!-- JSON 檢視器主要內容 -->
              <div class="p-3 h-100" style="overflow: auto;">
                <div class="position-relative">
                  <!-- 檢視工具列 -->
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <!-- 檢視模式選擇 -->
                    <div class="btn-group" role="group">
                      <button 
                        class="btn btn-outline-secondary btn-sm"
                        :class="{ 'active': jsonView === 'formatted' }"
                        @click="jsonView = 'formatted'"
                        title="格式化檢視"
                      >
                        <i class="fas fa-code"></i>
                        格式化
                      </button>
                      <button 
                        class="btn btn-outline-secondary btn-sm"
                        :class="{ 'active': jsonView === 'tree' }"
                        @click="jsonView = 'tree'"
                        title="樹狀檢視（開發中）"
                      >
                        <i class="fas fa-sitemap"></i>
                        樹狀
                      </button>
                      <button 
                        class="btn btn-outline-secondary btn-sm"
                        :class="{ 'active': jsonView === 'table' }"
                        @click="jsonView = 'table'"
                        title="表格檢視"
                        :disabled="!canShowTable"
                      >
                        <i class="fas fa-table"></i>
                        表格
                      </button>
                      <button 
                        v-if="selectedDataType === 'geojson'"
                        class="btn btn-outline-secondary btn-sm"
                        :class="{ 'active': jsonView === 'map' }"
                        @click="jsonView = 'map'"
                        title="地圖檢視"
                      >
                        <i class="fas fa-map"></i>
                        地圖
                      </button>
                    </div>
                    
                    <!-- 操作按鈕 -->
                    <div class="btn-group" role="group">
                      <button 
                        class="btn btn-outline-primary btn-sm"
                        @click="copyToClipboard"
                        title="複製到剪貼簿"
                      >
                        <i class="fas fa-copy"></i>
                      </button>
                      <button 
                        class="btn btn-outline-success btn-sm"
                        @click="downloadJson"
                        title="下載 JSON"
                      >
                        <i class="fas fa-download"></i>
                      </button>
                    </div>
                  </div>

                  <!-- =======================================================
                       各種檢視模式的內容區域
                       ======================================================= -->

                  <!-- 格式化 JSON 檢視 -->
                  <div v-if="jsonView === 'formatted'" class="json-container">
                    <pre class="json-pre"><code class="json-code" v-html="formattedJson"></code></pre>
                  </div>

                  <!-- 樹狀檢視（暫時顯示開發中提示） -->
                  <div v-else-if="jsonView === 'tree'" class="tree-container">
                    <div class="alert alert-info">
                      <i class="fas fa-info-circle me-2"></i>
                      樹狀檢視功能開發中，請使用格式化檢視
                    </div>
                  </div>

                  <!-- 表格檢視 -->
                  <div v-else-if="jsonView === 'table' && canShowTable" class="table-container">
                    <div class="table-responsive">
                      <table class="table table-sm table-hover">
                        <thead class="table-light">
                          <tr>
                            <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, index) in tableData" :key="index">
                            <td v-for="header in tableHeaders" :key="header">
                              <span v-if="typeof row[header] === 'object'">
                                {{ JSON.stringify(row[header]) }}
                              </span>
                              <span v-else>{{ row[header] }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 地圖檢視（僅限 GeoJSON 資料） -->
                  <div v-else-if="jsonView === 'map' && selectedDataType === 'geojson'" class="map-container">
                    <!-- 座標系統資訊提示 -->
                    <div class="alert alert-info mb-3" v-if="mapDisplayInfo">
                      <div class="row">
                        <div class="col-md-8">
                          <i class="fas fa-info-circle me-2"></i>
                          <strong>GeoJSON 地圖檢視</strong> - 顯示 {{ mapDisplayInfo.featureCount }} 個地理要素
                        </div>
                        <div class="col-md-4 text-md-end">
                          <small>
                            <strong>座標系統:</strong> {{ mapDisplayInfo.displaySystem }}
                            <span v-if="mapDisplayInfo.wasConverted" class="badge bg-success ms-1">已轉換</span>
                          </small>
                        </div>
                      </div>
                      <!-- TWD97 轉換說明 -->
                      <div v-if="mapDisplayInfo.wasConverted" class="mt-2">
                        <small class="text-muted">
                          <i class="fas fa-sync-alt me-1"></i>
                          原始資料使用 TWD97 (EPSG:3826) 座標系統，已自動轉換為 WGS84 (EPSG:4326) 以便地圖顯示
                        </small>
                        <div v-if="mapDisplayInfo.conversionInfo" class="mt-1">
                          <small class="text-muted">
                            轉換時間: {{ formatDate(mapDisplayInfo.conversionInfo.timestamp) }}
                          </small>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 地圖預覽區域 -->
                    <div class="border rounded bg-light d-flex align-items-center justify-content-center" style="height: 400px;">
                      <div class="text-center text-muted">
                        <i class="fas fa-map fa-3x mb-2"></i>
                        <h5>地圖檢視</h5>
                        <p>GeoJSON 資料可視化</p>
                        <div v-if="mapDisplayInfo">
                          <small><strong>要素數量:</strong> {{ mapDisplayInfo.featureCount }}</small><br>
                          <small><strong>座標系統:</strong> {{ mapDisplayInfo.coordinateSystem }}</small><br>
                          <small v-if="mapDisplayInfo.wasConverted" class="text-success">
                            <i class="fas fa-check-circle me-1"></i>已轉換為 WGS84
                          </small>
                        </div>
                        <hr class="my-2">
                        <small class="text-muted">完整地圖功能請使用主頁</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =================================================================
         匯出進度模態框
         ================================================================= -->
    <div class="modal fade" id="exportModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-download me-2"></i>匯出資料
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex align-items-center">
              <div class="spinner-border spinner-border-sm me-2" role="status"></div>
              <span>正在準備匯出檔案...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * =======================================================================
 * DataView.vue - 資料檢視頁面 JavaScript 邏輯
 * =======================================================================
 * 
 * 功能說明：
 * - 自動顯示 Pinia Store 中的所有 JSON 資料
 * - 支援多種檢視模式：格式化 JSON、樹狀結構、表格、地圖
 * - 自動檢測和轉換 TWD97 座標系統
 * - 響應式設計，支援各種螢幕尺寸
 * - 提供資料匯出和複製功能
 * 
 * 作者：空間分析視覺化專案團隊
 * 更新：2024-12-20
 * =======================================================================
 */

// =======================================================================
// 導入相關模組和函數
// =======================================================================
import { ref, computed, onMounted, watch } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { 
  detectCoordinateSystem, 
  parseGeoJSONCRS,
  transformGeoJSONCoordinates 
} from '@/utils/spatialAnalysis'

// =======================================================================
// Pinia Store 初始化
// =======================================================================
const dataStore = useDataStore()

// =======================================================================
// 響應式資料狀態管理
// =======================================================================

/**
 * 當前選中的資料類型 (geojson, csv, excel, spatial)
 * @type {import('vue').Ref<string>}
 */
const selectedDataType = ref('')

/**
 * 檢視模式：raw=原始資料, processed=處理後資料
 * @type {import('vue').Ref<string>}
 */
const viewMode = ref('raw')

/**
 * JSON 檢視格式
 * formatted=格式化, tree=樹狀, table=表格, map=地圖
 * @type {import('vue').Ref<string>}
 */
const jsonView = ref('formatted')

// =======================================================================
// 資料類型配置
// =======================================================================

/**
 * 支援的資料類型定義
 * 每種類型包含顯示標籤和對應的 FontAwesome 圖示
 * @type {Object}
 */
const dataTypes = {
  geojson: {
    label: 'GeoJSON 地理資料',
    icon: 'fas fa-map-marked-alt'
  },
  csv: {
    label: 'CSV 表格資料', 
    icon: 'fas fa-file-csv'
  },
  excel: {
    label: 'Excel 試算表',
    icon: 'fas fa-file-excel'
  },
  spatial: {
    label: '空間分析資料',
    icon: 'fas fa-project-diagram'
  }
}

// =======================================================================
// 基本計算屬性 - 資料統計
// =======================================================================

/**
 * 計算原始資料總數
 * @type {import('vue').ComputedRef<number>}
 */
const rawDataCount = computed(() => {
  return Object.keys(dataStore.rawData).length
})

/**
 * 計算處理後資料總數
 * @type {import('vue').ComputedRef<number>}
 */
const processedDataCount = computed(() => {
  return Object.keys(dataStore.processedData).length
})

/**
 * 檢查是否有任何資料
 * @type {import('vue').ComputedRef<boolean>}
 */
const hasAnyData = computed(() => {
  return rawDataCount.value > 0 || processedDataCount.value > 0
})

/**
 * 取得當前選中資料類型的詳細資訊
 * @type {import('vue').ComputedRef<Object|undefined>}
 */
const selectedDataTypeInfo = computed(() => {
  return dataTypes[selectedDataType.value]
})

/**
 * 取得當前選中的資料內容
 * 根據檢視模式返回原始或處理後的資料
 * @type {import('vue').ComputedRef<any>}
 */
const selectedData = computed(() => {
  if (!selectedDataType.value) return null
  
  if (viewMode.value === 'raw') {
    return dataStore.rawData[selectedDataType.value]
  } else {
    return dataStore.processedData[selectedDataType.value]
  }
})

/**
 * 檢查是否有對應的處理後資料
 * @type {import('vue').ComputedRef<boolean>}
 */
const hasProcessedData = computed(() => {
  return selectedDataType.value && dataStore.processedData[selectedDataType.value]
})

// =======================================================================
// JSON 格式化和檢視相關計算屬性
// =======================================================================

/**
 * 格式化後的 JSON 字串（帶語法高亮）
 * @type {import('vue').ComputedRef<string>}
 */
const formattedJson = computed(() => {
  if (!selectedData.value) return ''
  
  try {
    const jsonString = JSON.stringify(selectedData.value, null, 2)
    return highlightJson(jsonString)
  } catch (error) {
    return `JSON 格式錯誤: ${error.message}`
  }
})

/**
 * 檢查是否可以顯示表格檢視
 * 資料必須為陣列或包含 features 屬性（GeoJSON）
 * @type {import('vue').ComputedRef<boolean>}
 */
const canShowTable = computed(() => {
  if (!selectedData.value) return false
  
  const data = selectedData.value.data || selectedData.value
  return Array.isArray(data) || (data && Array.isArray(data.features))
})

/**
 * 表格標題行
 * 從資料的第一個項目提取所有鍵值作為表頭
 * @type {import('vue').ComputedRef<string[]>}
 */
const tableHeaders = computed(() => {
  if (!canShowTable.value) return []
  
  const data = selectedData.value.data || selectedData.value
  const items = Array.isArray(data) ? data : data.features
  
  if (!items || items.length === 0) return []
  
  const firstItem = items[0]
  if (firstItem.properties) {
    // GeoJSON feature：包含類型、幾何和屬性
    return ['type', 'geometry', ...Object.keys(firstItem.properties)]
  } else {
    // 一般物件：使用所有鍵值
    return Object.keys(firstItem)
  }
})

/**
 * 表格資料內容
 * 將複雜的 GeoJSON 結構扁平化為表格形式
 * @type {import('vue').ComputedRef<any[]>}
 */
const tableData = computed(() => {
  if (!canShowTable.value) return []
  
  const data = selectedData.value.data || selectedData.value
  const items = Array.isArray(data) ? data : data.features
  
  if (!items) return []
  
  // 限制顯示前100項以提高效能
  return items.slice(0, 100).map(item => {
    if (item.properties) {
      // GeoJSON feature：提取關鍵資訊
      return {
        type: item.type,
        geometry: item.geometry?.type || 'Unknown',
        ...item.properties
      }
    } else {
      // 一般物件：直接返回
      return item
    }
  })
})

// =======================================================================
// TWD97 座標轉換相關計算屬性
// =======================================================================

/**
 * 檢測 GeoJSON 的座標系統
 * 分析第一個要素的座標來判斷是 TWD97 還是 WGS84
 * @type {import('vue').ComputedRef<string>}
 */
const geoJsonCoordinateSystem = computed(() => {
  if (selectedDataType.value !== 'geojson' || !selectedData.value) {
    return 'unknown'
  }
  
  // 🔥 使用新的 CRS 解析功能
  const crsDetected = parseGeoJSONCRS(selectedData.value)
  if (crsDetected !== 'UNKNOWN') {
    return crsDetected
  }
  
  // 🔥 後備方案：從座標範圍檢測
  if (!selectedData.value.features || selectedData.value.features.length === 0) {
    return 'unknown'
  }
  
  const firstFeature = selectedData.value.features[0]
  if (!firstFeature?.geometry?.coordinates) {
    return 'unknown'
  }
  
  // 根據幾何類型提取樣本座標
  let sampleCoords = null
  const coords = firstFeature.geometry.coordinates
  
  switch (firstFeature.geometry.type) {
    case 'Point':
      sampleCoords = coords
      break
    case 'LineString':
    case 'MultiPoint':
      sampleCoords = coords[0]
      break
    case 'Polygon':
    case 'MultiLineString':
      sampleCoords = coords[0][0]
      break
    case 'MultiPolygon':
      sampleCoords = coords[0][0][0]
      break
  }
  
  if (sampleCoords) {
    return detectCoordinateSystem(sampleCoords)
  }
  
  return 'unknown'
})

/**
 * 轉換後的 GeoJSON 資料
 * 如果檢測到 TWD97 座標系統，自動轉換為 WGS84
 * @type {import('vue').ComputedRef<Object|null>}
 */
const convertedGeoJsonData = computed(() => {
  if (selectedDataType.value !== 'geojson' || !selectedData.value) {
    return null
  }
  
  // 檢測座標系統
  const coordinateSystem = geoJsonCoordinateSystem.value
  
  // 如果不是 TWD97，不需要轉換
  if (coordinateSystem !== 'TWD97') {
    console.log(`✅ GeoJSON 座標系統: ${coordinateSystem}，無需轉換`)
    return selectedData.value
  }
  
  console.log('🔄 檢測到 TWD97 座標系統，開始轉換為 WGS84...')
  
  try {
    // 🔥 使用新的轉換函數
    const convertedGeoJSON = transformGeoJSONCoordinates(selectedData.value, 'TWD97', 'WGS84')
    
    console.log(`✅ TWD97→WGS84 轉換完成: ${convertedGeoJSON.features?.length || 0} 個要素`)
    return convertedGeoJSON
  } catch (error) {
    console.error('❌ TWD97→WGS84 座標轉換失敗:', error)
    return selectedData.value
  }
})

/**
 * 地圖顯示資訊
 * 包含要素數量、座標系統和轉換狀態
 * @type {import('vue').ComputedRef<Object|null>}
 */
const mapDisplayInfo = computed(() => {
  if (selectedDataType.value !== 'geojson') return null
  
  const data = convertedGeoJsonData.value || selectedData.value
  const featureCount = data?.features?.length || 0
  const originalCoordinateSystem = geoJsonCoordinateSystem.value
  const wasConverted = originalCoordinateSystem === 'TWD97'
  
  return {
    featureCount,
    originalCoordinateSystem,
    wasConverted,
    displaySystem: wasConverted ? 'WGS84 (從 TWD97 轉換)' : originalCoordinateSystem,
    conversionInfo: data?._coordinateTransform || null
  }
})

// =======================================================================
// 使用者互動方法函數
// =======================================================================

/**
 * 選擇資料類型
 * @param {string} dataType - 資料類型名稱
 */
const selectDataType = (dataType) => {
  selectedDataType.value = dataType
  viewMode.value = 'raw' // 重設為原始資料檢視
  console.log(`🔍 選擇資料類型: ${dataType}`)
}

/**
 * 取得指定資料類型的數量
 * @param {string} dataType - 資料類型
 * @param {boolean} processed - 是否為處理後資料
 * @returns {number} 資料數量
 */
const getDataCount = (dataType, processed = false) => {
  const dataSource = processed ? dataStore.processedData : dataStore.rawData
  const data = dataSource[dataType]
  
  if (!data) return 0
  
  // 根據資料結構判斷數量
  if (data.data && Array.isArray(data.data)) {
    return data.data.length
  } else if (Array.isArray(data)) {
    return data.length
  } else if (data.features && Array.isArray(data.features)) {
    return data.features.length
  } else {
    return 1
  }
}

/**
 * 取得資料項目數量
 * @param {any} data - 資料物件
 * @returns {number} 項目數量
 */
const getItemCount = (data) => {
  if (!data) return 0
  
  if (data.data && Array.isArray(data.data)) {
    return data.data.length
  } else if (Array.isArray(data)) {
    return data.length
  } else if (data.features && Array.isArray(data.features)) {
    return data.features.length
  } else {
    return Object.keys(data).length
  }
}

// =======================================================================
// 格式化和工具方法函數
// =======================================================================

/**
 * 格式化日期時間顯示
 * @param {number|string} timestamp - 時間戳記
 * @returns {string} 格式化的日期字串
 */
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp).toLocaleString('zh-TW')
}

/**
 * 格式化檔案大小顯示
 * @param {number} size - 檔案大小（位元組）
 * @returns {string} 格式化的大小字串
 */
const formatSize = (size) => {
  if (!size) return 'Unknown'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * JSON 語法高亮處理
 * 為 JSON 字串添加 CSS 類別以實現語法高亮
 * @param {string} jsonString - JSON 字串
 * @returns {string} 帶高亮標記的 HTML
 */
const highlightJson = (jsonString) => {
  return jsonString
    .replace(/(".*?")/g, '<span class="json-string">$1</span>')
    .replace(/(\d+\.?\d*)/g, '<span class="json-number">$1</span>')
    .replace(/(true|false)/g, '<span class="json-boolean">$1</span>')
    .replace(/(null)/g, '<span class="json-null">$1</span>')
}

// =======================================================================
// 資料操作方法函數
// =======================================================================

/**
 * 複製選中的資料到剪貼簿
 * 使用現代瀏覽器的 Clipboard API
 */
const copyToClipboard = async () => {
  try {
    const jsonString = JSON.stringify(selectedData.value, null, 2)
    await navigator.clipboard.writeText(jsonString)
    console.log('✅ 已複製到剪貼簿')
    // TODO: 可以加入成功提示 toast
  } catch (error) {
    console.error('❌ 複製失敗:', error)
  }
}

/**
 * 下載選中的資料為 JSON 檔案
 * 使用 Blob API 創建下載連結
 */
const downloadJson = () => {
  try {
    const jsonString = JSON.stringify(selectedData.value, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedDataType.value}_${viewMode.value}_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ JSON 下載完成')
  } catch (error) {
    console.error('❌ 下載失敗:', error)
  }
}

/**
 * 匯出所有資料為單一 JSON 檔案
 * 包含原始資料和處理後資料
 */
const exportAllData = () => {
  try {
    const allData = dataStore.exportDataAsJSON()
    const jsonString = JSON.stringify(allData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `pinia_data_export_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ 所有資料匯出完成')
  } catch (error) {
    console.error('❌ 匯出失敗:', error)
  }
}

/**
 * 重新整理資料
 * TODO: 實作重新載入資料或清除快取的邏輯
 */
const refreshData = () => {
  console.log('🔄 重新整理資料')
  // 可以在這裡實作重新載入資料或清除快取的邏輯
}

// =======================================================================
// 資料監聽器 - 自動選擇邏輯
// =======================================================================

/**
 * 監聽資料變化，自動選擇第一個有資料的類型
 */
watch(() => hasAnyData.value, (newVal) => {
  if (newVal && !selectedDataType.value) {
    // 如果有資料但沒有選擇類型，自動選擇第一個有資料的類型
    for (const [key] of Object.entries(dataTypes)) {
      if (getDataCount(key, false) > 0 || getDataCount(key, true) > 0) {
        selectedDataType.value = key
        console.log(`🎯 自動選擇資料類型: ${key}`)
        break
      }
    }
  }
})

// =======================================================================
// 組件生命週期 - 初始化邏輯
// =======================================================================

/**
 * 組件掛載時的初始化
 * 載入真實台南數據並設定初始狀態
 */
onMounted(async () => {
  console.log('🚀 DataView 組件已掛載，開始載入台南數據...')
  
  try {
    // 🔥 載入真實台南數據（和 App.vue 使用相同的函數）
    const { loadTainanData } = await import('../utils/dataProcessor.js')
    const tainanData = await loadTainanData()
    
    console.log('📊 台南數據結構:', tainanData)
    
    // 存入 dataStore - 使用轉換後的 GeoJSON 作為主要資料
    dataStore.setRawData('geojson', tainanData.rawGeoJSON, {
      source: 'taiwan_data',
      description: '台南市原始 GeoJSON 資料（TWD97）',
      coordinateSystem: 'TWD97',
      features: tainanData.rawGeoJSON.features.length,
      merged: false
    })
    
    // 存入合併後的 GeoJSON（TWD97）
    dataStore.setProcessedData('geojson', tainanData.mergedGeoJSON, {
      source: 'merged_taiwan_data',
      description: '台南市合併資料（TWD97 + Excel）',
      coordinateSystem: 'TWD97',
      features: tainanData.mergedGeoJSON.features.length,
      merged: true
    })
    
    // 存入轉換後的 GeoJSON（WGS84）- 用於地圖顯示
    if (tainanData.convertedGeoJSON) {
      dataStore.setProcessedData('geojson_wgs84', tainanData.convertedGeoJSON, {
        source: 'converted_taiwan_data',
        description: '台南市資料（TWD97 → WGS84 轉換）',
        coordinateSystem: 'WGS84',
        features: tainanData.convertedGeoJSON.features.length,
        transformation: 'TWD97 → WGS84',
        merged: true
      })
    }
    
    // 存入 Excel 資料
    if (tainanData.excelData && tainanData.excelData.length > 0) {
      dataStore.setRawData('excel', tainanData.excelData, {
        source: 'taiwan_dengue_data',
        description: '台南市登革熱 Excel 資料',
        rows: tainanData.excelData.length
      })
    }
    
    // 存入表格資料
    if (tainanData.tableData && tainanData.tableData.length > 0) {
      dataStore.setProcessedData('spatial', tainanData.tableData, {
        source: 'merged_taiwan_data',
        description: '合併後的空間分析資料',
        records: tainanData.tableData.length
      })
    }
    
    // 自動選擇第一個資料類型
    selectedDataType.value = 'geojson'
    
    console.log('✅ 台南數據載入完成，DataView 應該可以顯示內容了')
    console.log('📋 載入的資料類型:')
    console.log(`   - 原始 GeoJSON (TWD97): ${tainanData.rawGeoJSON?.features?.length || 0} 個要素`)
    console.log(`   - 合併 GeoJSON (TWD97): ${tainanData.mergedGeoJSON?.features?.length || 0} 個要素`)
    console.log(`   - 轉換 GeoJSON (WGS84): ${tainanData.convertedGeoJSON?.features?.length || 0} 個要素`)
    console.log(`   - Excel: ${tainanData.excelData?.length || 0} 筆記錄`)
    console.log(`   - 表格: ${tainanData.tableData?.length || 0} 筆記錄`)
    
  } catch (error) {
    console.error('❌ 載入台南數據失敗:', error)
    
    // 如果載入失敗，使用後備的測試資料
    try {
      console.log('🔄 嘗試載入測試資料作為後備...')
      const { loadTestData } = await import('../utils/dataProcessor.js')
      const testData = await loadTestData()
      
      dataStore.setRawData('geojson', testData.mergedGeoJSON, {
        source: 'fallback_test_data',
        description: '後備測試資料（合併 TWD97）',
        coordinateSystem: 'TWD97',
        features: testData.mergedGeoJSON.features.length,
        merged: true
      })
      
      if (testData.convertedGeoJSON) {
        dataStore.setProcessedData('geojson', testData.convertedGeoJSON, {
          source: 'fallback_converted_data',
          description: '後備測試資料（TWD97 → WGS84）',
          coordinateSystem: 'WGS84',
          features: testData.convertedGeoJSON.features.length,
          transformation: 'TWD97 → WGS84'
        })
      }
      
      selectedDataType.value = 'geojson'
      console.log('✅ 使用後備測試資料')
      
    } catch (fallbackError) {
      console.error('❌ 後備測試資料也載入失敗:', fallbackError)
      
      // 最後的後備：建立最基本的測試資料
      const fallbackData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              name: "測試區域",
              count: 10,
              CODE2: "TEST01"
            },
            geometry: {
              type: "Point",
              coordinates: [120.2, 23.0]
            }
          }
        ]
      }
      
      dataStore.setRawData('geojson', fallbackData, {
        source: 'emergency_fallback',
        description: '緊急後備測試資料'
      })
      
      selectedDataType.value = 'geojson'
      console.log('✅ 使用緊急後備測試資料')
    }
  }
})
</script>

<style scoped>
/* =======================================================================
   DataView 元件樣式
   ======================================================================= */

/* JSON 容器樣式 */
.json-container {
  background: #f8f9fa;
  border-radius: 0.375rem;
  max-height: 70vh;
  overflow: auto;
}

/* JSON 預格式化文字樣式 */
.json-pre {
  margin: 0;
  padding: 1rem;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* JSON 語法高亮樣式 */
.json-code :deep(.json-string) {
  color: #22863a; /* 字串：綠色 */
}

.json-code :deep(.json-number) {
  color: #005cc5; /* 數字：藍色 */
}

.json-code :deep(.json-boolean) {
  color: #d73a49; /* 布林值：紅色 */
}

.json-code :deep(.json-null) {
  color: #6f42c1; /* null：紫色 */
}

/* 樹狀檢視容器樣式 */
.tree-container {
  background: #f8f9fa;
  border-radius: 0.375rem;
  padding: 1rem;
  max-height: 70vh;
  overflow: auto;
}

/* 表格容器樣式 */
.table-container {
  max-height: 70vh;
  overflow: auto;
}

/* 列表項目懸停效果 */
.list-group-item:hover {
  background-color: #f8f9fa;
}

/* 活躍列表項目樣式 */
.list-group-item.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

/* 標籤樣式 */
.badge {
  font-size: 0.75rem;
}

/* 響應式設計：手機版樣式 */
@media (max-width: 767.98px) {
  .col-lg-3, .col-lg-9 {
    margin-bottom: 1rem;
  }
  
  .json-container, .tree-container, .table-container {
    max-height: 50vh;
  }
}
</style> 