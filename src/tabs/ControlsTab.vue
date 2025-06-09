<template>
  <!-- 🎛️ ControlsTab.vue - 控制分頁組件 (Controls Tab Component) -->
  <!-- 提供系統設定、圖層狀態顯示和色票選擇等控制功能 -->
  <div class="p-3 custom-scroll h-100">
    <!-- 📱 地圖控制區域 (已註解) (Map Controls Area - Commented Out) -->
    <!-- 暫時隱藏的地圖縮放和座標控制功能，可在需要時啟用 -->
    <!-- 
    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label fw-semibold">
          縮放級別
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
        <label class="form-label fw-semibold">
          地圖中心
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
    -->

    <!-- 🎨 色票選擇區域 (Color Scheme Selection Area) -->
    <!-- 提供多種 Python 風格色票方案的選擇介面 -->
    <div class="row mb-4">
      <div class="col-12">
        <ColorSchemeSelector
          :selectedScheme="selectedColorScheme"
          @update:selectedScheme="$emit('update:selectedColorScheme', $event)" />
      </div>
    </div>

    <!-- 🌈 顏色預覽區域 (Color Preview Area) -->
    <!-- 即時預覽選定色票方案的顏色分布效果 -->
    <div class="row mb-4" v-if="maxCount > 0">
      <div class="col-12">
        <ColorPreview
          :maxCount="maxCount"
          :colorScheme="selectedColorScheme" />
      </div>
    </div>

    <!-- 📊 圖層狀態卡片 (Layer Status Card) -->
    <!-- 顯示當前系統中各個圖層的載入和顯示狀態 -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card bg-dark text-white">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-layer-group"></i> 圖層狀態
            </h6>
          </div>
          <div class="card-body">
            <div class="row justify-content-center">
              <!-- 🗺️ 台南市區域圖層狀態指示器 (Tainan Region Layer Status Indicator) -->
              <div class="col-md-6">
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
    
    <!-- 🔧 系統資訊卡片 (System Information Card) -->
    <!-- 顯示系統狀態、配置資訊和即時統計數據 -->
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
              <!-- 📏 左側系統資訊欄 (Left System Info Column) -->
              <div class="col-md-6">
                <!-- 📏 面板高度資訊 (Panel Height Info) -->
                <SystemInfo 
                  label="面板高度"
                  :value="`${bottomPanelHeight}px`"
                  icon="arrows-alt-v" />
                <!-- 📊 活躍圖層計數 (Active Layers Count) -->
                <SystemInfo 
                  label="活躍圖層"
                  :value="getActiveLayersCount()"
                  icon="layer-group" />
                <!-- 📍 座標系統資訊 (Coordinate System Info) -->
                <SystemInfo 
                  label="座標系統"
                  value="TWD97→WGS84"
                  icon="globe-asia" />
              </div>
              <!-- 📊 右側系統資訊欄 (Right System Info Column) -->
              <div class="col-md-6">
                <!-- ⏰ 最後更新時間 (Last Update Time) -->
                <SystemInfo 
                  label="最後更新"
                  :value="getCurrentTime()"
                  icon="clock" />
                <!-- 💾 數據載入狀態 (Data Loading Status) -->
                <SystemInfo 
                  label="數據載入狀態"
                  :value="isLoadingData ? '載入中' : '完成'"
                  icon="database"
                  :statusClass="isLoadingData ? 'text-warning' : 'text-success'" />
                <!-- 🎨 色票方案資訊 (Color Scheme Info) -->
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
/**
 * 🎛️ ControlsTab.vue - 控制分頁組件
 * 
 * 功能說明：
 * 1. 🎨 提供色票方案選擇和即時預覽功能
 * 2. 📊 顯示圖層狀態和活躍狀態指示器
 * 3. 🔧 展示系統資訊和配置狀態
 * 4. ⏰ 提供即時的系統狀態更新
 * 5. 📏 顯示面板尺寸和佈局資訊
 * 6. 💾 監控數據載入和處理狀態
 * 
 * 架構說明：
 * - 色票選擇區域：ColorSchemeSelector 組件
 * - 顏色預覽區域：ColorPreview 組件
 * - 圖層狀態卡片：LayerStatusIndicator 組件
 * - 系統資訊卡片：SystemInfo 組件陣列
 * 
 * 設計理念：
 * - 卡片式佈局，清晰分類資訊
 * - 即時狀態更新，提供視覺回饋
 * - 響應式設計，適應不同螢幕尺寸
 * - 模組化組件結構，便於維護
 */

// 🧩 子組件引入
import LayerStatusIndicator from '../common/LayerStatusIndicator.vue'
import SystemInfo from '../common/SystemInfo.vue'
import ColorSchemeSelector from '../common/ColorSchemeSelector.vue'
import ColorPreview from '../common/ColorPreview.vue'

export default {
  name: 'ControlsTab',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   * 註冊控制分頁中使用的所有子組件
   */
  components: {
    LayerStatusIndicator,  // 圖層狀態指示器組件
    SystemInfo,           // 系統資訊顯示組件
    ColorSchemeSelector,  // 色票方案選擇器組件
    ColorPreview         // 顏色預覽組件
  },
  
  /**
   * 📥 組件屬性定義 (Component Props)
   * 接收來自父組件的狀態和配置數據
   */
  props: {
    /** 🔍 地圖縮放等級 (1-18) */
    zoomLevel: {
      type: Number,
      default: 10
    },
    /** 📍 當前地圖中心座標 */
    currentCoords: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 })
    },
    /** 📏 底部面板高度 (像素) */
    bottomPanelHeight: {
      type: Number,
      default: 300
    },
    /** ⏳ 是否正在載入數據 */
    isLoadingData: {
      type: Boolean,
      default: false
    },
    /** 🗺️ 台南圖層顯示狀態 */
    showTainanLayer: {
      type: Boolean,
      default: false
    },
    /** 🎨 選定的色票方案 */
    selectedColorScheme: {
      type: String,
      default: 'default'
    },
    /** 📊 資料集最大數值 (用於色票預覽) */
    maxCount: {
      type: Number,
      default: 0
    }
  },
  
  /**
   * 📤 組件事件定義 (Component Events)
   * 定義向父組件發送的事件類型
   */
  emits: [
    'update:zoomLevel',          // 更新縮放等級
    'update:selectedColorScheme', // 更新選定色票方案
    'reset-view'                 // 重設地圖視圖
  ],
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup(props) {
    /**
     * ⏰ 取得當前時間字串 (Get Current Time String)
     * 返回格式化的台灣時區時間字串
     * 
     * @returns {string} 格式化的時間字串
     */
    const getCurrentTime = () => {
      return new Date().toLocaleString('zh-TW')
    }

    /**
     * 📊 計算活躍圖層數量 (Calculate Active Layers Count)
     * 統計當前顯示的圖層數量
     * 
     * @returns {number} 活躍圖層數量
     */
    const getActiveLayersCount = () => {
      let count = 0
      if (props.showTainanLayer) count++
      // 未來可以擴展支援更多圖層
      return count
    }

    // 📤 返回組件介面
    return {
      getCurrentTime,      // 取得當前時間方法
      getActiveLayersCount // 計算活躍圖層數量方法
    }
  }
}
</script> 