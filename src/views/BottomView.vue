<script>
  import { ref, watch, nextTick } from 'vue';
  import DataTableTab from '../tabs/DataTableTab.vue';

  export default {
    name: 'BottomView',

    /**
     * 🧩 組件註冊 (Component Registration)
     * 註冊底部面板內使用的子組件
     */
    components: {
      DataTableTab, // 資料表格分頁組件
    },

    /**
     * 🔧 組件屬性定義 (Component Props)
     * 接收來自父組件的配置和狀態數據
     */
    props: {
      activeBottomTab: { type: String, default: 'table' },
      bottomViewHeight: { type: Number, default: 300 },
      isPanelDragging: { type: Boolean, default: false },
    },

    /**
     * 📡 組件事件定義 (Component Events)
     * 定義向父組件發送的事件類型
     */
    emits: [
      'update:activeBottomTab', // 更新作用中底部分頁
      'highlight-on-map', // 在地圖上高亮顯示
      'reset-view', // 重設視圖
    ],

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup(props) {
      // 建立一個 ref 來引用模板中的底部分頁內容 DOM 元素
      const bottomTabContentRef = ref(null);

      /**
       * 👀 監聽作用中底部分頁的變化
       * 當分頁切換時，確保 DOM 更新完成
       */
      watch(
        () => props.activeBottomTab,
        () => {
          // 使用 nextTick 確保 DOM 更新完成後再進行任何後續操作
          nextTick(() => {
            // 這裡可以添加分頁切換後的特殊處理邏輯
            console.log(`✅ 底部分頁已切換至: ${props.activeBottomTab}`);
          });
        }
      );

      // 📤 將需要暴露給 <template> 使用的數據和方法返回
      return {
        bottomTabContentRef,
      };
    },
  };
</script>

<template>
  <!-- 📋 底部面板組件 (Bottom Panel Component) -->
  <!-- 提供資料表格顯示功能 -->
  <div class="bg-white text-dark border-top" :style="{ height: bottomViewHeight + 'px' }">
    <!-- 📄 底部分頁內容區域 (Bottom Tab Content Area) -->
    <!-- 顯示資料表格內容組件 -->
    <div ref="bottomTabContentRef" class="tab-content h-100 overflow-auto">
      <!-- 📊 資料表格分頁內容 (Data Table Tab Content) -->
      <!-- 顯示載入的地理資料，支援搜尋、排序、高亮等功能 -->
      <div class="h-100">
        <DataTableTab @highlight-on-map="$emit('highlight-on-map', $event)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /**
 * 🎨 底部面板組件樣式 (Bottom Panel Component Styles)
 *
 * 定義底部面板的視覺樣式，包含內容區域等
 */

  /* 📋 面板基礎樣式 (Panel Base Styles) */
  .bg-white {
    background-color: #ffffff !important; /* 白色背景 */
  }

  .border-top {
    border-top: 1px solid #dee2e6 !important; /* 上邊框分隔線 */
  }

  /* 📄 分頁內容區域樣式 (Tab Content Area Styles) */
  .tab-content {
    background-color: #ffffff; /* 內容區域背景色 */
    min-height: 0; /* 確保內容區域可以正確縮放 */
  }

  .tab-content.overflow-auto {
    scrollbar-width: thin; /* Firefox 細滾動條 */
    scrollbar-color: #c1c1c1 transparent; /* Firefox 滾動條顏色 */
  }

  /* WebKit 瀏覽器 (Chrome, Safari, Edge) 滾動條樣式 */
  .tab-content.overflow-auto::-webkit-scrollbar {
    width: 8px; /* 垂直滾動條寬度 */
    height: 8px; /* 水平滾動條高度 */
  }

  .tab-content.overflow-auto::-webkit-scrollbar-track {
    background: transparent; /* 透明軌道背景 */
  }

  .tab-content.overflow-auto::-webkit-scrollbar-thumb {
    background-color: #c1c1c1; /* 滾動條滑塊顏色 */
    border-radius: 4px; /* 圓角滑塊 */
  }
</style>
