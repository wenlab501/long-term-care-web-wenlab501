<template>
  <span class="badge badge-count" :class="badgeClass">
    {{ formatNumber(count || 0) }}
  </span>
</template>

<script>
import { computed } from 'vue'
import { formatNumber } from '../../utils/utils.js'

export default {
  name: 'BadgeCount',
  props: {
    count: {
      type: [Number, String],
      default: 0
    }
  },
  setup(props) {
    /**
     * 根據數量計算徽章樣式類別
     * @returns {string} CSS類別
     */
    const badgeClass = computed(() => {
      const numCount = Number(props.count) || 0
      if (numCount === 0) return 'bg-secondary'
      if (numCount <= 10) return 'bg-success'
      if (numCount <= 50) return 'bg-warning text-dark'
      return 'bg-danger'
    })

    return {
      badgeClass,
      formatNumber
    }
  }
}
</script> 