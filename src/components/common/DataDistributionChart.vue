<template>
  <div>
    <div class="mb-2">
      <div class="d-flex justify-content-between">
        <small>最高值</small>
        <small class="fw-bold text-danger">{{ formatNumber(maxCount) }}</small>
      </div>
      <div class="progress progress-sm">
        <div class="progress-bar bg-danger" style="width: 100%"></div>
      </div>
    </div>
    <div class="mb-2">
      <div class="d-flex justify-content-between">
        <small>平均值</small>
        <small class="fw-bold text-warning">{{ averageCount.toFixed(1) }}</small>
      </div>
      <div class="progress progress-sm">
        <div class="progress-bar bg-warning" :style="{ width: progressWidth + '%' }"></div>
      </div>
    </div>
    <div>
      <div class="d-flex justify-content-between">
        <small>有數據區域</small>
        <small class="fw-bold text-success">{{ dataRegionsCount }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { formatNumber } from '../../utils/utils.js'

export default {
  name: 'DataDistributionChart',
  props: {
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
    }
  },
  setup(props) {
    /**
     * 計算平均值進度條寬度
     * @returns {number} 百分比寬度
     */
    const progressWidth = computed(() => {
      if (props.maxCount === 0) return 0
      return (props.averageCount / props.maxCount) * 100
    })

    return {
      progressWidth,
      formatNumber
    }
  }
}
</script>

<style scoped>
.progress-sm {
  height: 0.5rem;
}
</style> 