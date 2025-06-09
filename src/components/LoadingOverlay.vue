<template>
  <!-- 📥 載入覆蓋層組件 (Loading Overlay Component) -->
  <!-- 在整個畫面上顯示載入狀態，包含旋轉動畫、文字和進度條 -->
  <div class="my-loading-overlay" v-if="isVisible">
    <!-- 📦 載入內容容器 (Loading Content Container) -->
    <div class="my-loading-content">
      <!-- 🔄 Bootstrap 旋轉載入動畫 (Bootstrap Spinner Animation) -->
      <div class="my-loading-spinner spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      
      <!-- 📝 載入狀態文字顯示 (Loading Status Text) -->
      <div class="my-loading-text">{{ loadingText }}</div>
      
      <!-- 📊 進度條顯示 (Progress Bar Display) -->
      <!-- 只有在 showProgress 為 true 且 progress 大於等於 0 時才顯示 -->
      <div class="my-loading-progress" v-if="showProgress && progress >= 0">
        <div class="progress">
          <div class="progress-bar" 
               role="progressbar" 
               :style="{ width: progress + '%' }"
               :aria-valuenow="progress"
               aria-valuemin="0" 
               aria-valuemax="100">
            {{ Math.round(progress) }}%
          </div>
        </div>
      </div>
      
      <!-- 📎 副文字顯示 (Sub Text Display) -->
      <!-- 顯示額外的載入訊息，如處理步驟等 -->
      <div class="mt-3" v-if="subText">
        <small class="text-light">{{ subText }}</small>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 📥 LoadingOverlay.vue - 載入覆蓋層組件
 * 
 * 功能說明：
 * 1. 🔄 顯示載入動畫旋轉器
 * 2. 📝 顯示載入狀態文字
 * 3. 📊 顯示載入進度條（可選）
 * 4. 📎 顯示額外的載入訊息（可選）
 * 5. 🎭 可控制顯示/隱藏狀態
 * 
 * 使用場景：
 * - 資料載入時的全屏覆蓋層
 * - 長時間操作的進度顯示
 * - 防止用戶在載入時進行其他操作
 */
export default {
  name: 'LoadingOverlay',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的載入狀態相關參數
   */
  props: {
    /** 🎭 是否顯示載入覆蓋層 */
    isVisible: {
      type: Boolean,
      default: false
    },
    /** 📝 載入狀態文字 */
    loadingText: {
      type: String,
      default: '載入中...'
    },
    /** 📊 載入進度百分比 (0-100) */
    progress: {
      type: Number,
      default: 0
    },
    /** 📊 是否顯示進度條 */
    showProgress: {
      type: Boolean,
      default: false
    },
    /** 📎 額外的載入訊息文字 */
    subText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 載入覆蓋層樣式 (Loading Overlay Styles)
 * 
 * 實現全屏覆蓋效果，確保載入時用戶無法進行其他操作
 */

/* 📥 主要覆蓋層容器 (Main Overlay Container) */
.my-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 確保在最上層 */
  backdrop-filter: blur(2px); /* 背景模糊效果 */
}

/* 📦 載入內容容器 (Loading Content Container) */
.my-loading-content {
  text-align: center;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.95); /* 半透明白色背景 */
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); /* 深度陰影 */
  backdrop-filter: blur(10px); /* 內容區域模糊效果 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 微細邊框 */
  min-width: 200px;
  max-width: 400px;
}

/* 🔄 載入旋轉器樣式 (Loading Spinner Styles) */
.my-loading-spinner {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
}

/* 📝 載入文字樣式 (Loading Text Styles) */
.my-loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
}

/* 📊 進度條容器樣式 (Progress Bar Container Styles) */
.my-loading-progress {
  margin-top: 1rem;
}

/* 📊 進度條樣式調整 (Progress Bar Style Adjustments) */
.my-loading-progress .progress {
  height: 1.2rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.6rem;
}

.my-loading-progress .progress-bar {
  background: linear-gradient(45deg, #007bff, #0056b3); /* 漸變背景 */
  border-radius: 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  transition: width 0.3s ease; /* 平滑動畫 */
}

/* 📱 響應式設計 (Responsive Design) */
@media (max-width: 768px) {
  .my-loading-content {
    margin: 1rem;
    padding: 1.5rem;
    min-width: auto;
    max-width: calc(100% - 2rem);
  }
  
  .my-loading-text {
    font-size: 1rem;
  }
  
  .my-loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style> 