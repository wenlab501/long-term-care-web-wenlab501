<template>
  <!-- 📈 分析清單分頁組件 (Analysis List Tab Component) -->
  <!-- 顯示和管理空間分析項目的清單 -->
  <div class="custom-scroll h-100">
    
    <!-- 📋 分析項目列表區域 (Analysis Items List Area) -->
    <!-- 當有分析項目時，遍歷顯示所有分析項目 -->
    <div v-if="analysisList.length > 0">
      <AnalysisItem
        v-for="analysis in analysisList" 
        :key="analysis.id"
        :analysis="analysis"
        :isSelected="selectedAnalysisId === analysis.id"
        @select="$emit('select-analysis', analysis.id)"
        @view="$emit('view-analysis', analysis.id)"
        @delete="$emit('delete-analysis', analysis.id)" />
    </div>
    
    <!-- 🚫 空狀態提示 (Empty State Message) -->
    <!-- 當沒有分析項目時顯示的引導訊息 -->
    <div v-else class="empty-state text-center text-muted p-4">
      <div class="mb-2">
        <i class="fas fa-chart-line fa-2x"></i>
      </div>
      <p>暫無分析項目</p>
      <small>點擊左側「開始分析」按鈕創建分析項目</small>
    </div>
  </div>
</template>

<script>
/**
 * 📈 AnalysisListTab.vue - 分析清單分頁組件
 * 
 * 功能說明：
 * 1. 📋 顯示所有空間分析項目的清單
 * 2. 🔄 管理分析項目的選擇狀態
 * 3. 📊 提供分析項目的查看、選擇、刪除操作
 * 4. 🚫 處理空清單狀態，提供用戶引導
 * 5. 📡 轉發分析項目相關事件到父組件
 * 
 * 架構說明：
 * - 列表渲染：使用 AnalysisItem 組件顯示每個分析項目
 * - 事件處理：轉發子組件事件到父組件
 * - 狀態管理：管理選中的分析項目 ID
 * 
 * 設計理念：
 * - 簡潔的列表展示
 * - 清晰的空狀態引導
 * - 統一的事件處理機制
 */

// 🧩 組件引入
import AnalysisItem from '../components/common/AnalysisItem.vue'

export default {
  name: 'AnalysisListTab',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   * 註冊分析清單分頁內使用的子組件
   */
  components: {
    AnalysisItem    // 分析項目組件
  },
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的分析清單和選中狀態
   */
  props: {
    /** 📋 分析項目清單陣列 */
    analysisList: {
      type: Array,
      default: () => []
    },
    /** 📊 當前選中的分析項目 ID */
    selectedAnalysisId: {
      type: [Number, String],
      default: null
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   * 定義向父組件發送的事件類型
   */
  emits: [
    'select-analysis',    // 選擇分析項目
    'view-analysis',      // 查看分析項目
    'delete-analysis'     // 刪除分析項目
  ]
}
</script>

<style scoped>
/**
 * 🎨 分析清單分頁樣式 (Analysis List Tab Styles)
 * 
 * 定義分析清單分頁的視覺樣式和佈局
 */

/* 📋 自定義滾動條樣式 (Custom Scrollbar Styles) */
.custom-scroll {
  overflow-y: auto;                    /* 垂直滾動 */
  scrollbar-width: thin;               /* Firefox 細滾動條 */
  scrollbar-color: #c1c1c1 transparent; /* Firefox 滾動條顏色 */
}

/* WebKit 瀏覽器 (Chrome, Safari, Edge) 滾動條樣式 */
.custom-scroll::-webkit-scrollbar {
  width: 6px;                          /* 滾動條寬度 */
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;             /* 透明軌道背景 */
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;          /* 滾動條滑塊顏色 */
  border-radius: 3px;                 /* 圓角滑塊 */
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;          /* 懸停時的滑塊顏色 */
}

/* 🚫 空狀態樣式 (Empty State Styles) */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;                   /* 最小高度，確保視覺平衡 */
}

.empty-state i {
  color: #6c757d;                      /* 圖示顏色 */
  margin-bottom: 1rem;                 /* 圖示下邊距 */
}

.empty-state p {
  font-size: 1.1rem;                   /* 主要文字大小 */
  margin-bottom: 0.5rem;               /* 主要文字下邊距 */
}

.empty-state small {
  font-size: 0.875rem;                 /* 輔助文字大小 */
  color: #6c757d;                      /* 輔助文字顏色 */
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  .custom-scroll::-webkit-scrollbar {
    width: 8px;                        /* 在觸控設備上增加滾動條寬度 */
  }
  
  .empty-state {
    min-height: 150px;                 /* 在小螢幕上減少最小高度 */
    padding: 1rem;                     /* 在小螢幕上增加內邊距 */
  }
  
  .empty-state i {
    font-size: 1.5rem;                 /* 在小螢幕上縮小圖示 */
  }
  
  .empty-state p {
    font-size: 1rem;                   /* 在小螢幕上調整文字大小 */
  }
}
</style> 