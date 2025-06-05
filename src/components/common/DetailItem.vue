<template>
  <div class="mb-3">
    <h6 class="text-muted small text-uppercase mb-1">{{ title }}</h6>
    <p class="lead mb-0 fw-medium">{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: 'DetailItem',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
.lead {
  word-wrap: break-word; /* Ensure long values wrap */
}
</style> 