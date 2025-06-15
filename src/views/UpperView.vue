<template>
  <!-- 📊 上半部面板組件 (Upper Panel Component) -->
  <div class="d-flex flex-column h-100">
    <!-- 📱 分頁內容區域 (Tab Content Area) -->
    <!-- 地圖和儀表板滿版顯示，提供無縫的用戶體驗 -->
    <div class="flex-grow-1 overflow-hidden position-relative">
      <!-- 🎛️ 統一的導航按鈕組 (Unified Navigation Buttons) -->
      <!-- 浮動在左上角，提供地圖和儀表板之間的快速切換 -->
      <div class="position-absolute top-0 start-0 m-3" style="z-index: 1000">
        <div class="my-view-switcher-controls">
          <!-- 🗺️ 地圖視圖按鈕 (Map View Button) -->
          <button
            class="btn btn-sm my-view-switcher-btn"
            :class="{
              'my-view-switcher-active': activeTab === 'map',
            }"
            @click="$emit('update:activeTab', 'map')"
            title="地圖視圖"
          >
            <i class="fas fa-map"></i>
          </button>
          <!-- 📊 儀表板按鈕 (Dashboard Button) -->
          <button
            class="btn btn-sm my-view-switcher-btn"
            :class="{
              'my-view-switcher-active': activeTab === 'dashboard',
            }"
            @click="$emit('update:activeTab', 'dashboard')"
            title="資料儀表板"
          >
            <i class="fas fa-chart-bar"></i>
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
          :zoomLevel="zoomLevel"
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
          :containerHeight="contentHeight"
          :isPanelDragging="isPanelDragging"
          :activeMarkers="activeMarkers"
        />
      </div>

      <!-- 🐛 調試信息區域 (Debug Information Area) -->
      <!-- 當分頁狀態異常時顯示，協助開發者診斷問題 -->
      <div
        v-if="activeTab !== 'map' && activeTab !== 'dashboard'"
        class="h-100 d-flex align-items-center justify-content-center"
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
      MapView,
      DashboardView,
    },

    /**
     * 🔧 組件屬性定義 (Component Props)
     * 接收來自父組件的配置和狀態數據
     */
    props: {
      activeTab: { type: String, default: 'map' },
      mainPanelWidth: { type: Number, default: 60 },
      contentHeight: { type: Number, default: 500 },
      showTainanLayer: { type: Boolean, default: false },
      selectedFilter: { type: String, default: '' },
      zoomLevel: { type: Number, default: 11 },
      isPanelDragging: { type: Boolean, default: false },
      activeMarkers: { type: Number, default: 0 },
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
        (newTab, oldTab) => {
          console.log('🔄 UpperView: Tab changed from', oldTab, 'to', newTab);

          nextTick(() => {
            if (newTab === 'map' && mapView.value) {
              console.log('🗺️ UpperView: Updating map after tab switch');
              // 🗺️ 刷新地圖大小，解決容器變化導致的顯示問題
              mapView.value.invalidateSize();

              // 如果是從其他分頁切換到地圖，延遲一點再刷新確保DOM完全渲染
              setTimeout(() => {
                if (mapView.value) {
                  mapView.value.invalidateSize();
                  // 強制重新載入圖層，解決分頁切換後圖層消失的問題
                  mapView.value.invalidateSize();
                  console.log(
                    '🗺️ UpperView: Map size invalidated and layers force updated after tab switch'
                  );
                }
              }, 100);
            }
            // Dashboard現在是純文字統計，不需要刷新圖表
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
          }
          // Dashboard現在是純文字統計，不需要重新計算圖表大小
        });
      });

      /**
       * 🎯 高亮顯示指定地圖特徵 (Highlight Feature on Map)
       * 如果當前不在地圖分頁，會自動切換到地圖分頁再執行高亮
       *
       * @param {Object} highlightData - 包含 layerId 和 id 的高亮數據物件
       */
      const highlightFeature = (highlightData) => {
        console.log('🎯 UpperView: highlightFeature called with data:', highlightData);

        // 如果當前不在地圖分頁，先切換到地圖分頁
        if (props.activeTab !== 'map') {
          emit('update:activeTab', 'map');

          // 等待分頁切換完成後再執行高亮
          nextTick(() => {
            mapView.value?.highlightFeature(highlightData);
          });
        } else {
          // 如果已經在地圖分頁，直接執行高亮
          mapView.value?.highlightFeature(highlightData);
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

  /**
   * �� UpperView 組件專屬樣式 (UpperView Component Scoped Styles)
   */

  /* ✨ 視圖切換控制項樣式 (View Switcher Controls Styles) */
  .my-view-switcher-controls {
    display: flex; /* 使用 Flexbox 佈局 */
    align-items: center; /* 垂直對齊 */
    gap: 8px; /* 按鈕間距 */
    background: rgba(255, 255, 255, 0.85); /* 半透明白色背景 */
    padding: 6px 10px; /* 內邊距 */
    border-radius: 8px; /* 圓角 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 陰影效果 */
    backdrop-filter: blur(12px) saturate(180%); /* 強化霧化效果 */
    -webkit-backdrop-filter: blur(12px) saturate(180%); /* Safari 支援 */
    border: 1px solid rgba(255, 255, 255, 0.3); /* 半透明邊框增強玻璃效果 */
    transition: all 0.3s ease; /* 平滑過渡效果 */
  }

  /* 🔘 視圖切換按鈕樣式 (View Switcher Button Styles) */
  .my-view-switcher-btn {
    background: transparent; /* 透明背景 */
    border: none; /* 無邊框 */
    color: var(--my-text-secondary); /* 次要文字顏色 */
    width: 32px; /* 固定寬度 */
    height: 32px; /* 固定高度 */
    display: flex; /* Flexbox 佈局 */
    align-items: center; /* 垂直置中 */
    justify-content: center; /* 水平置中 */
    border-radius: 6px; /* 圓角 */
    transition: all 0.2s ease; /* 平滑過渡 */
    font-size: 0.875rem; /* 圖標大小 */
  }

  /* 🔘 視圖切換按鈕懸停效果 (View Switcher Button Hover) */
  .my-view-switcher-btn:hover {
    background: rgba(0, 123, 255, 0.1); /* 淺藍色背景 */
    color: var(--my-primary-color); /* 主要顏色 */
    transform: translateY(-1px); /* 輕微上移 */
  }

  /* 🔘 視圖切換按鈕激活狀態 (View Switcher Button Active) */
  .my-view-switcher-active {
    background: var(--my-primary-color) !important; /* 主要顏色背景 */
    color: white !important; /* 白色文字 */
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3); /* 藍色陰影 */
  }

  /* 🔘 視圖切換按鈕激活懸停效果 (View Switcher Button Active Hover) */
  .my-view-switcher-active:hover {
    background: var(--my-primary-hover) !important; /* 主要顏色懸停 */
    transform: translateY(-1px); /* 輕微上移 */
  }
</style>
