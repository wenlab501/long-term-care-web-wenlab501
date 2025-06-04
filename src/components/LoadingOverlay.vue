<template>
  <div class="my-loading-overlay" v-if="isVisible">
    <div class="my-loading-content">
      <div class="my-loading-spinner spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <div class="my-loading-text">{{ loadingText }}</div>
      <div class="my-loading-progress" v-if="showProgress && progress >= 0">
        <div class="progress">
          <div class="progress-bar" 
               role="progressbar" 
               :style="{ width: progress + '%' }"
               :aria-valuenow="progress"
               aria-valuemin="0" 
               aria-valuemax="100">
            {{ Math.round(progress) }}%
          </div>
        </div>
      </div>
      <div class="mt-3" v-if="subText">
        <small class="text-light">{{ subText }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '載入中...'
    },
    progress: {
      type: Number,
      default: 0
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    subText: {
      type: String,
      default: ''
    }
  }
}
</script> 