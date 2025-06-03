<template>
  <span class="badge" :class="badgeClass">
    <i :class="iconClass"></i>
    {{ status }}
  </span>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BadgeStatus',
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    /**
     * 根據狀態計算徽章樣式類別
     * @returns {string} CSS類別
     */
    const badgeClass = computed(() => {
      return props.status === '成功' ? 'bg-success' : 'bg-warning text-dark'
    })

    /**
     * 根據狀態計算圖標類別
     * @returns {string} 圖標CSS類別
     */
    const iconClass = computed(() => {
      return props.status === '成功' ? 'fas fa-check' : 'fas fa-exclamation-triangle'
    })

    return {
      badgeClass,
      iconClass
    }
  }
}
</script> 