<!-- 🎨 ColorSchemePreview.vue - 色票方案預覽組件 (Color Scheme Preview Component) -->
<!-- 提供 Python 風格色票的預覽、選擇和應用功能 -->
<template>
  <!-- 🎨 色票預覽容器 (Color Scheme Preview Container) -->
  <div class="color-scheme-preview">
    <!-- 📋 預覽卡片 (Preview Card) -->
    <div class="card">
      <!-- 📝 卡片標題 (Card Header) -->
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-palette me-2"></i>
          Python 色票方案預覽
        </h6>
      </div>
      
      <!-- 📊 卡片內容 (Card Body) -->
      <div class="card-body">
        <!-- 🎨 當前選擇的色票選擇器 (Current Color Scheme Selector) -->
        <div class="mb-3">
          <label class="form-label">
            <i class="fas fa-eye me-1"></i>
            當前色票: {{ currentScheme }}
          </label>
          <!-- 🔽 色票下拉選單 (Color Scheme Dropdown) -->
          <!-- 分組顯示不同類型的色票方案 -->
          <select v-model="currentScheme" class="form-select" @change="updatePreview">
            <!-- 🐍 Python matplotlib 色票群組 -->
            <optgroup label="🐍 Python matplotlib">
              <option value="viridis">Viridis (預設)</option>
              <option value="plasma">Plasma</option>
              <option value="inferno">Inferno</option>
              <option value="magma">Magma</option>
              <option value="cividis">Cividis (色盲友善)</option>
            </optgroup>
            <!-- 🔬 Python seaborn 色票群組 -->
            <optgroup label="🔬 Python seaborn">
              <option value="seaborn_rocket">Rocket</option>
              <option value="seaborn_mako">Mako</option>
            </optgroup>
            <!-- 📊 科學視覺化色票群組 -->
            <optgroup label="📊 科學視覺化">
              <option value="coolwarm">CoolWarm</option>
              <option value="rdylbu">RdYlBu (發散)</option>
            </optgroup>
            <!-- 🎨 經典色票群組 -->
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

        <!-- 🌈 色票漸變條 (Color Gradient Bar) -->
        <!-- 顯示選中色票的連續漸變效果 -->
        <div class="mb-3">
          <label class="form-label">漸變預覽</label>
          <div 
            class="color-gradient-bar"
            :style="{ background: gradientBackground }"
          ></div>
        </div>

        <!-- ℹ️ 色票資訊 (Color Scheme Information) -->
        <!-- 顯示選中色票的詳細說明 -->
        <div v-if="schemeInfo" class="mb-3">
          <div class="alert alert-info">
            <strong>{{ schemeInfo.name }}</strong><br>
            <small>{{ schemeInfo.description }}</small>
          </div>
        </div>

        <!-- 🎯 離散色彩樣本 (Discrete Color Samples) -->
        <!-- 顯示模擬數據值對應的具體顏色 -->
        <div class="mb-3">
          <label class="form-label">離散色彩樣本 (模擬數據值)</label>
          <div class="row g-1">
            <div 
              v-for="(sample, index) in colorSamples" 
              :key="index"
              class="col"
            >
              <!-- 🎨 色彩樣本方塊 (Color Sample Block) -->
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

        <!-- 🔘 操作按鈕群組 (Action Buttons Group) -->
        <div class="d-grid gap-2">
          <!-- ✅ 套用色票按鈕 (Apply Color Scheme Button) -->
          <button 
            class="btn btn-primary"
            @click="applyColorScheme"
          >
            <i class="fas fa-check me-1"></i>
            套用此色票
          </button>
          
          <!-- 💾 匯出配置按鈕 (Export Configuration Button) -->
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
/**
 * 🎨 ColorSchemePreview.vue - 色票方案預覽組件
 * 
 * 🎯 功能說明：
 * 1. 🎨 提供 Python 風格色票的視覺化預覽
 * 2. 🔽 支援多種色票方案的選擇和切換
 * 3. 🌈 顯示連續漸變和離散色彩樣本
 * 4. ℹ️ 提供色票的詳細資訊和說明
 * 5. ✅ 支援色票的即時應用和全域更新
 * 6. 💾 提供色票配置的匯出功能
 * 
 * 🏗️ 架構說明：
 * - 選擇器：分組的色票下拉選單
 * - 預覽區：漸變條和離散樣本顯示
 * - 資訊區：色票的詳細說明
 * - 操作區：應用和匯出功能
 * 
 * 💡 設計理念：
 * - 視覺化優先：直觀的色彩預覽
 * - 分類清晰：按來源和用途分組色票
 * - 即時反饋：選擇後立即更新預覽
 * - 實用功能：支援應用和匯出
 */

// 🔧 Vue Composition API 引入
import { ref, computed, onMounted, watch } from 'vue'
// 🎨 色票工具函數引入
import { COLOR_SCHEMES, getColorByCount } from '../utils/dataProcessor.js'

export default {
  name: 'ColorSchemePreview',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 🎨 選定的色票方案名稱 */
    selectedScheme: {
      type: String,
      default: 'viridis'
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   */
  emits: ['scheme-changed'],
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup(props, { emit }) {
    // 📊 響應式狀態 (Reactive State)
    /** 🎨 當前選中的色票方案 */
    const currentScheme = ref(props.selectedScheme)
    
    // 🧮 計算屬性 (Computed Properties)
    
    /**
     * ℹ️ 色票資訊計算屬性 (Scheme Info Computed Property)
     * 獲取當前選中色票的詳細資訊
     */
    const schemeInfo = computed(() => {
      return COLOR_SCHEMES[currentScheme.value] || null
    })
    
    /**
     * 🌈 漸變背景計算屬性 (Gradient Background Computed Property)
     * 生成 CSS 漸變背景字串
     */
    const gradientBackground = computed(() => {
      if (!schemeInfo.value) return ''
      
      const colors = schemeInfo.value.colors.slice(1) // 跳過無數據顏色
      return `linear-gradient(to right, ${colors.join(', ')})`
    })
    
    /**
     * 🎯 色彩樣本計算屬性 (Color Samples Computed Property)
     * 生成模擬數據值對應的色彩樣本
     */
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
    
    // 🛠️ 組件方法 (Component Methods)
    
    /**
     * 🔄 更新預覽 (Update Preview)
     * 當色票選擇變化時觸發
     */
    const updatePreview = () => {
      emit('scheme-changed', currentScheme.value)
    }
    
    /**
     * ✅ 套用色票方案 (Apply Color Scheme)
     * 將選中的色票應用到全域
     */
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
    
    /**
     * 💾 匯出色票方案 (Export Color Scheme)
     * 將色票配置匯出為 JSON 檔案
     */
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
    
    // 👀 監聽器 (Watchers)
    
    /**
     * 👀 監聽外部 scheme 變化 (Watch External Scheme Changes)
     * 當父組件傳入的 selectedScheme 變化時同步更新
     */
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