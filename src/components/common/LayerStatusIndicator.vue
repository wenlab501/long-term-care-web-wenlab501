<!-- 🔍 LayerStatusIndicator.vue - 圖層狀態指示器組件 (Layer Status Indicator Component) -->
<!-- 提供視覺化的圖層狀態顯示，包含載入、可見性、錯誤等狀態指示 -->
<template>
  <!-- 📊 圖層狀態容器 (Layer Status Container) -->
  <!-- 使用 Bootstrap 佈局顯示圖層名稱和狀態指示器 -->
  <div class="d-flex align-items-center justify-content-between">
    <!-- 📝 圖層名稱 (Layer Name) -->
    <!-- 顯示圖層的識別名稱 -->
    <span class="fw-medium">{{ layerName }}</span>
    
    <!-- 🔍 狀態指示器群組 (Status Indicator Group) -->
    <!-- 包含多種狀態的視覺化指示器 -->
    <div class="d-flex align-items-center">
      <!-- ⏳ 載入狀態指示器 (Loading Status Indicator) -->
      <!-- 當圖層正在載入時顯示旋轉動畫 -->
      <div v-if="isLoading" class="spinner-border spinner-border-sm text-primary me-2" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      
      <!-- 👁️ 可見性狀態指示器 (Visibility Status Indicator) -->
      <!-- 顯示圖層是否可見的眼睛圖示 -->
      <i :class="visibilityIconClass" :title="visibilityTooltip"></i>
      
      <!-- ⚠️ 錯誤狀態指示器 (Error Status Indicator) -->
      <!-- 當圖層載入失敗時顯示警告圖示 -->
      <i v-if="hasError" class="fas fa-exclamation-triangle text-warning ms-1" title="載入錯誤"></i>
    </div>
  </div>
</template>

<script>
/**
 * 🔍 LayerStatusIndicator.vue - 圖層狀態指示器組件
 * 
 * 🎯 功能說明：
 * 1. 📊 提供圖層狀態的視覺化指示
 * 2. ⏳ 顯示載入進度和狀態
 * 3. 👁️ 指示圖層可見性狀態
 * 4. ⚠️ 顯示錯誤和警告狀態
 * 5. 🎨 使用 FontAwesome 圖示和 Bootstrap 樣式
 * 6. 💡 提供工具提示增強用戶體驗
 * 
 * 🏗️ 架構說明：
 * - 圖層名稱區域：顯示圖層識別資訊
 * - 狀態指示器區域：多種狀態的視覺化顯示
 * - 響應式佈局：適應不同容器尺寸
 * 
 * 💡 設計理念：
 * - 直觀性：使用通用的視覺符號表示狀態
 * - 即時性：實時反映圖層狀態變化
 * - 資訊密度：在有限空間內提供豐富的狀態資訊
 */
export default {
  name: 'LayerStatusIndicator',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 📝 圖層名稱 */
    layerName: {
      type: String,
      required: true
    },
    /** ⏳ 是否正在載入 */
    isLoading: {
      type: Boolean,
      default: false
    },
    /** 👁️ 是否可見 */
    isVisible: {
      type: Boolean,
      default: true
    },
    /** ⚠️ 是否有錯誤 */
    hasError: {
      type: Boolean,
      default: false
    }
  },
  
  /**
   * 🧮 計算屬性 (Computed Properties)
   */
  computed: {
    /** 👁️ 可見性圖示樣式類別 */
    visibilityIconClass() {
      return this.isVisible 
        ? 'fas fa-eye text-success' 
        : 'fas fa-eye-slash text-muted';
    },
    /** 💡 可見性工具提示文字 */
    visibilityTooltip() {
      return this.isVisible ? '圖層可見' : '圖層隱藏';
    }
  }
}
</script>

<style scoped>
.layer-status-indicator {
  font-size: 1.5rem;
}
</style> 