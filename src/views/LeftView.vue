<script>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { useDataStore } from '../stores/dataStore';
  import { ICONS, getIcon } from '../utils/utils.js';
  import Sortable from 'sortablejs';

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

      // 🎮 DOM 元素引用
      const layerListRef = ref(null);
      const sortableInstances = ref([]);

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

      /**
       * 🎯 獲取圖標資訊 (Get Icon Information)
       * 根據鍵名獲取圖標的文字和 FontAwesome 類名
       *
       * @param {string} iconKey - 圖標鍵名
       * @returns {object} 包含文字和圖標類名的物件
       */
      const getIconInfo = (iconKey) => {
        return getIcon(iconKey);
      };

      /**
       * 🔄 初始化拖拉排序 (Initialize Drag Sort)
       * 為每個圖層群組初始化 SortableJS 實例
       */
      const initializeDragSort = () => {
        // 安全地清理舊的實例
        sortableInstances.value.forEach((instance) => {
          try {
            if (instance && typeof instance.destroy === 'function') {
              instance.destroy();
            }
          } catch (error) {
            console.warn('清理 Sortable 實例時發生錯誤:', error);
          }
        });
        sortableInstances.value = [];

        // 等待 DOM 更新完成
        setTimeout(() => {
          const groupContainers = document.querySelectorAll('.sortable-group');

          groupContainers.forEach((container) => {
            // 確保容器存在且有效
            if (!container || !container.parentNode) {
              console.warn('跳過無效的容器:', container);
              return;
            }

            try {
              const sortable = new Sortable(container, {
                group: 'shared', // 允許跨群組拖拉
                animation: 150,
                handle: '.drag-handle', // 只能透過拖拉手柄拖動
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                fallbackOnBody: true, // 防止在某些情況下拖拉失效
                swapThreshold: 0.65, // 調整拖拉敏感度

                onStart: (evt) => {
                  // 拖拉開始時的處理
                  console.log('開始拖拉:', evt.item.dataset.layerId);
                },

                onEnd: (evt) => {
                  const { oldIndex, newIndex, from, to, item } = evt;

                  // 安全檢查
                  if (!from || !to || !item) {
                    console.warn('拖拉事件數據不完整');
                    return;
                  }

                  try {
                    // 如果在同一個容器內移動
                    if (from === to && oldIndex !== newIndex) {
                      const sourceGroupIndex = Array.from(
                        document.querySelectorAll('.sortable-group')
                      ).indexOf(from);
                      const sourceGroup = layers.value[sourceGroupIndex];

                      if (sourceGroup && sourceGroup.groupLayers) {
                        // 在群組內重新排序
                        const [movedLayer] = sourceGroup.groupLayers.splice(oldIndex, 1);
                        sourceGroup.groupLayers.splice(newIndex, 0, movedLayer);
                        console.log(
                          `圖層 ${movedLayer.name} 在群組內移動: ${oldIndex} -> ${newIndex}`
                        );
                      }
                    } else if (from !== to) {
                      // 跨群組移動
                      const sourceGroupIndex = Array.from(
                        document.querySelectorAll('.sortable-group')
                      ).indexOf(from);
                      const targetGroupIndex = Array.from(
                        document.querySelectorAll('.sortable-group')
                      ).indexOf(to);

                      const sourceGroup = layers.value[sourceGroupIndex];
                      const targetGroup = layers.value[targetGroupIndex];

                      if (
                        sourceGroup &&
                        targetGroup &&
                        sourceGroup.groupLayers &&
                        targetGroup.groupLayers
                      ) {
                        // 從源群組移除
                        const [movedLayer] = sourceGroup.groupLayers.splice(oldIndex, 1);
                        // 加入到目標群組
                        targetGroup.groupLayers.splice(newIndex, 0, movedLayer);
                        console.log(
                          `圖層 ${movedLayer.name} 跨群組移動: ${sourceGroup.groupName} -> ${targetGroup.groupName}`
                        );
                      }
                    }
                  } catch (error) {
                    console.error('處理拖拉結果時發生錯誤:', error);
                  }
                },
              });

              sortableInstances.value.push(sortable);
            } catch (error) {
              console.error('創建 Sortable 實例時發生錯誤:', error);
            }
          });
        }, 50);
      };

      /**
       * 🚀 組件掛載後初始化 (Initialize After Mount)
       */
      onMounted(() => {
        // 等待 DOM 完全渲染後初始化拖拉功能
        setTimeout(() => {
          initializeDragSort();
        }, 100);
      });

      /**
       * 🗑️ 組件卸載時清理 (Cleanup on Unmount)
       */
      onUnmounted(() => {
        // 安全地清理所有 Sortable 實例
        sortableInstances.value.forEach((instance) => {
          try {
            if (instance && typeof instance.destroy === 'function') {
              instance.destroy();
            }
          } catch (error) {
            console.warn('清理 Sortable 實例時發生錯誤:', error);
          }
        });
        sortableInstances.value = [];
      });

      // 📤 返回響應式數據和函數給模板使用
      return {
        layers, // 圖層列表
        toggleLayer, // 圖層切換函數
        layerListRef, // DOM 元素引用
        getIconInfo, // 圖標獲取函數
        ICONS, // 圖標常數
      };
    },
  };
</script>

<template>
  <div class="bg-light border-end h-100 d-flex flex-column overflow-hidden">
    <!-- 面板標題區域 -->
    <div class="p-3">
      <h1>
        <div class="my-font-size-lg my-letter-spacing-lg text-center m-3">臺北市長照資訊</div>
      </h1>
    </div>

    <!-- 主控制區域 -->
    <div class="flex-grow-1 overflow-auto" ref="layerListRef">
      <div class="mb-3">
        <!-- 群組迴圈 -->
        <div v-for="group in layers" :key="group.groupName" class="p-3">
          <!-- 群組標題區域 -->
          <div class="d-flex align-items-center pb-2">
            <i :class="getIconInfo('folder').icon" class="text-muted me-2"></i>
            <div class="my-title-xs">{{ group.groupName }}</div>
          </div>

          <!-- 可排序的圖層容器 -->
          <div class="sortable-group">
            <!-- 群組內圖層 -->
            <div
              v-for="layer in group.groupLayers"
              :key="layer.id"
              class="layer-item d-flex align-items-center shadow-sm bg-white mb-1"
              :data-layer-id="layer.id"
            >
              <!-- 拖拉手柄 -->
              <div class="drag-handle p-2 text-muted" :title="getIconInfo('drag').text">
                <i :class="getIconInfo('drag').icon" style="font-size: 12px"></i>
              </div>

              <!-- 圖層顏色指示器 -->
              <div
                class="layer-color-indicator"
                :style="{
                  backgroundColor: layer.color,
                  minWidth: '4px',
                  minHeight: '40px',
                }"
              ></div>

              <!-- 圖層內容區域 -->
              <div class="flex-grow-1 d-flex align-items-center justify-content-between px-2">
                <!-- 圖層圖標和名稱 -->
                <div class="d-flex align-items-center flex-grow-1">
                  <!-- 圖層類型圖標 -->
                  <i
                    :class="
                      layer.type === 'point'
                        ? getIconInfo('location').icon
                        : getIconInfo('layer').icon
                    "
                    class="text-muted me-2"
                    style="font-size: 14px"
                  ></i>

                  <!-- 圖層名稱 -->
                  <div class="my-content-sm text-truncate flex-grow-1">{{ layer.name }}</div>

                  <!-- 載入狀態指示器 -->
                  <div v-if="layer.isLoading" class="me-2">
                    <i
                      :class="getIconInfo('loading').icon"
                      class="text-primary"
                      style="font-size: 12px"
                    ></i>
                  </div>
                </div>

                <!-- 開關區域 -->
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
                    {{ layer.visible ? getIconInfo('visible').text : getIconInfo('hidden').text }}
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
  /* 開關樣式優化 */
  .form-check-input {
    cursor: pointer;
  }

  .form-check-input:checked {
    background-color: var(--my-color-success-500);
    border-color: var(--my-color-success-500);
  }

  .form-check-input:focus {
    border-color: var(--my-color-success-500);
    outline: 0;
    box-shadow: none;
  }

  /* 🎨 拖拉功能樣式 (Drag & Drop Styles) */
  .sortable-group {
    min-height: 20px; /* 確保空群組也可以接受拖拉項目 */
  }

  .layer-item {
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
    cursor: default;
  }

  .layer-item:hover {
    border-color: #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* 拖拉手柄樣式 */
  .drag-handle {
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    border-radius: 4px 0 0 4px;
    transition: background-color 0.2s ease;
  }

  .drag-handle:hover {
    background-color: #f8f9fa;
    color: #6c757d;
  }

  .drag-handle:active {
    cursor: grabbing;
    background-color: #e9ecef;
  }

  /* 圖層顏色指示器 */
  .layer-color-indicator {
    border-radius: 0;
    transition: opacity 0.2s ease;
  }

  /* SortableJS 預設樣式覆蓋 */
  .sortable-ghost {
    opacity: 0.5;
    background-color: #f8f9fa !important;
    border: 2px dashed #007bff !important;
    transform: rotate(2deg);
  }

  .sortable-chosen {
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3) !important;
    transform: scale(1.02);
    z-index: 1000;
  }

  .sortable-drag {
    transform: rotate(5deg);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
  }

  /* 群組標題樣式增強 */
  .my-title-xs {
    font-weight: 600;
    color: #495057;
  }

  /* 響應式設計：在小螢幕上調整拖拉手柄大小 */
  @media (max-width: 576px) {
    .drag-handle {
      min-width: 24px;
      padding: 0.375rem;
    }

    .drag-handle i {
      font-size: 10px !important;
    }
  }

  /* 圖層項目無障礙設計 */
  .layer-item:focus-within {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* 載入狀態動畫 */
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

  /* 群組容器樣式 */
  .sortable-group:empty::before {
    content: '將圖層拖拉到此處';
    display: block;
    padding: 12px;
    text-align: center;
    color: #adb5bd;
    font-size: 0.875rem;
    border: 2px dashed #dee2e6;
    border-radius: 4px;
    background-color: #f8f9fa;
  }

  /* 拖拉時的視覺反饋 */
  .sortable-group.sortable-over {
    background-color: rgba(0, 123, 255, 0.05);
    border-radius: 4px;
  }
</style>
