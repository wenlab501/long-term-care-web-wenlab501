<template>
  <div class="color-preview">
    <div class="color-preview-header">
      <label class="form-label text-white fw-semibold mb-2">
        <i class="fas fa-eye"></i> 顏色預覽
      </label>
      <small class="text-muted d-block mb-3">
        根據count值顯示對應顏色
      </small>
    </div>
    
    <!-- 顏色條 -->
    <div class="color-bar-container">
      <div class="color-bar">
        <div 
          v-for="(sample, index) in colorSamples" 
          :key="index"
          class="color-segment"
          :style="{ backgroundColor: sample.color }"
          :title="`Count: ${sample.count} - Color: ${sample.color}`">
        </div>
      </div>
      
      <!-- 標籤 -->
      <div class="color-labels">
        <small class="text-muted">0</small>
        <small class="text-muted">{{ Math.round(maxCount * 0.25) }}</small>
        <small class="text-muted">{{ Math.round(maxCount * 0.5) }}</small>
        <small class="text-muted">{{ Math.round(maxCount * 0.75) }}</small>
        <small class="text-muted">{{ maxCount }}</small>
      </div>
    </div>
    
    <!-- 統計信息 -->
    <div class="preview-stats mt-3">
      <div class="row text-center">
        <div class="col-4">
          <small class="text-muted d-block">最小值</small>
          <strong class="text-success">0</strong>
        </div>
        <div class="col-4">
          <small class="text-muted d-block">最大值</small>
          <strong class="text-danger">{{ maxCount }}</strong>
        </div>
        <div class="col-4">
          <small class="text-muted d-block">樣本數</small>
          <strong class="text-info">{{ colorSamples.length }}</strong>
        </div>
      </div>
    </div>
    
    <!-- 當前色票信息 -->
    <div class="scheme-info mt-3">
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">當前方案:</small>
        <span class="badge bg-primary">{{ colorScheme.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { getColorByCount } from '../../utils/dataProcessor.js'

export default {
  name: 'ColorPreview',
  props: {
    maxCount: {
      type: Number,
      default: 100
    },
    colorScheme: {
      type: String,
      default: 'default'
    },
    sampleCount: {
      type: Number,
      default: 20
    }
  },
  setup(props) {
    /**
     * 生成顏色樣本
     */
    const colorSamples = computed(() => {
      const samples = []
      const step = props.maxCount / props.sampleCount
      
      for (let i = 0; i <= props.sampleCount; i++) {
        const count = Math.round(i * step)
        const color = getColorByCount(count, props.maxCount, props.colorScheme)
        samples.push({ count, color })
      }
      
      return samples
    })

    return {
      colorSamples
    }
  }
}
</script>

<style scoped>
.color-preview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.color-bar-container {
  margin-bottom: 0.5rem;
}

.color-bar {
  display: flex;
  height: 30px;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 0.5rem;
}

.color-segment {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-segment:hover {
  transform: scaleY(1.3);
  z-index: 10;
  position: relative;
  border: 1px solid white;
}

.color-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.preview-stats {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.scheme-info {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.375rem;
  padding: 0.5rem;
}
</style> 