<script>
  import { computed, ref } from 'vue';
  import { useDataStore } from '@/stores/dataStore.js';
  import { ICONS, getIcon } from '../utils/utils.js';

  export default {
    name: 'LayersTab',

    /**
     * 🔧 LayersTab 組件設定函數
     *
     * 此組件負責顯示和管理地圖圖層的切換介面，支援以下功能：
     * 1. 顯示所有可用的地圖圖層，按分組組織
     * 2. 支援單一圖層和多字段圖層的不同顯示方式
     * 3. 提供圖層可見性切換功能
     * 4. 顯示圖層的圖例資訊
     * 5. 處理分組圖層的展開和收合
     *
     * 技術特點：
     * - 使用 Vue 3 Composition API
     * - 整合 Pinia 狀態管理
     * - 響應式數據處理
     * - 動態圖層分組和渲染
     */
    setup() {
      // 📦 取得 Pinia 數據存儲實例
      // 此實例提供所有圖層數據、狀態管理和操作方法
      const dataStore = useDataStore();

      // 🎯 DOM 引用：圖層列表容器
      // 用於滾動控制、高度計算等 DOM 操作
      const layerListRef = ref(null);

      // 🔽 圖層分組收合狀態管理
      // 用於追蹤每個多字段圖層分組的收合狀態
      // 預設為收合狀態（所有分組都收合）
      const collapsedGroups = ref(new Set());

      // 📑 當前選中的圖層類別 (Active Layer Category)
      const activeLayerCategory = ref('longTermCare');

      // 📊 圖層類別定義 (Layer Category Definitions)
      const layerCategories = [
        { id: 'longTermCare', name: '長照設施', icon: ICONS.elderly_care.icon },
        { id: 'infrastructure', name: '基礎設施', icon: ICONS.building.icon },
        { id: 'geographicData', name: '地理資料', icon: ICONS.geodata.icon },
        { id: 'dataAnalysis', name: '數據分析', icon: ICONS.data_analysis.icon },
      ];

      // 📊 根據選中的類別獲取對應的圖層數據
      const layers = computed(() => {
        switch (activeLayerCategory.value) {
          case 'longTermCare':
            return dataStore.layersLongTermCare;
          case 'infrastructure':
            return dataStore.layersInfrastructure;
          case 'geographicData':
            return dataStore.layersGeographicData;
          case 'dataAnalysis':
            return dataStore.layersDataAnalysis;
          default:
            return dataStore.layers;
        }
      });

      // 🔘 切換圖層類別 (Switch Layer Category)
      const switchLayerCategory = (categoryId) => {
        activeLayerCategory.value = categoryId;
      };

      /**
       * 🔄 處理圖層數據用於分組顯示
       *
       * 此計算屬性負責將 dataStore 中的圖層數據轉換為適合 LayersTab.vue 顯示的格式。
       * 它是整個圖層分組顯示邏輯的核心，處理兩種不同類型的圖層：
       *
       * 📋 數據處理流程：
       * 1. 遍歷所有圖層分組（如：地理統計資料、長照服務據點等）
       * 2. 對於每個分組中的圖層，根據其結構進行分類處理：
       *
       * 🔍 圖層分類邏輯：
       *
       * A. 多字段圖層（有 _originalLayer 屬性）：
       *    - 來源：dataStore 中的 initializeAndExpandLayers 函數處理後的多字段圖層
       *    - 特徵：包含 _originalLayer 和 _fieldIndex 屬性
       *    - 處理方式：
       *      * 按 _originalLayer.layerId 將子圖層分組
       *      * 創建 isGroup: true 的分組對象
       *      * 包含所有相關的子圖層（subLayers 陣列）
       *      * 在 UI 中顯示為一個帶有底線標題的區塊，內含多個子圖層按鈕
       *
       * B. 普通圖層（沒有 _originalLayer 屬性）：
       *    - 來源：單一圖層或單字段圖層
       *    - 特徵：沒有 _originalLayer 屬性
       *    - 處理方式：
       *      * 直接添加到分組中，保持原有顯示方式
       *      * 標記為 isGroup: false
       *
       * 🎯 輸出結構：
       * 每個分組包含：
       * - groupName: 分組名稱（如："地理統計資料"）
       * - groupLayers: 處理後的圖層陣列
       *   - isGroup: true 的分組對象（多字段圖層）
       *   - isGroup: false 的普通圖層對象
       *
       * 🔄 響應式特性：
       * - 當 dataStore.layers 發生變化時自動重新計算
       * - 確保 UI 與數據狀態保持同步
       *
       * @returns {Array} 處理後的圖層分組陣列，用於模板渲染
       * @example
       * // 返回結構示例：
       * [
       *   {
       *     groupName: "地理統計資料",
       *     groupLayers: [
       *       {
       *         isGroup: true,
       *         groupId: "人口統計-group",
       *         layerTitle: "人口統計",
       *         colorName: "purple",
       *         subLayers: [
       *           { layerTitle: "人口統計", layerFields: [{layerSubtitle: "14歲以下"}] },
       *           { layerTitle: "人口統計", layerFields: [{layerSubtitle: "15~64歲"}] }
       *         ]
       *       },
       *       {
       *         isGroup: false,
       *         layerTitle: "單一圖層",
       *         // ... 其他圖層屬性
       *       }
       *     ]
       *   }
       * ]
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
       *
       * 此函數負責處理圖層的顯示/隱藏切換操作，是圖層面板的核心互動功能。
       *
       * 📋 功能說明：
       * 1. 接收圖層 ID 作為參數
       * 2. 呼叫 dataStore 的 toggleLayerVisibility 方法
       * 3. 觸發圖層狀態變更和相關的 UI 更新
       *
       * 🔄 處理流程：
       * 1. 用戶點擊圖層切換開關或圖層卡片
       * 2. 事件處理器調用此函數
       * 3. 函數委託給 dataStore 進行實際的狀態管理
       * 4. dataStore 更新圖層可見性狀態
       * 5. 觸發響應式更新，UI 自動重新渲染
       *
       * 🎯 支援的圖層類型：
       * - 普通圖層：直接切換可見性
       * - 多字段圖層的子圖層：切換特定字段的可見性
       * - 分組圖層：切換整個分組的可見性
       *
       * ⚡ 效能考量：
       * - 使用委託模式，將複雜的狀態管理邏輯交給 dataStore
       * - 避免在組件中重複實現狀態管理邏輯
       * - 確保狀態的一致性和可預測性
       *
       * @param {string} layerId - 要切換的圖層 ID
       * @example
       * // 切換普通圖層
       * toggleLayer('人口統計');
       *
       * // 切換多字段圖層的子圖層
       * toggleLayer('各行政區死亡人口數-112年');
       */
      const toggleLayer = (layerId) => {
        dataStore.toggleLayerVisibility(layerId);
      };

      /**
       * 🔽 切換圖層分組的收合狀態
       * 預設為收合狀態，展開時加入 Set，收合時從 Set 移除
       *
       * 此函數負責處理多字段圖層分組的展開/收合操作。
       *
       * @param {string} groupId - 要切換的分組 ID
       */
      const toggleGroupCollapse = (groupId) => {
        if (collapsedGroups.value.has(groupId)) {
          // 目前是展開狀態，要收合
          collapsedGroups.value.delete(groupId);
        } else {
          // 目前是收合狀態，要展開
          collapsedGroups.value.add(groupId);
        }
        // 觸發響應式更新
        collapsedGroups.value = new Set(collapsedGroups.value);
      };

      /**
       * 🔍 檢查分組是否已收合
       * 預設所有分組都是收合狀態
       *
       * @param {string} groupId - 要檢查的分組 ID
       * @returns {boolean} 是否已收合
       */
      const isGroupCollapsed = (groupId) => {
        // 預設為收合狀態，如果不在 Set 中則表示已收合
        return !collapsedGroups.value.has(groupId);
      };

      // 📤 將需要暴露給 <template> 使用的數據和方法返回
      return {
        processedLayers,
        toggleLayer,
        toggleGroupCollapse,
        isGroupCollapsed,
        layerListRef,
        getIcon,
        activeLayerCategory,
        layerCategories,
        switchLayerCategory,
        ICONS,
      };
    },
  };
</script>

<template>
  <!-- 🎨 圖層面板主容器 -->
  <div class="h-100 d-flex flex-column overflow-hidden my-bgcolor-gray-100">
    <!-- 📑 圖層類別導航 (Layer Category Navigation) -->
    <div class="d-flex align-items-center justify-content-between p-2">
      <button
        v-for="category in layerCategories"
        :key="category.id"
        class="d-flex rounded-3 border-0 flex-grow-1 py-2 mx-1"
        :class="{
          'my-btn-transparent': activeLayerCategory !== category.id,
          'my-btn-blue': activeLayerCategory === category.id,
        }"
        :style="{
          'min-height': '44px',
        }"
        @click="switchLayerCategory(category.id)"
      >
        <div class="d-flex flex-column align-items-center justify-content-center w-100">
          <span class="my-font-size-sm mb-1" v-html="category.icon"></span>
          <span class="my-font-size-xs">{{ category.name }}</span>
        </div>
      </button>
    </div>

    <!-- 📋 圖層列表滾動容器 -->
    <div class="flex-grow-1 overflow-auto layer-list-container" ref="layerListRef">
      <div class="mb-3">
        <!-- 🔄 遍歷所有圖層分組 -->
        <div v-for="group in processedLayers" :key="group.groupName" class="p-3">
          <!-- 📌 分組標題區域 -->
          <div class="d-flex align-items-center pb-2">
            <div class="my-title-xs-gray">{{ group.groupName }}</div>
          </div>

          <!-- 🔄 遍歷分組中的每個圖層項目 -->
          <div
            v-for="item in group.groupLayers"
            :key="item.isGroup ? item.groupId : item.layerId"
            class="mb-1"
          >
            <!-- 📊 多字段圖層分組顯示 -->
            <div v-if="item.isGroup">
              <!-- 🎨 分組容器：包含標題和所有子圖層按鈕 -->
              <div class="rounded-0 border-0 d-flex flex-column shadow-sm my-bgcolor-white p-0">
                <!-- 📌 分組標題區域（整個區域可點擊） -->
                <div
                  class="d-flex btn rounded-0 border-0 shadow-sm my-bgcolor-white-hover p-0"
                  @click="toggleGroupCollapse(item.groupId)"
                >
                  <!-- 🎨 圖層顏色指示條 -->
                  <div
                    class="d-flex"
                    :class="`my-bgcolor-${item.colorName}`"
                    style="min-width: 6px"
                  ></div>
                  <div class="w-100">
                    <!-- 📝 分組標題（帶底線樣式） -->
                    <div class="d-flex align-items-center text-start w-100 px-3 py-2">
                      <span
                        class="my-content-sm-black flex-grow-1"
                        style="text-decoration: underline"
                        >{{ item.layerTitle }}</span
                      >
                      <!-- 🔽 收合按鈕 -->
                      <span
                        v-html="
                          isGroupCollapsed(item.groupId)
                            ? ICONS.chevron_down.icon
                            : ICONS.chevron_up.icon
                        "
                        style="font-size: 12px; color: var(--my-color-gray-600); margin-left: 8px"
                      ></span>
                    </div>
                  </div>
                </div>
                <!-- 🔄 子圖層列表區域（可收合） -->
                <div class="px-0 pt-0" v-show="!isGroupCollapsed(item.groupId)">
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
