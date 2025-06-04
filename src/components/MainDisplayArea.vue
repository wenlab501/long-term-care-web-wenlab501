<template>
  <div class="d-flex flex-column flex-grow-1 overflow-hidden h-100">
    <div :style="{ pointerEvents: isOverallDragging ? 'none' : 'auto', height: contentHeight + 'px', overflow: 'hidden' }">
      <MainContent
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
        @update:activeTab="$emit('update:activeTab', $event)"
        @update:zoomLevel="$emit('update:zoomLevel', $event)"
        @update:currentCoords="$emit('update:currentCoords', $event)"
        @update:activeMarkers="$emit('update:activeMarkers', $event)"
      />
    </div>

    <!-- 🔧 水平拖曳調整器 (Horizontal Resizer) -->
    <div
      class="my-resizer my-resizer-horizontal border-top"
      :class="{ dragging: isVerticalDragging }"
      @mousedown="startVerticalResize"
      title="拖曳調整底部面板高度"
    ></div>

    <div :style="{ pointerEvents: isOverallDragging ? 'none' : 'auto', height: actualBottomPanelPixelHeight + 'px', overflow: 'hidden' }">
      <BottomPanel
        ref="bottomPanelRef"
        :activeBottomTab="activeBottomTab"
        :bottomPanelHeight="actualBottomPanelPixelHeight"
        :mergedTableData="mergedTableData"
        :sortedAndFilteredTableData="sortedAndFilteredTableData"
        :tableSearchQuery="tableSearchQuery"
        :sortField="sortField"
        :sortDirection="sortDirection"
        :zoomLevel="zoomLevel"
        :currentCoords="currentCoords"
        :isLoadingData="isLoadingData"
        :showTainanLayer="showTainanLayer"
        :selectedColorScheme="selectedColorScheme"
        :selectedBorderColor="selectedBorderColor"
        :selectedBorderWeight="selectedBorderWeight"
        :maxCount="maxCount"
        :isPanelDragging="isOverallDragging"
        @update:activeBottomTab="$emit('update:activeBottomTab', $event)"
        @update:tableSearchQuery="$emit('update:tableSearchQuery', $event)"
        @sort-table="$emit('sort-table', $event)"
        @highlight-on-map="$emit('highlight-on-map', $event)"
        @update:zoomLevel="$emit('update:zoomLevel', $event)"
        @update:selectedColorScheme="$emit('update:selectedColorScheme', $event)"
        @update:selectedBorderColor="$emit('update:selectedBorderColor', $event)"
        @update:selectedBorderWeight="$emit('update:selectedBorderWeight', $event)"
        @reset-view="$emit('reset-view', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps, defineEmits, watch } from 'vue'
import MainContent from './MainContent.vue'
import BottomPanel from './BottomPanel.vue'

// --- Props ---
const props = defineProps({
  // Refs from HomeView for MainContent and BottomPanel
  mainContent: Object, // Will become mainContentRef
  bottomPanel: Object, // Will become bottomPanelRef

  // Tab states (will be emitted up)
  activeTab: String,
  activeBottomTab: String,
  
  // Panel dimensions (from HomeView for main area)
  mainPanelWidth: Number, // This is the width of the entire middle column
  dynamicMainAreaHeight: { type: Number, required: true }, // Added new prop
  
  // Data and map states (passed through)
  showTainanLayer: Boolean,
  selectedFilter: String,
  selectedColorScheme: String,
  selectedBorderColor: String,
  selectedBorderWeight: Number,
  zoomLevel: Number,
  currentCoords: Object,
  tainanGeoJSONData: Object,
  maxCount: Number,
  mergedTableData: Array,
  sortedAndFilteredTableData: Array,
  averageCount: Number,
  dataRegionsCount: Number,
  activeMarkers: Number,
  isLoadingData: Boolean,
  tableSearchQuery: String,
  sortField: String,
  sortDirection: String,

  // Drag state for horizontal resizers (left/right panels) from HomeView
  isSidePanelDragging: { type: Boolean, default: false },
});

// --- Emits ---
// eslint-disable-next-line no-unused-vars
const emit = defineEmits([
  'update:activeTab', 'update:activeBottomTab',
  'update:zoomLevel', 'update:currentCoords', 'update:activeMarkers',
  'update:tableSearchQuery', 'sort-table', 'highlight-on-map',
  'update:selectedColorScheme', 'update:selectedBorderColor', 'update:selectedBorderWeight',
  'reset-view',
  // Potentially emits for panel size changes if HomeView needs to know
]);

// --- Refs for internal components ---
const mainContentRef = ref(null); // For calling methods like highlightFeature
const bottomPanelRef = ref(null);


// --- Internal Vertical Resizing Logic ---
const bottomPanelHeightPercent = ref(30); // Default 30% for bottom panel
const isVerticalDragging = ref(false);
// const internalWindowHeight = ref(window.innerHeight); // Removed

// Computed property to determine if any dragging is occurring that affects this area
const isOverallDragging = computed(() => {
  return props.isSidePanelDragging || isVerticalDragging.value;
});

const middleSectionTotalHeight = computed(() => {
  // const totalHeight = internalWindowHeight.value - 40;
  const totalHeight = props.dynamicMainAreaHeight;
  console.log(`MDA: middleSectionTotalHeight (from prop): ${totalHeight}`);
  return Math.max(totalHeight, 0); // Ensure it's not negative if prop is bad
});

const actualBottomPanelPixelHeight = computed(() => {
  const pixelHeight = (bottomPanelHeightPercent.value / 100) * middleSectionTotalHeight.value;
  console.log(`MDA: actualBottomPanelPixelHeight calculated: ${pixelHeight} (percent: ${bottomPanelHeightPercent.value}%, totalMiddle: ${middleSectionTotalHeight.value})`);
  return pixelHeight;
  // document.removeEventListener('mousemove', handleMouseMove);
  // document.removeEventListener('mouseup', handleMouseUp);
});

const contentHeight = computed(() => { // For MainContent
  const mainContentH = middleSectionTotalHeight.value - actualBottomPanelPixelHeight.value;
  console.log(`MDA: contentHeight (for MainContent) calculated: ${mainContentH}, totalMiddle: ${middleSectionTotalHeight.value}, bottomPanelPx: ${actualBottomPanelPixelHeight.value}`);
  return mainContentH;
});

const startVerticalResize = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  isVerticalDragging.value = true;
  document.body.classList.add('my-no-select'); // Keep global no-select class
  
  const startY = event.clientY;
  const startBottomPercent = bottomPanelHeightPercent.value;
  const currentMiddleSectionHeight = middleSectionTotalHeight.value;

  const handleMouseMove = (moveEvent) => {
    moveEvent.preventDefault();
    const deltaY = moveEvent.clientY - startY;
    
    if (currentMiddleSectionHeight === 0) return;

    const deltaPercent = (deltaY / currentMiddleSectionHeight) * 100;
    // Drag up (deltaY < 0) increases bottom panel height percent
    // Drag down (deltaY > 0) decreases bottom panel height percent
    let newPercent = startBottomPercent - deltaPercent; 
    newPercent = Math.max(0, Math.min(100, newPercent));
    bottomPanelHeightPercent.value = Math.round(newPercent * 10) / 10;
  };

  const handleMouseUp = () => {
    isVerticalDragging.value = false;
    document.body.classList.remove('my-no-select');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// const handleWindowResize = () => { // Removed
//   internalWindowHeight.value = window.innerHeight;
// };

watch(() => props.activeTab, (newTab, oldTab) => {
  console.log(`MDA Watcher: activeTab changed from "${oldTab}" to "${newTab}". Current bottomPanelHeightPercent: ${bottomPanelHeightPercent.value}%`);
});

onMounted(() => {
  // window.addEventListener('resize', handleWindowResize); // Removed
  // handleWindowResize(); // Removed
  // Initial calculations will rely on prop being correct from HomeView
});

onUnmounted(() => {
  // window.removeEventListener('resize', handleWindowResize); // Removed
});

// --- Methods to be called from parent (HomeView) ---
// These will now operate on mainContentRef
const highlightFeature = (code2) => {
  if (mainContentRef.value) {
    mainContentRef.value.highlightFeature(code2);
  }
};

const fitToTainanBounds = () => {
  if (mainContentRef.value) {
    mainContentRef.value.fitToTainanBounds();
  }
};

const resetMapView = () => { // Renamed to avoid conflict if passed as prop
  if (mainContentRef.value) {
    mainContentRef.value.resetView(); // Assuming MainContent has resetView
  }
};

// Expose methods if HomeView needs to call them
// eslint-disable-next-line no-undef
defineExpose({
  highlightFeature,
  fitToTainanBounds,
  resetMapView,
  // Potentially expose mainContentRef and bottomPanelRef if HomeView needs direct access
});

</script>

<style scoped>
/* Styles for my-resizer-horizontal are expected to be global or inherited from HomeView */
/* Add any specific styles for MainDisplayArea if needed */
.my-resizer-horizontal { /* Copied from HomeView for completeness */
  min-height: 4px;
  max-height: 4px;
  cursor: row-resize;
  background-color: #dee2e6; /* Bootstrap default border color */
  transition: all 0.2s ease;
  /* Ensure it has a z-index if necessary, though usually not for simple resizers */
}

.my-resizer-horizontal:hover,
.my-resizer-horizontal.dragging {
  min-height: 6px;
  max-height: 6px;
  background-color: #007bff; /* Bootstrap primary color */
}
</style> 