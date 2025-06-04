<template>
  <!-- 📊 數據儀表板 - 使用Bootstrap建構現代化儀表板 -->
  <div class="container-fluid h-100 bg-light">
    <div class="row h-100 g-0">
      
      <!-- 📊 左側數據選擇面板 (Data Selection Panel) - 簡潔設計 -->
      <div class="col-lg-3 col-md-4 bg-white border-end shadow-sm">
        <div class="h-100 d-flex flex-column">
          
          <!-- 🏷️ 標題區域 (Header Section) -->
          <div class="p-4 border-bottom bg-primary text-white">
            <h4 class="mb-1 fw-bold">
              <i class="fas fa-database me-2"></i>
              Pinia 資料檢視
            </h4>
            <p class="mb-0 small opacity-75">即時資料狀態監控</p>
          </div>

          <!-- 📈 統計卡片區域 (Statistics Cards) -->
          <div class="p-3 bg-light border-bottom">
            <div class="row g-2">
              <div class="col-6">
                <div class="text-center p-2 bg-white rounded shadow-sm">
                  <div class="fs-4 fw-bold text-primary">{{ totalDataTypes }}</div>
                  <div class="small text-muted">資料類型</div>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center p-2 bg-white rounded shadow-sm">
                  <div class="fs-4 fw-bold text-success">{{ totalItems }}</div>
                  <div class="small text-muted">總項目</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 📋 資料類型清單 (Data Type List) -->
          <div class="flex-grow-1 overflow-auto">
            <div class="list-group list-group-flush" v-if="totalDataTypes > 0">
              <template v-for="(info, key) in allStoreData" :key="key">
                <button 
                  v-if="info.hasData"
                  class="list-group-item list-group-item-action border-0 py-3 px-4"
                  :class="{ 'active': selectedDataType === key }"
                  @click="selectDataType(key)">
                  
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center mb-1">
                        <i :class="info.icon" class="me-2 text-primary"></i>
                        <span class="fw-medium">{{ info.label }}</span>
                      </div>
                      <div class="small text-muted">
                        <i class="fas fa-clock me-1"></i>
                        {{ info.timestamp ? formatTime(info.timestamp) : '未知時間' }}
                      </div>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-primary rounded-pill">{{ info.count }}</span>
                      <div class="small text-muted mt-1">{{ formatSize(info.size) }}</div>
                    </div>
                  </div>
                </button>
              </template>
            </div>

            <!-- 🚫 無資料狀態 (Empty State) -->
            <div v-else class="d-flex flex-column align-items-center justify-content-center h-100 p-4">
              <div class="text-center">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">沒有可用資料</h5>
                <p class="text-muted small mb-0">請先載入一些資料檔案</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 📄 右側資料詳細內容區域 (Data Detail Panel) -->
      <div class="col-lg-9 col-md-8">
        <div class="h-100 d-flex flex-column">
          
          <!-- 🔧 工具列區域 (Toolbar Section) -->
          <div class="p-3 border-bottom bg-white">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i :class="selectedDataInfo?.icon || 'fas fa-file-code'" 
                   class="me-2 text-primary fs-4"></i>
                <div>
                  <h5 class="mb-0 fw-bold">
                    {{ selectedDataInfo?.label || '選擇資料類型' }}
                  </h5>
                  <small class="text-muted">
                    <span v-if="selectedDataInfo">
                      {{ selectedDataInfo.count }} 項目 • {{ formatSize(selectedDataInfo.size) }}
                    </span>
                    <span v-else>從左側選擇要檢視的資料類型</span>
                  </small>
                </div>
              </div>
              
              <!-- 🛠️ 操作按鈕組 (Action Buttons) -->
              <div class="btn-group" v-if="selectedData">
                <button 
                  class="btn btn-outline-primary btn-sm"
                  @click="copyToClipboard"
                  title="複製JSON">
                  <i class="fas fa-copy me-1"></i>複製
                </button>
                <button 
                  class="btn btn-outline-success btn-sm"
                  @click="downloadJSON"
                  title="下載JSON">
                  <i class="fas fa-download me-1"></i>下載
                </button>
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  @click="refreshData"
                  title="重新整理">
                  <i class="fas fa-sync-alt me-1"></i>重新整理
                </button>
              </div>
            </div>
          </div>

          <!-- 📊 內容顯示區域 (Content Display Area) -->
          <div class="flex-grow-1 bg-light">
            
            <!-- 🎯 未選擇資料時的提示 (No Selection State) -->
            <div v-if="!selectedData" 
                 class="h-100 d-flex flex-column align-items-center justify-content-center p-5">
              <div class="text-center">
                <i class="fas fa-mouse-pointer fa-4x text-primary mb-4"></i>
                <h3 class="text-muted mb-3">選擇資料類型</h3>
                <p class="text-muted lead mb-4">從左側面板選擇要檢視的資料類型，即可查看詳細內容</p>
                <div class="alert alert-info border-0 shadow-sm">
                  <i class="fas fa-info-circle me-2"></i>
                  支援 JSON、GeoJSON、表格資料等多種格式的即時預覽
                </div>
              </div>
            </div>

            <!-- 📄 JSON 資料顯示 (JSON Data Display) -->
            <div v-else class="h-100 d-flex flex-column">
              
              <!-- 📊 資料摘要資訊 (Data Summary) -->
              <div class="bg-white border-bottom p-3" v-if="selectedDataInfo">
                <div class="row g-3">
                  <div class="col-md-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded p-2 me-3">
                        <i class="fas fa-tag text-primary"></i>
                      </div>
                      <div>
                        <small class="text-muted text-uppercase fw-medium">資料類型</small>
                        <div class="fw-bold">{{ selectedDataInfo.label }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-3" v-if="selectedDataInfo.timestamp">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded p-2 me-3">
                        <i class="fas fa-clock text-success"></i>
                      </div>
                      <div>
                        <small class="text-muted text-uppercase fw-medium">更新時間</small>
                        <div class="fw-bold">{{ formatTime(selectedDataInfo.timestamp) }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-warning bg-opacity-10 rounded p-2 me-3">
                        <i class="fas fa-list-ol text-warning"></i>
                      </div>
                      <div>
                        <small class="text-muted text-uppercase fw-medium">項目數量</small>
                        <div class="fw-bold">{{ selectedDataInfo.count.toLocaleString() }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-info bg-opacity-10 rounded p-2 me-3">
                        <i class="fas fa-hdd text-info"></i>
                      </div>
                      <div>
                        <small class="text-muted text-uppercase fw-medium">資料大小</small>
                        <div class="fw-bold">{{ formatSize(selectedDataInfo.size) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 📝 JSON 內容顯示區域 (JSON Content Area) -->
              <div class="flex-grow-1 p-3">
                <div class="bg-dark rounded shadow h-100 p-3 overflow-auto">
                  <pre class="text-light mb-0 h-100" style="font-size: 13px; line-height: 1.5; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;"><code>{{ formattedJSON }}</code></pre>
                </div>
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