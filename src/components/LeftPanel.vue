<template>
  <div class="bg-light border-end flex-grow-1 my-custom-scroll">
    
    <!-- 📋 面板標題區域 (Panel Header Section) -->
    <h1 class="p-3">
      <div class="my-font-size-xl">
        登革熱空間分析
      </div>
    </h1>

    <!-- 📥 拖曳上傳區域 (Drag Upload Area) -->
    <div class="mb-4">
      <div 
        class="my-drag-upload-area"
        :class="{ 'dragover': isDragOver }"
        @drop="handleDrop"
        @dragover.prevent="handleDragOver"
        @dragenter.prevent="handleDragEnter"
        @dragleave="handleDragLeave"
        @click="triggerFileInput">
        
        <div class="my-drag-upload-icon">
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        
        <div class="my-drag-upload-text">
          拖曳檔案到這裡或點擊上傳
        </div>
        
        <div class="my-drag-upload-subtext">
          支援 GeoJSON、CSV、Excel 檔案格式
        </div>
        
        <!-- 隱藏的檔案輸入框 -->
        <input
          ref="fileInput"
          type="file"
          style="display: none"
          accept=".geojson,.json,.csv,.xlsx,.xls"
          multiple
          @change="handleFileSelect">
      </div>
      
      <!-- 上傳檔案列表 -->
      <div v-if="uploadedFiles.length > 0" class="mb-3">
        <h6 class="text-secondary mb-2">
          <i class="fas fa-list"></i> 已上傳檔案
        </h6>
        <div v-for="file in uploadedFiles" :key="file.id" class="my-uploaded-file-item">
          <div class="d-flex align-items-center justify-content-between">
            <div class="flex-grow-1">
              <div class="fw-medium">{{ file.name }}</div>
              <small class="text-muted">{{ formatFileSize(file.size) }} • {{ file.type }}</small>
            </div>
            <div class="ms-2">
              <button 
                class="btn btn-sm btn-outline-danger" 
                @click="removeFile(file.id)"
                title="移除檔案">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 📥 數據載入區域 (Data Loading Section) -->
    <div class="mb-4">
      <button 
        class="my-btn btn-success mb-2" 
        @click="$emit('load-tainan-data')" 
        :disabled="isLoadingData">
        <i class="fas fa-download"></i>
        {{ isLoadingData ? '載入中...' : '載入台南市數據' }}
      </button>
      <small class="text-muted d-block">
        載入GeoJSON和Excel數據進行合併
      </small>
    </div>

    <!-- 🔬 分析控制區域 (Analysis Control Section) -->
    <div class="mb-4">
      <button 
        class="my-btn my-btn-analyze mb-2" 
        @click="$emit('start-analysis')" 
        :disabled="!canStartAnalysis">
        <i class="fas fa-play"></i>
        開始分析
      </button>
      <small class="text-muted d-block">
        對載入的數據進行空間自相關分析
      </small>
    </div>
    
    <!-- 🗺️ 圖層控制區域 (Layer Control Section) -->
    <div class="mb-3">
      <label class="form-label fw-semibold">
        <i class="fas fa-layer-group me-1"></i>
        圖層控制
      </label>
      <!-- 台南市區域圖層：主要的分析圖層 -->
      <div class="form-check">
        <input 
          class="form-check-input" 
          type="checkbox" 
          id="tainan-layer" 
          :checked="showTainanLayer" 
          @change="handleTainanLayerToggle">
        <label class="form-check-label" for="tainan-layer">
          <i class="fas fa-map me-1"></i>
          台南市區域
        </label>
      </div>
      <small class="text-muted d-block mt-1">
        顯示/隱藏台南市行政區域邊界和數據視覺化
      </small>
    </div>
    
    <!-- 🔍 篩選條件區域 (Filter Control Section) -->
    <div class="mb-3">
      <label class="form-label fw-semibold">
        <i class="fas fa-filter me-1"></i>
        數據篩選
      </label>
      <select 
        class="form-select" 
        :value="selectedFilter" 
        @change="handleFilterChange">
        <option value="">全部數據</option>
        <option value="high">高值區域 (>平均值)</option>
        <option value="medium">中值區域 (平均值±0.5標準差)</option>
        <option value="low">低值區域 (&lt;平均值)</option>
        <option value="outliers">異常值區域</option>
      </select>
      <small class="text-muted d-block mt-1">
        根據數據值範圍篩選顯示的區域
      </small>
    </div>
    
    <!-- 📊 狀態信息區域 (Status Information Section) -->
    <div class="my-card bg-theme-secondary border-theme mt-4">
      <div class="card-body p-3">
        <h6 class="card-title text-primary mb-2">
          <i class="fas fa-info-circle"></i> 系統狀態
        </h6>
        
        <!-- 面板寬度資訊 -->
        <small class="text-muted d-block">
          <i class="fas fa-arrows-alt-h me-1"></i>
          面板寬度: {{ leftPanelWidth.toFixed(1) }}%
        </small>
        
        <!-- 台南數據狀態 -->
        <small class="text-muted d-block" v-if="tainanDataSummary">
          <i class="fas fa-database me-1"></i>
          台南數據: {{ tainanDataSummary.mergedCount }}/{{ tainanDataSummary.totalFeatures }} 
          ({{ tainanDataSummary.mergeRate }}%)
        </small>
        
        <!-- 分析項目計數 -->
        <small class="text-muted d-block">
          <i class="fas fa-chart-line me-1"></i>
          分析項目: {{ analysisList.length }} 個
        </small>
        
        <!-- 數據載入狀態 -->
        <small class="text-muted d-block">
          <i class="fas fa-circle me-1" :class="getDataStatusClass()"></i>
          數據狀態: {{ getDataStatusText() }}
        </small>
        
        <!-- 上傳檔案狀態 -->
        <small class="text-muted d-block" v-if="uploadedFiles.length > 0">
          <i class="fas fa-file me-1"></i>
          上傳檔案: {{ uploadedFiles.length }} 個
        </small>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 🎛️ LeftPanel.vue - 左側控制面板組件
 * 
 * 功能說明：
 * 1. 📥 提供台南市數據載入功能
 * 2. 📁 提供拖曳上傳檔案功能
 * 3. 🔬 提供空間分析啟動控制
 * 4. 🗺️ 提供圖層顯示控制
 * 5. 🔍 提供數據篩選功能
 * 6. 📊 顯示系統狀態資訊
 */
import { ref } from 'vue'

export default {
  name: 'LeftPanel',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的數據和狀態
   */
  props: {
    /** 📥 數據載入狀態 */
    isLoadingData: {
      type: Boolean,
      default: false,
      required: true
    },
    
    /** 🔬 是否可以開始分析 */
    canStartAnalysis: {
      type: Boolean,
      default: false,
      required: true
    },
    
    /** 🗺️ 台南圖層顯示狀態 */
    showTainanLayer: {
      type: Boolean,
      default: false,
      required: true
    },
    
    /** 🔍 當前選擇的篩選條件 */
    selectedFilter: {
      type: String,
      default: '',
      required: true
    },
    
    /** 📏 左側面板寬度百分比 */
    leftPanelWidth: {
      type: Number,
      default: 20,
      required: true
    },
    
    /** 📊 台南數據摘要資訊 */
    tainanDataSummary: {
      type: Object,
      default: null
    },
    
    /** 📋 分析項目列表 */
    analysisList: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   * 向父組件發送的事件
   */
  emits: [
    'load-tainan-data',      // 載入台南數據事件
    'start-analysis',        // 開始分析事件
    'update:showTainanLayer',     // 更新台南圖層顯示狀態
    'update:selectedFilter',      // 更新篩選條件
    'files-uploaded'             // 檔案上傳事件
  ],

  /**
   * 📊 組件數據設定 (Component Data)
   */
  setup(props, { emit }) {
    // 拖曳上傳相關狀態
    const isDragOver = ref(false)
    const uploadedFiles = ref([])
    const fileInput = ref(null)
    
    /**
     * 🎯 觸發檔案選擇器
     */
    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    
    /**
     * 📁 處理檔案選擇
     * @param {Event} event - 檔案選擇事件
     */
    const handleFileSelect = (event) => {
      const files = event.target.files
      if (files.length > 0) {
        processFiles(Array.from(files))
      }
    }
    
    /**
     * 🎯 處理拖曳進入
     * @param {DragEvent} event - 拖曳事件
     */
    const handleDragEnter = (event) => {
      event.preventDefault()
      isDragOver.value = true
    }
    
    /**
     * 🎯 處理拖曳覆蓋
     * @param {DragEvent} event - 拖曳事件
     */
    const handleDragOver = (event) => {
      event.preventDefault()
      isDragOver.value = true
    }
    
    /**
     * 🎯 處理拖曳離開
     * @param {DragEvent} event - 拖曳事件
     */
    const handleDragLeave = (event) => {
      event.preventDefault()
      // 檢查是否真的離開了拖曳區域
      if (!event.currentTarget.contains(event.relatedTarget)) {
        isDragOver.value = false
      }
    }
    
    /**
     * 🎯 處理檔案放置
     * @param {DragEvent} event - 放置事件
     */
    const handleDrop = (event) => {
      event.preventDefault()
      isDragOver.value = false
      
      const files = event.dataTransfer.files
      if (files.length > 0) {
        processFiles(Array.from(files))
      }
    }
    
    /**
     * 📁 處理上傳的檔案
     * @param {File[]} files - 檔案列表
     */
    const processFiles = (files) => {
      const validTypes = [
        'application/json',
        'application/geo+json',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      
      const validExtensions = ['.json', '.geojson', '.csv', '.xls', '.xlsx']
      
      files.forEach(file => {
        // 檢查檔案類型
        const isValidType = validTypes.includes(file.type) || 
                           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        
        if (isValidType) {
          const fileInfo = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: getFileTypeLabel(file),
            file: file,
            uploadedAt: new Date()
          }
          
          uploadedFiles.value.push(fileInfo)
          
          // 發送檔案上傳事件給父組件
          emit('files-uploaded', fileInfo)
          
          console.log('📁 檔案上傳成功:', fileInfo.name)
        } else {
          alert(`不支援的檔案類型: ${file.name}\n支援的格式: GeoJSON, JSON, CSV, Excel`)
        }
      })
      
      // 清空檔案輸入框
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
    
    /**
     * 🏷️ 取得檔案類型標籤
     * @param {File} file - 檔案物件
     * @returns {string} 檔案類型標籤
     */
    const getFileTypeLabel = (file) => {
      const name = file.name.toLowerCase()
      if (name.endsWith('.geojson') || name.endsWith('.json')) {
        return 'GeoJSON'
      } else if (name.endsWith('.csv')) {
        return 'CSV'
      } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        return 'Excel'
      } else {
        return '未知'
      }
    }
    
    /**
     * 📏 格式化檔案大小
     * @param {number} bytes - 檔案大小（位元組）
     * @returns {string} 格式化的檔案大小
     */
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    /**
     * 🗑️ 移除檔案
     * @param {number} fileId - 檔案ID
     */
    const removeFile = (fileId) => {
      const index = uploadedFiles.value.findIndex(file => file.id === fileId)
      if (index > -1) {
        const removedFile = uploadedFiles.value.splice(index, 1)[0]
        console.log('🗑️ 檔案已移除:', removedFile.name)
      }
    }
    
    return {
      // 拖曳上傳相關
      isDragOver,
      uploadedFiles,
      fileInput,
      triggerFileInput,
      handleFileSelect,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      formatFileSize,
      removeFile
    }
  },
  
  /**
   * 🔧 組件方法定義 (Component Methods)
   */
  methods: {
    /**
     * 🗺️ 處理台南圖層顯示切換
     * @param {Event} event - 核取方塊變更事件
     */
    handleTainanLayerToggle(event) {
      const isVisible = event.target.checked
      console.log('🗺️ 台南圖層顯示狀態:', isVisible)
      this.$emit('update:showTainanLayer', isVisible)
    },
    
    /**
     * 🔍 處理篩選條件變更
     * @param {Event} event - 選擇框變更事件
     */
    handleFilterChange(event) {
      const newFilter = event.target.value
      console.log('🔍 篩選條件變更:', newFilter)
      this.$emit('update:selectedFilter', newFilter)
    },
    
    /**
     * 📊 取得數據狀態的CSS類別
     * @returns {string} 狀態指示燈的CSS類別
     */
    getDataStatusClass() {
      if (this.isLoadingData) {
        return 'text-warning'  // 載入中 - 黃色
      } else if (this.tainanDataSummary) {
        return 'text-success'  // 已載入 - 綠色
      } else {
        return 'text-secondary'  // 未載入 - 灰色
      }
    },
    
    /**
     * 📊 取得數據狀態的文字描述
     * @returns {string} 數據狀態的文字說明
     */
    getDataStatusText() {
      if (this.isLoadingData) {
        return '載入中...'
      } else if (this.tainanDataSummary) {
        return `已載入 (${this.tainanDataSummary.mergedCount} 個區域)`
      } else {
        return '未載入'
      }
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 左側面板樣式 (Left Panel Styles)
 * 
 * 使用新的主題色彩變數系統
 */

/* 📝 標題樣式 */
.my-title-xl {
  font-size: var(--my-font-size-xl);
}


/* 📋 面板基礎樣式 */
.bg-light {
  background-color: var(--my-panel-bg) !important;
  height: 100vh; /* 垂直滿版 */
}

.border-end {
  border-color: var(--my-panel-border) !important;
}

/* 🔘 按鈕樣式增強 */
.my-btn {
  font-size: var(--my-font-size-btn);
  font-weight: var(--my-font-weight-medium);
  border-radius: var(--my-radius-base);
  transition: var(--my-transition-base);
}

.my-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 📝 表單控制項樣式 */
.form-select,
.form-check-input {
  font-size: var(--my-font-size-input);
  border-color: var(--my-input-border);
  transition: var(--my-transition-base);
}

.form-select:focus,
.form-check-input:focus {
  border-color: var(--my-input-focus);
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

/* 📇 卡片樣式 */
.my-card {
  border-radius: var(--my-radius-lg);
  box-shadow: var(--my-shadow-sm);
  transition: var(--my-transition-base);
}

.my-card:hover {
  box-shadow: var(--my-shadow-md);
}

/* 📁 上傳檔案項目樣式 */
.my-uploaded-file-item {
  background-color: var(--my-bg-light);
  border: 1px solid var(--my-border-light);
  border-radius: var(--my-radius-base);
  padding: var(--my-spacing-3);
  margin-bottom: var(--my-spacing-2);
  transition: var(--my-transition-base);
}

.my-uploaded-file-item:hover {
  background-color: var(--my-bg-secondary);
  border-color: var(--my-primary-color);
}

.my-uploaded-file-item .fw-medium {
  font-weight: var(--my-font-weight-medium);
  color: var(--my-text-primary);
  font-size: var(--my-font-size-sm);
}

.my-uploaded-file-item small {
  color: var(--my-text-muted);
  font-size: var(--my-font-size-xs);
}

.my-uploaded-file-item .btn-outline-danger {
  font-size: var(--my-font-size-xs);
  padding: var(--my-spacing-1) var(--my-spacing-2);
  border-radius: var(--my-radius-sm);
}

/* 📊 狀態指示器 */
.text-warning {
  color: var(--my-warning-color) !important;
}

.text-success {
  color: var(--my-success-color) !important;
}

.text-secondary {
  color: var(--my-text-secondary) !important;
}

/* 📱 響應式設計 */
@media (max-width: 768px) {
  .my-uploaded-file-item {
    padding: var(--my-spacing-2);
  }
  
  .my-uploaded-file-item .fw-medium {
    font-size: var(--my-font-size-xs);
  }
  
  .my-uploaded-file-item small {
    font-size: 0.7rem;
  }
}
</style> 