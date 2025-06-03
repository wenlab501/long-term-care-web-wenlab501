<template>
  <div class="p-3 custom-scroll h-100">
    <!-- 地圖控制區域 -->
    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label text-white fw-semibold">
          <i class="fas fa-search-plus"></i> 縮放級別
        </label>
        <input 
          type="number" 
          class="form-control form-control-sm" 
          :value="zoomLevel" 
          @input="$emit('update:zoomLevel', parseInt($event.target.value))" 
          min="1" 
          max="18">
      </div>
      <div class="col-md-4">
        <label class="form-label text-white fw-semibold">
          <i class="fas fa-map-pin"></i> 地圖中心
        </label>
        <div class="input-group input-group-sm">
          <span class="input-group-text">經緯度</span>
          <input 
            type="text" 
            class="form-control" 
            :value="`${currentCoords.lat}, ${currentCoords.lng}`" 
            readonly>
        </div>
      </div>
      <div class="col-md-4">
        <label class="form-label text-white">&nbsp;</label>
        <button 
          class="btn btn-primary btn-sm w-100" 
          @click="$emit('reset-view')"
          title="重置地圖視圖">
          <i class="fas fa-home"></i> 重置視圖
        </button>
      </div>
    </div>

    <!-- 色票選擇區域 -->
    <div class="row mb-4">
      <div class="col-12">
        <ColorSchemeSelector
          :selectedScheme="selectedColorScheme"
          @update:selectedScheme="$emit('update:selectedColorScheme', $event)" />
      </div>
    </div>

    <!-- 顏色預覽區域 -->
    <div class="row mb-4" v-if="maxCount > 0">
      <div class="col-12">
        <ColorPreview
          :maxCount="maxCount"
          :colorScheme="selectedColorScheme" />
      </div>
    </div>

    <!-- 圖層狀態卡片 -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card bg-dark text-white">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-layer-group"></i> 圖層狀態
            </h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <LayerStatusIndicator 
                  :isActive="showLayer1"
                  label="商店標記"
                  icon="store" />
              </div>
              <div class="col-md-4">
                <LayerStatusIndicator 
                  :isActive="showLayer2"
                  label="熱點區域"
                  icon="fire" />
              </div>
              <div class="col-md-4">
                <LayerStatusIndicator 
                  :isActive="showTainanLayer"
                  label="台南市區域"
                  icon="map" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 系統資訊卡片 -->
    <div class="row">
      <div class="col-12">
        <div class="card bg-dark text-white">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-info-circle"></i> 系統資訊
            </h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <SystemInfo 
                  label="面板高度"
                  :value="`${bottomPanelHeight}px`"
                  icon="arrows-alt-v" />
                <SystemInfo 
                  label="活躍圖層"
                  :value="getActiveLayersCount()"
                  icon="layer-group" />
                <SystemInfo 
                  label="座標系統"
                  value="TWD97→WGS84"
                  icon="globe-asia" />
              </div>
              <div class="col-md-6">
                <SystemInfo 
                  label="最後更新"
                  :value="getCurrentTime()"
                  icon="clock" />
                <SystemInfo 
                  label="數據載入狀態"
                  :value="isLoadingData ? '載入中' : '完成'"
                  icon="database"
                  :statusClass="isLoadingData ? 'text-warning' : 'text-success'" />
                <SystemInfo 
                  label="色票方案"
                  :value="selectedColorScheme.toUpperCase()"
                  icon="palette" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LayerStatusIndicator from '../common/LayerStatusIndicator.vue'
import SystemInfo from '../common/SystemInfo.vue'
import ColorSchemeSelector from '../common/ColorSchemeSelector.vue'
import ColorPreview from '../common/ColorPreview.vue'

export default {
  name: 'ControlsTab',
  components: {
    LayerStatusIndicator,
    SystemInfo,
    ColorSchemeSelector,
    ColorPreview
  },
  props: {
    zoomLevel: {
      type: Number,
      default: 10
    },
    currentCoords: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 })
    },
    bottomPanelHeight: {
      type: Number,
      default: 300
    },
    isLoadingData: {
      type: Boolean,
      default: false
    },
    showLayer1: {
      type: Boolean,
      default: false
    },
    showLayer2: {
      type: Boolean,
      default: false
    },
    showTainanLayer: {
      type: Boolean,
      default: false
    },
    selectedColorScheme: {
      type: String,
      default: 'default'
    },
    maxCount: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'update:zoomLevel',
    'update:selectedColorScheme',
    'reset-view'
  ],
  setup(props) {
    /**
     * 取得當前時間字串
     * @returns {string} 格式化的時間字串
     */
    const getCurrentTime = () => {
      return new Date().toLocaleString('zh-TW')
    }

    /**
     * 計算活躍圖層數量
     * @returns {number} 活躍圖層數量
     */
    const getActiveLayersCount = () => {
      let count = 0
      if (props.showLayer1) count++
      if (props.showLayer2) count++
      if (props.showTainanLayer) count++
      return count
    }

    return {
      getCurrentTime,
      getActiveLayersCount
    }
  }
}
</script> 