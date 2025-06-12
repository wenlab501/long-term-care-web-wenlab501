<script>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { useDataStore } from '../stores/dataStore';
  import { ICONS, getIcon, getLayerIcon } from '../utils/utils.js';
  import Sortable from 'sortablejs';

  export default {
    name: 'LeftView',
    props: {},
    emits: [],
    setup() {
      const dataStore = useDataStore();

      // 建立一個 ref 來引用模板中的圖層列表 DOM 元素
      const layerListRef = ref(null);
      // 建立一個 ref 陣列來存放所有 SortableJS 的實例，方便後續管理和銷毀
      const sortableInstances = ref([]);

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

      /**
       * 🔄 初始化拖拉排序功能
       * 為模板中每一個圖層群組（.sortable-group）建立一個 SortableJS 實例，
       * 讓使用者可以透過拖拉來改變圖層順序。
       */
      const initializeDragSort = () => {
        // 1. 安全地清理舊的 Sortable 實例，防止因熱重載 (HMR) 或重複初始化導致記憶體洩漏
        sortableInstances.value.forEach((instance) => {
          try {
            // 確認 instance 存在且有 destroy 方法才呼叫
            if (instance && typeof instance.destroy === 'function') {
              instance.destroy();
            }
          } catch (error) {
            console.warn('清理 Sortable 實例時發生錯誤:', error);
          }
        });
        sortableInstances.value = []; // 清空實例陣列

        // 2. 等待 DOM 更新完成後再執行初始化，確保能抓到所有 .sortable-group 元素
        setTimeout(() => {
          const groupContainers = document.querySelectorAll('.sortable-group');

          groupContainers.forEach((container) => {
            // 防禦性檢查，確保容器元素有效
            if (!container || !container.parentNode) {
              console.warn('跳過無效的容器:', container);
              return;
            }

            try {
              // 3. 為每個容器建立新的 Sortable 實例
              const sortable = new Sortable(container, {
                group: 'shared', // 設定群組名稱為 'shared'，允許圖層在不同群組之間拖拉
                animation: 150, // 拖拉動畫的持續時間 (毫秒)
                handle: '.drag-handle', // 指定只有 `.drag-handle` 元素可以觸發拖拉
                ghostClass: 'sortable-ghost', // 拖拉時，佔位符的 CSS class
                chosenClass: 'sortable-chosen', // 被選中的項目 CSS class
                dragClass: 'sortable-drag', // 正在被拖拉的項目 CSS class
                fallbackOnBody: true, // 解決某些瀏覽器或 CSS 環境下拖拉失效的問題
                swapThreshold: 0.65, // 拖拉項目覆蓋目標區域 65% 時觸發交換

                /**
                 * 拖拉結束時的回呼函式
                 * @param {Event} evt - SortableJS 提供的事件物件
                 */
                onEnd: (evt) => {
                  const { oldIndex, newIndex, from, to, item } = evt;

                  // 安全檢查，確保事件數據完整
                  if (!from || !to || !item) {
                    console.warn('拖拉事件數據不完整');
                    return;
                  }

                  try {
                    // a. 在同一個群組內移動
                    if (from === to && oldIndex !== newIndex) {
                      const sourceGroupIndex = Array.from(
                        document.querySelectorAll('.sortable-group')
                      ).indexOf(from);
                      const sourceGroup = layers.value[sourceGroupIndex];

                      if (sourceGroup && sourceGroup.groupLayers) {
                        // 從陣列中移除被移動的圖層，再插入到新的位置
                        const [movedLayer] = sourceGroup.groupLayers.splice(oldIndex, 1);
                        sourceGroup.groupLayers.splice(newIndex, 0, movedLayer);

                        // 透過重新賦值觸發 Vue 的響應式更新，讓 MapView 等其他組件能同步變化
                        layers.value = [...layers.value];
                      }
                    } else if (from !== to) {
                      // b. 跨群組移動
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
                        // 從源群組陣列中移除
                        const [movedLayer] = sourceGroup.groupLayers.splice(oldIndex, 1);
                        // 加入到目標群組陣列的新位置
                        targetGroup.groupLayers.splice(newIndex, 0, movedLayer);

                        // 同樣觸發響應式更新
                        layers.value = [...layers.value];
                      }
                    }
                  } catch (error) {
                    console.error('處理拖拉結果時發生錯誤:', error);
                  }
                },
              });

              // 將新建立的實例存起來，以便後續清理
              sortableInstances.value.push(sortable);
            } catch (error) {
              console.error('創建 Sortable 實例時發生錯誤:', error);
            }
          });
        }, 50); // 延遲 50ms 確保 DOM 渲染穩定
      };

      /**
       * 🚀 組件掛載 (Mounted) 生命週期鉤子
       * 當組件被掛載到 DOM 上後執行
       */
      onMounted(() => {
        // 使用 setTimeout 確保在所有子元素都渲染完成後才執行初始化
        setTimeout(() => {
          initializeDragSort();
        }, 100);
      });

      /**
       * 🗑️ 組件卸載 (Unmounted) 生命週期鉤子
       * 當組件從 DOM 中被移除前執行
       */
      onUnmounted(() => {
        // 清理所有 Sortable 實例，釋放資源，防止記憶體洩漏
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

          <div class="sortable-group">
            <div
              v-for="layer in group.groupLayers"
              :key="layer.id"
              class="d-flex align-items-center justify-content-between shadow-sm mb-1"
            >
              <div
                class="drag-handle d-flex align-items-center justify-content-between w-100"
                :title="getIconInfo('drag').zh"
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
                <div
                  :for="'switch-' + layer.id"
                  class="d-flex align-items-center my-bg-white px-3"
                  style="cursor: pointer"
                >
                  <div class="my-content-sm text-center text-truncate">
                    {{ layer.name }}
                  </div>

                  <div v-if="layer.isLoading" class="me-2">
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
  /* --- 自訂開關 (Switch) 樣式 --- */
  .form-check-input {
    cursor: pointer;
    width: 2rem !important; /* 強制設定寬度 */
    height: 1rem !important; /* 強制設定高度 */
    border-radius: 0.5rem !important; /* 設定圓角 */
    position: relative; /* 作為偽元素定位的基準 */
    transition: all 0.3s ease; /* 平滑過渡效果 */
  }

  /* 使用 ::before 偽元素來客製化圓球 (thumb) */
  .form-check-input::before {
    content: ''; /* 偽元素必要屬性 */
    position: absolute;
    top: 50%;
    left: 1px;
    width: 14px; /* 圓球寬度 */
    height: 14px; /* 圓球高度 */
    border-radius: 50%; /* 圓形 */
    background-color: white !important; /* 圓球恆為白色 */
    transition: all 0.3s ease;
    transform: translateY(-50%) translateX(0); /* 垂直置中並靠左 */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* 圓球陰影 */
  }

  /* 開啟狀態下，圓球的位置 */
  .form-check-input:checked::before {
    transform: translateY(-50%) translateX(16px); /* 向右移動 */
  }

  /* 開啟狀態的軌道顏色 */
  .form-check-input:checked {
    background-color: #28a745 !important; /* 綠色 */
    border-color: #28a745 !important;
  }

  /* 關閉狀態的軌道顏色 */
  .form-check-input:not(:checked) {
    background-color: var(--my-color-gray-500) !important;
    border-color: var(--my-color-gray-500) !important;
  }

  /* 焦點狀態樣式 */
  .form-check-input:focus {
    border-color: var(--my-color-gray-500);
    outline: 0;
    box-shadow: none; /* 移除預設的藍色光暈 */
  }

  .layer-item:hover {
    border-color: #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 滑鼠懸停時的陰影效果 */
  }

  /* 拖拉手柄樣式 */
  .drag-handle {
    cursor: grab; /* 預設為可抓取的手形游標 */
    color: var(--my-color-gray-400);
  }
  .drag-handle:hover {
    background-color: var(--my-color-gray-200); /* 懸停時的背景色 */
  }
  .drag-handle:active {
    cursor: grabbing; /* 正在拖拉時的游標 */
  }

  /* --- SortableJS 拖拉過程中的視覺回饋樣式 --- */
  /* 佔位符的樣式 (項目被拖走後留下的虛線框) */
  .sortable-ghost {
    opacity: 0.5;
    background-color: #f8f9fa !important;
    border: 2px dashed #007bff !important;
    transform: rotate(2deg); /* 輕微旋轉增加趣味性 */
  }

  /* 被選中項目的樣式 */
  .sortable-chosen {
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3) !important;
    transform: scale(1.02); /* 輕微放大 */
    z-index: 1000;
  }

  /* 正在被拖拉的項目（跟隨滑鼠的那個）的樣式 */
  .sortable-drag {
    transform: rotate(5deg);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
  }

  /* --- 其他樣式 --- */
  /* 無障礙設計：當圖層項目內的任何元素獲得焦點時，為整個項目加上外框 */
  .layer-item:focus-within {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

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

  /* 空群組的提示文字樣式 */
  .sortable-group:empty::before {
    content: '將圖層拖拉到此處';
    display: block;
    padding: 0.75rem;
    text-align: center;
    color: var(--my-color-gray-400);
    font-size: var(--my-font-size-sm);
    border: 2px dashed var(--my-color-gray-300);
  }

  /* 當有項目被拖到某個群組上時，該群組的背景色提示 */
  .sortable-group.sortable-over {
    background-color: var(--my-color-white);
  }
</style>
