<script>
  import { computed, ref } from 'vue';
  import { useDataStore } from '../stores/dataStore';
  import { ICONS, getIcon, getLayerIcon } from '../utils/utils.js';

  export default {
    name: 'LeftView',
    props: {},
    emits: [],
    setup() {
      const dataStore = useDataStore();

      // 建立一個 ref 來引用模板中的圖層列表 DOM 元素
      const layerListRef = ref(null);

      // 建立一個計算屬性，從 store 中獲取圖層數據。當 store 的 state 改變時，這裡會自動更新。
      const layers = computed(() => dataStore.layers);

      /**
       * 🔘 切換圖層可見性
       * 呼叫 store 中的 action 來切換指定圖層的顯示/隱藏狀態
       * @param {string} layerId - 要切換的圖層 ID
       */
      const toggleLayer = (layerId) => {
        dataStore.toggleLayerVisibility(layerId);
      };

      /**
       * ℹ️ 獲取通用圖標資訊
       * 根據提供的鍵名 (key)，從圖標常數中獲取對應的圖標物件
       * @param {string} iconKey - 圖標的鍵名 (例如 'drag', 'loading')
       */
      const getIconInfo = (iconKey) => {
        return getIcon(iconKey);
      };

      // 📤 將需要暴露給 <template> 使用的數據和方法返回
      return {
        layers,
        toggleLayer,
        layerListRef,
        getIconInfo,
        getLayerIcon,
        ICONS,
      };
    },
  };
</script>

<template>
  <div class="bg-light border-end h-100 d-flex flex-column overflow-hidden">
    <div class="p-3">
      <h1 class="my-font-size-lg my-letter-spacing-lg text-center m-3">臺北市長照資訊</h1>
    </div>

    <div class="overflow-auto" ref="layerListRef">
      <div class="mb-3">
        <div v-for="group in layers" :key="group.groupName" class="p-3">
          <div class="d-flex align-items-center pb-2">
            <div class="my-title-xs">{{ group.groupName }}</div>
          </div>

          <div>
            <div
              v-for="layer in group.groupLayers"
              :key="layer.id"
              class="d-flex align-items-center justify-content-between shadow-sm mb-1"
            >
              <div
                class="d-flex align-items-center flex-grow-1"
                @click="toggleLayer(layer.id)"
                style="cursor: pointer"
              >
                <div
                  class="d-flex align-items-center justify-content-center my-color-white my-font-size-md"
                  :style="{
                    backgroundColor: layer.color,
                    minHeight: '40px',
                    minWidth: '40px',
                  }"
                >
                  <i
                    :class="getLayerIcon(layer.name).icon"
                    :title="getLayerIcon(layer.name).zh"
                  ></i>
                </div>
                <div class="d-flex align-items-center my-bg-white px-3 flex-grow-1">
                  <div class="my-content-sm text-truncate">
                    {{ layer.name }}
                  </div>

                  <div v-if="layer.isLoading" class="ms-auto">
                    <i
                      :class="getIconInfo('loading').icon"
                      class="text-primary"
                      style="font-size: 12px"
                    ></i>
                  </div>
                </div>
              </div>

              <div class="px-2">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'switch-' + layer.id"
                    :checked="layer.visible"
                    :disabled="layer.isLoading"
                    @change="toggleLayer(layer.id)"
                  />
                  <label class="form-check-label visually-hidden" :for="'switch-' + layer.id">
                    {{ layer.visible ? getIconInfo('visible').zh : getIconInfo('hidden').zh }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 載入中圖標的旋轉動畫 */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .fa-spinner {
    animation: spin 1s linear infinite;
  }
</style>
