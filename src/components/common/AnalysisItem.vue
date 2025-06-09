<!-- 📊 AnalysisItem.vue - 分析項目組件 (Analysis Item Component) -->
<!-- 顯示單個空間分析項目的資訊和操作按鈕 -->
<template>
  <!-- 📋 分析項目卡片 (Analysis Item Card) -->
  <!-- 根據選中狀態動態調整樣式 -->
  <div 
    class="analysis-item card mb-2"
    :class="{ 'border-primary': isSelected, 'bg-light': isSelected }"
    @click="$emit('select')"
  >
    <!-- 📊 卡片內容 (Card Body) -->
    <div class="card-body p-3">
      <!-- 📝 分析項目標題 (Analysis Item Title) -->
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h6 class="card-title mb-0 fw-bold">{{ analysis.name }}</h6>
        <!-- 📅 分析日期 (Analysis Date) -->
        <small class="text-muted">{{ formatDate(analysis.createdAt) }}</small>
      </div>
      
      <!-- 📋 分析項目描述 (Analysis Item Description) -->
      <p class="card-text text-muted small mb-2">{{ analysis.description }}</p>
      
      <!-- 📊 分析項目詳細資訊 (Analysis Item Details) -->
      <div class="analysis-details mb-3">
        <!-- 🔬 分析方法 (Analysis Method) -->
        <div class="detail-item">
          <i class="fas fa-microscope me-1 text-primary"></i>
          <span class="fw-medium">方法:</span> {{ analysis.method }}
        </div>
        <!-- 📊 分析狀態 (Analysis Status) -->
        <div class="detail-item">
          <i class="fas fa-info-circle me-1" :class="getStatusColor(analysis.status)"></i>
          <span class="fw-medium">狀態:</span> {{ getStatusText(analysis.status) }}
        </div>
      </div>
      
      <!-- 🔘 操作按鈕群組 (Action Buttons Group) -->
      <div class="btn-group w-100" role="group">
        <!-- 👁️ 查看按鈕 (View Button) -->
        <button 
          type="button" 
          class="btn btn-outline-primary btn-sm"
          @click.stop="$emit('view')"
          title="查看分析結果"
        >
          <i class="fas fa-eye me-1"></i>查看
        </button>
        <!-- 🗑️ 刪除按鈕 (Delete Button) -->
        <button 
          type="button" 
          class="btn btn-outline-danger btn-sm"
          @click.stop="$emit('delete')"
          title="刪除分析項目"
        >
          <i class="fas fa-trash me-1"></i>刪除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 📊 AnalysisItem.vue - 分析項目組件
 * 
 * 🎯 功能說明：
 * 1. 📋 顯示單個空間分析項目的詳細資訊
 * 2. 🎨 根據選中狀態提供視覺化反饋
 * 3. 📅 格式化並顯示分析創建日期
 * 4. 📊 顯示分析方法和狀態資訊
 * 5. 🔘 提供查看和刪除操作按鈕
 * 6. 📡 向父組件發送互動事件
 * 
 * 🏗️ 架構說明：
 * - 卡片容器：Bootstrap 卡片樣式
 * - 資訊區域：標題、描述、詳細資訊
 * - 操作區域：查看和刪除按鈕
 * - 狀態指示：動態顏色和圖示
 * 
 * 💡 設計理念：
 * - 資訊層次：清晰的視覺層次結構
 * - 互動反饋：選中狀態和懸停效果
 * - 操作便利：直觀的操作按鈕配置
 * - 狀態清晰：明確的分析狀態指示
 */
export default {
  name: 'AnalysisItem',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 📊 分析項目物件，包含所有分析相關資訊 */
    analysis: {
      type: Object,
      required: true,
      validator: (value) => {
        // 驗證必要的屬性是否存在
        return value && 
               typeof value.id !== 'undefined' &&
               typeof value.name === 'string' &&
               typeof value.method === 'string'
      }
    },
    /** ✅ 是否為選中狀態 */
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   */
  emits: [
    'select',    // 選擇分析項目
    'view',      // 查看分析項目
    'delete'     // 刪除分析項目
  ],
  
  /**
   * 🛠️ 組件方法定義 (Component Methods)
   */
  methods: {
    /**
     * 📅 格式化日期 (Format Date)
     * 將日期物件或字串格式化為可讀的日期格式
     * 
     * @param {Date|string} date - 要格式化的日期
     * @returns {string} 格式化後的日期字串
     */
    formatDate(date) {
      if (!date) return '未知日期'
      
      try {
        const dateObj = new Date(date)
        return dateObj.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        console.warn('日期格式化錯誤:', error)
        return '日期錯誤'
      }
    },
    
    /**
     * 🎨 取得狀態顏色 (Get Status Color)
     * 根據分析狀態返回對應的 CSS 顏色類別
     * 
     * @param {string} status - 分析狀態
     * @returns {string} CSS 顏色類別
     */
    getStatusColor(status) {
      const colorMap = {
        'completed': 'text-success',    // 完成 - 綠色
        'running': 'text-warning',      // 執行中 - 黃色
        'failed': 'text-danger',        // 失敗 - 紅色
        'pending': 'text-info'          // 等待中 - 藍色
      }
      return colorMap[status] || 'text-muted'
    },
    
    /**
     * 📝 取得狀態文字 (Get Status Text)
     * 將英文狀態轉換為中文顯示文字
     * 
     * @param {string} status - 分析狀態
     * @returns {string} 中文狀態文字
     */
    getStatusText(status) {
      const textMap = {
        'completed': '已完成',
        'running': '執行中',
        'failed': '失敗',
        'pending': '等待中'
      }
      return textMap[status] || '未知狀態'
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 分析項目組件樣式 (Analysis Item Component Styles)
 * 
 * 定義分析項目卡片的視覺樣式和互動效果
 */

/* 📋 分析項目卡片基礎樣式 (Analysis Item Card Base Styles) */
.analysis-item {
  cursor: pointer;                    /* 滑鼠指標顯示為手型 */
  transition: all 0.2s ease;         /* 平滑的過渡動畫 */
  border: 1px solid #dee2e6;         /* 預設邊框顏色 */
}

/* 🖱️ 懸停效果 (Hover Effects) */
.analysis-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 懸停時的陰影效果 */
  transform: translateY(-1px);        /* 輕微上移效果 */
}

/* ✅ 選中狀態樣式 (Selected State Styles) */
.analysis-item.border-primary {
  border-color: #0d6efd !important;  /* 選中時的藍色邊框 */
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25); /* 選中時的外發光效果 */
}

/* 📊 詳細資訊項目樣式 (Detail Item Styles) */
.detail-item {
  display: flex;                      /* 彈性佈局 */
  align-items: center;                /* 垂直置中對齊 */
  margin-bottom: 0.25rem;             /* 項目間距 */
  font-size: 0.875rem;                /* 較小的字體大小 */
}

/* 🔘 按鈕群組樣式調整 (Button Group Style Adjustments) */
.btn-group .btn {
  flex: 1;                            /* 按鈕等寬分布 */
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  .analysis-item .card-body {
    padding: 0.75rem;                 /* 在小螢幕上減少內邊距 */
  }
  
  .detail-item {
    font-size: 0.8rem;                /* 在小螢幕上縮小字體 */
  }
  
  .btn-group .btn {
    font-size: 0.8rem;                /* 在小螢幕上縮小按鈕字體 */
    padding: 0.25rem 0.5rem;          /* 在小螢幕上調整按鈕內邊距 */
  }
}
</style> 