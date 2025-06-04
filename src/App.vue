<template>
  <!-- 🏠 App.vue - 主應用程式組件，使用Bootstrap實現滿版無空隙佈局 -->
  <div id="app" class="d-flex flex-column vh-100">
    
    <!-- 📥 載入覆蓋層 (Loading Overlay) -->
    <LoadingOverlay 
      :isVisible="isLoading" 
      :loadingText="loadingText"
      :progress="loadingProgress"
      :showProgress="showLoadingProgress"
      :subText="loadingSubText" />

    <!-- 📱 主要內容區域 (Main Content Area) - 使用Bootstrap flex-grow-1佔滿剩餘空間 -->
    <div class="flex-grow-1 d-flex flex-column overflow-hidden">
      
      <!-- 🚀 路由視圖 - 使用Bootstrap佈局 -->
      <div class="flex-grow-1">
        <router-view />
      </div>
    </div>

    <!-- 🦶 頁腳區域 (Footer Area) - Bootstrap sticky footer，緊貼底部無空隙 -->
    <footer class="my-app-footer bg-dark text-light py-2 mt-auto">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 text-md-start text-center">
            <small>© 2024 空間分析視覺化平台. All rights reserved.</small>
          </div>
          <div class="col-md-6 text-md-end text-center">
            <small>
              Powered by <a href="https://vuejs.org/" target="_blank" class="text-light text-decoration-none">Vue.js</a> & 
              <a href="https://leafletjs.com/" target="_blank" class="text-light text-decoration-none">Leaflet</a> & 
              <a href="https://d3js.org/" target="_blank" class="text-light text-decoration-none">D3.js</a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
/**
 * 🏠 App.vue - 應用程式主組件
 * 
 * 功能說明：
 * 1. 📱 提供應用程式整體框架
 * 2. 📥 管理全域載入狀態
 * 3. 🦶 提供應用程式頁腳
 * 4. 🚀 管理路由導航
 */
import { ref } from 'vue'

// 🧩 組件引入
import LoadingOverlay from './components/LoadingOverlay.vue'

export default {
  name: 'App',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   */
  components: {
    LoadingOverlay
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup() {
    // ⏳ 載入狀態 (Loading States)
    const isLoading = ref(false)
    const loadingText = ref('載入中...')
    const loadingProgress = ref(0)
    const showLoadingProgress = ref(false)
    const loadingSubText = ref('')

    // 📤 返回響應式數據和函數 (Return Reactive Data and Functions)
    return {
      // ⏳ 載入狀態
      isLoading,
      loadingText,
      loadingProgress,
      showLoadingProgress,
      loadingSubText
    }
  }
}
</script>

<style>
/**
 * 🎨 應用程式全域樣式 (Application Global Styles)
 * 
 * 引入共用CSS並定義全域樣式，主要使用Bootstrap佈局系統
 */
@import './assets/css/common.css';

/* 📱 全域防止選取樣式 (Global No-Select Style) - 拖曳時使用 */
.my-no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 🔧 拖拉調整器樣式 (Resize Handle Styles) */
/* 🔧 垂直拖曳調整器 (Vertical Resizer) */
.my-resizer-vertical {
  min-width: 4px;
  max-width: 4px;
  cursor: col-resize;
  background-color: #dee2e6;
  transition: all 0.2s ease;
}

.my-resizer-vertical:hover,
.my-resizer-vertical.dragging {
  min-width: 6px;
  max-width: 6px;
  background-color: #007bff;
}

/* 🔧 水平拖曳調整器 (Horizontal Resizer) */
.my-resizer-horizontal {
  min-height: 4px;
  max-height: 4px;
  cursor: row-resize;
  background-color: #dee2e6;
  transition: all 0.2s ease;
}

.my-resizer-horizontal:hover,
.my-resizer-horizontal.dragging {
  min-height: 6px;
  max-height: 6px;
  background-color: #007bff;
}

/* 🔧 拖拉時的全域樣式 (Global Dragging Styles) */
body.my-no-select {
  cursor: inherit !important;
}

body.my-no-select * {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

/* 📱 響應式設計 (Responsive Design) - 使用Bootstrap斷點 */
@media (max-width: 768px) {
  .my-resizer-vertical {
    min-width: 6px;
    max-width: 6px;
  }
  
  .my-resizer-horizontal {
    min-height: 6px;
    max-height: 6px;
  }
  
  .my-resizer-vertical:hover,
  .my-resizer-vertical.dragging {
    min-width: 8px;
    max-width: 8px;
  }
  
  .my-resizer-horizontal:hover,
  .my-resizer-horizontal.dragging {
    min-height: 8px;
    max-height: 8px;
  }
}
</style>
