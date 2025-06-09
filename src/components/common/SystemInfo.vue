<!-- 💻 SystemInfo.vue - 系統資訊顯示組件 (System Information Display Component) -->
<!-- 提供統一格式的系統資訊項目顯示，包含圖示、標籤和數值 -->
<template>
  <!-- 📊 系統資訊項目容器 (System Info Item Container) -->
  <!-- 使用 Bootstrap Flexbox 布局，對齊圖示、標籤和數值 -->
  <div class="d-flex align-items-center mb-2">
    <!-- 🔍 FontAwesome 圖示 (FontAwesome Icon) -->
    <!-- 動態圖示顯示，根據 icon prop 渲染對應的 FontAwesome 圖示 -->
    <i :class="`fas fa-${icon} me-2 text-muted`"></i>
    
    <!-- 📝 資訊標籤 (Information Label) -->
    <!-- 顯示系統資訊的描述文字 -->
    <small class="text-muted">{{ label }}:</small>
    
    <!-- 📊 資訊數值 (Information Value) -->
    <!-- 顯示實際的系統資訊數值，支援自定義樣式 -->
    <small :class="`ms-auto fw-bold ${statusClass || 'text-white'}`">{{ value }}</small>
  </div>
</template>

<script>
/**
 * 💻 SystemInfo.vue - 系統資訊顯示組件
 * 
 * 🎯 功能說明：
 * 1. 📊 提供統一格式的系統資訊項目顯示
 * 2. 🔍 支援 FontAwesome 圖示自定義
 * 3. 🎨 支援狀態顏色自定義（成功、警告、錯誤等）
 * 4. 📏 使用 Bootstrap 佈局系統，確保對齊一致
 * 5. 📱 響應式設計，適應不同螢幕尺寸
 * 
 * 🏗️ 架構說明：
 * - 圖示區域：使用 FontAwesome 圖示庫
 * - 標籤區域：顯示資訊描述
 * - 數值區域：顯示實際數值，支援樣式自定義
 * 
 * 💡 設計理念：
 * - 可重用性：標準化的系統資訊顯示格式
 * - 彈性配置：支援圖示、顏色、內容的完全自定義
 * - 視覺一致性：與整體設計系統保持一致
 */
export default {
  name: 'SystemInfo',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 📝 資訊標籤文字 */
    label: {
      type: String,
      required: true
    },
    /** 📊 資訊數值（支援字串或數字） */
    value: {
      type: [String, Number],
      required: true
    },
    /** 🔍 FontAwesome 圖示名稱（不含 'fa-' 前綴） */
    icon: {
      type: String,
      required: true
    },
    /** 🎨 狀態樣式類別（Bootstrap 或自定義 CSS 類別） */
    statusClass: {
      type: String,
      default: ''
    }
  }
}
</script> 