<script>
  import { computed, ref } from 'vue';
  import { useDataStore } from '@/stores/dataStore.js';
  import { ICONS, getIcon, getLayerIconName, getLayerIconHtml } from '../utils/utils.js';

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
        getLayerIconName,
        getLayerIconHtml,
        ICONS,
      };
    },
  };
</script>

<template>
  <div class="my-bg-gray-100 h-100 d-flex flex-column overflow-hidden">
    <div class="p-3">
      <h1 class="my-font-size-lg my-letter-spacing-lg text-center m-3">臺北市長照資訊</h1>
    </div>

    <div class="flex-grow-1 overflow-auto layer-list-container" ref="layerListRef">
      <div class="mb-3">
        <div v-for="group in layers" :key="group.groupName" class="p-3">
          <div class="d-flex align-items-center pb-2">
            <div class="my-title-xs">{{ group.groupName }}</div>
          </div>

          <div v-for="layer in group.groupLayers" :key="layer.layerId" class="mb-1">
            <!-- 圖層卡片 -->
            <div
              class="btn rounded-0 border-0 d-flex shadow-sm my-bg-white-hover p-0"
              @click="toggleLayer(layer.layerId)"
            >
              <div class="d-flex w-100">
                <!-- 圖層圖示 -->
                <div
                  class="d-flex"
                  :style="{
                    backgroundColor: layer.color,
                    width: '6px',
                  }"
                ></div>
                <!-- 圖層名稱 -->
                <div class="d-flex align-items-center text-start px-3 py-2">
                  <span class="my-content-sm">
                    {{ layer.name }}
                  </span>
                  <span class="my-content-xs ms-2">
                    {{ layer.summaryData?.totalCount }}
                  </span>
                </div>
              </div>
              <!-- 切換圖層可見性 -->
              <div class="d-none d-lg-flex align-items-center justify-content-center px-3 py-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 🎨 圖層切換開關樣式 (Layer Toggle Switch Styles) */
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
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 優化背景色過渡 */
  }

  label:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    background: var(--my-color-white);
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 優化滑動過渡 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加陰影增強立體感 */
  }

  input:checked + label {
    background: var(--my-color-green);
  }

  /* 🎯 優化按壓動畫效果 (Optimized Press Animation) */
  label:active:after {
    width: 16px; /* 減少拉伸寬度，更自然 */
    transition: width 0.15s cubic-bezier(0.4, 0, 0.2, 1); /* 快速響應按壓 */
  }

  input:checked + label:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
</style>
