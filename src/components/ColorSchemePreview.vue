<template>
  <div class="color-scheme-preview">
    <div class="card">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-palette me-2"></i>
          Python 色票方案預覽
        </h6>
      </div>
      <div class="card-body">
        <!-- 當前選擇的色票 -->
        <div class="mb-3">
          <label class="form-label">
            <i class="fas fa-eye me-1"></i>
            當前色票: {{ currentScheme }}
          </label>
          <select v-model="currentScheme" class="form-select" @change="updatePreview">
            <optgroup label="🐍 Python matplotlib">
              <option value="viridis">Viridis (預設)</option>
              <option value="plasma">Plasma</option>
              <option value="inferno">Inferno</option>
              <option value="magma">Magma</option>
              <option value="cividis">Cividis (色盲友善)</option>
            </optgroup>
            <optgroup label="🔬 Python seaborn">
              <option value="seaborn_rocket">Rocket</option>
              <option value="seaborn_mako">Mako</option>
            </optgroup>
            <optgroup label="📊 科學視覺化">
              <option value="coolwarm">CoolWarm</option>
              <option value="rdylbu">RdYlBu (發散)</option>
            </optgroup>
            <optgroup label="🎨 經典色票">
              <option value="default">預設</option>
              <option value="heat">熱力圖</option>
              <option value="blues">藍色系</option>
              <option value="greens">綠色系</option>
              <option value="reds">紅色系</option>
              <option value="rainbow">彩虹光譜</option>
            </optgroup>
          </select>
        </div>

        <!-- 色票漸變條 -->
        <div class="mb-3">
          <label class="form-label">漸變預覽</label>
          <div 
            class="color-gradient-bar"
            :style="{ background: gradientBackground }"
          ></div>
        </div>

        <!-- 色票資訊 -->
        <div v-if="schemeInfo" class="mb-3">
          <div class="alert alert-info">
            <strong>{{ schemeInfo.name }}</strong><br>
            <small>{{ schemeInfo.description }}</small>
          </div>
        </div>

        <!-- 離散色彩樣本 -->
        <div class="mb-3">
          <label class="form-label">離散色彩樣本 (模擬數據值)</label>
          <div class="row g-1">
            <div 
              v-for="(sample, index) in colorSamples" 
              :key="index"
              class="col"
            >
              <div 
                class="color-sample text-center"
                :style="{ backgroundColor: sample.color }"
                :title="`值: ${sample.value}`"
              >
                <small class="sample-value">{{ sample.value }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="d-grid gap-2">
          <button 
            class="btn btn-primary"
            @click="applyColorScheme"
          >
            <i class="fas fa-check me-1"></i>
            套用此色票
          </button>
          
          <button 
            class="btn btn-outline-secondary"
            @click="exportColorScheme"
          >
            <i class="fas fa-download me-1"></i>
            匯出色票配置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { COLOR_SCHEMES, getColorByCount } from '../utils/dataProcessor.js'

export default {
  name: 'ColorSchemePreview',
  props: {
    selectedScheme: {
      type: String,
      default: 'viridis'
    }
  },
  emits: ['scheme-changed'],
  setup(props, { emit }) {
    const currentScheme = ref(props.selectedScheme)
    
    // 計算屬性
    const schemeInfo = computed(() => {
      return COLOR_SCHEMES[currentScheme.value] || null
    })
    
    const gradientBackground = computed(() => {
      if (!schemeInfo.value) return ''
      
      const colors = schemeInfo.value.colors.slice(1) // 跳過無數據顏色
      return `linear-gradient(to right, ${colors.join(', ')})`
    })
    
    const colorSamples = computed(() => {
      const samples = []
      const maxValue = 100
      const sampleCount = 8
      
      for (let i = 0; i < sampleCount; i++) {
        const value = Math.round((i + 1) * (maxValue / sampleCount))
        const color = getColorByCount(value, maxValue, currentScheme.value)
        samples.push({ value, color })
      }
      
      return samples
    })
    
    // 方法
    const updatePreview = () => {
      emit('scheme-changed', currentScheme.value)
    }
    
    const applyColorScheme = () => {
      // 觸發全域色票變更事件
      const event = new CustomEvent('colorSchemeChanged', {
        detail: {
          scheme: currentScheme.value,
          schemeInfo: schemeInfo.value
        }
      })
      window.dispatchEvent(event)
      
      console.log(`🎨 已套用色票: ${currentScheme.value}`)
      
      // 顯示成功消息
      const toast = document.createElement('div')
      toast.className = 'toast-message'
      toast.textContent = `已套用 ${schemeInfo.value?.name || currentScheme.value} 色票`
      document.body.appendChild(toast)
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    }
    
    const exportColorScheme = () => {
      const exportData = {
        scheme: currentScheme.value,
        info: schemeInfo.value,
        samples: colorSamples.value,
        timestamp: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `color_scheme_${currentScheme.value}.json`
      link.click()
      URL.revokeObjectURL(url)
      
      console.log(`📄 已匯出色票配置: ${currentScheme.value}`)
    }
    
    // 監聽外部 scheme 變化
    watch(() => props.selectedScheme, (newScheme) => {
      currentScheme.value = newScheme
    })
    
    onMounted(() => {
      console.log('🎨 色票預覽組件已載入')
      console.log('📊 可用色票:', Object.keys(COLOR_SCHEMES))
    })
    
    return {
      currentScheme,
      schemeInfo,
      gradientBackground,
      colorSamples,
      updatePreview,
      applyColorScheme,
      exportColorScheme
    }
  }
}
</script>

<style scoped>
.color-gradient-bar {
  height: 40px;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
  margin-bottom: 0.5rem;
}

.color-sample {
  height: 60px;
  border-radius: 0.25rem;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 0.25rem;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-sample:hover {
  transform: scale(1.05);
  z-index: 10;
}

.sample-value {
  background: rgba(255, 255, 255, 0.9);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: bold;
  color: #333;
}

.color-scheme-preview .card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Toast 消息樣式 */
:global(.toast-message) {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 