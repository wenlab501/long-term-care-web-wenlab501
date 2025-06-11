<script>
  /**
   * 🏠 HomeView.vue - 首頁視圖組件
   *
   * 功能說明：
   * 1. 📱 提供響應式三面板佈局系統（左中右，支援 0-100% 動態調整）
   * 2. 🗺️ 整合地圖視覺化與空間分析功能
   * 3. 📊 管理長照資源數據的載入、處理與分析
   * 4. 🎨 提供多種 Python matplotlib 色票方案
   * 5. 🔧 支援拖拉調整面板大小（完全彈性 0-100% 範圍）
   * 6. 📈 整合 Pinia 狀態管理，統一管理應用程式狀態
   * 7. 🎯 處理地圖互動、特徵選擇、高亮顯示等用戶操作
   *
   * 架構說明：
   * - 佈局系統：三欄式響應式佈局，支援拖曳調整
   * - 狀態管理：整合 Pinia store，管理圖層和資料狀態
   * - 組件組合：組合多個子組件提供完整功能
   *
   * 設計理念：
   * - 滿版無邊距佈局
   * - 直觀的拖曳調整體驗
   */

  // 🔧 Vue Composition API 引入
  import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
  // 🛠️ 工具函數引入
  import { formatNumber } from '../utils/utils.js';
  // 📦 Pinia 狀態管理引入
  import { useDataStore } from '@/stores/dataStore';

  // 🧩 組件引入
  import LoadingOverlay from '../components/LoadingOverlay.vue';
  import LeftView from './LeftView.vue';
  import RightView from './RightView.vue';
  import MiddleView from './MiddleView.vue';

  export default {
    name: 'HomeView',

    /**
     * 🧩 組件註冊 (Component Registration)
     * 註冊首頁使用的所有子組件
     */
    components: {
      LoadingOverlay, // 載入覆蓋層組件
      LeftView, // 左側控制面板組件
      RightView, // 右側面板組件
      MiddleView, // 中間主要內容面板組件
    },

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯和狀態管理
     */
    setup() {
      // 📦 取得 Pinia 數據存儲實例
      const dataStore = useDataStore();

      // 📊 本地資料狀態 (Local Data State)
      /** 📋 表格資料暫存 */
      const tableData = ref([]);
      /** 📊 台南資料統計摘要 */
      const tainanDataSummary = ref({
        totalCount: 0,
        validPoints: 0,
      });

      // 📚 組件引用 (Component References)
      /** 🌟 中間面板組件引用 */
      const middlePanelRef = ref(null);
      /** 🦶 頁腳元素引用 */
      const appFooterRef = ref(null);

      // 📑 分頁狀態 (Tab States)
      /** 🗺️ 主要分頁狀態（地圖/儀表板） */
      const activeTab = ref('map');
      /** 📋 底部分頁狀態（表格/樣式） */
      const activeBottomTab = ref('table');
      /** 📊 右側分頁狀態（屬性/分析） */
      const activeRightTab = ref('properties');

      // 📏 面板大小狀態 (Panel Size States)
      // 使用百分比系統實現響應式佈局
      const MIN_LEFT_PANEL_WIDTH_PERCENT = 5; // 左側面板最小寬度百分比
      /** 📏 左側面板寬度百分比 (0-100%) */
      const leftViewWidth = ref(20);
      /** 📏 右側面板寬度百分比 (0-100%) */
      const rightViewWidth = ref(20);
      /** 📏 瀏覽器視窗寬度 */
      const windowWidth = ref(window.innerWidth);
      /** 📏 瀏覽器視窗高度 */
      const windowHeight = ref(window.innerHeight);
      /** 📏 頁腳高度 */
      const footerHeight = ref(0);

      // 🧮 計算屬性 - 面板尺寸 (Computed Properties - Panel Dimensions)
      /** 📏 左側面板像素寬度 */
      const leftViewWidthPx = computed(() => `${leftViewWidth.value}%`);
      /** 📏 右側面板像素寬度 */
      const rightViewWidthPx = computed(() => `${rightViewWidth.value}%`);
      /** 📏 中間面板寬度百分比 */
      const mainPanelWidth = computed(() => 100 - leftViewWidth.value - rightViewWidth.value);
      /** 📏 中間面板像素寬度 */
      const mainPanelWidthPx = computed(() => `${mainPanelWidth.value}%`);

      /** 📏 中間面板計算高度 */
      const calculatedMiddleViewHeight = computed(() => {
        return windowHeight.value - footerHeight.value;
      });

      // ⏳ 載入狀態 (Loading States)
      // 由 Pinia store 驅動的載入狀態管理
      /** 📝 載入文字提示 */
      const loadingText = ref('載入中...');
      /** 📊 載入進度百分比 */
      const loadingProgress = ref(0);
      /** 📊 是否顯示進度條 */
      const showLoadingProgress = ref(false);
      /** 📝 載入子文字說明 */
      const loadingSubText = ref('');

      /** ⏳ 是否有任何圖層正在載入 */
      const isAnyLayerLoading = computed(() =>
        dataStore.getAllLayers().some((layer) => layer.isLoading)
      );

      /**
       * 👀 監聽載入狀態變化 (Watch Loading State Changes)
       * 根據 Pinia store 中的圖層載入狀態更新 UI 提示
       */
      watch(
        isAnyLayerLoading,
        (loading) => {
          if (loading) {
            const loadingLayer = dataStore.getAllLayers().find((l) => l.isLoading);
            loadingText.value = `載入 ${loadingLayer.name} 數據中...`;
            loadingSubText.value = '正在處理地理資訊...';
          } else {
            loadingText.value = '載入完成';
            loadingSubText.value = `數據已更新`;
          }
        },
        { deep: true }
      );

      // 🗺️ 地圖和圖層狀態 (Map and Layer States)
      // 大部分狀態由 Pinia store 管理，此處保留 UI 控制相關狀態
      /** 🗺️ 台南圖層顯示狀態（從 store 計算） */
      const showTainanLayer = computed(() => dataStore.findLayerById('tainan')?.visible || false);
      /** 🔍 選定的資料篩選器 */
      const selectedFilter = ref('');
      /** 🎨 選定的色票方案 */
      const selectedColorScheme = ref('viridis');
      /** 🖌️ 選定的邊框顏色 */
      const selectedBorderColor = ref('#666666');
      /** 📏 選定的邊框粗細 */
      const selectedBorderWeight = ref(1);
      /** 🔍 地圖縮放等級 */
      const zoomLevel = ref(10);
      /** 📍 當前地圖座標 */
      const currentCoords = ref({ lat: 25.033, lng: 121.5654 });
      /** 📊 選中數據計數 */
      const selectedCount = ref(0);
      /** 📍 作用中的地圖標記數量 */
      const activeMarkers = ref(0);

      // 📊 台南數據相關計算屬性 (Tainan Data Related Computed Properties)
      // 這些數據從 Pinia store 的特定圖層數據中提取

      /** 🗺️ 從 store 獲取台南 GeoJSON 資料 */
      const storeTainanGeoJSONData = computed(() => dataStore.processedData.loadedAndMergedGeoJSON);
      /** 📊 從 store 獲取台南資料統計摘要 */
      const storeTainanDataSummary = computed(() => dataStore.dataSummary);

      // 🔧 拖曳狀態 (Dragging States)
      /** 🖱️ 側邊面板拖曳進行中狀態 */
      const isSidePanelDragging = ref(false);

      // 🗺️ 地圖互動函數 (Map Interaction Functions)

      /**
       * 🗺️ 適應地圖到數據範圍 (Fit Map to Data)
       * 調整地圖視圖以包含所有資料範圍
       */
      const fitMapToData = () => {
        if (middlePanelRef.value) {
          middlePanelRef.value.fitToTainanBounds();
        }
      };

      /**
       * 🔄 重設地圖視圖 (Reset Map View)
       * 將地圖恢復到初始狀態
       */
      const resetView = () => {
        if (middlePanelRef.value) {
          middlePanelRef.value.resetMapView();
        }
      };

      /**
       * 📊 切換到儀表板 (Switch to Dashboard)
       * 將主要分頁切換到儀表板視圖
       */
      const switchToDashboard = () => {
        activeTab.value = 'dashboard';
      };

      /**
       * 🕐 取得當前時間 (Get Current Time)
       * 返回格式化的當前時間字串
       */
      const getCurrentTime = () => {
        return new Date().toLocaleString('zh-TW');
      };

      // 🔧 拖拽調整功能 (Drag Resize Functions)

      /**
       * 🔧 開始調整面板大小 (Start Panel Resize)
       * 改進版本的拖曳系統，提供更流暢的體驗
       *
       * @param {string} direction - 拖曳方向（'left' 或 'right'）
       * @param {MouseEvent} event - 滑鼠事件對象
       */
      const startResize = (direction, event) => {
        event.preventDefault();
        event.stopPropagation();

        // 設定拖曳狀態和防止文字選取
        isSidePanelDragging.value = true;
        document.body.classList.add('my-no-select');

        // 記錄初始位置和面板尺寸
        const startX = event.clientX;
        const startLeftWidth = leftViewWidth.value;
        const startRightWidth = rightViewWidth.value;

        // 獲取窗口尺寸以計算百分比
        const currentWindowWidth = windowWidth.value;

        console.log(`🔧 開始調整 ${direction} 方向，初始值:`, {
          leftWidth: startLeftWidth,
          rightWidth: startRightWidth,
        });

        /**
         * 🖱️ 處理滑鼠移動事件 (Handle Mouse Move)
         */
        const handleMouseMove = (moveEvent) => {
          moveEvent.preventDefault();

          const deltaX = moveEvent.clientX - startX;
          const deltaXPercent = (deltaX / currentWindowWidth) * 100;

          if (direction === 'left') {
            // 調整左側面板寬度
            let newWidth = startLeftWidth + deltaXPercent;
            // 限制寬度：最小值為 MIN_LEFT_PANEL_WIDTH_PERCENT，最大值確保主面板不為負
            newWidth = Math.max(
              MIN_LEFT_PANEL_WIDTH_PERCENT,
              Math.min(100 - rightViewWidth.value, newWidth)
            );
            leftViewWidth.value = newWidth;
          } else if (direction === 'right') {
            // 調整右側面板寬度
            let newWidth = startRightWidth - deltaXPercent;
            // 限制寬度：最小值為 0，最大值確保主面板不為負
            newWidth = Math.max(0, Math.min(100 - leftViewWidth.value, newWidth));
            rightViewWidth.value = newWidth;
          }
        };

        /**
         * 🖱️ 處理滑鼠放開事件 (Handle Mouse Up)
         */
        const handleMouseUp = () => {
          // 清除拖曳狀態
          isSidePanelDragging.value = false;
          document.body.classList.remove('my-no-select');
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);

          // 驗證最終尺寸
          validatePanelSizes();

          console.log('✅ 拖曳調整完成，最終值:', {
            leftWidth: leftViewWidth.value,
            rightWidth: rightViewWidth.value,
            mainWidth: mainPanelWidth.value,
          });
        };

        // 註冊事件監聽器
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      /**
       * ✅ 驗證面板尺寸 (Validate Panel Sizes)
       * 確保面板尺寸在合理範圍內 (0-100%)
       */
      const validatePanelSizes = () => {
        // 確保各面板在合理範圍內
        leftViewWidth.value = Math.max(
          MIN_LEFT_PANEL_WIDTH_PERCENT,
          Math.min(100, leftViewWidth.value)
        );
        rightViewWidth.value = Math.max(0, Math.min(100, rightViewWidth.value));

        // 四捨五入到一位小數
        leftViewWidth.value = Math.round(leftViewWidth.value * 10) / 10;
        rightViewWidth.value = Math.round(rightViewWidth.value * 10) / 10;
      };

      // 📏 視窗大小變化處理 (Window Resize Handler)
      /**
       * 📏 處理瀏覽器視窗大小變化 (Handle Browser Window Resize)
       */
      const handleResize = () => {
        windowWidth.value = window.innerWidth;
        windowHeight.value = window.innerHeight;
        nextTick(() => {
          if (appFooterRef.value) {
            footerHeight.value = appFooterRef.value.offsetHeight;
          }
        });
      };

      /**
       * 🚀 組件掛載事件 (Component Mounted Event)
       * 初始化組件和事件監聽器
       */
      onMounted(() => {
        console.log('🚀 空間分析平台已初始化');

        // 添加視窗調整事件監聽
        window.addEventListener('resize', handleResize);

        // 初始化計算頁腳高度
        nextTick(() => {
          if (appFooterRef.value) {
            footerHeight.value = appFooterRef.value.offsetHeight;
          }
        });
      });

      /**
       * 🗑️ 組件卸載事件 (Component Unmounted Event)
       * 清理事件監聽器
       */
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
      });

      // 📍 座標和標記更新函數 (Coordinate and Marker Update Functions)

      /**
       * 📍 更新當前座標 (Update Current Coordinates)
       * @param {Object} coords - 座標對象 {lat, lng}
       */
      const updateCurrentCoords = (coords) => {
        currentCoords.value = coords;
      };

      /**
       * 📍 更新作用中標記數量 (Update Active Markers Count)
       * @param {number} count - 標記數量
       */
      const updateActiveMarkers = (count) => {
        activeMarkers.value = count;
      };

      /**
       * 🎯 處理特徵選中事件 (Handle Feature Selected Event)
       * 當用戶在地圖上選中某個特徵時觸發
       * @param {Object} feature - 選中的地理特徵對象
       */
      const handleFeatureSelected = (feature) => {
        console.log('HomeView - handleFeatureSelected called with:', {
          feature: feature,
          properties: feature.properties,
          store: dataStore,
        });
        // 將選中的特徵設定到 Pinia store
        dataStore.setSelectedFeature(feature);
        console.log('HomeView - After setting selectedFeature:', {
          storeSelectedFeature: dataStore.selectedFeature,
        });
        // 自動切換到物件屬性分頁
        activeRightTab.value = 'properties';
      };

      /**
       * 🎯 處理高亮顯示事件 (Handle Highlight Event)
       * 在地圖上高亮顯示指定名稱的特徵
       * @param {string} id - 要高亮顯示的特徵名稱
       */
      const handleHighlight = (id) => {
        // 如果當前不在地圖視圖，先切換到地圖
        if (activeTab.value !== 'map') {
          activeTab.value = 'map';
        }

        // 使用 nextTick 確保地圖組件已渲染完成
        nextTick(() => {
          if (middlePanelRef.value) {
            middlePanelRef.value.highlightFeature(id);
          } else {
            console.error('Cannot highlight: middlePanelRef is not available.');
          }
        });
      };

      // 📤 返回響應式數據和函數給模板使用 (Return Reactive Data and Functions)
      return {
        // 📚 組件引用
        middlePanelRef, // 中間面板引用

        // 📑 分頁狀態
        activeTab, // 主要分頁狀態
        activeBottomTab, // 底部分頁狀態
        activeRightTab, // 右側分頁狀態

        // ⏳ 載入狀態
        isAnyLayerLoading, // 是否有圖層正在載入
        loadingText, // 載入文字
        loadingProgress, // 載入進度
        showLoadingProgress, // 是否顯示進度條
        loadingSubText, // 載入子文字

        // 🗺️ 圖層狀態
        showTainanLayer, // 台南圖層顯示狀態
        selectedFilter, // 選定篩選器
        selectedColorScheme, // 選定色票方案
        selectedBorderColor, // 選定邊框顏色
        selectedBorderWeight, // 選定邊框粗細

        // 🗺️ 地圖狀態
        zoomLevel, // 地圖縮放等級
        currentCoords, // 當前地圖座標

        // 📊 統計數據
        selectedCount, // 選中數據計數
        activeMarkers, // 作用中標記數量

        // 📏 面板尺寸（百分比系統）
        leftViewWidth, // 左側面板寬度百分比
        rightViewWidth, // 右側面板寬度百分比
        leftViewWidthPx, // 左側面板像素寬度
        rightViewWidthPx, // 右側面板像素寬度
        mainPanelWidth, // 中間面板寬度百分比
        mainPanelWidthPx, // 中間面板像素寬度

        // 📊 台南數據
        tainanDataSummary, // 台南資料摘要
        tableData, // 表格資料
        storeTainanGeoJSONData, // 從 store 獲取的 GeoJSON 資料
        storeTainanDataSummary, // 從 store 獲取的資料摘要

        // 📥 數據管理功能
        fitMapToData, // 適應地圖到資料
        resetView, // 重設視圖
        switchToDashboard, // 切換到儀表板

        // 🔧 拖拽調整功能
        startResize, // 開始調整大小
        isSidePanelDragging, // 側邊面板拖曳狀態
        validatePanelSizes, // 驗證面板尺寸

        // 🛠️ 工具函數
        formatNumber, // 數字格式化
        getCurrentTime, // 取得當前時間
        appFooterRef, // 頁腳引用
        calculatedMiddleViewHeight, // 計算的中間面板高度
        handleHighlight, // 處理高亮顯示

        // 🎯 互動函數
        updateCurrentCoords, // 更新當前座標
        updateActiveMarkers, // 更新作用中標記
        handleFeatureSelected, // 處理特徵選中
      };
    },
  };
</script>

<template>
  <!-- 🏠 HomeView.vue - 首頁視圖組件 (Home View Component) -->
  <!-- 提供長照資訊系統的主要用戶界面，包含響應式三面板佈局系統 -->
  <div id="app" class="d-flex flex-column vh-100">
    <!-- 📥 載入覆蓋層 (Loading Overlay) -->
    <!-- 在資料載入時顯示，提供視覺化的載入進度回饋 -->
    <LoadingOverlay
      :isVisible="isAnyLayerLoading"
      :loadingText="loadingText"
      :progress="loadingProgress"
      :showProgress="showLoadingProgress"
      :subText="loadingSubText"
    />

    <!-- 📱 主要內容區域 (Main Content Area) -->
    <!-- 使用計算高度為 footer 留出空間，避免擋住滾動條 -->
    <div class="d-flex flex-column overflow-hidden">
      <!-- 🚀 路由視圖區域 (Router View Area) -->
      <!-- 顯示非首頁的路由組件內容 -->
      <div v-if="$route.path !== '/'" class="h-100">
        <router-view />
      </div>

      <!-- 🏠 首頁內容區域 (Home Page Content Area) -->
      <!-- 空間分析平台的主要功能界面，使用響應式三面板佈局 -->
      <div v-if="$route.path === '/'" class="h-100 d-flex flex-column overflow-hidden">
        <div class="d-flex flex-row flex-grow-1 overflow-hidden">
          <!-- 🎛️ 左側控制面板容器 (Left Control Panel Container) -->
          <!-- 包含圖層控制、資料載入等功能，支援動態寬度調整 -->
          <div
            class="h-100 overflow-auto"
            :style="{ width: leftViewWidthPx }"
            v-if="leftViewWidth > 0"
          >
            <LeftView />
          </div>

          <!-- 🔧 左側拖曳調整器 (Left Panel Resizer) -->
          <!-- 提供滑鼠拖曳功能，動態調整左側面板寬度 -->
          <div
            class="my-resizer my-resizer-vertical border-start border-end"
            :class="{ 'my-dragging': isSidePanelDragging }"
            @mousedown="startResize('left', $event)"
            title="拖曳調整左側面板寬度"
          ></div>

          <!-- 🌟 中間主要顯示區域 (Main Display Area) -->
          <!-- 包含地圖、儀表板、資料表格等核心功能組件 -->
          <MiddleView
            ref="middlePanelRef"
            class="d-flex flex-column flex-grow-1 overflow-hidden h-100"
            :style="{ width: mainPanelWidthPx, 'min-width': '0px' }"
            :dynamicMainAreaHeight="calculatedMiddleViewHeight"
            :activeTab="activeTab"
            :activeBottomTab="activeBottomTab"
            :mainPanelWidth="mainPanelWidth"
            :showTainanLayer="showTainanLayer"
            :selectedFilter="selectedFilter"
            :selectedColorScheme="selectedColorScheme"
            :selectedBorderColor="selectedBorderColor"
            :selectedBorderWeight="selectedBorderWeight"
            :zoomLevel="zoomLevel"
            :currentCoords="currentCoords"
            :tainanGeoJSONData="storeTainanGeoJSONData"
            :maxCount="maxCount"
            :averageCount="averageCount"
            :dataRegionsCount="dataRegionsCount"
            :activeMarkers="activeMarkers"
            :isLoadingData="isAnyLayerLoading"
            :isSidePanelDragging="isSidePanelDragging"
            :tainanDataSummary="storeTainanDataSummary"
            @update:activeTab="activeTab = $event"
            @update:activeBottomTab="activeBottomTab = $event"
            @update:zoomLevel="zoomLevel = $event"
            @update:currentCoords="currentCoords = $event"
            @update:activeMarkers="activeMarkers = $event"
            @update:selectedColorScheme="selectedColorScheme = $event"
            @update:selectedBorderColor="selectedBorderColor = $event"
            @update:selectedBorderWeight="selectedBorderWeight = $event"
            @reset-view="resetView"
            @highlight-on-map="handleHighlight"
            @highlight-feature="handleHighlight"
            @feature-selected="handleFeatureSelected"
          />

          <!-- 🔧 右側拖曳調整器 (Right Panel Resizer) -->
          <!-- 提供滑鼠拖曳功能，動態調整右側面板寬度 -->
          <div
            class="my-resizer my-resizer-vertical border-start border-end"
            :class="{ 'my-dragging': isSidePanelDragging }"
            @mousedown="startResize('right', $event)"
            title="拖曳調整右側面板寬度"
          ></div>

          <!-- 📈 右側控制面板容器 (Right Control Panel Container) -->
          <!-- 包含物件屬性、分析清單等輔助功能，支援動態寬度調整 -->
          <div
            class="h-100 overflow-auto"
            :style="{ width: rightViewWidthPx }"
            v-if="rightViewWidth > 0"
          >
            <RightView
              :activeRightTab="activeRightTab"
              :activeMarkers="activeMarkers"
              :tainanDataSummary="storeTainanDataSummary"
              :maxCount="maxCount"
              :averageCount="averageCount"
              :dataRegionsCount="dataRegionsCount"
              :showTainanLayer="showTainanLayer"
              :rightViewWidth="rightViewWidth"
              @update:activeRightTab="activeRightTab = $event"
              @fit-map-to-data="fitMapToData"
              @switch-to-dashboard="switchToDashboard"
              @highlight-feature="handleHighlight"
              :current-coords="currentCoords"
              @update:current-coords="updateCurrentCoords"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 🦶 頁腳區域 (Footer Area) -->
    <!-- 固定高度 footer，提供版權資訊和技術鳴謝 -->
    <footer
      class="d-flex justify-content-between my-app-footer bg-dark text-light p-2"
      ref="appFooterRef"
    >
      <small>臺灣大學地理環境資源學系</small>
      <small>2025</small>
    </footer>
  </div>
</template>

<style>
  /**
 * 🎨 應用程式全域樣式 (Application Global Styles)
 *
 * 引入共用 CSS 並定義全域樣式，主要使用 Bootstrap 佈局系統
 */
  @import '../assets/css/common.css';

  /* 📱 HomeView 專用樣式 (HomeView Specific Styles) */
  /* 其他通用樣式已移至 common.css 中統一管理 */
</style>
