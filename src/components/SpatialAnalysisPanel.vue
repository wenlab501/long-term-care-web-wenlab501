<template>
  <div class="col-12">
    <div class="card h-100">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="fas fa-chart-area me-2"></i>
          空間分析工具
        </h6>
      </div>
      <div class="card-body">
        <!-- 分析參數設定 -->
        <div class="mb-4">
          <h6><i class="fas fa-cog me-2"></i>分析參數</h6>
          
          <!-- K值設定 -->
          <div class="mb-3">
            <label class="form-label">
              <i class="fas fa-hashtag me-1"></i>
              K最近鄰數量
            </label>
            <div class="input-group">
              <input 
                v-model.number="analysisParams.kValue"
                type="range" 
                class="form-range"
                min="1" 
                max="20" 
                step="1"
              >
              <span class="input-group-text">{{ analysisParams.kValue }}</span>
            </div>
          </div>

          <!-- 權重類型 -->
          <div class="mb-3">
            <label class="form-label">
              <i class="fas fa-weight-hanging me-1"></i>
              權重計算方式
            </label>
            <select v-model="analysisParams.weightType" class="form-select">
              <option value="inverse_distance">反距離權重</option>
              <option value="distance">距離權重</option>
              <option value="equal">等權重</option>
            </select>
          </div>

          <!-- 聚集閾值 -->
          <div class="mb-3">
            <label class="form-label">
              <i class="fas fa-bullseye me-1"></i>
              聚集檢測閾值
            </label>
            <div class="input-group">
              <input 
                v-model.number="analysisParams.threshold"
                type="range" 
                class="form-range"
                min="0.1" 
                max="2.0" 
                step="0.1"
              >
              <span class="input-group-text">{{ analysisParams.threshold.toFixed(1) }}</span>
            </div>
          </div>
        </div>

        <!-- 可用分析方法 -->
        <div class="mb-4">
          <h6><i class="fas fa-tools me-2"></i>分析方法</h6>
          <div class="d-grid gap-2">
            <button 
              v-for="method in availableMethods"
              :key="method.id"
              :class="['btn', method.active ? 'btn-primary' : 'btn-outline-primary', 'btn-icon']"
              :disabled="!hasData || loading"
              @click="toggleMethod(method.id)"
            >
              <i :class="method.icon"></i>
              <span>{{ method.name }}</span>
            </button>
          </div>
        </div>

        <!-- 執行分析 -->
        <div class="mb-4">
          <button 
            class="btn btn-success btn-icon w-100"
            :disabled="!hasData || !hasSelectedMethods || loading"
            @click="runAnalysis"
          >
            <i class="fas fa-play me-2"></i>
            <span v-if="!loading">執行分析</span>
            <span v-else>
              <div class="spinner-border spinner-border-sm me-2"></div>
              分析中...
            </span>
          </button>
        </div>

        <!-- 分析結果 -->
        <div v-if="analysisResults && Object.keys(analysisResults).length > 0" class="mb-4">
          <h6><i class="fas fa-chart-line me-2"></i>分析結果</h6>
          
          <!-- K最近鄰結果 -->
          <div v-if="analysisResults.knn" class="mb-3">
            <div class="card color-level-100">
              <div class="card-body">
                <h6 class="card-title">
                  <i class="fas fa-map-pin me-2"></i>
                  K最近鄰分析
                </h6>
                <div class="row text-center">
                  <div class="col-6">
                    <div class="h5 text-primary">{{ analysisResults.knn.totalPoints }}</div>
                    <small>總點數</small>
                  </div>
                  <div class="col-6">
                    <div class="h5 text-success">{{ analysisResults.knn.avgDistance?.toFixed(2) || 'N/A' }}km</div>
                    <small>平均距離</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空間滯後結果 -->
          <div v-if="analysisResults.spatialLag" class="mb-3">
            <div class="card color-level-200">
              <div class="card-body">
                <h6 class="card-title">
                  <i class="fas fa-project-diagram me-2"></i>
                  空間滯後分析
                </h6>
                <div class="row text-center">
                  <div class="col-6">
                    <div class="h5 text-info">{{ analysisResults.spatialLag.avgLag?.toFixed(3) || 'N/A' }}</div>
                    <small>平均滯後值</small>
                  </div>
                  <div class="col-6">
                    <div class="h5 text-warning">{{ analysisResults.spatialLag.variance?.toFixed(3) || 'N/A' }}</div>
                    <small>變異數</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 聚集檢測結果 -->
          <div v-if="analysisResults.clusters" class="mb-3">
            <div class="card color-level-400">
              <div class="card-body">
                <h6 class="card-title text-white">
                  <i class="fas fa-cluster me-2"></i>
                  空間聚集檢測
                </h6>
                <div class="row text-center text-white">
                  <div class="col-4">
                    <div class="h6">{{ analysisResults.clusters.summary?.significantClusters || 0 }}</div>
                    <small>顯著聚集</small>
                  </div>
                  <div class="col-4">
                    <div class="h6">{{ analysisResults.clusters.summary?.outliers || 0 }}</div>
                    <small>離群值</small>
                  </div>
                  <div class="col-4">
                    <div class="h6">{{ analysisResults.clusters.summary?.noSignificant || 0 }}</div>
                    <small>無顯著性</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Moran's I 結果 -->
          <div v-if="analysisResults.morans" class="mb-3">
            <div class="card color-level-800">
              <div class="card-body">
                <h6 class="card-title text-white">
                  <i class="fas fa-chart-area me-2"></i>
                  空間自相關性
                </h6>
                <div class="text-center text-white">
                  <div class="h4">{{ analysisResults.morans.globalI?.toFixed(4) || 'N/A' }}</div>
                  <small>Moran's I 全域指標</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 匯出結果 -->
        <div v-if="analysisResults && Object.keys(analysisResults).length > 0" class="d-grid gap-2">
          <button 
            class="btn btn-outline-primary btn-icon"
            @click="exportResults"
          >
            <i class="fas fa-download"></i>
            <span>匯出結果</span>
          </button>
          
          <button 
            class="btn btn-outline-secondary btn-icon"
            @click="clearResults"
          >
            <i class="fas fa-broom"></i>
            <span>清除結果</span>
          </button>
        </div>

        <!-- 無資料提示 -->
        <div v-if="!hasData" class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          請先載入空間資料以進行分析
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="error" class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useDataStore } from '../stores/dataStore.js'
import { 
  calculateAllKNearestNeighbors,
  calculateAllSpatialLags,
  calculateLocalMoransI,
  detectSpatialClusters
} from '../utils/spatialAnalysis.js'

export default {
  name: 'SpatialAnalysisPanel',
  setup() {
    const dataStore = useDataStore()
    
    const loading = ref(false)
    const error = ref('')
    const analysisResults = ref({})
    
    // 分析參數
    const analysisParams = ref({
      kValue: 5,
      weightType: 'inverse_distance',
      threshold: 0.5
    })

    // 可用分析方法
    const availableMethods = ref([
      {
        id: 'knn',
        name: 'K最近鄰分析',
        icon: 'fas fa-map-pin',
        active: false
      },
      {
        id: 'spatialLag',
        name: '空間滯後分析',
        icon: 'fas fa-project-diagram',
        active: false
      },
      {
        id: 'clusters',
        name: '聚集檢測',
        icon: 'fas fa-object-group',
        active: false
      },
      {
        id: 'morans',
        name: 'Moran\'s I',
        icon: 'fas fa-chart-area',
        active: false
      }
    ])

    // 計算屬性
    const hasData = computed(() => {
      return dataStore.hasData('geojson') || dataStore.hasData('transformedGeojson', true)
    })

    const hasSelectedMethods = computed(() => {
      return availableMethods.value.some(method => method.active)
    })

    // 監聽參數變化，同步到 Store
    watch(
      () => analysisParams.value,
      (newParams) => {
        dataStore.updateAnalysisParameters('spatialAnalysis', newParams)
      },
      { deep: true }
    )

    // 切換分析方法
    const toggleMethod = (methodId) => {
      const method = availableMethods.value.find(m => m.id === methodId)
      if (method) {
        method.active = !method.active
      }
    }

    // 準備分析資料
    const prepareAnalysisData = () => {
      let geoData = dataStore.getData('transformedGeojson', true) || dataStore.getData('geojson')
      
      if (!geoData || !geoData.features) {
        throw new Error('無有效的地理資料')
      }

      // 轉換為分析所需的格式
      const points = []
      
      geoData.features.forEach((feature, index) => {
        if (feature.geometry && feature.geometry.coordinates) {
          let coords
          
          // 根據幾何類型取得座標
          switch (feature.geometry.type) {
            case 'Point':
              coords = feature.geometry.coordinates
              break
            case 'Polygon':
              // 取多邊形中心點（簡化）
              const ring = feature.geometry.coordinates[0]
              if (ring && ring.length > 0) {
                const sumLng = ring.reduce((sum, coord) => sum + coord[0], 0)
                const sumLat = ring.reduce((sum, coord) => sum + coord[1], 0)
                coords = [sumLng / ring.length, sumLat / ring.length]
              }
              break
            default:
              // 其他類型暫時跳過
              return
          }

          if (coords && coords.length >= 2) {
            points.push({
              lng: coords[0],
              lat: coords[1],
              value: feature.properties?.value || Math.random(), // 如果沒有數值，使用隨機值
              id: index,
              properties: feature.properties || {}
            })
          }
        }
      })

      if (points.length === 0) {
        throw new Error('無法從資料中提取有效座標點')
      }

      return points
    }

    // 執行分析
    const runAnalysis = async () => {
      if (!hasData.value || !hasSelectedMethods.value) return

      loading.value = true
      error.value = ''
      
      try {
        const points = prepareAnalysisData()
        const results = {}

        console.log('🔍 開始空間分析:', {
          points: points.length,
          methods: availableMethods.value.filter(m => m.active).map(m => m.id),
          params: analysisParams.value
        })

        // K最近鄰分析
        if (availableMethods.value.find(m => m.id === 'knn' && m.active)) {
          const coordPoints = points.map(p => [p.lng, p.lat])
          const knnResults = calculateAllKNearestNeighbors(coordPoints, analysisParams.value.kValue)
          
          // 計算統計
          const distances = knnResults.flatMap(result => 
            result.neighbors.map(neighbor => neighbor.distance)
          )
          const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length

          results.knn = {
            totalPoints: points.length,
            avgDistance,
            results: knnResults
          }
        }

        // 空間滯後分析
        if (availableMethods.value.find(m => m.id === 'spatialLag' && m.active)) {
          const spatialLagResults = calculateAllSpatialLags(
            points, 
            analysisParams.value.kValue, 
            analysisParams.value.weightType
          )
          
          // 計算統計
          const lagValues = spatialLagResults.map(r => r.spatialLag)
          const avgLag = lagValues.reduce((sum, v) => sum + v, 0) / lagValues.length
          const variance = lagValues.reduce((sum, v) => sum + Math.pow(v - avgLag, 2), 0) / lagValues.length

          results.spatialLag = {
            avgLag,
            variance,
            results: spatialLagResults
          }
        }

        // 聚集檢測
        if (availableMethods.value.find(m => m.id === 'clusters' && m.active)) {
          const clusterResults = detectSpatialClusters(
            points,
            analysisParams.value.kValue,
            analysisParams.value.threshold
          )
          
          results.clusters = clusterResults
        }

        // Moran's I
        if (availableMethods.value.find(m => m.id === 'morans' && m.active)) {
          const moransResults = calculateLocalMoransI(points, analysisParams.value.kValue)
          
          // 計算全域 Moran's I（簡化版）
          const localIs = moransResults.map(r => r.localMoransI || 0)
          const globalI = localIs.reduce((sum, i) => sum + i, 0) / localIs.length

          results.morans = {
            globalI,
            localResults: moransResults
          }
        }

        analysisResults.value = results

        // 存入 Store
        dataStore.setProcessedData('spatialAnalysisResults', results, {
          analysisParams: analysisParams.value,
          pointCount: points.length,
          methods: availableMethods.value.filter(m => m.active).map(m => m.id)
        })

        console.log('✅ 空間分析完成:', results)

      } catch (err) {
        error.value = `分析失敗: ${err.message}`
        console.error('❌ 空間分析錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    // 匯出結果
    const exportResults = () => {
      if (!analysisResults.value || Object.keys(analysisResults.value).length === 0) return

      const exportData = {
        analysisResults: analysisResults.value,
        parameters: analysisParams.value,
        timestamp: new Date().toISOString(),
        metadata: {
          software: 'Spatial Analysis Tool',
          version: '1.0.0'
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `spatial_analysis_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      console.log('📄 分析結果已匯出')
    }

    // 清除結果
    const clearResults = () => {
      analysisResults.value = {}
      dataStore.clearData('spatialAnalysisResults')
      console.log('🗑️ 分析結果已清除')
    }

    return {
      loading,
      error,
      analysisResults,
      analysisParams,
      availableMethods,
      hasData,
      hasSelectedMethods,
      toggleMethod,
      runAnalysis,
      exportResults,
      clearResults
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.form-range {
  flex: 1;
}

.input-group .form-range {
  border-radius: 0.375rem 0 0 0.375rem;
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
  
  .col-4 .h6,
  .col-6 .h5 {
    font-size: 1rem;
  }
}
</style> 