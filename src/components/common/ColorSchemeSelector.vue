<template>
  <div class="color-scheme-selector">
    <!-- 當前選中的色票顯示 -->
    <div class="mb-3">
      <label class="form-label text-white fw-semibold">
        <i class="fas fa-palette"></i> 色票方案
      </label>
      <div class="current-scheme-preview">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <small class="text-muted">{{ currentScheme.name }}</small>
          <button 
            class="btn btn-outline-light btn-sm" 
            @click="showSelector = !showSelector"
            :title="showSelector ? '隱藏色票選擇' : '顯示色票選擇'">
            <i :class="showSelector ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>
        </div>
        <div class="color-preview-bar">
          <div 
            v-for="(color, index) in currentScheme.colors.slice(1)" 
            :key="index"
            class="color-sample"
            :style="{ backgroundColor: color }"
            :title="`顏色 ${index + 1}: ${color}`">
          </div>
        </div>
        <small class="text-muted d-block mt-1">{{ currentScheme.description }}</small>
      </div>
    </div>

    <!-- 色票選擇器（可折疊） -->
    <div v-show="showSelector" class="color-scheme-options">
      <div class="schemes-grid">
        <div 
          v-for="(scheme, key) in availableSchemes" 
          :key="key"
          class="scheme-option"
          :class="{ active: selectedScheme === key }"
          @click="selectScheme(key)"
          :title="scheme.description">
          
          <!-- 色票名稱 -->
          <div class="scheme-name">{{ scheme.name }}</div>
          
          <!-- 色票預覽 -->
          <div class="scheme-preview">
            <div 
              v-for="(color, index) in scheme.colors.slice(1, 6)" 
              :key="index"
              class="preview-color"
              :style="{ backgroundColor: color }">
            </div>
          </div>
          
          <!-- 選中指示器 -->
          <div v-if="selectedScheme === key" class="selection-indicator">
            <i class="fas fa-check"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 色票統計資訊 -->
    <div class="mt-3">
      <div class="row text-center">
        <div class="col-6">
          <small class="text-muted d-block">顏色數量</small>
          <strong class="text-white">{{ currentScheme.colors.length - 1 }}</strong>
        </div>
        <div class="col-6">
          <small class="text-muted d-block">當前方案</small>
          <strong class="text-primary">{{ selectedScheme.toUpperCase() }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { COLOR_SCHEMES } from '../../utils/dataProcessor.js'

export default {
  name: 'ColorSchemeSelector',
  props: {
    selectedScheme: {
      type: String,
      default: 'default'
    }
  },
  emits: ['update:selectedScheme'],
  setup(props, { emit }) {
    // 響應式數據
    const showSelector = ref(false)
    const availableSchemes = ref(COLOR_SCHEMES)

    /**
     * 當前選中的色票方案
     */
    const currentScheme = computed(() => {
      return COLOR_SCHEMES[props.selectedScheme] || COLOR_SCHEMES.default
    })

    /**
     * 選擇色票方案
     * @param {string} schemeKey - 色票方案鍵值
     */
    const selectScheme = (schemeKey) => {
      emit('update:selectedScheme', schemeKey)
      showSelector.value = false // 選擇後自動隱藏選擇器
    }

    return {
      showSelector,
      availableSchemes,
      currentScheme,
      selectScheme
    }
  }
}
</script>

<style scoped>
.color-scheme-selector {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.current-scheme-preview {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.color-preview-bar {
  display: flex;
  height: 20px;
  border-radius: 0.25rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.color-sample {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-sample:hover {
  transform: scaleY(1.2);
  z-index: 10;
  position: relative;
}

.schemes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
}

.scheme-option {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.scheme-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.scheme-option.active {
  background: rgba(13, 110, 253, 0.2);
  border-color: #0d6efd;
}

.scheme-name {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.scheme-preview {
  display: flex;
  height: 12px;
  border-radius: 0.25rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-color {
  flex: 1;
  min-width: 0;
}

.selection-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #0d6efd;
  font-size: 1rem;
}

/* 自定義滾動條 */
.schemes-grid::-webkit-scrollbar {
  width: 6px;
}

.schemes-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.schemes-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.schemes-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style> 