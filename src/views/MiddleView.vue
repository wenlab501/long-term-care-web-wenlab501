<script setup>
  /**
   * 🎛️ MiddleView.vue - 中間面板組件 (Middle Panel Component)
   *
   * 功能說明：
   * 1. 📊 管理上下兩個面板的佈局與垂直空間分配
   * 2. 🔧 提供垂直拖曳調整功能，允許使用者動態調整面板高度比例
   * 3. 📡 轉發事件到父組件 (HomeView)，作為中介層處理組件間通訊
   * 4. 🎨 管理面板高度比例計算，響應式調整內容區域大小
   * 5. 🖱️ 處理拖曳狀態和滑鼠互動，提供流暢的使用者體驗
   * 6. 📚 提供組件引用管理，讓父組件可以直接調用子組件方法
   *
   * 架構說明：
   * - 上半部：UpperView (地圖、儀表板等主要內容)
   * - 拖曳器：可調整上下面板高度比例的分隔線
   * - 下半部：BottomView (資料表格、控制項等輔助內容)
   *
   * 設計理念：
   * - 使用 Vue 3 Composition API 的 <script setup> 語法
   * - 響應式佈局設計，支援動態高度調整
   * - 完整的事件轉發機制，保持資料流清晰
   * - 模組化組件設計，易於維護和擴展
   */

  // 🔧 Vue Composition API 引入
  import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    defineProps,
    defineEmits,
    defineExpose,
    watch,
  } from 'vue';

  // 🧩 組件引入
  import UpperView from './UpperView.vue';
  import BottomView from './BottomView.vue';

  // --- 📥 組件屬性定義 (Component Props) ---
  /**
   * 📋 接收來自父組件 (HomeView) 的所有必要數據和狀態
   * 包含面板尺寸、分頁狀態、地圖設定、資料等
   */
  const props = defineProps({
    mainContent: { type: Object, default: null },
    bottomView: { type: Object, default: null },
    activeTab: { type: String, default: 'map' },
    activeBottomTab: { type: String, default: 'table' },
    mainPanelWidth: { type: Number, default: 800 },
    dynamicMainAreaHeight: { type: Number, required: true, validator: (value) => value >= 0 },
    showTainanLayer: { type: Boolean, default: false },
    selectedFilter: { type: String, default: 'all' },
    selectedColorScheme: { type: String, default: 'default' },
    selectedBorderColor: { type: String, default: '#000000' },
    selectedBorderWeight: { type: Number, default: 1 },
    zoomLevel: { type: Number, default: 10 },
    currentCoords: { type: Object, default: () => ({ lat: 0, lng: 0 }) },
    sortedAndFilteredTableData: { type: Array, default: () => [] },
    dataRegionsCount: { type: Number, default: 0 },
    activeMarkers: { type: Number, default: 0 },
    isLoadingData: { type: Boolean, default: false },
    tableSearchQuery: { type: String, default: '' },
    sortField: { type: String, default: '' },
    sortDirection: {
      type: String,
      default: 'asc',
      validator: (value) => ['asc', 'desc'].includes(value),
    },
    isSidePanelDragging: { type: Boolean, default: false },
  });

  // --- 📤 組件事件定義 (Component Events) ---
  /**
   * 📡 定義向父組件 (HomeView) 發送的所有事件
   * 採用事件轉發模式，確保資料流向清晰
   */
  defineEmits([
    // 📑 分頁相關事件
    'update:activeTab', // 更新主要分頁
    'update:activeBottomTab', // 更新底部分頁

    // 🗺️ 地圖相關事件
    'update:zoomLevel', // 更新地圖縮放等級
    'update:currentCoords', // 更新地圖中心座標
    'update:activeMarkers', // 更新標記數量
    'feature-selected', // 地圖要素被選中

    // 📊 表格相關事件
    'update:tableSearchQuery', // 更新搜尋查詢
    'sort-table', // 表格排序
    'highlight-on-map', // 在地圖上高亮顯示

    // 🎨 樣式相關事件
    'update:selectedColorScheme', // 更新色彩方案
    'update:selectedBorderColor', // 更新邊框顏色
    'update:selectedBorderWeight', // 更新邊框粗細

    // 🔄 操作相關事件
    'reset-view', // 重設視圖
  ]);

  // --- 📚 內部組件引用 (Internal Component References) ---
  /** 📊 主內容面板引用 (用於呼叫 UpperView 的方法如 highlightFeature) */
  const mainContentRef = ref(null);

  // --- 🔧 內部垂直拖曳調整邏輯 (Internal Vertical Resizing Logic) ---

  /** 📏 底部面板高度百分比 (預設 30%，可透過拖曳調整) */
  const bottomViewHeightPercent = ref(30);

  /** 🖱️ 是否正在進行垂直拖曳 (追蹤垂直拖曳狀態) */
  const isVerticalDragging = ref(false);

  /**
   * 🖱️ 計算是否有任何拖曳正在進行 (影響滑鼠指標事件)
   * 結合側邊面板拖曳和垂直拖曳狀態，用於禁用指標事件
   */
  const isOverallDragging = computed(() => {
    return props.isSidePanelDragging || isVerticalDragging.value;
  });

  /**
   * 📏 中間區域總高度計算 (Computing Total Middle Section Height)
   * 從父組件傳入的動態高度，確保不為負數
   */
  const middleSectionTotalHeight = computed(() => {
    const totalHeight = props.dynamicMainAreaHeight;
    console.log(`🔧 MiddleView: middleSectionTotalHeight (from prop): ${totalHeight}`);
    return Math.max(totalHeight, 0); // 確保不為負數，避免佈局錯誤
  });

  /**
   * 📏 底部面板實際像素高度計算 (Computing Actual Bottom View Pixel Height)
   * 根據百分比和總高度計算實際像素值
   */
  const actualBottomViewPixelHeight = computed(() => {
    const pixelHeight = (bottomViewHeightPercent.value / 100) * middleSectionTotalHeight.value;
    console.log(
      `🔧 MiddleView: actualBottomViewPixelHeight calculated: ${pixelHeight} (percent: ${bottomViewHeightPercent.value}%, totalMiddle: ${middleSectionTotalHeight.value})`
    );
    return pixelHeight;
  });

  /**
   * 📏 主內容區域高度計算 (Computing Main Content Area Height)
   * 總高度減去底部面板高度，得到上部區域可用高度
   */
  const contentHeight = computed(() => {
    const mainContentH = middleSectionTotalHeight.value - actualBottomViewPixelHeight.value;
    console.log(
      `🔧 MiddleView: contentHeight (for MainContent) calculated: ${mainContentH}, totalMiddle: ${middleSectionTotalHeight.value}, bottomViewPx: ${actualBottomViewPixelHeight.value}`
    );
    return mainContentH;
  });

  /**
   * 🖱️ 開始垂直拖曳調整 (Start Vertical Resize)
   * 處理滑鼠按下事件，開始垂直面板大小調整
   *
   * @param {MouseEvent} event - 滑鼠按下事件
   */
  const startVerticalResize = (event) => {
    // 阻止預設行為和事件冒泡，避免干擾其他元素
    event.preventDefault();
    event.stopPropagation();

    // 設定拖曳狀態和視覺回饋
    isVerticalDragging.value = true;
    document.body.classList.add('my-no-select'); // 防止文字選取，提升拖曳體驗

    // 記錄初始位置和狀態，用於計算拖曳變化量
    const startY = event.clientY;
    const startBottomPercent = bottomViewHeightPercent.value;
    const currentMiddleSectionHeight = middleSectionTotalHeight.value;

    /**
     * 🖱️ 處理滑鼠移動事件 (Handle Mouse Move)
     * 計算拖曳距離並更新面板高度比例
     *
     * @param {MouseEvent} moveEvent - 滑鼠移動事件
     */
    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const deltaY = moveEvent.clientY - startY;

      // 防止除零錯誤
      if (currentMiddleSectionHeight === 0) return;

      // 計算百分比變化 (Y座標變化轉換為高度百分比變化)
      const deltaPercent = (deltaY / currentMiddleSectionHeight) * 100;

      // 向上拖曳 (deltaY < 0) 增加底部面板高度百分比
      // 向下拖曳 (deltaY > 0) 減少底部面板高度百分比
      let newPercent = startBottomPercent - deltaPercent;

      // 限制在合理範圍 (0-100%)，確保佈局穩定
      newPercent = Math.max(0, Math.min(100, newPercent));

      // 四捨五入到小數點後一位，避免精度問題
      bottomViewHeightPercent.value = Math.round(newPercent * 10) / 10;
    };

    /**
     * 🖱️ 處理滑鼠放開事件 (Handle Mouse Up)
     * 清理拖曳狀態，移除事件監聽器
     */
    const handleMouseUp = () => {
      // 清除拖曳狀態和視覺回饋
      isVerticalDragging.value = false;
      document.body.classList.remove('my-no-select');

      // 移除臨時事件監聽器，避免記憶體洩漏
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // 註冊全域事件監聽器，確保拖曳行為在整個頁面範圍內有效
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  /**
   * 👀 監聽 activeTab 變化 (Watch activeTab Changes)
   * 當分頁切換時記錄日誌，用於除錯和狀態追蹤
   */
  watch(
    () => props.activeTab,
    (newTab, oldTab) => {
      console.log(
        `🔧 MiddleView Watcher: activeTab changed from "${oldTab}" to "${newTab}". Current bottomViewHeightPercent: ${bottomViewHeightPercent.value}%`
      );
    }
  );

  /**
   * 🚀 組件掛載時初始化 (Component Mounted Initialization)
   * 組件載入完成後的初始化工作
   */
  onMounted(() => {
    // 初始計算將依賴從 HomeView 傳遞的正確 prop
    console.log('🚀 MiddleView mounted');
  });

  /**
   * 🗑️ 組件卸載時清理 (Component Unmounted Cleanup)
   * 組件銷毀前的清理工作，確保沒有記憶體洩漏
   */
  onUnmounted(() => {
    console.log('🗑️ MiddleView unmounted');
  });

  // --- 🔧 可從父組件呼叫的方法 (Methods Callable from Parent) ---

  /**
   * 🎯 高亮顯示特徵 (Highlight Feature)
   * 透過 mainContentRef 呼叫主內容面板的高亮功能
   * 用於從表格或其他來源觸發地圖上的要素高亮
   *
   * @param {string} name - 要高亮顯示的特徵名稱或識別碼
   * @param {Object} layerInfo - 圖層資訊（可選）
   */
  const highlightFeature = (name, layerInfo = null) => {
    if (!mainContentRef.value) {
      console.warn('⚠️ 無法高亮顯示：mainContentRef 未定義');
      return;
    }
    console.log(`🎯 MiddleView: 呼叫 highlightFeature with name: ${name}`, layerInfo);
    mainContentRef.value.highlightFeature(name, layerInfo);
  };

  /**
   * 🗺️ 適應台南邊界 (Fit to Tainan Bounds)
   * 透過 mainContentRef 呼叫地圖適應邊界功能
   * 將地圖視圖調整到顯示完整的台南市範圍
   */
  const fitToTainanBounds = () => {
    if (mainContentRef.value) {
      console.log('🗺️ MiddleView: 呼叫 fitToTainanBounds');
      mainContentRef.value.fitToTainanBounds();
    }
  };

  /**
   * 🔄 重設地圖視圖 (Reset Map View)
   * 透過 mainContentRef 呼叫地圖重設功能
   * 將地圖恢復到預設的縮放等級和中心位置
   */
  const resetMapView = () => {
    if (mainContentRef.value) {
      console.log('🔄 MiddleView: 呼叫 resetMapView');
      mainContentRef.value.resetView(); // 假設 UpperView 有 resetView 方法
    }
  };

  /**
   * 📤 暴露方法給父組件使用 (Expose Methods to Parent Component)
   * 讓 HomeView 可以直接呼叫這些方法，實現組件間的方法調用
   */
  defineExpose({
    highlightFeature, // 高亮顯示功能
    fitToTainanBounds, // 地圖邊界適應
    resetMapView, // 地圖視圖重設
    // 如果 HomeView 需要直接存取子組件，可以暴露 mainContentRef 和 bottomViewRef
    // mainContentRef,    // 主內容組件引用
    // bottomViewRef      // 底部視圖組件引用
  });
</script>

<template>
  <!-- 🎛️ 中間面板組件 (Middle Panel Component) -->
  <!-- 負責管理上下兩個面板的佈局和垂直拖曳調整功能 -->
  <!-- 這是一個佈局容器，使用 flexbox 垂直排列，填滿可用空間 -->
  <div class="d-flex flex-column flex-grow-1 overflow-hidden h-100">
    <!-- 📊 上半部內容區域 (Upper Content Area) -->
    <!-- 包含地圖、儀表板等主要顯示內容 -->
    <!-- 動態高度根據 contentHeight 計算，拖曳時禁用指標事件避免干擾 -->
    <div
      :style="{
        pointerEvents: isOverallDragging ? 'none' : 'auto',
        height: contentHeight + 'px',
        overflow: 'hidden',
      }"
    >
      <!-- 🗺️ 上層視圖組件 (Upper View Component) -->
      <!-- 傳遞所有必要的 props 給 UpperView，包含地圖狀態、資料、樣式設定等 -->
      <UpperView
        ref="mainContentRef"
        :activeTab="activeTab"
        :mainPanelWidth="mainPanelWidth"
        :contentHeight="contentHeight"
        :showTainanLayer="showTainanLayer"
        :selectedFilter="selectedFilter"
        :selectedColorScheme="selectedColorScheme"
        :selectedBorderColor="selectedBorderColor"
        :selectedBorderWeight="selectedBorderWeight"
        :zoomLevel="zoomLevel"
        :sortedAndFilteredTableData="sortedAndFilteredTableData"
        :dataRegionsCount="dataRegionsCount"
        :isPanelDragging="isOverallDragging"
        :activeMarkers="activeMarkers"
        @update:activeTab="$emit('update:activeTab', $event)"
        @update:zoomLevel="$emit('update:zoomLevel', $event)"
        @update:currentCoords="$emit('update:currentCoords', $event)"
        @update:activeMarkers="$emit('update:activeMarkers', $event)"
        @feature-selected="$emit('feature-selected', $event)"
      />
    </div>

    <!-- 🔧 水平拖曳調整器 (Horizontal Resizer) -->
    <!-- 用於調整上下面板的高度比例 -->
    <!-- 監聽 mousedown 事件開始拖曳，動態顯示拖曳狀態的樣式 -->
    <div
      class="my-resizer my-resizer-horizontal border-top"
      :class="{ 'my-dragging': isVerticalDragging }"
      @mousedown="startVerticalResize"
      title="拖曳調整底部面板高度"
    ></div>

    <!-- 📋 下半部內容區域 (Bottom Content Area) -->
    <!-- 包含資料表格、控制項等輔助顯示內容 -->
    <!-- 動態高度根據 actualBottomViewPixelHeight 計算 -->
    <div
      class="overflow-hidden"
      :style="{
        pointerEvents: isOverallDragging ? 'none' : 'auto',
        height: actualBottomViewPixelHeight + 'px',
      }"
    >
      <!-- 📊 底部視圖組件 (Bottom View Component) -->
      <!-- 傳遞表格資料、樣式設定、面板狀態等 props -->
      <BottomView
        :activeBottomTab="activeBottomTab"
        :bottomViewHeight="actualBottomViewPixelHeight"
        :selectedColorScheme="selectedColorScheme"
        :selectedBorderColor="selectedBorderColor"
        :selectedBorderWeight="selectedBorderWeight"
        :isPanelDragging="isOverallDragging"
        @update:activeBottomTab="$emit('update:activeBottomTab', $event)"
        @highlight-on-map="$emit('highlight-on-map', $event)"
        @update:selectedColorScheme="$emit('update:selectedColorScheme', $event)"
        @update:selectedBorderColor="$emit('update:selectedBorderColor', $event)"
        @update:selectedBorderWeight="$emit('update:selectedBorderWeight', $event)"
        @reset-view="$emit('reset-view')"
      />
    </div>
  </div>
</template>

<style scoped>
  /**
 * 🎨 中間面板樣式 (Middle Panel Styles)
 *
 * 中間面板專用樣式定義
 * 由於大部分通用樣式已移至 common.css，這裡僅保留必要的組件特定樣式
 *
 * 設計原則：
 * - 避免重複定義，依賴全域樣式
 * - 僅定義組件特有的樣式需求
 * - 保持樣式檔案精簡，提升維護性
 */

  /* 📱 中間面板專用樣式 (Middle Panel Specific Styles) */
  /*
 * 註：大部分樣式已整合至 common.css 中，避免重複定義
 * 包含 .my-resizer、.my-resizer-horizontal、.my-no-select 等通用樣式
 * 如需新增中間面板特有樣式，請在此處定義
 */

  /* 🔧 組件容器樣式微調 (Component Container Style Adjustments) */
  /* 確保 flexbox 佈局正常運作，避免內容溢出 */
  .d-flex.flex-column.flex-grow-1 {
    /* 使用 Bootstrap 的 flexbox 類別，無需額外樣式 */
  }

  /* 📏 高度計算容器樣式 (Height Calculation Container Styles) */
  /* 確保動態高度計算的容器正確顯示 */
  div[style*='height:'] {
    /* 透過內聯樣式控制高度，無需額外 CSS */
  }

  /* 🖱️ 拖曳狀態樣式 (Dragging State Styles) */
  /* 拖曳調整器的互動狀態已在 common.css 中定義 */

  /* 📱 響應式設計微調 (Responsive Design Fine-tuning) */
  @media (max-width: 768px) {
    /* 中小型螢幕的特殊調整，如有需要可在此新增 */
  }

  @media (max-width: 576px) {
    /* 小型螢幕的特殊調整，如有需要可在此新增 */
  }

  /* 🎯 效能優化樣式 (Performance Optimization Styles) */
  /* 啟用硬體加速，提升拖曳操作的流暢度 */
  .my-resizer {
    /* 拖曳調整器樣式已在 common.css 中定義 */
  }
</style>
