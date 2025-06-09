<!-- 🔘 ActionButton.vue - 動作按鈕組件 (Action Button Component) -->
<!-- 提供統一樣式的動作按鈕，支援圖示、文字、狀態等自定義配置 -->
<template>
  <!-- 🔘 Bootstrap 按鈕 (Bootstrap Button) -->
  <!-- 支援多種樣式、尺寸和狀態的標準化按鈕組件 -->
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    :title="tooltip"
    @click="handleClick">
    
    <!-- ⏳ 載入狀態指示器 (Loading Status Indicator) -->
    <!-- 當按鈕處於載入狀態時顯示旋轉動畫 -->
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status">
      <span class="visually-hidden">載入中...</span>
    </span>
    
    <!-- 🔍 FontAwesome 圖示 (FontAwesome Icon) -->
    <!-- 當不在載入狀態且有指定圖示時顯示 -->
    <i v-else-if="icon" :class="`fas fa-${icon} ${text ? 'me-2' : ''}`"></i>
    
    <!-- 📝 按鈕文字 (Button Text) -->
    <!-- 顯示按鈕的文字內容 -->
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script>
/**
 * 🔘 ActionButton.vue - 動作按鈕組件
 * 
 * 🎯 功能說明：
 * 1. 🎨 提供統一樣式的動作按鈕介面
 * 2. 🔍 支援 FontAwesome 圖示顯示
 * 3. ⏳ 支援載入狀態和禁用狀態
 * 4. 🎨 支援多種 Bootstrap 按鈕樣式
 * 5. 📏 支援多種按鈕尺寸配置
 * 6. 💡 提供工具提示功能
 * 
 * 🏗️ 架構說明：
 * - 按鈕容器：使用 Bootstrap 按鈕樣式系統
 * - 圖示區域：可選的 FontAwesome 圖示
 * - 文字區域：可選的按鈕文字內容
 * - 狀態指示：載入動畫和禁用狀態
 * 
 * 💡 設計理念：
 * - 一致性：統一的按鈕樣式和行為
 * - 彈性：支援多種配置和自定義
 * - 可用性：清楚的狀態反饋和無障礙支援
 */
export default {
  name: 'ActionButton',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 📝 按鈕文字內容 */
    text: {
      type: String,
      default: ''
    },
    /** 🔍 FontAwesome 圖示名稱（不含 'fa-' 前綴） */
    icon: {
      type: String,
      default: ''
    },
    /** 🎨 Bootstrap 按鈕變體（primary, secondary, success 等） */
    variant: {
      type: String,
      default: 'primary'
    },
    /** 📏 按鈕尺寸（sm, lg 等） */
    size: {
      type: String,
      default: ''
    },
    /** 🚫 是否禁用按鈕 */
    disabled: {
      type: Boolean,
      default: false
    },
    /** ⏳ 是否處於載入狀態 */
    loading: {
      type: Boolean,
      default: false
    },
    /** 💡 工具提示文字 */
    tooltip: {
      type: String,
      default: ''
    }
  },
  
  /**
   * 📤 組件事件定義 (Component Events)
   */
  emits: ['click'],
  
  /**
   * 🧮 計算屬性 (Computed Properties)
   */
  computed: {
    /** 🎨 按鈕樣式類別組合 */
    buttonClasses() {
      const classes = ['btn', `btn-${this.variant}`];
      
      if (this.size) {
        classes.push(`btn-${this.size}`);
      }
      
      return classes.join(' ');
    }
  },
  
  /**
   * 🔧 組件方法 (Component Methods)
   */
  methods: {
    /** 🖱️ 處理按鈕點擊事件 */
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event);
      }
    }
  }
}
</script> 