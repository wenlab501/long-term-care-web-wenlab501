<script>
  import { computed, ref } from 'vue';
  import { useDataStore } from '@/stores/dataStore.js';
  import { getIcon } from '../utils/utils.js';

  export default {
    name: 'LayersTab',

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup() {
      // 📦 取得 Pinia 數據存儲實例
      const dataStore = useDataStore();

      // 建立一個 ref 來引用模板中的圖層列表 DOM 元素
      const layerListRef = ref(null);

      // 建立一個計算屬性，從 store 中獲取圖層數據。當 store 的 state 改變時，這裡會自動更新。
      const layers = computed(() => dataStore.layers);
      const processedLayers = computed(() => {
        return layers.value.map((group) => {
          const newGroup = { ...group, groupLayers: [] };
          const layersToProcess = group.groupLayers.filter((layer) => layer.display !== false);
          const processedOriginalLayerIds = new Set();

          for (const layer of layersToProcess) {
            if (layer._originalLayer) {
              if (!processedOriginalLayerIds.has(layer._originalLayer.layerId)) {
                processedOriginalLayerIds.add(layer._originalLayer.layerId);

                const subLayers = layersToProcess.filter(
                  (l) =>
                    l._originalLayer && l._originalLayer.layerId === layer._originalLayer.layerId
                );

                newGroup.groupLayers.push({
                  isGroup: true,
                  // Use a unique ID for the group wrapper
                  groupId: layer._originalLayer.layerId + '-group',
                  layerTitle: layer._originalLayer.layerTitle,
                  colorName: layer._originalLayer.colorName,
                  subLayers: subLayers,
                });
              }
            } else {
              // This is a normal layer (or a layer with 1 field)
              newGroup.groupLayers.push({
                isGroup: false,
                ...layer,
              });
            }
          }
          return newGroup;
        });
      });
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
        processedLayers,
        toggleLayer,
        layerListRef,
        getIcon,
      };
    },
  };
</script>

<template>
  <div class="h-100 d-flex flex-column overflow-hidden my-bgcolor-gray-100">
    <div class="flex-grow-1 overflow-auto layer-list-container" ref="layerListRef">
      <div class="mb-3">
        <div v-for="group in processedLayers" :key="group.groupName" class="p-3">
          <div class="d-flex align-items-center pb-2">
            <div class="my-title-xs-gray">{{ group.groupName }}</div>
          </div>

          <div
            v-for="item in group.groupLayers"
            :key="item.isGroup ? item.groupId : item.layerId"
            class="mb-1"
          >
            <!-- Grouped Layers -->
            <div v-if="item.isGroup">
              <div class="rounded-0 border-0 d-flex flex-column shadow-sm my-bgcolor-white p-0">
                <div class="d-flex">
                  <div
                    class="d-flex"
                    :class="`my-bgcolor-${item.colorName}`"
                    style="min-width: 6px"
                  ></div>
                  <div class="w-100">
                    <div class="d-flex align-items-center text-start w-100 px-3 py-2">
                      <span class="my-content-sm-black">{{ item.layerTitle }}</span>
                    </div>
                  </div>
                </div>
                <div class="px-3 pb-2 pt-1 d-flex flex-wrap" style="gap: 0.5rem">
                  <button
                    v-for="subLayer in item.subLayers"
                    :key="subLayer.layerId"
                    class="btn rounded-pill"
                    :class="{
                      'my-btn-green-1': subLayer.visible,
                      'my-btn-gray-2': !subLayer.visible,
                    }"
                    style="
                      padding: 0.1rem 0.5rem;
                      font-size: 0.75rem;
                      border: 1px solid;
                      border-color: var(--my-color-gray-200) !important;
                    "
                    @click.stop="toggleLayer(subLayer.layerId)"
                  >
                    {{ subLayer.layerFields[0].layerSubtitle }}
                  </button>
                </div>
              </div>
            </div>
            <!-- 圖層卡片 -->
            <div
              v-else
              class="btn rounded-0 border-0 d-flex shadow-sm my-bgcolor-white-hover p-0"
              @click="toggleLayer(item.layerId)"
            >
              <!-- 圖層圖示 -->
              <div
                class="d-flex"
                :class="`my-bgcolor-${item.colorName}`"
                style="min-width: 6px"
              ></div>
              <div class="w-100">
                <div class="d-flex">
                  <!-- 圖層名稱 -->
                  <div class="d-flex align-items-center text-start w-100 px-3 py-2">
                    <span class="my-content-sm-black">
                      {{
                        item.layerTitle +
                        (item.layerFields?.[0]?.layerSubtitle
                          ? ' - ' + item.layerFields[0].layerSubtitle
                          : '')
                      }}
                      <span class="my-content-xs-gray ms-2">
                        {{ item.summaryData?.totalCount }}
                      </span>
                    </span>
                  </div>
                  <!-- 切換圖層可見性 -->
                  <div class="d-flex align-items-center justify-content-center px-3 py-2">
                    <input
                      type="checkbox"
                      :id="'switch-' + item.layerId"
                      :checked="item.visible"
                      :disabled="item.isLoading"
                      @change="toggleLayer(item.layerId)"
                    />
                    <label :for="'switch-' + item.layerId"></label>
                  </div>
                </div>
                <div v-if="item.legendData && item.visible" class="px-3 pb-2">
                  <div
                    v-for="data in item.legendData"
                    :key="data.color"
                    class="d-flex align-items-center"
                  >
                    <div
                      style="min-width: 6px; min-height: 18px"
                      :style="{
                        backgroundColor: data.color,
                      }"
                    ></div>
                    <div class="my-content-xs-black text-nowrap ms-2">{{ data.label }}</div>
                  </div>
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
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* 優化滑動過渡 */
  }

  input:checked + label {
    background: var(--my-color-green);
  }

  input:checked + label:after {
    transform: translateX(12px);
  }
</style>
