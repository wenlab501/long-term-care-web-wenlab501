<template>
  <div class="my-right-panel bg-light border-start p-3 flex-grow-1 custom-scroll">
    <h5 class="text-primary fw-bold mb-3">
      <i class="fas fa-chart-line"></i> 右側控制面版
    </h5>
    
    <!-- 右側Tab導航 -->
    <div class="mb-3">
      <ul class="nav nav-pills nav-fill">
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeRightTab === 'results' }" 
            @click="$emit('update:activeRightTab', 'results')">
            <i class="fas fa-chart-bar"></i> 分析結果
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeRightTab === 'list' }" 
            @click="$emit('update:activeRightTab', 'list')">
            <i class="fas fa-list"></i> 分析清單
          </button>
        </li>
      </ul>
    </div>
    
    <!-- 右側Tab內容 -->
    <div class="tab-content flex-grow-1">
      <!-- 分析結果Tab -->
      <div v-show="activeRightTab === 'results'" class="h-100">
        <AnalysisResultsTab
          :totalCount="totalCount"
          :activeMarkers="activeMarkers"
          :tainanDataSummary="tainanDataSummary"
          :mergedTableData="mergedTableData"
          :maxCount="maxCount"
          :averageCount="averageCount"
          :dataRegionsCount="dataRegionsCount"
          :showTainanLayer="showTainanLayer"
          @fit-map-to-data="$emit('fit-map-to-data')"
          @clear-tainan-data="$emit('clear-tainan-data')"
          @switch-to-dashboard="$emit('switch-to-dashboard')" />
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
    
    <!-- 面板狀態資訊 -->
    <div class="mt-3">
      <div class="card bg-light border-0">
        <div class="card-body p-2">
          <SystemInfo 
            label="面板寬度"
            :value="`${rightPanelWidth}px`"
            icon="arrows-alt-h" />
          <SystemInfo 
            label="活躍分析"
            :value="getActiveAnalysisCount()"
            icon="chart-line" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnalysisResultsTab from './tabs/AnalysisResultsTab.vue'
import AnalysisListTab from './tabs/AnalysisListTab.vue'
import SystemInfo from './common/SystemInfo.vue'

export default {
  name: 'RightPanel',
  components: {
    AnalysisResultsTab,
    AnalysisListTab,
    SystemInfo
  },
  props: {
    // Tab狀態
    activeRightTab: {
      type: String,
      default: 'results'
    },
    // 統計數據
    totalCount: {
      type: Number,
      default: 0
    },
    activeMarkers: {
      type: Number,
      default: 0
    },
    // 台南數據
    tainanDataSummary: {
      type: Object,
      default: null
    },
    mergedTableData: {
      type: Array,
      default: () => []
    },
    maxCount: {
      type: Number,
      default: 0
    },
    averageCount: {
      type: Number,
      default: 0
    },
    dataRegionsCount: {
      type: Number,
      default: 0
    },
    showTainanLayer: {
      type: Boolean,
      default: false
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
    'fit-map-to-data',
    'clear-tainan-data',
    'switch-to-dashboard',
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
  height: 100vh; /* 垂直滿版 */
  overflow-y: auto; /* 內容溢出時可滾動 */
}
</style> 