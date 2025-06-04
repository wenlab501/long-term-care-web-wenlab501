<template>
  <!-- =======================================================================
       DataView.vue - 資料檢視頁面
       =======================================================================
       功能：自動顯示 Pinia Store 中的所有 JSON 資料
       支援：格式化 JSON、表格檢視、地圖檢視、座標轉換
       ======================================================================= -->
  <div class="container-fluid px-0 h-100">
    <div class="row h-100 g-0">
      
      <!-- =================================================================
           左側資料總覽側邊欄
           ================================================================= -->
      <div class="col-12 col-lg-3">
        <div class="my-card h-100">
          <div class="my-card-header">
            <h5 class="mb-0">
              <i class="fas fa-database me-2"></i>Pinia 資料總覽
            </h5>
          </div>
          
          <div class="card-body p-0">
            <!-- 資料統計 -->
            <div class="p-3 bg-light">
              <div class="row g-2">
                <div class="col-6 text-center">
                  <div class="my-stats-value">{{ totalDataTypes }}</div>
                  <div class="my-stats-label">資料類型</div>
                </div>
                <div class="col-6 text-center">
                  <div class="my-stats-value">{{ totalItems }}</div>
                  <div class="my-stats-label">總項目</div>
                </div>
              </div>
            </div>

            <!-- 資料類型列表 -->
            <div class="list-group list-group-flush">
              <template v-for="(info, key) in allStoreData" :key="key">
                <button 
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  :class="{ 'active': selectedDataType === key }"
                  @click="selectDataType(key)"
                  v-if="info.hasData"
                >
                  <div class="d-flex align-items-center">
                    <i :class="info.icon" class="me-2"></i>
                    <span>{{ info.label }}</span>
                  </div>
                  <span class="my-badge my-badge-count">{{ info.count }}</span>
                </button>
              </template>
            </div>

            <!-- 無資料提示 -->
            <div v-if="totalDataTypes === 0" class="my-empty-state">
              <div class="my-empty-state-icon">
                <i class="fas fa-inbox"></i>
              </div>
              <div class="my-empty-state-title">沒有資料</div>
              <div class="my-empty-state-text">請先載入一些資料檔案</div>
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================================
           右側資料詳細內容區域
           ================================================================= -->
      <div class="col-12 col-lg-9">
        <div class="my-card h-100">
          <div class="my-card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i :class="selectedDataInfo?.icon || 'fas fa-file-code'" class="me-2"></i>
              {{ selectedDataInfo?.label || '選擇資料類型' }}
            </h5>
            
            <!-- 工具列 -->
            <div class="btn-group" v-if="selectedData">
              <button 
                class="my-btn btn-outline-primary btn-sm"
                @click="copyToClipboard"
                title="複製JSON"
              >
                <i class="fas fa-copy"></i>
              </button>
              <button 
                class="my-btn btn-outline-secondary btn-sm"
                @click="downloadJSON"
                title="下載JSON"
              >
                <i class="fas fa-download"></i>
              </button>
              <button 
                class="my-btn btn-outline-success btn-sm"
                @click="refreshData"
                title="重新整理"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
          
          <div class="card-body p-0 h-100">
            <!-- 未選擇資料時的提示 -->
            <div v-if="!selectedData" class="my-empty-state h-100 d-flex flex-column justify-content-center">
              <div class="my-empty-state-icon">
                <i class="fas fa-mouse-pointer"></i>
              </div>
              <div class="my-empty-state-title">請選擇資料類型</div>
              <div class="my-empty-state-text">從左側選擇要檢視的資料類型</div>
            </div>

            <!-- JSON 資料顯示 -->
            <div v-else class="h-100 d-flex flex-column">
              <!-- 資料摘要 -->
              <div class="bg-light border-bottom p-3" v-if="selectedDataInfo">
                <div class="row g-3">
                  <div class="col-md-3">
                    <small class="text-muted">資料類型</small>
                    <div class="fw-bold">{{ selectedDataInfo.label }}</div>
                  </div>
                  <div class="col-md-3" v-if="selectedDataInfo.timestamp">
                    <small class="text-muted">更新時間</small>
                    <div class="fw-bold">{{ formatTime(selectedDataInfo.timestamp) }}</div>
                  </div>
                  <div class="col-md-3">
                    <small class="text-muted">項目數量</small>
                    <div class="fw-bold">{{ selectedDataInfo.count }}</div>
                  </div>
                  <div class="col-md-3">
                    <small class="text-muted">資料大小</small>
                    <div class="fw-bold">{{ formatSize(selectedDataInfo.size) }}</div>
                  </div>
                </div>
              </div>

              <!-- JSON 內容 -->
              <div class="flex-grow-1 p-3 my-custom-scroll">
                <pre class="bg-dark text-light p-3 rounded h-100 mb-0" style="font-size: 12px; line-height: 1.4;"><code>{{ formattedJSON }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/dataStore'

export default {
  name: 'DataView',
  
  setup() {
    const dataStore = useDataStore()
    const selectedDataType = ref('')
    
    // 計算所有store中的資料
    const allStoreData = computed(() => {
      const storeData = {}
      
      // 原始資料
      if (dataStore.rawData) {
        Object.keys(dataStore.rawData).forEach(key => {
          if (key !== 'metadata' && dataStore.rawData[key]) {
            const data = dataStore.rawData[key]
            const hasData = data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
            
            storeData[`raw_${key}`] = {
              label: `原始資料 - ${key.toUpperCase()}`,
              icon: getDataIcon(key),
              hasData,
              count: getDataCount(data),
              size: getDataSize(data),
              timestamp: dataStore.rawData.metadata?.[key]?.timestamp,
              data
            }
          }
        })
      }
      
      // 處理後資料
      if (dataStore.processedData) {
        Object.keys(dataStore.processedData).forEach(key => {
          const data = dataStore.processedData[key]
          const hasData = data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
          
          storeData[`processed_${key}`] = {
            label: `處理資料 - ${key}`,
            icon: 'fas fa-cogs',
            hasData,
            count: getDataCount(data),
            size: getDataSize(data),
            timestamp: new Date().toISOString(),
            data
          }
        })
      }
      
      // 視覺化設定
      storeData.visualizationSettings = {
        label: '視覺化設定',
        icon: 'fas fa-palette',
        hasData: Boolean(dataStore.visualizationSettings),
        count: dataStore.visualizationSettings ? Object.keys(dataStore.visualizationSettings).length : 0,
        size: getDataSize(dataStore.visualizationSettings),
        timestamp: new Date().toISOString(),
        data: dataStore.visualizationSettings
      }
      
      // 分析參數
      storeData.analysisParameters = {
        label: '分析參數',
        icon: 'fas fa-sliders-h',
        hasData: Boolean(dataStore.analysisParameters),
        count: dataStore.analysisParameters ? Object.keys(dataStore.analysisParameters).length : 0,
        size: getDataSize(dataStore.analysisParameters),
        timestamp: new Date().toISOString(),
        data: dataStore.analysisParameters
      }
      
      return storeData
    })
    
    // 總計資料
    const totalDataTypes = computed(() => {
      return Object.values(allStoreData.value).filter(info => info.hasData).length
    })
    
    const totalItems = computed(() => {
      return Object.values(allStoreData.value)
        .filter(info => info.hasData)
        .reduce((total, info) => total + info.count, 0)
    })
    
    // 選中的資料
    const selectedData = computed(() => {
      return selectedDataType.value ? allStoreData.value[selectedDataType.value]?.data : null
    })
    
    const selectedDataInfo = computed(() => {
      return selectedDataType.value ? allStoreData.value[selectedDataType.value] : null
    })
    
    // 格式化 JSON
    const formattedJSON = computed(() => {
      if (!selectedData.value) return ''
      try {
        return JSON.stringify(selectedData.value, null, 2)
      } catch (error) {
        return `JSON 格式化錯誤: ${error.message}`
      }
    })
    
    // 工具函數
    const getDataIcon = (key) => {
      const iconMap = {
        geojson: 'fas fa-map',
        csvData: 'fas fa-table',
        excelData: 'fas fa-file-excel',
        spatialData: 'fas fa-globe',
        transformedGeojson: 'fas fa-map-marked-alt',
        spatialAnalysisResults: 'fas fa-chart-line',
        statisticsResults: 'fas fa-calculator',
        clusteringResults: 'fas fa-project-diagram',
        heatmapData: 'fas fa-fire',
        boundaryData: 'fas fa-border-style'
      }
      return iconMap[key] || 'fas fa-file-code'
    }
    
    const getDataCount = (data) => {
      if (!data) return 0
      if (Array.isArray(data)) return data.length
      if (typeof data === 'object') {
        if (data.features && Array.isArray(data.features)) return data.features.length
        return Object.keys(data).length
      }
      return 1
    }
    
    const getDataSize = (data) => {
      if (!data) return 0
      try {
        return new Blob([JSON.stringify(data)]).size
      } catch {
        return 0
      }
    }
    
    const formatTime = (timestamp) => {
      if (!timestamp) return '--'
      return new Date(timestamp).toLocaleString('zh-TW')
    }
    
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    // 方法
    const selectDataType = (key) => {
      selectedDataType.value = key
    }
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(formattedJSON.value)
        alert('JSON 已複製到剪貼簿')
      } catch (error) {
        console.error('複製失敗:', error)
        alert('複製失敗')
      }
    }
    
    const downloadJSON = () => {
      if (!selectedData.value || !selectedDataInfo.value) return
      
      const dataStr = JSON.stringify(selectedData.value, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${selectedDataInfo.value.label.replace(/\s+/g, '_')}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
    
    const refreshData = () => {
      // 觸發重新計算
      selectedDataType.value = ''
      setTimeout(() => {
        if (Object.keys(allStoreData.value).length > 0) {
          const firstKey = Object.keys(allStoreData.value).find(key => allStoreData.value[key].hasData)
          if (firstKey) selectedDataType.value = firstKey
        }
      }, 100)
    }
    
    // 初始化
    onMounted(() => {
      // 自動選擇第一個有資料的類型
      const firstKey = Object.keys(allStoreData.value).find(key => allStoreData.value[key].hasData)
      if (firstKey) {
        selectedDataType.value = firstKey
      }
    })
    
    return {
      selectedDataType,
      allStoreData,
      totalDataTypes,
      totalItems,
      selectedData,
      selectedDataInfo,
      formattedJSON,
      selectDataType,
      copyToClipboard,
      downloadJSON,
      refreshData,
      formatTime,
      formatSize
    }
  }
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Consolas, monospace;
}

code {
  color: #e83e8c;
}

.list-group-item.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
</style> 