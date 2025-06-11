<script>
  import ObjectPropertiesTab from '../tabs/ObjectPropertiesTab.vue';
  import { useDataStore } from '../stores/dataStore';
  import { computed, watch } from 'vue';

  export default {
    name: 'RightView',
    components: {
      ObjectPropertiesTab, // 物件屬性分頁組件
    },
    props: {
      /** 🔗 當前作用中的右側分頁標籤 */
      activeRightTab: {
        type: String,
        default: 'results',
      },
      /** 📈 分析結果清單數據 */
      analysisList: {
        type: Array,
        default: () => [],
      },
      /** 📈 選中的分析項目 ID */
      selectedAnalysisId: {
        type: [Number, String],
        default: null,
      },
      /** 📏 右側面板寬度 (像素) */
      rightViewWidth: {
        type: Number,
        default: 250,
      },
    },

    /**
     * 📡 組件事件定義 (Component Events)
     * 定義向父組件發送的事件類型
     */
    emits: [
      'update:activeRightTab', // 更新作用中分頁
      'select-analysis', // 選擇分析項目
      'view-analysis', // 查看分析結果
      'delete-analysis', // 刪除分析項目
      'highlight-feature', // 高亮顯示地圖特徵
    ],

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup(props) {
      // 📦 取得 Pinia 數據存儲實例
      const dataStore = useDataStore();

      /**
       * 📊 計算活躍分析項目數量 (Calculate Active Analysis Count)
       * 統計狀態為「完成」的分析項目數量
       *
       * @returns {number} 完成狀態的分析項目數量
       */
      const getActiveAnalysisCount = () => {
        return props.analysisList.filter((a) => a.status === '完成').length;
      };

      /**
       * 👀 監聽選中物件的變化 (Watch Selected Feature Changes)
       * 當 Pinia store 中的 selectedFeature 變化時執行回調
       */
      watch(
        () => dataStore.selectedFeature,
        (newFeature) => {
          console.log('RightView - selectedFeature changed:', {
            newFeature: newFeature,
            properties: newFeature?.properties,
            store: dataStore,
          });
        },
        { immediate: true }
      ); // immediate: true 表示立即執行一次

      /**
       * 🧮 選中物件計算屬性 (Selected Feature Computed Property)
       * 從 Pinia store 獲取當前選中的地圖物件
       * 提供響應式的選中物件數據給子組件使用
       */
      const selectedFeatureComputed = computed(() => {
        const feature = dataStore.selectedFeature;
        console.log('RightView - Computing selectedFeature:', {
          feature: feature,
          properties: feature?.properties,
        });
        return feature;
      });

      // 📤 返回響應式數據和函數給模板和子組件使用
      return {
        getActiveAnalysisCount, // 活躍分析計數函數
        selectedFeature: selectedFeatureComputed, // 選中物件計算屬性
      };
    },
  };
</script>

<template>
  <!-- 📊 右側面板組件 (Right Panel Component) -->
  <!-- 提供物件屬性查看和分析清單管理功能 -->
  <div
    class="my-right-panel bg-light border-start h-100 d-flex flex-column custom-scroll overflow-hidden"
  >
    <!-- 📄 右側分頁內容區域 (Right Panel Tab Content Area) -->
    <!-- 根據選中的分頁顯示對應的內容組件 -->
    <div class="tab-content flex-grow-1 overflow-auto p-3" style="min-width: 0">
      <!-- 📋 物件屬性分頁內容 (Object Properties Tab Content) -->
      <!-- 顯示選中地圖物件的詳細屬性資訊 -->
      <div v-show="activeRightTab === 'properties'" class="h-100">
        <ObjectPropertiesTab
          :selected-feature="selectedFeature"
          @highlight-feature="$emit('highlight-feature', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /**
 * 🎨 右側面板樣式 (Right Panel Styles)
 *
 * 定義右側面板的視覺樣式，包含基礎佈局、滾動條客製化等
 */

  /* 📋 面板基礎樣式 (Panel Base Styles) */
  .my-right-panel {
    overflow-y: auto; /* 內容溢出時可垂直滾動 */
  }

  /* 📋 自定義滾動條樣式 (Custom Scrollbar Styles) */
  /* WebKit 瀏覽器 (Chrome, Safari, Edge) 的滾動條樣式 */

  /* 滾動條軌道寬度 */
  .custom-scroll::-webkit-scrollbar {
    width: 6px; /* 窄版滾動條，節省空間 */
  }

  /* 滾動條軌道背景 */
  .custom-scroll::-webkit-scrollbar-track {
    background: #f1f1f1; /* 淺灰色軌道背景 */
    border-radius: 3px; /* 圓角軌道 */
  }

  /* 滾動條滑塊樣式 */
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #c1c1c1; /* 中灰色滑塊 */
    border-radius: 3px; /* 圓角滑塊 */
  }

  /* 滾動條滑塊懸停樣式 */
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8; /* 懸停時變深灰色 */
  }

  /* 🔗 分頁導航樣式調整 (Tab Navigation Style Adjustments) */
  .nav-tabs {
    border-bottom: 1px solid #dee2e6; /* 分頁底部邊框 */
  }

  .nav-link {
    transition: all 0.2s ease; /* 平滑的狀態轉換 */
    padding: 0.5rem 1rem; /* 適中的內邊距 */
  }

  .nav-link:hover {
    background-color: #f8f9fa; /* 懸停時的背景色 */
  }

  .nav-link.active {
    border-bottom: 2px solid #007bff; /* 作用中分頁的底部邊框 */
  }

  /* 📄 分頁內容區域樣式 (Tab Content Area Styles) */
  .tab-content {
    min-height: 0; /* 確保內容區域可以正確縮放 */
  }

  /* 📱 響應式設計調整 (Responsive Design Adjustments) */
  @media (max-width: 768px) {
    .nav-tabs {
      font-size: 0.875rem; /* 在小螢幕上縮小字體 */
    }

    .nav-link {
      padding: 0.375rem 0.75rem; /* 在小螢幕上減少內邊距 */
    }

    .custom-scroll::-webkit-scrollbar {
      width: 8px; /* 在觸控設備上增加滾動條寬度，便於操作 */
    }
  }
</style>
