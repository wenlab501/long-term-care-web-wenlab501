<template>
  <!-- 🎛️ 左側控制面板 - 簡化版本，減少卡片使用，節省空間 -->
  <div class="bg-light border-end h-100 d-flex flex-column" style="overflow: hidden;">
    
    <!-- 📋 面板標題區域 (Panel Header Section) -->
    <div class="p-3" style="min-width: 0;">
      <h1 class="my-font-size-xl" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
        <div class="d-flex flex-column align-items-center justify-content-center m-3">
          <div class="rounded-circle my-bg-color-gray-300 p-4"></div>
          <div class="my-font-size-lg my-letter-spacing-lg mt-3">登革熱空間分析</div>
        </div>
      </h1>
    </div>

    <!-- 🎛️ 主控制區域 (Main Control Area) - 使用緊湊樣式 -->
    <div class="flex-grow-1 overflow-auto p-3" style="min-width: 0;">
      
      <!-- 圖層控制卡片 -->
      <div class="mb-3">
        <h6 class="text-muted small text-uppercase mb-2">圖層控制</h6>
        <div class="d-grid gap-2">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="showTainanLayer"
              @change="handleLayerToggle($event.target.checked)"
            >
            <label class="form-check-label">台南市行政區</label>
          </div>
        </div>
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
import { ref, toRaw } from 'vue'

export default {
  name: 'LeftPanel',
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的數據和狀態
   */
  props: {
    isLoadingData: { type: Boolean, default: false, required: true }, // 數據載入狀態 
    showTainanLayer: { type: Boolean, default: false, required: true }, // 台南圖層顯示狀態
    
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
    },
    
    /** 🗺️ 地圖縮放級別 */
    zoomLevel: {
      type: Number,
      default: 10,
      required: true
    },
    
    /** 📈 活躍標記數量 */
    activeMarkers: {
      type: Number,
      default: 0,
      required: true
    },
    mergedTableData: {
      type: Array,
      default: () => []
    },
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
    'files-uploaded',             // 檔案上傳事件
    'update:zoomLevel',            // 更新地圖縮放級別
    'update:activeMarkers',        // 更新活躍標記數量
    'fit-map-to-data',
    'switch-to-dashboard',
    'load-data'
  ],

  /**
   * 📊 組件數據設定 (Component Data)
   */
  setup(props, { emit }) {
    // 拖曳上傳相關狀態
    const isDragOver = ref(false)
    const uploadedFiles = ref([])
    const fileInput = ref(null)
    
    // 分析方法選擇
    const analysisMethods = ref([
      { text: '空間自相關 (Moran\'s I)', value: 'morans_i' },
      { text: '點模式分析 (Nearest Neighbor)', value: 'point_pattern' },
      { text: '核密度分析 (Kernel Density)', value: 'kernel_density' },
      { text: '熱點分析 (Getis-Ord Gi*)', value: 'hotspot_analysis' },
      { text: '地理加權回歸 (GWR)', value: 'gwr' }
    ]);
    const selectedAnalysisMethod = ref( (analysisMethods.value && analysisMethods.value.length > 0) ? analysisMethods.value[0] : null );

    // Added: Console logging for debugging
    console.log('[LeftPanel setup] analysisMethods:', JSON.stringify(toRaw(analysisMethods.value)));
    console.log('[LeftPanel setup] selectedAnalysisMethod:', JSON.stringify(toRaw(selectedAnalysisMethod.value)));

    const selectAnalysisMethod = (method) => {
      selectedAnalysisMethod.value = method;
      console.log('Selected analysis method:', method.value);
      // Potentially emit an event if the parent needs to know immediately
      // emit('analysis-method-selected', method.value);
    };
    
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
     * 🎯 取得檔案類型標籤
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

    const handleLayerToggle = (checked) => {
      if (checked) {
        // 當圖層打開時，觸發載入數據事件
        emit('load-data')
      }
      // 更新圖層顯示狀態
      emit('update:showTainanLayer', checked)
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
      removeFile,
      // 分析方法
      analysisMethods,
      selectedAnalysisMethod,
      selectAnalysisMethod,
      handleLayerToggle
    }
  },
  
  /**
   * 🔧 組件方法定義 (Component Methods)
   */
  methods: {
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
 * 主要使用Bootstrap樣式，僅保留必要的自定義樣式
 * 優先使用Bootstrap utility classes而非自定義CSS
 */

/* 📋 面板基礎樣式 - 必要的高度設定 */
.bg-light {
  height: 100vh; /* 垂直滿版 - 必須保留此設定 */
}

/* 📝 自定義字體大小類別 - 與CSS變數系統整合 */
.my-font-size-xl {
  font-size: var(--my-font-size-xl);
}

/* 📁 拖曳上傳區域樣式 - Bootstrap無法提供的互動效果 */
.my-drag-upload-area {
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 80px; /* 設定固定最小高度，確保拖放時高度一致 */
  padding: 1rem; /* 設定固定內距 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.my-drag-upload-area:hover {
  background-color: var(--bs-light) !important;
  border-color: var(--bs-primary) !important;
}

.my-drag-upload-area.border-primary {
  background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
  min-height: 80px; /* 拖放時保持相同高度 */
}

/* 📊 狀態指示器顏色 - 與Bootstrap主題整合 */
.text-warning {
  color: var(--bs-warning) !important;
}

.text-success {
  color: var(--bs-success) !important;
}

/* 📱 響應式設計 - 使用Bootstrap斷點 */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }
  
  .list-group-item {
    padding: 0.75rem;
  }
}

/* 
================================================================================
🗑️ 以下是未使用的CSS樣式 (可以安全移除，但保留備查)
================================================================================

未使用的樣式包括：
1. .my-btn - 已改用Bootstrap按鈕類別
2. .form-select, .form-check-input 自定義樣式 - Bootstrap預設樣式已足夠
3. .my-card - 已改用Bootstrap .card
4. .my-uploaded-file-item - 已改用Bootstrap .list-group-item
5. 大部分邊距和間距設定 - 已改用Bootstrap spacing utilities (p-*, m-*, etc.)
6. 顏色相關自定義變數 - 已改用Bootstrap顏色系統

保留的必要樣式：
1. .bg-light 的 height: 100vh - 確保面板垂直滿版
2. .my-font-size-xl - 自定義字體大小
3. .my-drag-upload-area 相關樣式 - 互動效果
4. 狀態指示器顏色 - 保持一致性

================================================================================
*/
</style> 