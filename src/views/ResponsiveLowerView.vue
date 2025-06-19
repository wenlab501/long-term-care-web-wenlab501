<script>
  import { computed } from 'vue';
  import LayersTab from '../tabs/LayersTab.vue';
  import DataTableTab from '../tabs/DataTableTab.vue';
  import PropertiesTab from '../tabs/PropertiesTab.vue';

  export default {
    name: 'ResponsiveLowerView',

    /**
     * 🧩 組件註冊 (Component Registration)
     * 註冊響應式下半部面板內使用的子組件
     */
    components: {
      LayersTab, // 圖層列表分頁組件
      DataTableTab, // 資料表格分頁組件
      PropertiesTab, // 物件屬性分頁組件
    },

    /**
     * 🔧 組件屬性定義 (Component Props)
     * 接收來自父組件的配置和狀態數據
     */
    props: {
      activeTab: { type: String, default: 'layers' },
      activeRightTab: { type: String, default: 'properties' },
      activeBottomTab: { type: String, default: 'table' },
    },

    /**
     * 📡 組件事件定義 (Component Events)
     * 定義向父組件發送的事件類型
     */
    emits: [
      'update:activeTab', // 更新作用中分頁
      'update:activeRightTab', // 更新右側分頁
      'update:activeBottomTab', // 更新底部分頁
      'highlight-on-map', // 在地圖上高亮顯示
      'highlight-feature', // 高亮顯示特徵
    ],

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup(props, { emit }) {
      /**
       * 📊 計算可用的分頁列表 (Compute Available Tabs)
       * 根據需求顯示不同的分頁選項
       */
      const availableTabs = computed(() => [
        { id: 'layers', name: '圖層', icon: 'fas fa-layer-group' },
        { id: 'table', name: '資料表', icon: 'fas fa-table' },
        { id: 'properties', name: '屬性', icon: 'fa-solid fa-location-dot' },
      ]);

      /**
       * 🔘 切換分頁 (Switch Tab)
       * @param {string} tabId - 分頁 ID
       */
      const switchTab = (tabId) => {
        emit('update:activeTab', tabId);
      };

      // 📤 返回響應式數據和函數給模板使用
      return {
        availableTabs,
        switchTab,
      };
    },
  };
</script>

<template>
  <!-- 📱 響應式下半部面板組件 (Responsive Lower Panel Component) -->
  <div class="d-flex flex-column h-100 my-bgcolor-gray-200">
    <!-- 📄 分頁內容區域 (Tab Content Area) -->
    <div class="flex-grow-1 overflow-hidden">
      <!-- 📋 圖層分頁內容 -->
      <div v-show="activeTab === 'layers'" class="h-100">
        <LayersTab />
      </div>

      <!-- 📊 資料表格分頁內容 -->
      <div v-show="activeTab === 'table'" class="h-100">
        <DataTableTab @highlight-on-map="$emit('highlight-on-map', $event)" />
      </div>

      <!-- 📈 物件屬性分頁內容 -->
      <div v-show="activeTab === 'properties'" class="h-100">
        <PropertiesTab @highlight-feature="$emit('highlight-feature', $event)" />
      </div>
    </div>

    <!-- 📑 分頁導航 (Tab Navigation) - 移到底部，符合手機介面習慣 -->
    <div class="d-flex border-top">
      <button
        v-for="tab in availableTabs"
        :key="tab.id"
        class="rounded-3 border-0 flex-grow-1 py-2 m-1 mb-2"
        :class="{
          'my-btn-transparent': activeTab !== tab.id,
          'my-btn-blue': activeTab === tab.id,
        }"
        @click="switchTab(tab.id)"
      >
        <div class="d-flex flex-column align-items-center justify-content-center">
          <span class="my-font-size-sm"><i :class="tab.icon" class="mb-1"></i></span>
          <span class="my-font-size-xs">{{ tab.name }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
