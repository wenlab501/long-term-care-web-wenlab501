<!-- 📋 DetailItem.vue - 詳細資訊項目組件 (Detail Information Item Component) -->
<!-- 提供統一格式的詳細資訊顯示，適用於物件屬性、統計數據等資訊展示 -->
<template>
  <!-- 📊 詳細資訊項目容器 (Detail Info Item Container) -->
  <!-- 使用 Bootstrap Flexbox 布局，左側標籤右側數值的標準格式 -->
  <div class="d-flex justify-content-between align-items-center py-1">
    <!-- 📝 資訊標籤 (Information Label) -->
    <!-- 顯示屬性或欄位的名稱描述 -->
    <span class="text-muted">{{ label }}:</span>
    
    <!-- 📊 資訊數值 (Information Value) -->
    <!-- 顯示實際的數值或內容，支援多種數據類型 -->
    <span class="fw-bold">{{ value }}</span>
  </div>
</template>

<script>
/**
 * 📋 DetailItem.vue - 詳細資訊項目組件
 * 
 * 🎯 功能說明：
 * 1. 📊 提供標準化的詳細資訊顯示格式
 * 2. 📏 使用 Bootstrap 佈局確保對齊一致性
 * 3. 🎨 提供清楚的視覺層次（標籤淡色、數值強調）
 * 4. 📱 響應式設計，適應不同螢幕尺寸
 * 5. 🔧 高度可重用，適用於各種資訊顯示場景
 * 
 * 🏗️ 架構說明：
 * - 標籤區域：顯示欄位或屬性名稱
 * - 數值區域：顯示對應的內容或數值
 * - 使用 Flexbox 確保左右對齊
 * 
 * 💡 設計理念：
 * - 簡潔性：最小化的設計，專注於內容呈現
 * - 一致性：與整體設計系統保持統一風格
 * - 可讀性：清楚的視覺對比和層次結構
 */
export default {
  name: 'DetailItem',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 📝 資訊標籤文字 */
    label: {
      type: String,
      required: true
    },
    /** 📊 資訊數值（支援字串、數字或其他類型） */
    value: {
      type: [String, Number, Boolean, Object],
      required: true
    }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
.lead {
  word-wrap: break-word; /* Ensure long values wrap */
}
</style> 