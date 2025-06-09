<template>
  <!-- 🎛️ 中間面板組件 (Middle Panel Component) -->
  <!-- 負責管理上下兩個面板的佈局和垂直拖曳調整功能 -->
  <div class="d-flex flex-column flex-grow-1 overflow-hidden h-100">
    
    <!-- 📊 上半部內容區域 (Upper Content Area) -->
    <!-- 包含地圖、儀表板等主要顯示內容 -->
    <div :style="{ pointerEvents: isOverallDragging ? 'none' : 'auto', height: contentHeight + 'px', overflow: 'hidden' }">
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
        :tainanGeoJSONData="tainanGeoJSONData"
        :maxCount="maxCount"
        :mergedTableData="mergedTableData"
        :sortedAndFilteredTableData="sortedAndFilteredTableData"
        :averageCount="averageCount"
        :dataRegionsCount="dataRegionsCount"
        :isPanelDragging="isOverallDragging"
        :activeMarkers="activeMarkers"
        :totalCount="totalCount"
        :tainanDataSummary="tainanDataSummary"
        @update:activeTab="$emit('update:activeTab', $event)"
        @update:zoomLevel="$emit('update:zoomLevel', $event)"
        @update:currentCoords="$emit('update:currentCoords', $event)"
        @update:activeMarkers="$emit('update:activeMarkers', $event)"
        @feature-selected="$emit('feature-selected', $event)"
      />
    </div>

    <!-- 🔧 水平拖曳調整器 (Horizontal Resizer) -->
    <!-- 用於調整上下面板的高度比例 -->
    <div
      class="my-resizer my-resizer-horizontal border-top"
      :class="{ dragging: isVerticalDragging }"
      @mousedown="startVerticalResize"
      title="拖曳調整底部面板高度"
    ></div>

    <!-- 📋 下半部內容區域 (Bottom Content Area) -->
    <!-- 包含資料表格、控制項等輔助顯示內容 -->
    <div :style="{ pointerEvents: isOverallDragging ? 'none' : 'auto', height: actualBottomViewPixelHeight + 'px', overflow: 'hidden' }">
      <BottomView
        ref="bottomViewRef"
        :activeBottomTab="activeBottomTab"
        :bottomViewHeight="actualBottomViewPixelHeight"
        :tableData="mergedTableData"
        :selectedColorScheme="selectedColorScheme"
        :selectedBorderColor="selectedBorderColor"
        :selectedBorderWeight="selectedBorderWeight"
        :isPanelDragging="isOverallDragging"
        @update:activeBottomTab="$emit('update:activeBottomTab', $event)"
        @highlight-on-map="emit('highlight-on-map', $event)"
        @update:selectedColorScheme="$emit('update:selectedColorScheme', $event)"
        @update:selectedBorderColor="$emit('update:selectedBorderColor', $event)"
        @update:selectedBorderWeight="$emit('update:selectedBorderWeight', $event)"
        @reset-view="$emit('reset-view', $event)"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * 🎛️ MiddleView.vue - 中間面板組件
 * 
 * 功能說明：
 * 1. 📊 管理上下兩個面板的佈局
 * 2. 🔧 提供垂直拖曳調整功能
 * 3. 📡 轉發事件到父組件 (HomeView)
 * 4. 🎨 管理面板高度比例計算
 * 5. 🖱️ 處理拖曳狀態和滑鼠互動
 * 
 * 架構說明：
 * - 上半部：UpperView (地圖、儀表板等)
 * - 拖曳器：可調整上下面板高度比例
 * - 下半部：BottomView (資料表格、控制項等)
 */

// 🔧 Vue Composition API 引入
import { ref, computed, onMounted, onUnmounted, defineProps, defineEmits, defineExpose, watch } from 'vue'

// 🧩 組件引入
import UpperView from './UpperView.vue'
import BottomView from './BottomView.vue'

// --- 📥 組件屬性定義 (Component Props) ---
const props = defineProps({
  /** 📚 主內容引用 (從 HomeView 傳遞的 ref) */
  mainContent: Object,
  /** 📚 底部面板引用 (從 HomeView 傳遞的 ref) */
  bottomView: Object,

  /** 📑 當前作用分頁標籤 */
  activeTab: String,
  /** 📑 底部面板作用分頁標籤 */
  activeBottomTab: String,
  
  /** 📏 主面板寬度 (整個中間欄的寬度) */
  mainPanelWidth: Number,
  /** 📏 動態主區域高度 (從 HomeView 計算的高度) */
  dynamicMainAreaHeight: { type: Number, required: true },
  
  /** 🗺️ 是否顯示台南圖層 */
  showTainanLayer: Boolean,
  /** 🔍 選定的過濾器 */
  selectedFilter: String,
  /** 🎨 選定的色彩方案 */
  selectedColorScheme: String,
  /** 🖌️ 選定的邊框顏色 */
  selectedBorderColor: String,
  /** 📏 選定的邊框粗細 */
  selectedBorderWeight: Number,
  /** 🔍 地圖縮放等級 */
  zoomLevel: Number,
  /** 📍 當前座標 */
  currentCoords: Object,
  /** 🗺️ 台南 GeoJSON 資料 */
  tainanGeoJSONData: Object,
  /** 📊 最大計數值 */
  maxCount: Number,
  /** 📋 合併的表格資料 */
  mergedTableData: Array,
  /** 📋 排序和過濾後的表格資料 */
  sortedAndFilteredTableData: Array,
  /** 📊 平均計數值 */
  averageCount: Number,
  /** 📊 資料區域計數 */
  dataRegionsCount: Number,
  /** 📍 作用中的標記數量 */
  activeMarkers: Number,
  /** ⏳ 是否正在載入資料 */
  isLoadingData: Boolean,
  /** 🔍 表格搜尋查詢 */
  tableSearchQuery: String,
  /** 📊 排序欄位 */
  sortField: String,
  /** 📊 排序方向 */
  sortDirection: String,

  /** 📊 總計數值 (用於儀表板) */
  totalCount: { type: Number, default: 0 },
  /** 📊 台南資料摘要 (用於儀表板) */
  tainanDataSummary: { type: Object, default: null },

  /** 🖱️ 側邊面板拖曳狀態 (從 HomeView 傳遞) */
  isSidePanelDragging: { type: Boolean, default: false },
});

// --- 📤 組件事件定義 (Component Events) ---
const emit = defineEmits([
  'update:activeTab', 'update:activeBottomTab',
  'update:zoomLevel', 'update:currentCoords', 'update:activeMarkers',
  'update:tableSearchQuery', 'sort-table', 'highlight-on-map',
  'update:selectedColorScheme', 'update:selectedBorderColor', 'update:selectedBorderWeight',
  'reset-view',
  'feature-selected'
]);

// --- 📚 內部組件引用 (Internal Component References) ---
/** 📊 主內容面板引用 (用於呼叫方法如 highlightFeature) */
const mainContentRef = ref(null);
/** 📋 底部面板引用 */
const bottomViewRef = ref(null);

// --- 🔧 內部垂直拖曳調整邏輯 (Internal Vertical Resizing Logic) ---
/** 📏 底部面板高度百分比 (預設 30%) */
const bottomViewHeightPercent = ref(30);
/** 🖱️ 是否正在進行垂直拖曳 */
const isVerticalDragging = ref(false);

/** 🖱️ 計算是否有任何拖曳正在進行 (影響滑鼠指標事件) */
const isOverallDragging = computed(() => {
  return props.isSidePanelDragging || isVerticalDragging.value;
});

/** 📏 中間區域總高度計算 */
const middleSectionTotalHeight = computed(() => {
  const totalHeight = props.dynamicMainAreaHeight;
  console.log(`MDA: middleSectionTotalHeight (from prop): ${totalHeight}`);
  return Math.max(totalHeight, 0); // 確保不為負數
});

/** 📏 底部面板實際像素高度計算 */
const actualBottomViewPixelHeight = computed(() => {
  const pixelHeight = (bottomViewHeightPercent.value / 100) * middleSectionTotalHeight.value;
  console.log(`MDA: actualBottomViewPixelHeight calculated: ${pixelHeight} (percent: ${bottomViewHeightPercent.value}%, totalMiddle: ${middleSectionTotalHeight.value})`);
  return pixelHeight;
});

/** 📏 主內容區域高度計算 */
const contentHeight = computed(() => {
  const mainContentH = middleSectionTotalHeight.value - actualBottomViewPixelHeight.value;
  console.log(`MDA: contentHeight (for MainContent) calculated: ${mainContentH}, totalMiddle: ${middleSectionTotalHeight.value}, bottomViewPx: ${actualBottomViewPixelHeight.value}`);
  return mainContentH;
});

/**
 * 🖱️ 開始垂直拖曳調整 (Start Vertical Resize)
 * 處理滑鼠按下事件，開始垂直面板大小調整
 */
const startVerticalResize = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  // 設定拖曳狀態
  isVerticalDragging.value = true;
  document.body.classList.add('my-no-select'); // 防止文字選取
  
  // 記錄初始位置和狀態
  const startY = event.clientY;
  const startBottomPercent = bottomViewHeightPercent.value;
  const currentMiddleSectionHeight = middleSectionTotalHeight.value;

  /**
   * 🖱️ 處理滑鼠移動事件
   */
  const handleMouseMove = (moveEvent) => {
    moveEvent.preventDefault();
    const deltaY = moveEvent.clientY - startY;
    
    if (currentMiddleSectionHeight === 0) return;

    // 計算百分比變化
    const deltaPercent = (deltaY / currentMiddleSectionHeight) * 100;
    // 向上拖曳 (deltaY < 0) 增加底部面板高度百分比
    // 向下拖曳 (deltaY > 0) 減少底部面板高度百分比
    let newPercent = startBottomPercent - deltaPercent; 
    newPercent = Math.max(0, Math.min(100, newPercent)); // 限制在 0-100% 範圍
    bottomViewHeightPercent.value = Math.round(newPercent * 10) / 10; // 四捨五入到小數點後一位
  };

  /**
   * 🖱️ 處理滑鼠放開事件
   */
  const handleMouseUp = () => {
    // 清除拖曳狀態
    isVerticalDragging.value = false;
    document.body.classList.remove('my-no-select');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // 註冊事件監聽器
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

/**
 * 👀 監聽 activeTab 變化 (Watch activeTab Changes)
 */
watch(() => props.activeTab, (newTab, oldTab) => {
  console.log(`MDA Watcher: activeTab changed from "${oldTab}" to "${newTab}". Current bottomViewHeightPercent: ${bottomViewHeightPercent.value}%`);
});

/**
 * 🚀 組件掛載時初始化 (Component Mounted Initialization)
 */
onMounted(() => {
  // 初始計算將依賴從 HomeView 傳遞的正確 prop
  console.log('MiddleView mounted');
});

/**
 * 🗑️ 組件卸載時清理 (Component Unmounted Cleanup)
 */
onUnmounted(() => {
  console.log('MiddleView unmounted');
});

// --- 🔧 可從父組件呼叫的方法 (Methods Callable from Parent) ---

/**
 * 🎯 高亮顯示特徵 (Highlight Feature)
 * 透過 mainContentRef 呼叫主內容面板的高亮功能
 */
const highlightFeature = (name) => {
  if (!mainContentRef.value) {
    console.warn('無法高亮顯示：mainContentRef 未定義')
    return
  }
  mainContentRef.value.highlightFeature(name)
};

/**
 * 🗺️ 適應台南邊界 (Fit to Tainan Bounds)
 * 透過 mainContentRef 呼叫地圖適應邊界功能
 */
const fitToTainanBounds = () => {
  if (mainContentRef.value) {
    mainContentRef.value.fitToTainanBounds();
  }
};

/**
 * 🔄 重設地圖視圖 (Reset Map View)
 * 透過 mainContentRef 呼叫地圖重設功能
 */
const resetMapView = () => {
  if (mainContentRef.value) {
    mainContentRef.value.resetView(); // 假設 MainContent 有 resetView 方法
  }
};

/**
 * 📤 暴露方法給父組件使用 (Expose Methods to Parent Component)
 * 讓 HomeView 可以直接呼叫這些方法
 */
defineExpose({
  highlightFeature,
  fitToTainanBounds,
  resetMapView,
  // 如果 HomeView 需要直接存取，可以暴露 mainContentRef 和 bottomViewRef
});
</script>

<style scoped>
/**
 * 🎨 中間面板樣式 (Middle Panel Styles)
 * 
 * 中間面板專用樣式，通用的拖曳調整器樣式已移至 common.css
 */

/* 📱 中間面板專用樣式 (Middle Panel Specific Styles) */
/* 大部分樣式已整合至 common.css 中，避免重複定義 */
</style> 