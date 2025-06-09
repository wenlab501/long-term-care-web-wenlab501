
<script>
/**
 * 🎛️ LeftPanel.vue - 左側控制面板組件
 * 
 * 功能說明：
 * 1. 🗺️ 提供圖層顯示控制功能，資料來源為 Pinia store
 * 2. 📋 顯示應用程式標題和標誌
 * 3. ⏳ 處理圖層載入狀態顯示
 * 4. 🔘 提供圖層開關的視覺回饋
 * 
 * 架構說明：
 * - 標題區域：顯示應用名稱和圓形標誌
 * - 控制區域：動態顯示所有圖層的開關按鈕
 * - 狀態管理：透過 Pinia store 管理圖層狀態
 * 
 * 設計理念：
 * - 簡化版本，減少卡片使用，節省空間
 * - 使用緊湊樣式提高空間利用率
 * - 響應式設計，適應不同面板寬度
 */

// 🔧 Vue Composition API 引入
import { computed } from 'vue'
// 📦 Pinia 數據存儲引入
import { useDataStore } from '../stores/dataStore'

export default {
  name: 'LeftPanel',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的數據和狀態
   * 
   * 注意：由於使用 Pinia store 管理狀態，大部分 props 已被移除
   */
  props: {
    // Props 現在大多已過時，因為我們從 store 獲取狀態
    // 保留此區域以備未來擴展使用
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   * 向父組件發送的事件
   * 
   * 注意：由於直接調用 store actions，emits 也已大幅減少
   */
  emits: [
    // Emits 也已減少，因為直接呼叫 store actions
    // 保留此區域以備未來擴展使用
  ],

  /**
   * 🔧 組件設定函數 (Component Setup)
   * 使用 Composition API 設定組件邏輯
   */
  setup() {
    // 📦 取得 Pinia 數據存儲實例
    const dataStore = useDataStore()

    /**
     * 🗺️ 圖層列表計算屬性 (Layers Computed Property)
     * 從 Pinia store 獲取所有圖層資訊
     * 包含圖層 ID、名稱、可見性、載入狀態等
     */
    const layers = computed(() => dataStore.layers)

    /**
     * 🔘 切換圖層可見性 (Toggle Layer Visibility)
     * 透過 Pinia store 的 action 切換指定圖層的顯示狀態
     * 
     * @param {string} layerId - 要切換的圖層 ID
     */
    const toggleLayer = (layerId) => {
      dataStore.toggleLayerVisibility(layerId)
    }

    // 📤 返回響應式數據和函數給模板使用
    return {
      layers,        // 圖層列表
      toggleLayer    // 圖層切換函數
    }
  }
}
</script>

<template>
  <!-- 🎛️ 左側控制面板組件 (Left Control Panel Component) -->
  <!-- 提供圖層管理、資料載入控制等功能的側邊面板 -->
  <div class="bg-light border-end h-100 d-flex flex-column" style="overflow: hidden;">
    
    <!-- 📋 面板標題區域 (Panel Header Section) -->
    <!-- 顯示應用程式標題和圓形標誌 -->
    <div class="p-3" style="min-width: 0;">
      <h1 class="my-font-size-xl" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
        <!-- 🏢 標題和圖示區域 (Title and Icon Area) -->
        <div class="d-flex flex-column align-items-center justify-content-center m-3">
          <!-- 🔘 圓形標誌圖示 (Circular Logo Icon) -->
          <div class="rounded-circle my-bg-color-gray-300 p-4"></div>
          <!-- 📝 應用程式標題文字 (Application Title Text) -->
          <div class="my-font-size-lg my-letter-spacing-lg mt-3">臺北市長照資訊</div>
        </div>
      </h1>
    </div>

    <!-- 🎛️ 主控制區域 (Main Control Area) -->
    <!-- 使用緊湊樣式，包含所有圖層控制功能 -->
    <div class="flex-grow-1 overflow-auto p-3" style="min-width: 0;">
      
      <!-- 🗺️ 圖層控制卡片 (Layer Control Card) -->
      <!-- 動態顯示所有可用圖層，並提供開關控制 -->
      <div class="mb-3">
        <div class="vstack gap-2">
          <!-- 🔄 圖層列表迴圈 (Layer List Loop) -->
          <!-- 遍歷 Pinia store 中的所有圖層 -->
          <div v-for="layer in layers" :key="layer.id" class="d-flex justify-content-between align-items-center">
            <!-- 📝 圖層名稱標籤 (Layer Name Label) -->
            <label class="form-label mb-0">{{ layer.name }}</label>
            
            <!-- 🔘 圖層開關按鈕 (Layer Toggle Button) -->
            <!-- 顯示圖層狀態：開啟/關閉/載入中 -->
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
              <!-- ⏳ 載入動畫指示器 (Loading Animation Indicator) -->
              <span v-if="layer.isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <!-- 📝 按鈕狀態文字 (Button Status Text) -->
              <span v-else>{{ layer.visible ? '開啟' : '關閉' }}</span>
            </button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
/**
 * 🎨 左側面板樣式 (Left Panel Styles)
 * 
 * 定義左側控制面板的視覺樣式，包含字體、顏色、間距等設定
 */

/* 📝 大號字體樣式 (Extra Large Font Style) */
.my-font-size-xl {
  font-size: 1.25rem; /* 20px，用於主標題 */
}

/* 📝 中大號字體樣式 (Large Font Style) */
.my-font-size-lg {
  font-size: 1.1rem; /* 17.6px，用於副標題 */
}

/* 📝 大字間距樣式 (Large Letter Spacing Style) */
.my-letter-spacing-lg {
  letter-spacing: .2rem; /* 增加字母間距，提升視覺質感 */
}

/* 🎨 灰色背景色樣式 (Gray Background Color Style) */
.my-bg-color-gray-300 {
  background-color: #e2e8f0; /* 淺灰色，用於圓形標誌背景 */
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  .my-font-size-xl {
    font-size: 1.1rem; /* 在小螢幕上縮小字體 */
  }
  
  .my-font-size-lg {
    font-size: 1rem; /* 在小螢幕上縮小字體 */
  }
  
  .my-letter-spacing-lg {
    letter-spacing: .1rem; /* 在小螢幕上減少字間距 */
  }
}

/* 🎛️ 控制按鈕樣式調整 (Control Button Style Adjustments) */
.btn-sm {
  transition: all 0.2s ease; /* 平滑的按鈕狀態轉換 */
}

.btn-sm:hover:not(.disabled) {
  transform: translateY(-1px); /* 懸停時輕微上移效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 懸停時陰影效果 */
}

/* 📋 面板內容區域樣式 (Panel Content Area Styles) */
.vstack {
  /* 確保垂直堆疊元素之間有適當間距 */
}

.form-label {
  font-weight: 500; /* 中等字重，提升可讀性 */
  color: #374151; /* 深灰色文字 */
}
</style> 