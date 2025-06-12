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

      // 📤 將需要暴露給 <template> 使用的數據和方法返回
      return {
        layers,
        toggleLayer,
        layerListRef,
        getIcon,
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

    <div class="overflow-auto layer-list-container" ref="layerListRef">
      <div class="mb-3">
        <div v-for="group in layers" :key="group.groupName" class="p-3">
          <div class="d-flex align-items-center pb-2">
            <div class="my-title-xs">{{ group.groupName }}</div>
          </div>

          <div v-for="layer in group.groupLayers" :key="layer.layerId" class="mb-1">
            <button
              class="btn rounded-0 border-0 d-flex align-items-center justify-content-between shadow-sm my-bg-white-hover w-100 p-3"
              @click="toggleLayer(layer.layerId)"
            >
              <div class="d-flex align-items-center">
                <!-- 圖層圖示 -->
                <div
                  class="d-none d-lg-flex align-items-center justify-content-center rounded-circle my-color-white my-font-size-xs p-2 me-3"
                  :style="{
                    backgroundColor: layer.color,
                    minHeight: '28px',
                    minWidth: '28px',
                  }"
                >
                  <i
                    :class="getLayerIcon(layer.name).icon"
                    :title="getLayerIcon(layer.name).zh"
                  ></i>
                </div>
                <!-- 圖層名稱 -->
                <div class="d-flex align-items-center text-start w-100">
                  <span class="my-content-sm">
                    {{ layer.name }}
                  </span>
                  <span class="my-content-xs ms-2">
                    {{ layer.summaryData?.totalCount }}
                  </span>
                </div>
              </div>
              <!-- 切換圖層可見性 -->
              <div
                class="d-none d-lg-flex align-items-center justify-content-center ms-3"
                :style="{
                  'min-width': '32px',
                }"
              >
                <input
                  type="checkbox"
                  :id="'switch-' + layer.layerId"
                  :for="'switch-' + layer.layerId"
                  :checked="layer.visible"
                  :disabled="layer.isLoading"
                  @change="toggleLayer(layer.layerId)"
                />
                <label for="switch"></label>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* https://www.tpisoftware.com/tpu/articleDetails/2744 */

  input[type='checkbox'] {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  label {
    cursor: pointer;
    width: 28px;
    height: 16px;
    background: var(--my-color-gray-300);
    display: block;
    border-radius: 16px;
    position: relative;
  }

  label:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 12px;
    transition: 0.2s;
  }

  input:checked + label {
    background: var(--my-color-success-500);
  }

  label:active:after {
    width: 28px;
  }

  input:checked + label:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
</style>
