<template>
  <div class="loading-overlay" v-if="isVisible">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="loading-text">{{ loadingText }}</div>
      <div class="loading-progress" v-if="showProgress">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" 
               role="progressbar" 
               :style="{ width: progress + '%' }"
               :aria-valuenow="progress" 
               aria-valuemin="0" 
               aria-valuemax="100">
            {{ progress }}%
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