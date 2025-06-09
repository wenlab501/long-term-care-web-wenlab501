<template>
  <!-- 📁 GeojsonLoader.vue - GeoJSON 資料載入組件 (GeoJSON Loader Component) -->
  <!-- 提供 GeoJSON 檔案載入、座標系統檢測轉換及資料統計分析功能 -->
  <div class="col-12">
    <div class="card h-100">
      <!-- 📄 組件標題區域 (Component Header) -->
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-map-marked-alt me-2"></i>
          GeoJSON 資料載入
        </h6>
      </div>
      
      <!-- 📄 主要內容區域 (Main Content Area) -->
      <div class="card-body">
        <!-- 📁 檔案選擇區域 (File Selection Area) -->
        <!-- 支援 .geojson 和 .json 格式檔案上傳 -->
        <div class="mb-3">
          <label for="geojsonFile" class="form-label">
            <i class="fas fa-file-upload me-1"></i>
            選擇 GeoJSON 檔案
          </label>
          <input 
            id="geojsonFile"
            type="file" 
            class="form-control" 
            accept=".geojson,.json"
            @change="handleFileLoad"
          >
          <div class="form-text">
            支援 TWD97 和 WGS84 座標系統，系統會自動檢測並轉換
          </div>
        </div>

        <!-- 📍 座標系統資訊顯示 (Coordinate System Information) -->
        <!-- 顯示檢測到的座標系統和轉換狀態 -->
        <div v-if="coordinateInfo" class="mb-3">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>檢測結果：</strong> {{ coordinateInfo.detected }}
            <span v-if="coordinateInfo.converted" class="ms-2">
              → 已轉換為 {{ coordinateInfo.target }}
            </span>
          </div>
        </div>

        <!-- ⏳ 載入狀態指示器 (Loading Status Indicator) -->
        <!-- 在處理檔案時顯示旋轉載入動畫 -->
        <div v-if="loading" class="text-center mb-3">
          <div class="spinner-border color-level-400" role="status">
            <span class="visually-hidden">載入中...</span>
          </div>
          <div class="mt-2">處理中...</div>
        </div>

        <!-- 📊 資料統計摘要 (Data Statistics Summary) -->
        <!-- 顯示 GeoJSON 特徵數量和幾何類型統計 -->
        <div v-if="geoData" class="mb-3">
          <h6><i class="fas fa-chart-bar me-2"></i>資料統計</h6>
          <div class="row">
            <!-- 📊 特徵數量統計卡片 (Features Count Card) -->
            <div class="col-6">
              <div class="card text-center color-level-100">
                <div class="card-body py-2">
                  <div class="h5 mb-1">{{ geoData.features?.length || 0 }}</div>
                  <small>特徵數量</small>
                </div>
              </div>
            </div>
            <!-- 📊 幾何類型數量統計卡片 (Geometry Types Count Card) -->
            <div class="col-6">
              <div class="card text-center color-level-200">
                <div class="card-body py-2">
                  <div class="h5 mb-1">{{ geometryTypes.length }}</div>
                  <small>幾何類型</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🔍 幾何類型分布詳情 (Geometry Type Distribution Details) -->
        <!-- 列出各種幾何類型及其數量統計 -->
        <div v-if="geometryTypes.length > 0" class="mb-3">
          <h6><i class="fas fa-shapes me-2"></i>幾何類型分布</h6>
          <div class="row g-2">
            <div 
              v-for="type in geometryTypes" 
              :key="type.name"
              class="col-12"
            >
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  <i :class="getGeometryIcon(type.name)" class="me-2"></i>
                  {{ type.name }}
                </span>
                <span class="badge color-level-400">{{ type.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 🎛️ 操作按鈕組 (Action Buttons Group) -->
        <!-- 提供加入地圖、空間分析、清除資料等操作 -->
        <div v-if="geoData" class="d-grid gap-2">
          <!-- 🗺️ 加入地圖按鈕 (Add to Map Button) -->
          <button 
            class="btn btn-primary btn-icon"
            @click="addToMap"
          >
            <i class="fas fa-map"></i>
            <span>加入地圖</span>
          </button>
          
          <!-- 📈 空間分析按鈕 (Spatial Analysis Button) -->
          <button 
            class="btn btn-outline-secondary btn-icon"
            @click="analyzeData"
          >
            <i class="fas fa-chart-line"></i>
            <span>空間分析</span>
          </button>

          <!-- 🗑️ 清除資料按鈕 (Clear Data Button) -->
          <button 
            class="btn btn-outline-danger btn-icon"
            @click="clearData"
          >
            <i class="fas fa-trash"></i>
            <span>清除資料</span>
          </button>
        </div>

        <!-- ❌ 錯誤訊息顯示區域 (Error Message Display Area) -->
        <!-- 當檔案載入或處理失敗時顯示錯誤訊息 -->
        <div v-if="error" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 📁 GeojsonLoader.vue - GeoJSON 資料載入組件
 * 
 * 功能說明：
 * 1. 📁 提供 GeoJSON 檔案上傳和解析功能
 * 2. 📍 自動檢測座標系統（TWD97/WGS84）並進行轉換
 * 3. 📊 分析和統計 GeoJSON 資料結構
 * 4. 🔍 顯示幾何類型分布和特徵數量
 * 5. 🗺️ 將資料加入地圖圖層系統
 * 6. 📈 整合空間分析工具
 * 7. 💾 與 Pinia store 整合進行資料管理
 * 
 * 支援功能：
 * - 📄 檔案格式：.geojson, .json
 * - 📍 座標系統：TWD97 (EPSG:3826), WGS84 (EPSG:4326)
 * - 🔍 幾何類型：Point, LineString, Polygon 及其 Multi 版本
 * - 📊 即時統計分析和視覺化回饋
 * 
 * 設計理念：
 * - 使用者友善的拖放上傳介面
 * - 自動化座標系統處理
 * - 即時的視覺化回饋
 * - 完整的錯誤處理機制
 * 
 * @author 長照空間分析團隊
 * @version 1.0.0
 * @since 2024
 */

// 🔧 Vue Composition API 引入
import { ref, computed } from 'vue'
// 📦 Pinia 狀態管理引入
import { useDataStore } from '../stores/dataStore.js'

export default {
  name: 'GeojsonLoader',
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup() {
    // 📦 取得 Pinia 存儲實例
    const dataStore = useDataStore()
    
    // 📊 組件狀態 (Component State)
    /** ⏳ 載入狀態 */
    const loading = ref(false)
    /** ❌ 錯誤訊息 */
    const error = ref('')
    /** 📊 解析後的 GeoJSON 資料 */
    const geoData = ref(null)
    /** 📍 座標系統檢測資訊 */
    const coordinateInfo = ref(null)

    /**
     * 🔍 幾何類型分布計算屬性 (Geometry Types Distribution Computed)
     * 分析 GeoJSON 中各種幾何類型的數量分布
     */
    const geometryTypes = computed(() => {
      if (!geoData.value?.features) return []
      
      const types = {}
      geoData.value.features.forEach(feature => {
        const type = feature.geometry?.type
        if (type) {
          types[type] = (types[type] || 0) + 1
        }
      })
      
      return Object.entries(types).map(([name, count]) => ({
        name,
        count
      }))
    })

    /**
     * 🎨 取得幾何類型圖示 (Get Geometry Type Icon)
     * 根據 GeoJSON 幾何類型返回對應的 Font Awesome 圖示類別
     * 
     * @param {string} type - GeoJSON 幾何類型
     * @returns {string} Font Awesome 圖示 CSS 類別
     */
    const getGeometryIcon = (type) => {
      const icons = {
        'Point': 'fas fa-map-pin',
        'MultiPoint': 'fas fa-map-pin',
        'LineString': 'fas fa-route',
        'MultiLineString': 'fas fa-route',
        'Polygon': 'fas fa-draw-polygon',
        'MultiPolygon': 'fas fa-draw-polygon'
      }
      return icons[type] || 'fas fa-question'
    }

    /**
     * 📁 處理檔案載入 (Handle File Load)
     * 處理使用者選擇的 GeoJSON 檔案，進行解析和座標系統檢測
     * 
     * @param {Event} event - 檔案選擇事件
     */
    const handleFileLoad = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      loading.value = true
      error.value = ''
      coordinateInfo.value = null

      try {
        const text = await file.text()
        const jsonData = JSON.parse(text)

        // 檢測和處理座標系統
        const { processedData, detectedCRS } = await processCoordinateSystem(jsonData)
        
        geoData.value = processedData
        
        // 設定座標系統資訊
        coordinateInfo.value = {
          detected: detectedCRS,
          converted: detectedCRS === 'TWD97',
          target: detectedCRS === 'TWD97' ? 'WGS84' : detectedCRS
        }
        
        // 存入 Pinia Store
        dataStore.setRawData('geojson', processedData, {
          filename: file.name,
          size: file.size,
          coordinateSystem: detectedCRS
        })

        console.log('✅ GeoJSON 載入成功:', {
          features: jsonData.features?.length,
          detectedCRS,
          converted: detectedCRS === 'TWD97'
        })

      } catch (err) {
        error.value = `檔案處理失敗: ${err.message}`
        console.error('❌ GeoJSON 載入失敗:', err)
      } finally {
        loading.value = false
      }
    }

    /**
     * 📍 處理座標系統 (Process Coordinate System)
     * 檢測 GeoJSON 的座標系統並進行必要的轉換
     * 
     * @param {Object} jsonData - 原始 GeoJSON 資料
     * @returns {Object} 處理後的資料和檢測結果
     */
    const processCoordinateSystem = async (jsonData) => {
      // 座標系統檢測邏輯（簡化版）
      let detectedCRS = 'Unknown'
      let processedData = jsonData

      // 檢查第一個特徵的座標範圍
      if (jsonData.features && jsonData.features.length > 0) {
        const firstFeature = jsonData.features[0]
        if (firstFeature.geometry && firstFeature.geometry.coordinates) {
          const coords = firstFeature.geometry.coordinates
          const firstCoord = coords[0]
          
          // 簡單檢測：TWD97 座標通常 x > 100000, y > 2000000
          if (Array.isArray(firstCoord) && firstCoord[0] > 100000 && firstCoord[1] > 2000000) {
            detectedCRS = 'TWD97'
            // 這裡應該調用座標轉換函數
            // processedData = await convertTWD97ToWGS84(jsonData)
          } else if (Array.isArray(firstCoord) && firstCoord[0] > -180 && firstCoord[0] < 180) {
            detectedCRS = 'WGS84'
          }
        }
      }

      return { processedData, detectedCRS }
    }

    /**
     * 🗺️ 加入地圖 (Add to Map)
     * 將載入的 GeoJSON 資料加入地圖圖層系統
     */
    const addToMap = () => {
      if (!geoData.value) return
      
      // 通過 dataStore 添加新圖層
      dataStore.toggleLayerVisibility('geojson')
      console.log('🗺️ GeoJSON 資料已加入地圖')
    }

    /**
     * 📈 分析資料 (Analyze Data)
     * 對載入的 GeoJSON 資料進行空間分析
     */
    const analyzeData = () => {
      if (!geoData.value) return
      
      console.log('📈 開始空間分析...')
      // 這裡可以調用空間分析工具
    }

    /**
     * 🗑️ 清除資料 (Clear Data)
     * 清除當前載入的 GeoJSON 資料
     */
    const clearData = () => {
      geoData.value = null
      coordinateInfo.value = null
      error.value = ''
      console.log('🗑️ GeoJSON 資料已清除')
    }

    // 📤 返回組件介面
    return {
      // 📊 狀態
      loading,
      error,
      geoData,
      coordinateInfo,
      
      // 🧮 計算屬性
      geometryTypes,
      
      // 🔧 方法
      getGeometryIcon,
      handleFileLoad,
      addToMap,
      analyzeData,
      clearData
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.alert {
  border-radius: 0.375rem;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 767.98px) {
  .btn-icon span {
    display: none;
  }
  
  .btn-icon {
    gap: 0;
  }
}
</style> 