<template>
  <div class="custom-scroll h-100">
    <!-- 數據統計卡片 -->
    <div class="mb-3">
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="fas fa-chart-pie"></i> 數據統計
          </h6>
        </div>
        <div class="card-body p-3">
          <div class="row text-center">
            <div class="col-6">
              <div class="border-end">
                <div class="h4 text-primary mb-1">{{ formatNumber(totalCount) }}</div>
                <small class="text-muted">總數量</small>
              </div>
            </div>
            <div class="col-6">
              <div class="h4 text-success mb-1">{{ activeMarkers }}</div>
              <small class="text-muted">活躍標記</small>
            </div>
          </div>
          <hr>
          <div v-if="tainanDataSummary" class="text-center">
            <div class="h4 text-info mb-1">{{ tainanDataSummary.totalFeatures }}</div>
            <small class="text-muted">台南區域總數</small>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 數據分佈卡片 -->
    <div class="mb-3" v-if="mergedTableData.length > 0">
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="fas fa-chart-area"></i> 數據分佈
          </h6>
        </div>
        <div class="card-body p-3">
          <DataDistributionChart 
            :maxCount="maxCount"
            :averageCount="averageCount"
            :dataRegionsCount="dataRegionsCount" />
        </div>
      </div>
    </div>

    <!-- 圖層控制卡片 -->
    <div class="mb-3">
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="fas fa-layer-group"></i> 圖層控制
          </h6>
        </div>
        <div class="card-body p-3">
          <div class="d-grid gap-2">
            <ActionButton 
              @click="$emit('fit-map-to-data')"
              :disabled="!showTainanLayer"
              variant="outline-secondary"
              icon="expand-arrows-alt"
              text="調整地圖視角" />
            
            <ActionButton 
              @click="$emit('clear-tainan-data')"
              :disabled="mergedTableData.length === 0"
              variant="outline-warning"
              icon="trash"
              text="清除台南數據" />
            
            <ActionButton 
              @click="$emit('switch-to-dashboard')"
              variant="outline-primary"
              icon="chart-bar"
              text="查看儀表板" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatNumber } from '../../utils/utils.js'
import DataDistributionChart from '../common/DataDistributionChart.vue'
import ActionButton from '../common/ActionButton.vue'

export default {
  name: 'AnalysisResultsTab',
  components: {
    DataDistributionChart,
    ActionButton
  },
  props: {
    totalCount: {
      type: Number,
      default: 0
    },
    activeMarkers: {
      type: Number,
      default: 0
    },
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
    }
  },
  emits: [
    'fit-map-to-data',
    'clear-tainan-data',
    'switch-to-dashboard'
  ],
  setup() {
    return {
      formatNumber
    }
  }
}
</script> 