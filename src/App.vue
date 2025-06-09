<template>
  <!-- 🏠 App.vue - 主應用程式組件 (Main Application Component) -->
  <!-- 提供應用程式整體框架，使用 Bootstrap 實現滿版無空隙佈局 -->
  <div id="app" class="d-flex flex-column vh-100">
    
    <!-- ⏳ 載入覆蓋層 (Loading Overlay) -->
    <!-- 全域載入狀態顯示，當資料處理時阻止用戶互動 -->
    <LoadingOverlay 
      :isVisible="isLoading" 
      :loadingText="loadingText"
      :progress="loadingProgress"
      :showProgress="showLoadingProgress"
      :subText="loadingSubText" />

    <!-- 📱 主要內容區域 (Main Content Area) -->
    <!-- 使用 Bootstrap flex-grow-1 佔滿剩餘空間，實現滿版佈局 -->
    <div class="flex-grow-1 d-flex flex-column overflow-hidden">
      
      <!-- 🚀 路由視圖區域 (Router View Area) -->
      <!-- Vue Router 的動態組件渲染區域，根據路由顯示不同頁面 -->
      <div class="flex-grow-1">
        <router-view />
      </div>
    </div>

    <!-- 🦶 頁腳區域 (Footer Area) -->
    <!-- Bootstrap sticky footer，緊貼底部無空隙，提供版權和技術資訊 -->
    <footer class="my-app-footer bg-dark text-light py-2 mt-auto">
      <div class="container-fluid">
        <div class="row">
          <!-- 📝 版權資訊區域 (Copyright Information Area) -->
          <div class="col-md-6 text-md-start text-center">
            <small>© 2024 空間分析視覺化平台. All rights reserved.</small>
          </div>
          <!-- 🔗 技術鳴謝連結區域 (Technology Credits Links Area) -->
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
 * 1. 🏗️ 提供應用程式整體框架和佈局結構
 * 2. ⏳ 管理全域載入狀態和進度顯示
 * 3. 🦶 提供應用程式頁腳，包含版權和技術資訊
 * 4. 🚀 管理 Vue Router 的路由導航系統
 * 5. 📱 實現響應式滿版佈局，無邊距和空隙
 * 
 * 架構說明：
 * - 載入層：全域載入覆蓋層，處理應用層級的載入狀態
 * - 內容層：路由視圖容器，動態顯示不同頁面組件
 * - 頁腳層：固定在底部的資訊欄，提供版權和技術鳴謝
 * 
 * 設計理念：
 * - 使用 Vue 3 Composition API
 * - Bootstrap 5 響應式設計系統
 * - 滿版無邊距佈局設計
 * - 模組化組件架構
 */

// 🔧 Vue Composition API 引入
import { ref } from 'vue'
// 🧩 組件引入
import LoadingOverlay from './components/LoadingOverlay.vue'

export default {
  name: 'App',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   * 註冊應用程式層級使用的組件
   */
  components: {
    LoadingOverlay    // 載入覆蓋層組件
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   * 使用 Composition API 設定應用程式層級的狀態管理
   */
  setup() {
    // ⏳ 全域載入狀態管理 (Global Loading State Management)
    /** ⏳ 是否顯示載入覆蓋層 */
    const isLoading = ref(false)
    /** 📝 載入文字提示 */
    const loadingText = ref('載入中...')
    /** 📊 載入進度百分比 (0-100) */
    const loadingProgress = ref(0)
    /** 📊 是否顯示進度條 */
    const showLoadingProgress = ref(false)
    /** 📝 載入子文字說明 */
    const loadingSubText = ref('')

    // 📤 返回響應式數據和函數給模板使用 (Return Reactive Data and Functions)
    return {
      // ⏳ 載入狀態
      isLoading,             // 載入狀態開關
      loadingText,           // 載入主要文字
      loadingProgress,       // 載入進度
      showLoadingProgress,   // 是否顯示進度條
      loadingSubText         // 載入輔助文字
    }
  }
}
</script>

<style>
/**
 * 🎨 應用程式全域樣式 (Application Global Styles)
 * 
 * 引入共用 CSS 並定義應用程式層級的樣式
 * 注意：大部分樣式已移至 common.css 中統一管理
 */

/* 📦 引入共用樣式表 (Import Common Stylesheets) */
@import './assets/css/common.css';

/* 📱 應用程式特定樣式 (App-Specific Styles) */
/* 其他樣式已整合至 common.css 中，避免重複定義 */
</style>
