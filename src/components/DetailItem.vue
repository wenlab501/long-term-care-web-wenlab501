<script>
  export default {
    name: 'DetailItem',
    props: {
      label: {
        type: String,
        required: true,
      },
      value: {
        type: [String, Number, Boolean, Object],
        required: true,
      },
    },
  };
</script>

<template>
  <div class="d-flex align-items-center justify-content-between py-2">
    <span class="my-title-xs text-nowrap me-3">{{ label }}</span>
    <span class="my-content-sm">{{ value }}</span>
  </div>
</template>

<style scoped>
  /* Add any component-specific styles here if needed */
  .lead {
    word-wrap: break-word; /* Ensure long values wrap */
  }
</style>
