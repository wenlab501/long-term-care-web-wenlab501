<template>
  <!-- 📊 上半部面板組件 (Upper Panel Component) -->
  <div class="d-flex flex-column h-100">
    <!-- 📱 分頁內容區域 (Tab Content Area) -->
    <!-- 地圖和儀表板滿版顯示，提供無縫的用戶體驗 -->
    <div class="flex-grow-1 overflow-hidden position-relative">
      <!-- 🎛️ 統一的導航按鈕組 (Unified Navigation Buttons) -->
      <!-- 浮動在左上角，提供地圖和儀表板之間的快速切換 -->
      <div class="position-absolute top-0 start-0 m-3" style="z-index: 1000">
        <div class="btn-group shadow-sm" role="group">
          <!-- 🗺️ 地圖視圖按鈕 (Map View Button) -->
          <button
            class="btn btn-light btn-sm"
            :class="{
              'btn-primary active': activeTab === 'map',
              'text-primary': activeTab !== 'map',
            }"
            @click="$emit('update:activeTab', 'map')"
          >
            地圖視圖
          </button>
          <!-- 📊 儀表板按鈕 (Dashboard Button) -->
          <button
            class="btn btn-light btn-sm"
            :class="{
              'btn-success active': activeTab === 'dashboard',
              'text-success': activeTab !== 'dashboard',
            }"
            @click="$emit('update:activeTab', 'dashboard')"
          >
            數據儀表板
          </button>
        </div>
      </div>

      <!-- 🗺️ 地圖分頁內容 (Map Tab Content) -->
      <!-- 顯示互動式地圖，支援圖層控制、樣式設定等功能 -->
      <div v-if="activeTab === 'map'" class="h-100">
        <MapView
          ref="mapView"
          :showTainanLayer="showTainanLayer"
          :selectedFilter="selectedFilter"
          :selectedColorScheme="selectedColorScheme"
          :selectedBorderColor="selectedBorderColor"
          :selectedBorderWeight="selectedBorderWeight"
          :zoomLevel="zoomLevel"
          :tainanGeoJSONData="tainanGeoJSONData"
          :maxCount="maxCount"
          @update:zoomLevel="$emit('update:zoomLevel', $event)"
          @update:currentCoords="$emit('update:currentCoords', $event)"
          @update:activeMarkers="$emit('update:activeMarkers', $event)"
          @feature-selected="$emit('feature-selected', $event)"
        />
      </div>

      <!-- 📊 儀表板分頁內容 (Dashboard Tab Content) -->
      <!-- 顯示資料統計圖表、分析結果等視覺化內容 -->
      <div
        v-if="activeTab === 'dashboard'"
        ref="dashboardContainerRef"
        class="h-100 overflow-auto p-3 pt-5"
      >
        <!-- 🎛️ 為導航按鈕組預留空間 (Reserve Space for Navigation Buttons) -->
        <div style="height: 40px"></div>
        <DashboardView
          ref="dashboardView"
          :mergedTableData="mergedTableData"
          :maxCount="maxCount"
          :averageCount="averageCount"
          :dataRegionsCount="dataRegionsCount"
          :containerHeight="contentHeight"
          :isPanelDragging="isPanelDragging"
          :activeMarkers="activeMarkers"
          :totalCount="totalCount"
          :tainanDataSummary="tainanDataSummary"
        />
      </div>

      <!-- 🐛 調試信息區域 (Debug Information Area) -->
      <!-- 當分頁狀態異常時顯示，協助開發者診斷問題 -->
      <div
        v-if="activeTab !== 'map' && activeTab !== 'dashboard'"
        class="h-100 d-flex align-items-center justify-content-center bg-light"
      >
        <div class="text-center">
          <h5>調試信息</h5>
          <p>
            當前 activeTab: <code>{{ activeTab }}</code>
          </p>
          <p>預期值: <code>map</code> 或 <code>dashboard</code></p>
          <button class="btn btn-primary me-2" @click="$emit('update:activeTab', 'map')">
            切換到地圖
          </button>
          <button class="btn btn-success" @click="$emit('update:activeTab', 'dashboard')">
            切換到儀表板
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 📊 UpperView.vue - 上半部面板組件
   *
   * 功能說明：
   * 1. 📑 提供地圖和儀表板的分頁切換功能
   * 2. 🗺️ 管理地圖視圖組件的生命週期和互動
   * 3. 📊 管理儀表板視圖組件的生命週期和更新
   * 4. 📏 響應面板大小變化，自動調整子組件
   * 5. 🎛️ 支援浮動導航按鈕的佈局模式
   * 6. 🎯 提供高亮顯示和地圖操作的統一介面
   *
   * 架構說明：
   * - 導航區域：浮動按鈕組，提供分頁切換
   * - 內容區域：條件渲染地圖或儀表板組件
   * - 調試區域：開發時的錯誤診斷界面
   *
   * 設計理念：
   * - 滿版顯示，最大化內容空間利用
   * - 響應式設計，自動適應容器大小變化
   * - 統一的事件處理和狀態管理
   */

  // 🔧 Vue Composition API 引入
  import { ref, watch, nextTick } from 'vue';
  // 🧩 子組件引入
  import MapView from '../views/MapView.vue';
  import DashboardView from '../views/DashboardView.vue';

  export default {
    name: 'UpperView',

    /**
     * 🧩 組件註冊 (Component Registration)
     * 註冊上半部面板內使用的子組件
     */
    components: {
      MapView, // 地圖視圖組件
      DashboardView, // 儀表板視圖組件
    },

    /**
     * 🔧 組件屬性定義 (Component Props)
     * 接收來自父組件的配置和狀態數據
     */
    props: {
      /** 📑 當前作用中的分頁標籤 */
      activeTab: {
        type: String,
        default: 'map',
        required: true,
      },
      /** 🛠️ 是否正在拖曳面板 (影響滑鼠事件處理) */
      isPanelDragging: {
        type: Boolean,
        default: false,
      },

      /** 📏 主面板寬度百分比 */
      mainPanelWidth: {
        type: Number,
        default: 60,
        required: true,
      },
      /** 📏 內容區域高度 (像素) */
      contentHeight: {
        type: Number,
        default: 500,
        required: true,
      },

      /** 🗺️ 台南圖層顯示狀態 */
      showTainanLayer: {
        type: Boolean,
        default: false,
        required: true,
      },
      /** 🔍 選定的資料篩選條件 */
      selectedFilter: {
        type: String,
        default: '',
        required: true,
      },
      /** 🎨 選定的色票方案 (如 viridis, plasma 等) */
      selectedColorScheme: {
        type: String,
        default: 'viridis',
        required: true,
      },
      /** 🎨 選定的邊框顏色 (十六進位色碼) */
      selectedBorderColor: {
        type: String,
        default: '#666666',
        required: true,
      },
      /** 🎨 選定的邊框寬度 (像素) */
      selectedBorderWeight: {
        type: Number,
        default: 1,
        required: true,
      },
      /** 🔍 地圖縮放等級 (1-20) */
      zoomLevel: {
        type: Number,
        default: 10,
        required: true,
      },

      /** 📊 台南地區的 GeoJSON 地理資料 */
      tainanGeoJSONData: {
        type: Object,
        default: null,
      },
      /** 📊 資料集中的最大計數值 */
      maxCount: {
        type: Number,
        default: 0,
        required: true,
      },
      /** 📋 處理後的合併表格資料 */
      mergedTableData: {
        type: Array,
        default: () => [],
        required: true,
      },
      /** 📊 資料的平均計數值 */
      averageCount: {
        type: Number,
        default: 0,
        required: true,
      },
      /** 📊 包含有效資料的區域數量 */
      dataRegionsCount: {
        type: Number,
        default: 0,
        required: true,
      },
      /** 📍 地圖上作用中的標記數量 */
      activeMarkers: {
        type: Number,
        default: 0,
      },
      /** 📊 資料總計數值 */
      totalCount: {
        type: Number,
        default: 0,
      },
      /** 📊 台南資料的統計摘要 */
      tainanDataSummary: {
        type: Object,
        default: null,
      },
    },

    /**
     * 📡 組件事件定義 (Component Events)
     * 定義向父組件發送的事件類型
     */
    emits: [
      'update:activeTab', // 更新作用中分頁
      'update:zoomLevel', // 更新地圖縮放等級
      'update:currentCoords', // 更新當前座標
      'update:activeMarkers', // 更新作用中標記數量
      'feature-selected', // 選中地圖特徵
    ],

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup(props, { emit }) {
      // 📚 子組件引用 (Child Component References)
      /** 🗺️ 地圖視圖組件引用 */
      const mapView = ref(null);
      /** 📊 儀表板視圖組件引用 */
      const dashboardView = ref(null);
      /** 📊 儀表板容器引用 (用於控制滑鼠事件) */
      const dashboardContainerRef = ref(null);

      /**
       * 👀 監聽拖曳狀態和分頁變化 (Watch Dragging State and Tab Changes)
       * 調整儀表板容器的滑鼠指標事件，防止拖曳時的干擾
       */
      watch(
        [() => props.isPanelDragging, () => props.activeTab],
        ([dragging, tab]) => {
          nextTick(() => {
            if (dashboardContainerRef.value) {
              if (dragging && tab === 'dashboard') {
                // 拖曳時禁用儀表板的滑鼠事件
                dashboardContainerRef.value.style.pointerEvents = 'none';
                console.log('MainContent: Dashboard container pointer-events set to none');
              } else {
                // 恢復儀表板的滑鼠事件
                dashboardContainerRef.value.style.pointerEvents = 'auto';
                console.log(
                  'MainContent: Dashboard container pointer-events set to auto (dragging:',
                  dragging,
                  ', tab:',
                  tab,
                  ')'
                );
              }
            }
          });
        },
        { immediate: true }
      ); // immediate: true 表示立即執行一次

      /**
       * 👀 監聽分頁變化 (Watch Tab Changes)
       * 當切換分頁時觸發相應的更新動作，確保組件正常顯示
       */
      watch(
        () => props.activeTab,
        (newTab) => {
          nextTick(() => {
            if (newTab === 'map' && mapView.value) {
              // 🗺️ 刷新地圖大小，解決容器變化導致的顯示問題
              mapView.value.invalidateSize();
            } else if (newTab === 'dashboard' && dashboardView.value) {
              // 📊 刷新圖表，重新計算圖表尺寸和佈局
              dashboardView.value.refreshCharts();
            }
          });
        }
      );

      /**
       * 👀 監聽面板大小變化 (Watch Panel Size Changes)
       * 當面板寬度或高度變化時，更新相應的子組件
       */
      watch([() => props.mainPanelWidth, () => props.contentHeight], () => {
        nextTick(() => {
          if (props.activeTab === 'map' && mapView.value) {
            // 🗺️ 重新計算地圖大小，適應新的容器尺寸
            mapView.value.invalidateSize();
          } else if (props.activeTab === 'dashboard' && dashboardView.value) {
            // 📊 重新計算圖表大小，適應新的容器尺寸
            dashboardView.value.refreshCharts();
          }
        });
      });

      /**
       * 🎯 高亮顯示指定地圖特徵 (Highlight Feature on Map)
       * 如果當前不在地圖分頁，會自動切換到地圖分頁再執行高亮
       *
       * @param {string} id - 要高亮顯示的區域名稱
       */
      const highlightFeature = (id) => {
        // 如果當前不在地圖分頁，先切換到地圖分頁
        if (props.activeTab !== 'map') {
          emit('update:activeTab', 'map');

          // 等待分頁切換完成後再執行高亮
          nextTick(() => {
            mapView.value?.highlightFeature(id);
          });
        } else {
          // 如果已經在地圖分頁，直接執行高亮
          mapView.value?.highlightFeature(id);
        }
      };

      /**
       * 🔄 重設地圖視圖 (Reset Map View)
       * 將地圖恢復到初始視圖狀態
       */
      const resetView = () => {
        if (props.activeTab === 'map' && mapView.value) {
          mapView.value.resetView();
        }
      };

      /**
       * 🗺️ 適應台南地區邊界 (Fit to Tainan Bounds)
       * 調整地圖視圖以完整顯示台南地區
       */
      const fitToTainanBounds = () => {
        if (props.activeTab === 'map' && mapView.value) {
          mapView.value.fitToTainanBounds();
        }
      };

      /**
       * 📏 手動刷新地圖尺寸 (Manually Refresh Map Size)
       * 當容器大小變化但自動偵測失效時使用
       */
      const invalidateMapSize = () => {
        if (props.activeTab === 'map' && mapView.value) {
          mapView.value.invalidateSize();
        }
      };

      // 📤 返回響應式數據和函數給模板和父組件使用
      return {
        mapView, // 地圖組件引用
        dashboardView, // 儀表板組件引用
        dashboardContainerRef, // 儀表板容器引用
        highlightFeature, // 高亮顯示功能
        resetView, // 重設視圖功能
        fitToTainanBounds, // 適應邊界功能
        invalidateMapSize, // 刷新地圖尺寸功能
      };
    },
  };
</script>

<style scoped>
  /**
 * 🎨 上半部面板樣式 (Upper Panel Styles)
 *
 * 定義上半部面板的視覺樣式，包含導航、內容區域、滾動條等
 */

  /* 🎛️ 固定導航條樣式 (Fixed Navigation Bar Styles) */
  .navbar {
    padding: 0.5rem 1rem; /* 適中的內邊距 */
  }

  .navbar .btn {
    border-radius: 0.375rem; /* 圓角按鈕 */
    margin-right: 0.25rem; /* 按鈕間距 */
  }

  .navbar .btn:last-child {
    margin-right: 0; /* 最後一個按鈕不需要右邊距 */
  }

  /* 📱 內容區域基礎樣式 (Content Area Base Styles) */
  .flex-grow-1 {
    overflow: hidden; /* 防止內容溢出 */
  }

  /* 📊 儀表板區域樣式 (Dashboard Area Styles) */
  .overflow-auto {
    scrollbar-width: thin; /* Firefox 細滾動條 */
    scrollbar-color: #c1c1c1 transparent; /* Firefox 滾動條顏色 */
  }

  /* WebKit 瀏覽器 (Chrome, Safari, Edge) 滾動條樣式 */
  .overflow-auto::-webkit-scrollbar {
    width: 8px; /* 滾動條寬度 */
  }

  .overflow-auto::-webkit-scrollbar-track {
    background: transparent; /* 透明軌道背景 */
  }

  .overflow-auto::-webkit-scrollbar-thumb {
    background-color: #c1c1c1; /* 滾動條滑塊顏色 */
    border-radius: 4px; /* 圓角滑塊 */
  }

  .overflow-auto::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1a1; /* 懸停時的滑塊顏色 */
  }

  /* 🎛️ 導航按鈕組樣式 (Navigation Button Group Styles) */
  .btn-group .btn {
    transition: all 0.3s ease; /* 平滑的狀態轉換動畫 */
  }

  .btn-group .btn:hover {
    transform: translateY(-1px); /* 懸停時輕微上移效果 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* 懸停時陰影效果 */
  }

  .btn-group .btn.active {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 作用中按鈕的陰影 */
  }

  /* 🎨 分頁內容區域樣式 (Tab Content Area Styles) */
  .position-relative {
    /* 為浮動導航按鈕提供定位上下文 */
  }

  /* 🐛 調試信息區域樣式 (Debug Information Area Styles) */
  .bg-light {
    background-color: #f8f9fa !important; /* 淺灰色背景 */
  }

  .text-center code {
    background-color: #e9ecef; /* 程式碼背景色 */
    padding: 0.25rem 0.5rem; /* 程式碼內邊距 */
    border-radius: 0.25rem; /* 程式碼圓角 */
    font-family: 'Courier New', monospace; /* 等寬字體 */
  }
</style>
