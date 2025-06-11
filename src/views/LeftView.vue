<script>
  import { computed } from 'vue';
  import { useDataStore } from '../stores/dataStore';

  export default {
    name: 'LeftView',

    /**
     * 🔧 組件屬性定義 (Component Props)
     * 接收來自父組件的數據和狀態
     *
     * 注意：由於使用 Pinia store 管理狀態，大部分 props 已被移除
     */
    props: {
      // Props 現在大多已過時，因為我們從 store 獲取狀態
      // 保留此區域以備未來擴展使用
    },

    /**
     * 📡 組件事件定義 (Component Events)
     * 向父組件發送的事件
     *
     * 注意：由於直接調用 store actions，emits 也已大幅減少
     */
    emits: [
      // Emits 也已減少，因為直接呼叫 store actions
      // 保留此區域以備未來擴展使用
    ],

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup() {
      // 📦 取得 Pinia 數據存儲實例
      const dataStore = useDataStore();

      /**
       * 🗺️ 圖層列表計算屬性 (Layers Computed Property)
       * 從 Pinia store 獲取所有圖層資訊
       * 包含圖層 ID、名稱、可見性、載入狀態等
       */
      const layers = computed(() => dataStore.layers);

      /**
       * 🔘 切換圖層可見性 (Toggle Layer Visibility)
       * 透過 Pinia store 的 action 切換指定圖層的顯示狀態
       *
       * @param {string} layerId - 要切換的圖層 ID
       */
      const toggleLayer = (layerId) => {
        dataStore.toggleLayerVisibility(layerId);
      };

      // 📤 返回響應式數據和函數給模板使用
      return {
        layers, // 圖層列表
        toggleLayer, // 圖層切換函數
      };
    },
  };
</script>

<template>
  <!-- 🎛️ 左側控制面板組件 (Left Control Panel Component) -->
  <!-- 提供圖層管理、資料載入控制等功能的側邊面板 -->
  <div class="bg-light border-end h-100 d-flex flex-column overflow-hidden">
    <!-- 📋 面板標題區域 (Panel Header Section) -->
    <div class="p-3" style="min-width: 0">
      <h1
        class="my-font-size-xl"
        style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
      >
        <div class="d-flex flex-column align-items-center justify-content-center m-3">
          <div class="rounded-circle my-bg-color-gray-300 p-4"></div>
          <div class="my-font-size-lg my-letter-spacing-lg mt-3">臺北市長照資訊</div>
        </div>
      </h1>
    </div>

    <!-- 🎛️ 主控制區域 (Main Control Area) -->
    <div class="flex-grow-1 overflow-auto p-3">
      <!-- 🗺️ 圖層控制卡片 (Layer Control Card) -->
      <!-- 動態顯示所有可用圖層群組，並提供開關控制 -->
      <div class="mb-3">
        <!-- 🔄 圖層群組列表迴圈 (Layer Group List Loop) -->
        <!-- 遍歷 Pinia store 中的所有圖層群組 -->
        <div v-for="group in layers" :key="group.groupName" class="mb-3">
          <!-- 📋 群組標題 (Group Title) -->
          <h6 class="text-muted mb-2">{{ group.groupName }}</h6>

          <!-- 🗂️ 群組內圖層列表 (Group Layers List) -->
          <div class="vstack gap-2 ps-2">
            <!-- 🔄 群組內圖層迴圈 (Group Layers Loop) -->
            <div
              v-for="layer in group.groupLayers"
              :key="layer.id"
              class="d-flex justify-content-between align-items-center"
            >
              <!-- 📝 圖層名稱標籤 (Layer Name Label) -->
              <label class="form-label mb-0">{{ layer.name }}</label>

              <!-- 🔘 圖層開關按鈕 (Layer Toggle Button) -->
              <!-- 顯示圖層狀態：開啟/關閉/載入中 -->
              <button
                type="button"
                class="btn btn-sm"
                style="width: 60px"
                :class="{
                  'btn-success': layer.visible,
                  'btn-outline-secondary': !layer.visible,
                  disabled: layer.isLoading,
                }"
                @click="toggleLayer(layer.id)"
                :disabled="layer.isLoading"
              >
                <!-- ⏳ 載入動畫指示器 (Loading Animation Indicator) -->
                <span
                  v-if="layer.isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <!-- 📝 按鈕狀態文字 (Button Status Text) -->
                <span v-else>{{ layer.visible ? '開啟' : '關閉' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
