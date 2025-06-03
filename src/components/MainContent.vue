<template>
  <div class="d-flex flex-column" :style="{ width: mainPanelWidth + 'px' }">
    <!-- Tab Navigation -->
    <div class="bg-white border-bottom">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'map' }" @click="$emit('update:activeTab', 'map')">
            <i class="fas fa-map"></i> 地圖視圖
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'dashboard' }" @click="$emit('update:activeTab', 'dashboard')">
            <i class="fas fa-chart-bar"></i> 數據儀表板
          </button>
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <div class="flex-grow-1" :style="{ height: contentHeight + 'px' }">
      <!-- Map Tab -->
      <div v-show="activeTab === 'map'" class="h-100">
        <MapView 
          ref="mapView"
          :showLayer1="showLayer1"
          :showLayer2="showLayer2"
          :showTainanLayer="showTainanLayer"
          :selectedFilter="selectedFilter"
          :zoomLevel="zoomLevel"
          :tainanGeoJSONData="tainanGeoJSONData"
          :maxCount="maxCount"
          @update:zoomLevel="$emit('update:zoomLevel', $event)"
          @update:currentCoords="$emit('update:currentCoords', $event)"
          @update:activeMarkers="$emit('update:activeMarkers', $event)" />
      </div>
      
      <!-- Dashboard Tab -->
      <div v-show="activeTab === 'dashboard'" class="h-100">
        <DashboardView 
          ref="dashboardView"
          :mergedTableData="mergedTableData"
          :maxCount="maxCount"
          :averageCount="averageCount"
          :dataRegionsCount="dataRegionsCount"
          :containerHeight="contentHeight" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import MapView from './MapView.vue'
import DashboardView from './DashboardView.vue'

export default {
  name: 'MainContent',
  components: {
    MapView,
    DashboardView
  },
  props: {
    activeTab: String,
    mainPanelWidth: Number,
    contentHeight: Number,
    showLayer1: Boolean,
    showLayer2: Boolean,
    showTainanLayer: Boolean,
    selectedFilter: String,
    zoomLevel: Number,
    tainanGeoJSONData: Object,
    maxCount: Number,
    mergedTableData: Array,
    averageCount: Number,
    dataRegionsCount: Number
  },
  emits: [
    'update:activeTab',
    'update:zoomLevel',
    'update:currentCoords',
    'update:activeMarkers'
  ],
  setup(props) {
    const mapView = ref(null)
    const dashboardView = ref(null)

    // Watch for tab changes and trigger appropriate actions
    watch(() => props.activeTab, (newTab) => {
      nextTick(() => {
        if (newTab === 'map' && mapView.value) {
          mapView.value.invalidateSize()
        } else if (newTab === 'dashboard' && dashboardView.value) {
          dashboardView.value.refreshCharts()
        }
      })
    })

    // Watch for panel size changes
    watch([() => props.mainPanelWidth, () => props.contentHeight], () => {
      nextTick(() => {
        if (props.activeTab === 'map' && mapView.value) {
          mapView.value.invalidateSize()
        } else if (props.activeTab === 'dashboard' && dashboardView.value) {
          dashboardView.value.refreshCharts()
        }
      })
    })

    const highlightFeature = (code2) => {
      if (mapView.value) {
        mapView.value.highlightFeature(code2)
      }
    }

    const resetView = () => {
      if (mapView.value) {
        mapView.value.resetView()
      }
    }

    const fitToTainanBounds = () => {
      if (mapView.value) {
        mapView.value.fitToTainanBounds()
      }
    }

    return {
      mapView,
      dashboardView,
      highlightFeature,
      resetView,
      fitToTainanBounds
    }
  }
}
</script> 