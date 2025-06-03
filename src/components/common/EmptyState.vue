<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <i :class="`fas fa-${icon}`"></i>
    </div>
    <div class="empty-state-title">{{ title }}</div>
    <div class="empty-state-text">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: 'info-circle'
    },
    title: {
      type: String,
      default: '暫無內容'
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script> 