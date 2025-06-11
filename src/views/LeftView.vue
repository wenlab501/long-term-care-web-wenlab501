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
  <div class="bg-light border-end h-100 d-flex flex-column overflow-hidden">
    <!-- 面板標題區域 -->
    <div class="p-3">
      <h1>
        <div class="my-font-size-lg my-letter-spacing-lg text-center m-4">臺北市長照資訊</div>
      </h1>
    </div>

    <!-- 主控制區域 -->
    <div class="flex-grow-1 overflow-auto">
      <div class="mb-3">
        <!-- 群組迴圈 -->
        <div
          v-for="group in layers"
          :key="group.groupName"
          class="rounded-4 shadow-sm bg-white p-3 m-3"
        >
          <div class="text-center mb-3">{{ group.groupName }}</div>

          <div class="vstack gap-2 ps-2">
            <!-- 群組內圖 -->
            <div
              v-for="layer in group.groupLayers"
              :key="layer.id"
              class="d-flex justify-content-between align-items-center py-2"
            >
              <div class="d-flex align-items-center">
                <div
                  class="layer-color-indicator me-2"
                  :style="{ backgroundColor: layer.color }"
                ></div>
                {{ layer.name }}
              </div>

              <!-- 開關 -->
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'switch-' + layer.id"
                  :checked="layer.visible"
                  :disabled="layer.isLoading"
                  @change="toggleLayer(layer.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /*  圖層顏色指示器 */
  .layer-color-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  /* 開關樣式優化 */
  .form-check-input:checked {
    background-color: var(--my-color-success-500);
    border-color: var(--my-color-success-500);
  }

  .form-check-input:focus {
    border-color: var(--my-color-success-500);
    outline: 0;
  }
</style>
