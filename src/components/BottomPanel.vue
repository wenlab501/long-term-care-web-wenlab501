<template>
  <div class="bg-white text-dark border-top" :style="{ height: bottomPanelHeight + 'px' }">
    <!-- 底部Tab導航 -->
    <div class="bg-light">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button 
            class="nav-link text-dark border-0" 
            :class="{ active: activeBottomTab === 'table', 'bg-primary text-white': activeBottomTab === 'table' }" 
            @click="$emit('update:activeBottomTab', 'table')">
            數據表格
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link text-dark border-0" 
            :class="{ active: activeBottomTab === 'controls', 'bg-primary text-white': activeBottomTab === 'controls' }" 
            @click="$emit('update:activeBottomTab', 'controls')">
            控制面板
          </button>
        </li>
      </ul>
    </div>
    
    <!-- 底部Tab內容 -->
    <div class="tab-content h-100 overflow-hidden">
      <!-- 數據表格Tab -->
      <div v-show="activeBottomTab === 'table'" class="h-100">
        <DataTableTab
          :mergedTableData="mergedTableData"
          :sortedAndFilteredTableData="sortedAndFilteredTableData"
          :tableSearchQuery="tableSearchQuery"
          :sortField="sortField"
          :sortDirection="sortDirection"
          @update:tableSearchQuery="$emit('update:tableSearchQuery', $event)"
          @sort-table="$emit('sort-table', $event)"
          @highlight-on-map="$emit('highlight-on-map', $event)" />
      </div>
      
      <!-- 控制面板Tab -->
      <div v-show="activeBottomTab === 'controls'" class="h-100">
        <ControlsTab
          :zoomLevel="zoomLevel"
          :currentCoords="currentCoords"
          :bottomPanelHeight="bottomPanelHeight"
          :isLoadingData="isLoadingData"
          :showTainanLayer="showTainanLayer"
          :selectedColorScheme="selectedColorScheme"
          :maxCount="maxCount"
          @update:zoomLevel="$emit('update:zoomLevel', $event)"
          @update:selectedColorScheme="$emit('update:selectedColorScheme', $event)"
          @reset-view="$emit('reset-view')" />
      </div>
    </div>
  </div>
</template>

<script>
import DataTableTab from './tabs/DataTableTab.vue'
import ControlsTab from './tabs/ControlsTab.vue'

export default {
  name: 'BottomPanel',
  components: {
    DataTableTab,
    ControlsTab
  },
  props: {
    // Tab狀態
    activeBottomTab: {
      type: String,
      default: 'table'
    },
    // 面板尺寸
    bottomPanelHeight: {
      type: Number,
      default: 300
    },
    // 表格數據
    mergedTableData: {
      type: Array,
      default: () => []
    },
    sortedAndFilteredTableData: {
      type: Array,
      default: () => []
    },
    tableSearchQuery: {
      type: String,
      default: ''
    },
    sortField: {
      type: String,
      default: ''
    },
    sortDirection: {
      type: String,
      default: 'asc'
    },
    // 地圖控制
    zoomLevel: {
      type: Number,
      default: 10
    },
    currentCoords: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 })
    },
    // 系統狀態
    isLoadingData: {
      type: Boolean,
      default: false
    },
    // 圖層狀態
    showTainanLayer: {
      type: Boolean,
      default: false
    },
    selectedColorScheme: {
      type: String,
      default: ''
    },
    maxCount: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'update:activeBottomTab',
    'update:tableSearchQuery',
    'sort-table',
    'highlight-on-map',
    'update:zoomLevel',
    'update:selectedColorScheme',
    'reset-view'
  ]
}
</script> 