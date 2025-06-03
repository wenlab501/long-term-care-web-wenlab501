<template>
  <div class="col-12">
    <div class="card h-100">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-map-marked-alt me-2"></i>
          GeoJSON 資料載入
        </h6>
      </div>
      <div class="card-body">
        <!-- 檔案載入區域 -->
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

        <!-- 座標系統資訊 -->
        <div v-if="coordinateInfo" class="mb-3">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>檢測結果：</strong> {{ coordinateInfo.detected }}
            <span v-if="coordinateInfo.converted" class="ms-2">
              → 已轉換為 {{ coordinateInfo.target }}
            </span>
          </div>
        </div>

        <!-- 載入狀態 -->
        <div v-if="loading" class="text-center mb-3">
          <div class="spinner-border color-level-400" role="status">
            <span class="visually-hidden">載入中...</span>
          </div>
          <div class="mt-2">處理中...</div>
        </div>

        <!-- 資料統計 -->
        <div v-if="geoData" class="mb-3">
          <h6><i class="fas fa-chart-bar me-2"></i>資料統計</h6>
          <div class="row">
            <div class="col-6">
              <div class="card text-center color-level-100">
                <div class="card-body py-2">
                  <div class="h5 mb-1">{{ geoData.features?.length || 0 }}</div>
                  <small>特徵數量</small>
                </div>
              </div>
            </div>
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

        <!-- 幾何類型分布 -->
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

        <!-- 操作按鈕 -->
        <div v-if="geoData" class="d-grid gap-2">
          <button 
            class="btn btn-primary btn-icon"
            @click="addToMap"
          >
            <i class="fas fa-map"></i>
            <span>加入地圖</span>
          </button>
          
          <button 
            class="btn btn-outline-secondary btn-icon"
            @click="analyzeData"
          >
            <i class="fas fa-chart-line"></i>
            <span>空間分析</span>
          </button>

          <button 
            class="btn btn-outline-danger btn-icon"
            @click="clearData"
          >
            <i class="fas fa-trash"></i>
            <span>清除資料</span>
          </button>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="error" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useDataStore } from '../stores/dataStore.js'
import { useMapStore } from '../stores/mapStore.js'

export default {
  name: 'GeojsonLoader',
  setup() {
    const dataStore = useDataStore()
    const mapStore = useMapStore()
    
    const loading = ref(false)
    const error = ref('')
    const geoData = ref(null)
    const coordinateInfo = ref(null)

    // 計算幾何類型分布
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

    // 取得幾何類型圖示
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

    // 處理檔案載入
    const handleFileLoad = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      loading.value = true
      error.value = ''
      coordinateInfo.value = null

      try {
        const text = await file.text()
        const jsonData = JSON.parse(text)

        // 檢測座標系統
        const detectedCRS = mapStore.detectCoordinateSystem(jsonData)
        
        // 處理座標轉換
        const processedData = mapStore.processGeoJSONLoad(jsonData)
        
        geoData.value = processedData
        
        // 設定座標資訊
        coordinateInfo.value = {
          detected: detectedCRS,
          converted: detectedCRS === 'TWD97',
          target: 'WGS84'
        }

        // 存入 Store
        dataStore.setRawData('geojson', jsonData, {
          filename: file.name,
          size: file.size,
          coordinateSystem: detectedCRS
        })

        if (detectedCRS === 'TWD97') {
          dataStore.setProcessedData('transformedGeojson', processedData, {
            transformation: 'TWD97 → WGS84',
            method: 'proj4'
          })
        }

        console.log('✅ GeoJSON 載入成功:', {
          features: jsonData.features?.length,
          detectedCRS,
          converted: detectedCRS === 'TWD97'
        })

      } catch (err) {
        error.value = `載入失敗: ${err.message}`
        console.error('❌ GeoJSON 載入錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    // 加入地圖
    const addToMap = () => {
      if (!geoData.value) return
      
      // 這裡可以觸發地圖組件的事件
      console.log('🗺️ 加入地圖:', geoData.value)
      
      // 更新地圖統計
      mapStore.updateStatistics({
        totalCount: geoData.value.features?.length || 0,
        selectedCount: 0
      })
    }

    // 分析資料
    const analyzeData = () => {
      if (!geoData.value) return
      
      console.log('📊 開始空間分析:', geoData.value)
      
      // 這裡可以觸發空間分析
      // 例如：計算空間自相關、聚類分析等
    }

    // 清除資料
    const clearData = () => {
      geoData.value = null
      coordinateInfo.value = null
      error.value = ''
      
      // 清除 Store 中的資料
      dataStore.clearData('geojson')
      dataStore.clearData('transformedGeojson')
      
      console.log('🗑️ 資料已清除')
    }

    return {
      loading,
      error,
      geoData,
      coordinateInfo,
      geometryTypes,
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