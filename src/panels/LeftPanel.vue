<template>
  <!-- 🎛️ 左側控制面板 - 簡化版本，減少卡片使用，節省空間 -->
  <div class="bg-light border-end h-100 d-flex flex-column" style="overflow: hidden;">
    
    <!-- 📋 面板標題區域 (Panel Header Section) -->
    <div class="p-3" style="min-width: 0;">
      <h1 class="my-font-size-xl" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
        <div class="d-flex flex-column align-items-center justify-content-center m-3">
          <div class="rounded-circle my-bg-color-gray-300 p-4"></div>
          <div class="my-font-size-lg my-letter-spacing-lg mt-3">臺北市長照資訊</div>
        </div>
      </h1>
    </div>

    <!-- 🎛️ 主控制區域 (Main Control Area) - 使用緊湊樣式 -->
    <div class="flex-grow-1 overflow-auto p-3" style="min-width: 0;">
      
      <!-- 圖層控制卡片 -->
      <div class="mb-3">
        <div class="vstack gap-2">
          <div v-for="layer in layers" :key="layer.id" class="d-flex justify-content-between align-items-center">
            <label class="form-label mb-0">{{ layer.name }}</label>
            <button 
              type="button" 
              class="btn btn-sm"
              style="width: 60px;"
              :class="{
                'btn-success': layer.visible, 
                'btn-outline-secondary': !layer.visible,
                'disabled': layer.isLoading
              }"
              @click="toggleLayer(layer.id)"
              :disabled="layer.isLoading"
            >
              <span v-if="layer.isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-else>{{ layer.visible ? '開啟' : '關閉' }}</span>
            </button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
/**
 * 🎛️ LeftPanel.vue - 左側控制面板組件
 * 
 * 功能說明：
 * 1. 🗺️ 提供圖層顯示控制, 資料來自 Pinia store.
 */
import { computed } from 'vue'
import { useDataStore } from '../stores/dataStore'

export default {
  name: 'LeftPanel',
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的數據和狀態
   */
  props: {
    // Props are now largely obsolete as we get state from the store
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   * 向父組件發送的事件
   */
  emits: [
    // Emits are also reduced as store actions are called directly
  ],

  /**
   * 📊 組件數據設定 (Component Data)
   */
  setup() {
    const dataStore = useDataStore()

    const layers = computed(() => dataStore.layers)

    const toggleLayer = (layerId) => {
      dataStore.toggleLayerVisibility(layerId)
    }

    return {
      layers,
      toggleLayer
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 左側面板樣式 (Left Panel Styles)
 */
.my-font-size-xl {
  font-size: 1.25rem;
}
.my-font-size-lg {
    font-size: 1.1rem;
}
.my-letter-spacing-lg{
    letter-spacing: .2rem;
}
.my-bg-color-gray-300{
    background-color: #e2e8f0;
}
</style> 