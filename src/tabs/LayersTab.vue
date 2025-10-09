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

      /**
       * 🔄 處理圖層數據用於分組顯示
       *
       * 此計算屬性負責將 dataStore 中的圖層數據轉換為適合 LayersTab.vue 顯示的格式：
       *
       * 處理邏輯：
       * 1. 遍歷所有圖層分組
       * 2. 對於每個分組，檢查其中的圖層：
       *    - 如果圖層有 _originalLayer 屬性（來自 dataStore 的多字段展開）：
       *      * 將相同 _originalLayer.layerId 的子圖層分組在一起
       *      * 創建一個分組對象，包含所有子圖層
       *      * 用於在 UI 中顯示為一個圖層區塊，內含多個子圖層按鈕
       *    - 如果圖層沒有 _originalLayer 屬性（普通圖層）：
       *      * 直接添加到分組中，保持原有顯示方式
       *
       * @returns {Array} 處理後的圖層分組陣列，用於模板渲染
       */
      const processedLayers = computed(() => {
        return layers.value.map((group) => {
          // 創建新的分組對象，避免直接修改原始數據
          const newGroup = { ...group, groupLayers: [] };

          // 過濾掉不需要顯示的圖層（display: false）
          const layersToProcess = group.groupLayers.filter((layer) => layer.display !== false);

          // 使用 Set 來追蹤已經處理過的原始圖層ID，避免重複處理
          const processedOriginalLayerIds = new Set();

          for (const layer of layersToProcess) {
            // 🔍 檢查是否為多字段圖層的子圖層（有 _originalLayer 屬性）
            if (layer._originalLayer) {
              // 檢查是否已經處理過這個原始圖層
              if (!processedOriginalLayerIds.has(layer._originalLayer.layerId)) {
                processedOriginalLayerIds.add(layer._originalLayer.layerId);

                // 找出所有屬於同一個原始圖層的子圖層
                const subLayers = layersToProcess.filter(
                  (l) =>
                    l._originalLayer && l._originalLayer.layerId === layer._originalLayer.layerId
                );

                // 🏗️ 創建分組對象，用於在 UI 中顯示為一個圖層區塊
                newGroup.groupLayers.push({
                  isGroup: true, // 標記這是一個分組對象
                  groupId: layer._originalLayer.layerId + '-group', // 唯一的分組ID
                  layerTitle: layer._originalLayer.layerTitle, // 使用原始圖層的標題
                  colorName: layer._originalLayer.colorName, // 使用原始圖層的顏色
                  subLayers: subLayers, // 包含所有子圖層的陣列
                });
              }
            } else {
              // 🔍 普通圖層（沒有 _originalLayer 屬性），保持原有顯示方式
              newGroup.groupLayers.push({
                isGroup: false, // 標記這不是分組對象
                ...layer, // 複製圖層的所有屬性
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
                      <span class="my-content-sm-black">{{ item.layerTitle }}111</span>
                    </div>
                  </div>
                </div>
                <div class="px-0 pt-0">
                  <div v-for="subLayer in item.subLayers" :key="subLayer.layerId">
                    <div
                      class="btn rounded-0 border-0 d-flex shadow-sm my-bgcolor-white-hover p-0 w-100"
                      @click="toggleLayer(subLayer.layerId)"
                    >
                      <div
                        class="d-flex"
                        :class="`my-bgcolor-${subLayer.colorName}`"
                        style="min-width: 6px"
                      ></div>
                      <div class="w-100">
                        <div class="d-flex">
                          <div class="d-flex align-items-center text-start w-100 px-3 py-2">
                            <span class="my-content-sm-black">
                              {{
                                subLayer.layerFields?.[0]?.layerSubtitle
                                  ? subLayer.layerFields[0].layerSubtitle
                                  : ''
                              }}
                              <span class="my-content-xs-gray ms-2">
                                {{ subLayer.summaryData?.totalCount }}
                              </span>
                            </span>
                          </div>
                          <div class="d-flex align-items-center justify-content-center px-3 py-2">
                            <input
                              type="checkbox"
                              :id="'switch-' + subLayer.layerId"
                              :checked="subLayer.visible"
                              :disabled="subLayer.isLoading"
                              @change="toggleLayer(subLayer.layerId)"
                            />
                            <label :for="'switch-' + subLayer.layerId"></label>
                          </div>
                        </div>
                        <div v-if="subLayer.legendData && subLayer.visible" class="px-3 pb-2">
                          <div
                            v-for="data in subLayer.legendData"
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
