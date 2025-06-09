<template>
  <div class="d-flex flex-column h-100">
    <!-- 📱 標籤內容 (Tab Content) - 地圖滿版顯示 -->
    <div class="flex-grow-1 overflow-hidden position-relative">
      
      <!-- 🎛️ 統一的導航按鈕 (Unified Navigation Buttons) - 左上角 -->
      <div class="position-absolute top-0 start-0 m-3" style="z-index: 1000;">
        <div class="btn-group shadow-sm" role="group">
          <button 
            class="btn btn-light btn-sm"
            :class="{ 'btn-primary active': activeTab === 'map', 'text-primary': activeTab !== 'map' }" 
            @click="$emit('update:activeTab', 'map')">
            地圖視圖
          </button>
          <button 
            class="btn btn-light btn-sm"
            :class="{ 'btn-success active': activeTab === 'dashboard', 'text-success': activeTab !== 'dashboard' }" 
            @click="$emit('update:activeTab', 'dashboard')">
            數據儀表板
          </button>
        </div>
      </div>
      
      <!-- 🗺️ 地圖標籤 (Map Tab) -->
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
          @update:activeMarkers="$emit('update:activeMarkers', $event)" />
      </div>
      
      <!-- 📊 儀表板標籤 (Dashboard Tab) -->
      <div v-if="activeTab === 'dashboard'" 
           ref="dashboardContainerRef" 
           class="h-100 overflow-auto p-3 pt-5">
        <!-- 為按鈕組留出空間 -->
        <div style="height: 40px;"></div> 
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
          :tainanDataSummary="tainanDataSummary" />
      </div>

      <!-- 🐛 調試信息 (Debug Info) - 當沒有匹配的標籤時顯示 -->
      <div v-if="activeTab !== 'map' && activeTab !== 'dashboard'" class="h-100 d-flex align-items-center justify-content-center bg-light">
        <div class="text-center">
          <h5>調試信息</h5>
          <p>當前 activeTab: <code>{{ activeTab }}</code></p>
          <p>預期值: <code>map</code> 或 <code>dashboard</code></p>
          <button class="btn btn-primary me-2" @click="$emit('update:activeTab', 'map')">切換到地圖</button>
          <button class="btn btn-success" @click="$emit('update:activeTab', 'dashboard')">切換到儀表板</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 🏠 MainContent.vue - 主要內容區域組件
 * 
 * 功能說明：
 * 1. 📑 提供地圖和儀表板的標籤切換
 * 2. 🗺️ 管理地圖視圖組件
 * 3. 📊 管理儀表板視圖組件
 * 4. 📏 響應面板大小變化
 * 5. 🎛️ 支援不同的導航模式（浮動按鈕 vs 固定導航條）
 */
import { ref, watch, nextTick } from 'vue'
import MapView from '../components/MapView.vue'
import DashboardView from '../components/DashboardView.vue'

export default {
  name: 'UpperPanel',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   */
  components: {
    MapView,
    DashboardView
  },
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 📑 活躍的標籤 */
    activeTab: {
      type: String,
      default: 'map',
      required: true
    },
    /** 🛠️ 是否正在拖曳面板 */
    isPanelDragging: {
      type: Boolean,
      default: false
    },
    
    /** 📏 主面板寬度百分比 */
    mainPanelWidth: {
      type: Number,
      default: 60,
      required: true
    },
    
    /** 📏 內容區域高度 */
    contentHeight: {
      type: Number,
      default: 500,
      required: true
    },
    
    /** 🗺️ 台南圖層顯示狀態 */
    showTainanLayer: {
      type: Boolean,
      default: false,
      required: true
    },
    
    /** 🔍 選擇的篩選條件 */
    selectedFilter: {
      type: String,
      default: '',
      required: true
    },
    
    /** 🎨 選擇的色票方案 */
    selectedColorScheme: {
      type: String,
      default: 'viridis',
      required: true
    },
    
    /** 🎨 選擇的邊框顏色 */
    selectedBorderColor: {
      type: String,
      default: '#666666',
      required: true
    },
    
    /** 🎨 選擇的邊框寬度 */
    selectedBorderWeight: {
      type: Number,
      default: 1,
      required: true
    },
    
    /** 🔍 地圖縮放級別 */
    zoomLevel: {
      type: Number,
      default: 10,
      required: true
    },
    
    /** 📊 台南GeoJSON數據 */
    tainanGeoJSONData: {
      type: Object,
      default: null
    },
    
    /** 📊 最大計數值 */
    maxCount: {
      type: Number,
      default: 0,
      required: true
    },
    
    /** 📋 合併的表格數據 */
    mergedTableData: {
      type: Array,
      default: () => [],
      required: true
    },
    
    /** 📊 平均計數值 */
    averageCount: {
      type: Number,
      default: 0,
      required: true
    },
    
    /** 📊 有數據的區域數量 */
    dataRegionsCount: {
      type: Number,
      default: 0,
      required: true
    },
    activeMarkers: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    },
    tainanDataSummary: {
      type: Object,
      default: null
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   */
  emits: [
    'update:activeTab',
    'update:zoomLevel',
    'update:currentCoords',
    'update:activeMarkers'
  ],
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup(props) {
    // 📚 組件引用 (Component References)
    const mapView = ref(null)
    const dashboardView = ref(null)
    const dashboardContainerRef = ref(null)

    /**
     * 👀 監聽拖曳狀態和標籤變化以調整儀表板容器的指針事件
     */
    watch([() => props.isPanelDragging, () => props.activeTab], ([dragging, tab]) => {
      nextTick(() => {
        if (dashboardContainerRef.value) {
          if (dragging && tab === 'dashboard') {
            dashboardContainerRef.value.style.pointerEvents = 'none';
            console.log('MainContent: Dashboard container pointer-events set to none');
          } else {
            dashboardContainerRef.value.style.pointerEvents = 'auto';
            console.log('MainContent: Dashboard container pointer-events set to auto (dragging:', dragging, ', tab:', tab, ')');
          }
        }
      });
    }, { immediate: true });

    /**
     * 👀 監聽標籤變化 (Watch Tab Changes)
     * 當切換標籤時觸發相應的更新動作
     */
    watch(() => props.activeTab, (newTab) => {
      nextTick(() => {
        if (newTab === 'map' && mapView.value) {
          // 🗺️ 刷新地圖大小
          mapView.value.invalidateSize()
        } else if (newTab === 'dashboard' && dashboardView.value) {
          // 📊 刷新圖表
          dashboardView.value.refreshCharts()
        }
      })
    })

    /**
     * 👀 監聽面板大小變化 (Watch Panel Size Changes)
     * 當面板大小變化時更新子組件
     */
    watch([() => props.mainPanelWidth, () => props.contentHeight], () => {
      nextTick(() => {
        if (props.activeTab === 'map' && mapView.value) {
          // 🗺️ 重新計算地圖大小
          mapView.value.invalidateSize()
        } else if (props.activeTab === 'dashboard' && dashboardView.value) {
          // 📊 重新計算圖表大小
          dashboardView.value.refreshCharts()
        }
      })
    })

    /**
     * 🎯 高亮顯示指定區域
     * @param {string} name - 區域名稱
     */
    const highlightFeature = (name) => {
      if (mapView.value) {
        mapView.value.highlightFeature(name)
      }
    }

    /**
     * 🔄 重置地圖視圖 (Reset Map View)
     */
    const resetView = () => {
      if (mapView.value) {
        mapView.value.resetView()
      }
    }

    /**
     * 🗺️ 適應台南邊界 (Fit to Tainan Bounds)
     */
    const fitToTainanBounds = () => {
      if (mapView.value) {
        mapView.value.fitToTainanBounds()
      }
    }

    // 📤 返回數據和方法 (Return Data and Methods)
    return {
      mapView,
      dashboardView,
      dashboardContainerRef,
      highlightFeature,
      resetView,
      fitToTainanBounds
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 主要內容區域樣式 (Main Content Styles)
 */

/* 🎛️ 固定導航條樣式 */
.navbar {
  padding: 0.5rem 1rem;
}

.navbar .btn {
  border-radius: 0.375rem;
  margin-right: 0.25rem;
}

.navbar .btn:last-child {
  margin-right: 0;
}

/* 📱 內容區域樣式 */
.flex-grow-1 {
  overflow: hidden;
}

/* 📊 儀表板區域樣式 */
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}

.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1;
}
</style> 