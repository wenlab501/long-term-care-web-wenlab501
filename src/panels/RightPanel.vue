<template>
  <div class="my-right-panel bg-light border-start h-100 d-flex flex-column custom-scroll" style="overflow: hidden;">

    <!-- 右側Tab導航 -->
    <div class="bg-light" style="min-width: 0;">
      <ul class="nav nav-tabs nav-fill small">
        <li class="nav-item">
          <button 
            class="nav-link text-dark border-0"
            :class="{ 'active bg-white text-primary fw-bold': activeRightTab === 'results' }" 
            @click="$emit('update:activeRightTab', 'results')">
            分析結果
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link text-dark border-0"
            :class="{ 'active bg-white text-primary fw-bold': activeRightTab === 'list' }" 
            @click="$emit('update:activeRightTab', 'list')">
            分析清單
          </button>
        </li>
      </ul>
    </div>
    
    <!-- 右側Tab內容 -->
    <div class="tab-content flex-grow-1 overflow-auto p-3" style="min-width: 0;">
      <!-- 分析結果Tab -->
      <div v-show="activeRightTab === 'results'" class="h-100">
        <AnalysisResultsTab />
      </div>
      
      <!-- 分析清單Tab -->
      <div v-show="activeRightTab === 'list'" class="h-100">
        <AnalysisListTab
          :analysisList="analysisList"
          :selectedAnalysisId="selectedAnalysisId"
          @select-analysis="$emit('select-analysis', $event)"
          @view-analysis="$emit('view-analysis', $event)"
          @delete-analysis="$emit('delete-analysis', $event)" />
      </div>
    </div>
  
  </div>
</template>

<script>
import AnalysisResultsTab from '../tabs/AnalysisResultsTab.vue'
import AnalysisListTab from '../tabs/AnalysisListTab.vue'

export default {
  name: 'RightPanel',
  components: {
    AnalysisResultsTab,
    AnalysisListTab
  },
  props: {
    // Tab狀態
    activeRightTab: {
      type: String,
      default: 'results'
    },
    // 分析數據
    analysisList: {
      type: Array,
      default: () => []
    },
    selectedAnalysisId: {
      type: [Number, String],
      default: null
    },
    // 面板尺寸
    rightPanelWidth: {
      type: Number,
      default: 250
    }
  },
  emits: [
    'update:activeRightTab',
    'select-analysis',
    'view-analysis',
    'delete-analysis'
  ],
  setup(props) {
    /**
     * 計算活躍分析項目數量
     * @returns {number} 完成狀態的分析項目數量
     */
    const getActiveAnalysisCount = () => {
      return props.analysisList.filter(a => a.status === '完成').length
    }

    return {
      getActiveAnalysisCount
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 右側面板樣式 (Right Panel Styles)
 */

/* 📋 面板基礎樣式 */
.my-right-panel {
  overflow-y: auto; /* 內容溢出時可滾動 */
}

/* 📋 自定義滾動條 */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 