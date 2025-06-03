/**
 * 🚀 應用程式主入口文件 (Main Application Entry Point)
 * 
 * 功能說明：
 * 1. 🎨 引入Bootstrap和自定義主題樣式
 * 2. 🧩 初始化Vue應用程式和組件
 * 3. 🗺️ 設定路由和狀態管理
 * 4. 🌍 掛載應用程式到DOM
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 🎨 引入樣式文件 (Import Style Files)
import 'bootstrap/dist/css/bootstrap.min.css'      // Bootstrap CSS框架
import 'leaflet/dist/leaflet.css'                 // Leaflet地圖樣式
import '@fortawesome/fontawesome-free/css/all.min.css'  // Font Awesome圖示
import './assets/css/common.css'                   // 共用樣式（已包含主題色彩配置）

console.log('🎨 樣式文件載入完成')

// 🚀 創建並配置Vue應用程式 (Create and Configure Vue Application)
const app = createApp(App)

// 🗄️ 創建Pinia實例 (Create Pinia Instance)
const pinia = createPinia()

// 🗺️ 使用路由 (Use Router)
app.use(router)

// 🗄️ 使用Pinia狀態管理 (Use Pinia State Management)
app.use(pinia)

// 🌍 掛載應用程式 (Mount Application)
app.mount('#app')

console.log('🚀 空間分析視覺化平台已啟動')
console.log('��️ Pinia狀態管理已初始化')
