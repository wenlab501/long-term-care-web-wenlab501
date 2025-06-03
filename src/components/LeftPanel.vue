<template>
  <div class="bg-light border-end p-3 flex-grow-1 custom-scroll">
    
    <!-- 📋 面板標題區域 (Panel Header Section) -->
    <h5 class="text-primary fw-bold mb-3">
      <i class="fas fa-sliders-h"></i> 左側控制面版
    </h5>
    
    <!-- 📥 數據載入區域 (Data Loading Section) -->
    <div class="mb-4">
      <button 
        class="btn btn-success mb-2" 
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
        class="btn btn-analyze mb-2" 
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
    <div class="card bg-theme-secondary border-theme mt-4">
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
 * 2. 🔬 提供空間分析啟動控制
 * 3. 🎨 提供色票方案選擇（Python matplotlib等）
 * 4. 🗺️ 提供圖層顯示控制
 * 5. 🔍 提供數據篩選功能
 * 6. 📊 顯示系統狀態資訊
 */
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
    'update:selectedFilter'       // 更新篩選條件
  ],
  
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

/* 📋 面板基礎樣式 */
.bg-light {
  background-color: var(--panel-bg) !important;
}

.border-end {
  border-color: var(--panel-border) !important;
}

/* 🔘 按鈕樣式增強 */
.btn {
  font-size: var(--font-size-btn);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-base);
  transition: var(--transition-base);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 📝 表單控制項樣式 */
.form-select,
.form-check-input {
  font-size: var(--font-size-input);
  border-color: var(--input-border);
}

.form-select:focus,
.form-check-input:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

/* 🏷️ 標籤樣式 */
.form-label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

/* 📊 狀態卡片樣式 */
.card {
  background-color: var(--panel-bg);
  border-color: var(--panel-border);
  box-shadow: var(--panel-shadow);
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
}

/* 📝 小字體樣式 */
small {
  font-size: var(--font-size-small);
  line-height: 1.4;
}

.text-muted {
  color: var(--text-muted) !important;
}

/* 🎯 圖示間距 */
.me-1 {
  margin-right: 0.25rem;
}

/* 🎨 狀態指示燈動畫 */
.text-warning {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style> 