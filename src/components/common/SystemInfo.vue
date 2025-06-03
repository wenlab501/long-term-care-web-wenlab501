<template>
  <div class="d-flex align-items-center mb-2">
    <i :class="`fas fa-${icon} me-2 text-muted`"></i>
    <small class="text-muted">{{ label }}:</small>
    <small :class="`ms-auto fw-bold ${statusClass || 'text-white'}`">{{ value }}</small>
  </div>
</template>

<script>
export default {
  name: 'SystemInfo',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    statusClass: {
      type: String,
      default: ''
    }
  }
}
</script> 