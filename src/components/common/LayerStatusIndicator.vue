<template>
  <div class="text-center">
    <div class="layer-status-indicator mb-2">
      <i :class="`fas fa-${icon}`" :style="{ color: statusColor }"></i>
    </div>
    <small class="d-block fw-bold" :style="{ color: statusColor }">
      {{ label }}
    </small>
    <small class="d-block text-muted">
      {{ isActive ? '啟用' : '停用' }}
    </small>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'LayerStatusIndicator',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  setup(props) {
    /**
     * 根據狀態計算顏色
     * @returns {string} 顏色值
     */
    const statusColor = computed(() => {
      return props.isActive ? '#28a745' : '#6c757d'
    })

    return {
      statusColor
    }
  }
}
</script>

<style scoped>
.layer-status-indicator {
  font-size: 1.5rem;
}
</style> 