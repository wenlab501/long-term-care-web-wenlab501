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
  <div class="pb-2">
    <div class="my-title-xs pb-1">{{ label }}</div>
    <div class="my-content-sm pb-1">{{ value }}</div>
  </div>
</template>

<style scoped>
  /* Add any component-specific styles here if needed */
  .lead {
    word-wrap: break-word; /* Ensure long values wrap */
  }
</style>
