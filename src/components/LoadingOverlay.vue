<template>
  <!-- ⏳ 載入覆蓋層組件 (Loading Overlay Component) -->
  <!-- 在資料載入時顯示，提供視覺化的載入進度回饋和狀態提示 -->
  <div class="my-loading-overlay" v-if="isVisible">
    <!-- 📄 載入內容卡片 (Loading Content Card) -->
    <!-- 包含載入動畫、文字提示、進度條等元素的中央卡片 -->
    <div class="my-loading-content">
      <!-- ⏳ 載入動畫圓環 (Loading Animation Spinner) -->
      <!-- Bootstrap 提供的圓形載入動畫，表示系統正在處理請求 -->
      <div class="my-loading-spinner spinner-border text-primary" role="status">
        <!-- 🔍 無障礙輔助文字 (Screen Reader Text) -->
        <!-- 為螢幕閱讀器提供的載入狀態說明 -->
        <span class="visually-hidden">載入中...</span>
      </div>
      
      <!-- 📝 主要載入文字 (Primary Loading Text) -->
      <!-- 顯示當前載入的主要操作或狀態描述 -->
      <div class="my-loading-text">{{ loadingText }}</div>
      
      <!-- 📊 載入進度條區域 (Loading Progress Area) -->
      <!-- 當需要顯示具體進度時，提供視覺化的進度條 -->
      <div class="my-loading-progress" v-if="showProgress && progress >= 0">
        <!-- 📊 Bootstrap 進度條容器 (Bootstrap Progress Container) -->
        <div class="progress">
          <!-- 📊 進度條滑塊 (Progress Bar) -->
          <!-- 根據 progress 屬性動態調整寬度，顯示載入完成百分比 -->
          <div 
            class="progress-bar" 
            role="progressbar" 
            :style="{ width: progress + '%' }"
            :aria-valuenow="progress" 
            aria-valuemin="0" 
            aria-valuemax="100">
            {{ Math.round(progress) }}%
          </div>
        </div>
      </div>

      <!-- 📝 輔助說明文字 (Secondary Text) -->
      <!-- 提供載入操作的詳細說明或提示資訊 -->
      <div v-if="subText" class="text-muted mt-2">
        <small>{{ subText }}</small>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * ⏳ LoadingOverlay.vue - 載入覆蓋層組件
 * 
 * 功能說明：
 * 1. ⏳ 提供全螢幕載入遮罩，防止用戶在載入時進行其他操作
 * 2. 📊 支援進度條顯示，讓用戶了解載入進度
 * 3. 📝 提供自定義載入文字和輔助說明
 * 4. 🎨 使用 Bootstrap 樣式系統，保持設計一致性
 * 5. ♿ 包含無障礙設計，支援螢幕閱讀器
 * 
 * 架構說明：
 * - 覆蓋層：全螢幕半透明背景，阻止用戶互動
 * - 內容卡片：居中顯示的載入資訊卡片
 * - 動畫元素：旋轉載入動畫和進度條
 * 
 * 設計理念：
 * - 視覺回饋：清楚顯示系統正在處理請求
 * - 進度追蹤：可選的進度條提供詳細進度資訊
 * - 用戶體驗：防止載入期間的誤操作
 */

export default {
  name: 'LoadingOverlay',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的載入狀態和配置選項
   */
  props: {
    /** ⏳ 是否顯示載入覆蓋層 */
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    /** 📝 載入過程的主要文字描述 */
    loadingText: {
      type: String,
      default: '載入中...'
    },
    /** 📊 載入進度百分比 (0-100) */
    progress: {
      type: Number,
      default: -1,
      validator: (value) => value >= -1 && value <= 100
    },
    /** 📊 是否顯示進度條 */
    showProgress: {
      type: Boolean,
      default: false
    },
    /** 📝 輔助說明文字 (可選) */
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
 * 使用自定義 CSS 變數系統，與 common.css 中的定義保持一致
 * 提供響應式設計和無障礙支援
 */

/* ⏳ 全螢幕載入覆蓋層 (Full Screen Loading Overlay) */
.my-loading-overlay {
  position: fixed;          /* 固定定位，覆蓋整個視窗 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 半透明深色背景 */
  display: flex;
  justify-content: center;  /* 水平置中 */
  align-items: center;      /* 垂直置中 */
  z-index: 9999;           /* 最高層級，確保在所有元素之上 */
}

/* 📄 載入內容卡片 (Loading Content Card) */
.my-loading-content {
  text-align: center;      /* 文字置中對齊 */
  background-color: #ffffff; /* 白色背景 */
  padding: 2rem;           /* 內邊距 */
  border-radius: 8px;      /* 圓角邊框 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 陰影效果 */
  min-width: 300px;        /* 最小寬度 */
  max-width: 400px;        /* 最大寬度 */
}

/* ⏳ 載入動畫圓環 (Loading Spinner) */
.my-loading-spinner {
  width: 3rem;             /* 動畫尺寸 */
  height: 3rem;
  margin: 0 auto 1rem;     /* 置中並設定下邊距 */
}

/* 📝 主要載入文字 (Primary Loading Text) */
.my-loading-text {
  font-size: 1.25rem;      /* 較大字體 */
  font-weight: 500;        /* 中等字重 */
  color: #374151;          /* 深灰色文字 */
  margin-bottom: 0.5rem;   /* 下邊距 */
}

/* 📊 載入進度條區域 (Loading Progress Area) */
.my-loading-progress {
  margin-top: 1rem;        /* 上邊距 */
}

/* 📊 Bootstrap 進度條自定義 (Bootstrap Progress Customization) */
.my-loading-progress .progress {
  height: 8px;             /* 進度條高度 */
  background-color: #e5e7eb; /* 進度條背景色 */
  border-radius: 4px;      /* 圓角邊框 */
}

/* 📊 進度條滑塊樣式 (Progress Bar Styles) */
.my-loading-progress .progress-bar {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8); /* 藍色漸層背景 */
  transition: width 0.3s ease; /* 寬度變化動畫 */
  font-size: 0.75rem;      /* 小字體顯示百分比 */
  color: white;            /* 白色文字 */
  display: flex;
  align-items: center;     /* 文字垂直置中 */
  justify-content: center; /* 文字水平置中 */
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  .my-loading-content {
    min-width: 250px;       /* 在小螢幕上減少最小寬度 */
    padding: 1.5rem;        /* 在小螢幕上減少內邊距 */
  }
  
  .my-loading-text {
    font-size: 1.1rem;      /* 在小螢幕上縮小字體 */
  }
  
  .my-loading-spinner {
    width: 2.5rem;          /* 在小螢幕上縮小動畫尺寸 */
    height: 2.5rem;
  }
}
</style> 