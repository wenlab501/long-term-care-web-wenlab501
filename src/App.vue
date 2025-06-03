<template>
  <div id="app">
    <!-- Top Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">
          <i class="fas fa-map-marked-alt"></i> 空間分析視覺化平台 - 驢子熱分析
        </span>
        <div class="navbar-nav ms-auto">
          <router-link to="/design" class="nav-link text-white">
            <i class="fas fa-palette"></i> 設計系統
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <div class="main-content">
      <router-view v-if="$route.path !== '/'" />
      
      <!-- Home Content -->
      <div v-if="$route.path === '/'" class="container-fluid h-100 p-0">
        <div class="row h-100 g-0">
          <!-- Left Control Panel -->
          <div class="panel-left d-flex" :style="{ width: leftPanelWidth + 'px' }">
            <div class="bg-light border-end p-3 flex-grow-1">
              <h5>左側控制面版</h5>
              
              <!-- 台南市數據載入按鈕 -->
              <div class="mb-3">
                <button class="btn btn-success w-100" @click="loadTainanData" :disabled="isLoadingData">
                  <i class="fas fa-download"></i>
                  {{ isLoadingData ? '載入中...' : '載入台南市數據' }}
                </button>
                <small class="text-muted d-block mt-1">
                  載入GeoJSON和Excel數據進行合併
                </small>
              </div>
              
              <div class="mb-3">
                <label class="form-label">圖層控制</label>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="layer1" v-model="showLayer1" @change="toggleLayer1">
                  <label class="form-check-label" for="layer1">商店標記</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="layer2" v-model="showLayer2" @change="toggleLayer2">
                  <label class="form-check-label" for="layer2">熱點區域</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="layer3" v-model="showTainanLayer" @change="toggleTainanLayer">
                  <label class="form-check-label" for="layer3">台南市區域</label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">篩選條件</label>
                <select class="form-select" v-model="selectedFilter" @change="applyFilter">
                  <option value="">全部</option>
                  <option value="convenience">便利商店</option>
                  <option value="supermarket">超市</option>
                  <option value="restaurant">餐廳</option>
                </select>
              </div>
              <div class="mb-3">
                <small class="text-muted">面板寬度: {{ leftPanelWidth }}px</small>
                <br>
                <small class="text-muted" v-if="tainanDataSummary">
                  台南數據: {{ tainanDataSummary.mergedCount }}/{{ tainanDataSummary.totalFeatures }} 合併成功
                </small>
              </div>
            </div>
            <!-- Left Resizer -->
            <div class="resizer resizer-vertical" 
                 @mousedown="startResize($event, 'left')"
                 title="拖曳調整面板寬度">
            </div>
          </div>

          <!-- Main Screen -->
          <div class="panel-main d-flex flex-column" :style="{ width: mainPanelWidth + 'px' }">
            <!-- Tab Navigation -->
            <div class="bg-white border-bottom">
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <button class="nav-link" :class="{ active: activeTab === 'map' }" @click="setActiveTab('map')">
                    地圖視圖
                  </button>
                </li>
                <li class="nav-item">
                  <button class="nav-link" :class="{ active: activeTab === 'dashboard' }" @click="setActiveTab('dashboard')">
                    數據儀表板
                  </button>
                </li>
              </ul>
            </div>

            <!-- Tab Content -->
            <div class="flex-grow-1" :style="{ height: contentHeight + 'px' }">
              <!-- Map Tab -->
              <div v-show="activeTab === 'map'" class="h-100">
                <div id="map" ref="mapContainer" class="h-100 w-100"></div>
              </div>
              
              <!-- Dashboard Tab -->
              <div v-show="activeTab === 'dashboard'" class="h-100 p-3 bg-light">
                <div class="row h-100">
                  <div class="col-6">
                    <div class="card h-100">
                      <div class="card-header">
                        <h6 class="mb-0">銷售趨勢 - 柱狀圖</h6>
                      </div>
                      <div class="card-body">
                        <div id="barChart" ref="barChart"></div>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="card h-100">
                      <div class="card-header">
                        <h6 class="mb-0">市場佔有率 - 圓餅圖</h6>
                      </div>
                      <div class="card-body">
                        <div id="pieChart" ref="pieChart"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Horizontal Resizer -->
            <div class="resizer resizer-horizontal" 
                 @mousedown="startResize($event, 'horizontal')"
                 title="拖曳調整內容高度">
            </div>
            
            <!-- Bottom Control Panel with Tabs -->
            <div class="bg-secondary text-white" :style="{ height: bottomPanelHeight + 'px' }">
              <!-- Bottom Tab Navigation -->
              <div class="bg-secondary border-bottom">
                <ul class="nav nav-tabs nav-dark">
                  <li class="nav-item">
                    <button class="nav-link text-white border-0" 
                            :class="{ active: activeBottomTab === 'table', 'bg-primary': activeBottomTab === 'table' }" 
                            @click="setActiveBottomTab('table')">
                      <i class="fas fa-table"></i> 數據表格
                    </button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link text-white border-0" 
                            :class="{ active: activeBottomTab === 'controls', 'bg-primary': activeBottomTab === 'controls' }" 
                            @click="setActiveBottomTab('controls')">
                      <i class="fas fa-cog"></i> 控制面板
                    </button>
                  </li>
                </ul>
              </div>
              
              <!-- Bottom Tab Content -->
              <div class="tab-content h-100 overflow-auto p-3">
                <!-- 數據表格 -->
                <div v-show="activeBottomTab === 'table'" class="h-100">
                  <div v-if="mergedTableData.length > 0" class="h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h6 class="text-white mb-0">合併數據表格 ({{ mergedTableData.length }} 筆)</h6>
                      <div>
                        <input type="text" class="form-control form-control-sm" 
                               v-model="tableSearchQuery" 
                               placeholder="搜尋..." style="width: 200px;">
                      </div>
                    </div>
                    <div class="table-responsive" style="height: calc(100% - 40px);">
                      <table class="table table-sm table-dark table-striped">
                        <thead class="table-primary">
                          <tr>
                            <th>ID</th>
                            <th>Code2</th>
                            <th>Name</th>
                            <th>Count</th>
                            <th>合併狀態</th>
                            <th>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in filteredTableData" :key="row.id">
                            <td>{{ row.id }}</td>
                            <td>{{ row.code2 || '-' }}</td>
                            <td>{{ row.name || '-' }}</td>
                            <td>
                              <span class="badge" :class="getCountBadgeClass(row.count)">
                                {{ row.count || 0 }}
                              </span>
                            </td>
                            <td>
                              <span class="badge" :class="row.merged === '成功' ? 'bg-success' : 'bg-warning'">
                                {{ row.merged }}
                              </span>
                            </td>
                            <td>
                              <button class="btn btn-outline-light btn-sm" @click="highlightOnMap(row)">
                                <i class="fas fa-map-marker-alt"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-else class="h-100 d-flex align-items-center justify-content-center">
                    <div class="text-center text-white">
                      <i class="fas fa-table fa-3x mb-3 opacity-50"></i>
                      <h6>暫無數據</h6>
                      <p class="mb-0">請點擊「載入台南市數據」按鈕載入數據</p>
                    </div>
                  </div>
                </div>
                
                <!-- 控制面板 -->
                <div v-show="activeBottomTab === 'controls'">
                  <div class="row">
                    <div class="col-6">
                      <label class="form-label text-white">縮放級別</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="zoomLevel" @input="updateMapZoom" min="1" max="18">
                    </div>
                    <div class="col-6">
                      <label class="form-label text-white">&nbsp;</label>
                      <button class="btn btn-primary btn-sm w-100" @click="resetView">重置視圖</button>
                    </div>
                  </div>
                  <div class="mt-2">
                    <small>座標: {{ currentCoords.lat }}, {{ currentCoords.lng }}</small>
                    <br>
                    <small class="text-light">面板高度: {{ bottomPanelHeight }}px</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Control Panel with Tabs -->
          <div class="panel-right d-flex" :style="{ width: rightPanelWidth + 'px' }">
            <!-- Right Resizer -->
            <div class="resizer resizer-vertical" 
                 @mousedown="startResize($event, 'right')"
                 title="拖曳調整面板寬度">
            </div>
            <div class="bg-light border-start p-3 flex-grow-1">
              <h5>右側控制面版</h5>
              
              <!-- Right Tab Navigation -->
              <div class="mb-3">
                <ul class="nav nav-pills nav-fill">
                  <li class="nav-item">
                    <button class="nav-link btn-sm" 
                            :class="{ active: activeRightTab === 'stats' }" 
                            @click="setActiveRightTab('stats')">
                      統計
                    </button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link btn-sm" 
                            :class="{ active: activeRightTab === 'charts' }" 
                            @click="setActiveRightTab('charts')">
                      圖表
                    </button>
                  </li>
                </ul>
              </div>
              
              <!-- Right Tab Content -->
              <div class="tab-content">
                <!-- 統計Tab -->
                <div v-show="activeRightTab === 'stats'">
                  <div class="mb-3">
                    <label class="form-label">數據統計</label>
                    <div class="card">
                      <div class="card-body p-2">
                        <small>總數量: {{ formatNumber(totalCount) }}</small><br>
                        <small>選中項目: {{ selectedCount }}</small><br>
                        <small>活躍標記: {{ activeMarkers }}</small><br>
                        <small v-if="tainanDataSummary">台南區域: {{ tainanDataSummary.totalFeatures }}</small>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-3" v-if="mergedTableData.length > 0">
                    <label class="form-label">數據分佈</label>
                    <div class="card">
                      <div class="card-body p-2">
                        <small>最高值: {{ maxCount }}</small><br>
                        <small>平均值: {{ averageCount.toFixed(1) }}</small><br>
                        <small>有數據區域: {{ dataRegionsCount }}</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 圖表Tab -->
                <div v-show="activeRightTab === 'charts'">
                  <div class="mb-3">
                    <label class="form-label">圖表控制</label>
                    <div class="btn-group-vertical d-grid gap-1">
                      <button class="btn btn-outline-primary btn-sm" @click="updateChart('bar')" :class="{ active: chartType === 'bar' }">更新柱狀圖</button>
                      <button class="btn btn-outline-primary btn-sm" @click="updateChart('pie')" :class="{ active: chartType === 'pie' }">更新圓餅圖</button>
                      <button class="btn btn-outline-primary btn-sm" @click="switchToDashboard">查看儀表板</button>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">圖層顯示</label>
                    <div class="btn-group-vertical d-grid gap-1">
                      <button class="btn btn-outline-secondary btn-sm" @click="fitMapToData" :disabled="!showTainanLayer">
                        調整地圖視角
                      </button>
                      <button class="btn btn-outline-warning btn-sm" @click="clearTainanData" :disabled="mergedTableData.length === 0">
                        清除台南數據
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <small class="text-muted">面板寬度: {{ rightPanelWidth }}px</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import L from 'leaflet'
import * as d3 from 'd3'
import { formatNumber } from './utils/utils.js'
import { loadTainanData as loadTainanDataUtil, getColorByCount } from './utils/dataProcessor.js'

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'App',
  setup() {
    const mapContainer = ref(null)
    const barChart = ref(null)
    const pieChart = ref(null)
    let map = null
    let layer1Markers = []
    let layer2Polygons = []
    let tainanLayer = null

    // Tab states
    const activeTab = ref('map')
    const activeBottomTab = ref('table')
    const activeRightTab = ref('stats')

    // Panel size state
    const leftPanelWidth = ref(250)
    const rightPanelWidth = ref(250)
    const bottomPanelHeight = ref(300)
    const windowWidth = ref(window.innerWidth)
    const windowHeight = ref(window.innerHeight)

    // Computed values
    const mainPanelWidth = computed(() => 
      windowWidth.value - leftPanelWidth.value - rightPanelWidth.value
    )
    const contentHeight = computed(() => 
      windowHeight.value - bottomPanelHeight.value - 100 // 100px for tabs and navbar
    )

    // Reactive data
    const showLayer1 = ref(true)
    const showLayer2 = ref(false)
    const showTainanLayer = ref(false)
    const selectedFilter = ref('')
    const zoomLevel = ref(10)
    const currentCoords = ref({ lat: 25.0330, lng: 121.5654 })
    const totalCount = ref(1250000)
    const selectedCount = ref(0)
    const activeMarkers = ref(0)
    const chartType = ref('bar')
    
    // Tainan data related
    const isLoadingData = ref(false)
    const tainanDataSummary = ref(null)
    const mergedTableData = ref([])
    const tableSearchQuery = ref('')
    const tainanGeoJSONData = ref(null)

    // Computed values for statistics
    const maxCount = computed(() => {
      if (mergedTableData.value.length === 0) return 0
      return Math.max(...mergedTableData.value.map(row => row.count || 0))
    })

    const averageCount = computed(() => {
      if (mergedTableData.value.length === 0) return 0
      const counts = mergedTableData.value.map(row => row.count || 0)
      return counts.reduce((a, b) => a + b, 0) / counts.length
    })

    const dataRegionsCount = computed(() => {
      return mergedTableData.value.filter(row => row.count > 0).length
    })

    const filteredTableData = computed(() => {
      if (!tableSearchQuery.value) return mergedTableData.value
      const query = tableSearchQuery.value.toLowerCase()
      return mergedTableData.value.filter(row => 
        (row.code2 && row.code2.toLowerCase().includes(query)) ||
        (row.name && row.name.toLowerCase().includes(query)) ||
        (row.count && row.count.toString().includes(query))
      )
    })

    // Chart data
    const salesData = ref([
      { name: '一月', value: 30 },
      { name: '二月', value: 45 },
      { name: '三月', value: 35 },
      { name: '四月', value: 50 },
      { name: '五月', value: 40 }
    ])

    const marketData = ref([
      { name: '便利商店', value: 40 },
      { name: '超市', value: 30 },
      { name: '餐廳', value: 20 },
      { name: '其他', value: 10 }
    ])

    // Tab functions
    const setActiveTab = (tab) => {
      activeTab.value = tab
      if (tab === 'map' && map) {
        setTimeout(() => {
          map.invalidateSize()
        }, 100)
      } else if (tab === 'dashboard') {
        setTimeout(() => {
          createBarChart()
          createPieChart()
        }, 100)
      }
    }

    const setActiveBottomTab = (tab) => {
      activeBottomTab.value = tab
    }

    const setActiveRightTab = (tab) => {
      activeRightTab.value = tab
    }

    const switchToDashboard = () => {
      setActiveTab('dashboard')
    }

    // Layer functions
    const createLayer1Markers = () => {
      const storeLocations = [
        { lat: 25.0330, lng: 121.5654, title: '7-11 台北車站店', type: 'convenience' },
        { lat: 25.0478, lng: 121.5319, title: '全家大安店', type: 'convenience' },
        { lat: 25.0853, lng: 121.5606, title: '家樂福中山店', type: 'supermarket' },
        { lat: 25.0412, lng: 121.5681, title: '麥當勞信義店', type: 'restaurant' },
        { lat: 25.0345, lng: 121.5789, title: '星巴克東區店', type: 'restaurant' }
      ]

      layer1Markers.forEach(marker => map.removeLayer(marker))
      layer1Markers = []

      if (showLayer1.value) {
        storeLocations.forEach(store => {
          if (!selectedFilter.value || store.type === selectedFilter.value) {
            const marker = L.marker([store.lat, store.lng])
              .addTo(map)
              .bindPopup(`<b>${store.title}</b><br>類型: ${store.type}`)
            layer1Markers.push(marker)
          }
        })
      }
      activeMarkers.value = layer1Markers.length
    }

    const createLayer2Polygons = () => {
      layer2Polygons.forEach(polygon => map.removeLayer(polygon))
      layer2Polygons = []

      if (showLayer2.value) {
        const heatAreas = [
          {
            coords: [[25.040, 121.550], [25.045, 121.550], [25.045, 121.555], [25.040, 121.555]],
            name: '商業熱點A'
          },
          {
            coords: [[25.080, 121.560], [25.085, 121.560], [25.085, 121.565], [25.080, 121.565]],
            name: '商業熱點B'
          }
        ]

        heatAreas.forEach(area => {
          const polygon = L.polygon(area.coords, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3
          }).addTo(map).bindPopup(area.name)
          layer2Polygons.push(polygon)
        })
      }
    }

    const createTainanLayer = () => {
      // 清除現有圖層
      if (tainanLayer) {
        map.removeLayer(tainanLayer)
        tainanLayer = null
      }

      if (showTainanLayer.value && tainanGeoJSONData.value) {
        const maxCountValue = maxCount.value

        tainanLayer = L.geoJSON(tainanGeoJSONData.value, {
          style: (feature) => {
            const count = feature.properties.count || 0
            const color = getColorByCount(count, maxCountValue)
            return {
              fillColor: color,
              weight: 1,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            }
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties
            const popupContent = `
              <div>
                <h6>${props.name || props.code2 || '未知區域'}</h6>
                <p><strong>Code2:</strong> ${props.code2 || 'N/A'}</p>
                <p><strong>Count:</strong> ${props.count || 0}</p>
                <p><strong>合併狀態:</strong> ${props._merged ? '成功' : '失敗'}</p>
              </div>
            `
            layer.bindPopup(popupContent)
          }
        }).addTo(map)
      }
    }

    const toggleLayer1 = () => {
      createLayer1Markers()
    }

    const toggleLayer2 = () => {
      createLayer2Polygons()
    }

    const toggleTainanLayer = () => {
      createTainanLayer()
    }

    const applyFilter = () => {
      createLayer1Markers()
    }

    // Map functions
    const updateMapZoom = () => {
      if (map && zoomLevel.value >= 1 && zoomLevel.value <= 18) {
        map.setZoom(zoomLevel.value)
      }
    }

    // Tainan data functions
    const loadTainanData = async () => {
      isLoadingData.value = true
      try {
        const data = await loadTainanDataUtil()
        tainanDataSummary.value = data.summary
        mergedTableData.value = data.tableData
        tainanGeoJSONData.value = data.mergedGeoJSON
        
        // 自動顯示台南圖層
        showTainanLayer.value = true
        createTainanLayer()
        
        // 切換到表格tab
        setActiveBottomTab('table')
        
        console.log('台南數據載入完成:', data.summary)
      } catch (error) {
        console.error('載入台南數據失敗:', error)
        alert('載入數據失敗，請檢查文件路徑和格式')
      } finally {
        isLoadingData.value = false
      }
    }

    const getCountBadgeClass = (count) => {
      if (!count || count === 0) return 'bg-secondary'
      if (count <= 10) return 'bg-success'
      if (count <= 50) return 'bg-warning'
      return 'bg-danger'
    }

    const highlightOnMap = (row) => {
      if (!tainanLayer || !map) return

      // 找到對應的圖層並高亮顯示
      tainanLayer.eachLayer((layer) => {
        if (layer.feature.properties.code2 === row.code2) {
          // 臨時改變樣式
          layer.setStyle({
            fillColor: 'yellow',
            weight: 3,
            color: 'red',
            fillOpacity: 0.9
          })
          
          // 移動地圖到該區域
          map.fitBounds(layer.getBounds())
          layer.openPopup()
          
          // 3秒後恢復原樣式
          setTimeout(() => {
            const count = layer.feature.properties.count || 0
            const color = getColorByCount(count, maxCount.value)
            layer.setStyle({
              fillColor: color,
              weight: 1,
              color: 'white',
              fillOpacity: 0.7
            })
          }, 3000)
        }
      })
    }

    const fitMapToData = () => {
      if (tainanLayer && map) {
        map.fitBounds(tainanLayer.getBounds())
      }
    }

    const clearTainanData = () => {
      if (confirm('確定要清除台南數據嗎？')) {
        // 清除數據
        tainanDataSummary.value = null
        mergedTableData.value = []
        tainanGeoJSONData.value = null
        tableSearchQuery.value = ''
        
        // 隱藏圖層
        showTainanLayer.value = false
        if (tainanLayer) {
          map.removeLayer(tainanLayer)
          tainanLayer = null
        }
        
        console.log('台南數據已清除')
      }
    }

    // Chart functions
    const createBarChart = () => {
      if (!barChart.value) return

      d3.select(barChart.value).selectAll("*").remove()

      const margin = { top: 20, right: 30, bottom: 40, left: 40 }
      const width = barChart.value.clientWidth - margin.left - margin.right
      const height = barChart.value.clientHeight - margin.top - margin.bottom

      const svg = d3.select(barChart.value)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(salesData.value.map(d => d.name))

      const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(salesData.value, d => d.value)])

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))

      g.append("g")
        .call(d3.axisLeft(y))

      g.selectAll(".bar")
        .data(salesData.value)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#007bff")
    }

    const createPieChart = () => {
      if (!pieChart.value) return

      d3.select(pieChart.value).selectAll("*").remove()

      const width = pieChart.value.clientWidth
      const height = pieChart.value.clientHeight
      const radius = Math.min(width, height) / 2 - 10

      const svg = d3.select(pieChart.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)

      const color = d3.scaleOrdinal()
        .range(["#ff7f0e", "#2ca02c", "#d62728", "#9467bd"])

      const pie = d3.pie()
        .value(d => d.value)

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

      const arcs = svg.selectAll(".arc")
        .data(pie(marketData.value))
        .enter().append("g")
        .attr("class", "arc")

      arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.name))

      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", "12px")
    }

    const updateChart = (type) => {
      chartType.value = type
      if (activeTab.value === 'dashboard') {
        if (type === 'bar') {
          createBarChart()
        } else if (type === 'pie') {
          createPieChart()
        }
      }
    }

    // Resize functionality
    let isResizing = false
    let resizeType = ''
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0

    const startResize = (event, type) => {
      isResizing = true
      resizeType = type
      startX = event.clientX
      startY = event.clientY
      
      if (type === 'left') {
        startWidth = leftPanelWidth.value
      } else if (type === 'right') {
        startWidth = rightPanelWidth.value
      } else if (type === 'horizontal') {
        startHeight = bottomPanelHeight.value
      }
      
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
      event.preventDefault()
    }

    const handleResize = (event) => {
      if (!isResizing) return
      
      if (resizeType === 'left') {
        const deltaX = event.clientX - startX
        const newWidth = Math.max(150, Math.min(400, startWidth + deltaX))
        leftPanelWidth.value = newWidth
      } else if (resizeType === 'right') {
        const deltaX = event.clientX - startX
        const newWidth = Math.max(150, Math.min(400, startWidth - deltaX))
        rightPanelWidth.value = newWidth
      } else if (resizeType === 'horizontal') {
        const deltaY = event.clientY - startY
        const newHeight = Math.max(200, Math.min(600, startHeight - deltaY))
        bottomPanelHeight.value = newHeight
      }
      
      // Resize map or charts after panel resize
      setTimeout(() => {
        if (map && activeTab.value === 'map') {
          map.invalidateSize()
        } else if (activeTab.value === 'dashboard') {
          createBarChart()
          createPieChart()
        }
      }, 100)
    }

    const stopResize = () => {
      isResizing = false
      resizeType = ''
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }

    // Window resize handler
    const handleWindowResize = () => {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
      
      setTimeout(() => {
        if (map && activeTab.value === 'map') {
          map.invalidateSize()
        } else if (activeTab.value === 'dashboard') {
          createBarChart()
          createPieChart()
        }
      }, 100)
    }

    const initializeMap = () => {
      if (!mapContainer.value) return

      // 初始化地圖 (以台北為中心)
      map = L.map(mapContainer.value).setView([25.0330, 121.5654], 10)

      // 添加地圖圖層
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // 創建圖層
      createLayer1Markers()
      createLayer2Polygons()

      // 監聽地圖移動事件
      map.on('mousemove', (e) => {
        currentCoords.value = {
          lat: e.latlng.lat.toFixed(4),
          lng: e.latlng.lng.toFixed(4)
        }
      })

      map.on('zoomend', () => {
        zoomLevel.value = map.getZoom()
      })
    }

    const resetView = () => {
      if (map) {
        if (tainanLayer) {
          // 如果有台南數據，調整到台南視角
          map.fitBounds(tainanLayer.getBounds())
        } else {
          // 否則回到台北
          map.setView([25.0330, 121.5654], 10)
          zoomLevel.value = 10
        }
      }
    }

    // Watch for zoom level changes
    watch(zoomLevel, (newZoom) => {
      if (map && map.getZoom() !== newZoom && newZoom >= 1 && newZoom <= 18) {
        map.setZoom(newZoom)
      }
    })

    onMounted(() => {
      // 等待DOM完全載入後初始化地圖
      setTimeout(initializeMap, 100)
      
      // 監聽視窗大小變化
      window.addEventListener('resize', handleWindowResize)
    })

    onUnmounted(() => {
      if (map) {
        map.remove()
      }
      window.removeEventListener('resize', handleWindowResize)
    })

    return {
      mapContainer,
      barChart,
      pieChart,
      activeTab,
      activeBottomTab,
      activeRightTab,
      showLayer1,
      showLayer2,
      showTainanLayer,
      selectedFilter,
      zoomLevel,
      currentCoords,
      totalCount,
      selectedCount,
      activeMarkers,
      chartType,
      leftPanelWidth,
      rightPanelWidth,
      bottomPanelHeight,
      mainPanelWidth,
      contentHeight,
      isLoadingData,
      tainanDataSummary,
      mergedTableData,
      tableSearchQuery,
      maxCount,
      averageCount,
      dataRegionsCount,
      filteredTableData,
      setActiveTab,
      setActiveBottomTab,
      setActiveRightTab,
      switchToDashboard,
      toggleLayer1,
      toggleLayer2,
      toggleTainanLayer,
      applyFilter,
      updateMapZoom,
      loadTainanData,
      getCountBadgeClass,
      highlightOnMap,
      fitMapToData,
      clearTainanData,
      updateChart,
      resetView,
      startResize,
      formatNumber
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap');

* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans TC', sans-serif;
}

#app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

.main-content .container-fluid {
  height: calc(100vh - 56px); /* 減去導航欄高度 */
}

/* 全局樣式 */
.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
}

.card {
  font-size: 0.875rem;
}

.bg-secondary {
  background-color: #6c757d !important;
}

/* Tab樣式 */
.nav-tabs {
  border-bottom: 1px solid #dee2e6;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
  color: #495057;
  background: none;
}

.nav-tabs .nav-link.active {
  border-bottom-color: #007bff;
  color: #007bff;
  font-weight: 500;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #007bff;
  color: #007bff;
}

/* Dark tabs for bottom panel */
.nav-dark .nav-link {
  color: #ffffff !important;
}

.nav-dark .nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-dark .nav-link.active {
  color: #ffffff !important;
}

/* Right panel pills */
.nav-pills .nav-link {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.nav-pills .nav-link.active {
  background-color: #007bff;
}

/* Chart容器樣式 */
#barChart, #pieChart {
  width: 100%;
  height: 300px;
}

/* 表格樣式 */
.table-responsive {
  border-radius: 0.375rem;
  overflow-y: auto;
}

.table-dark {
  --bs-table-bg: transparent;
}

.table-dark th {
  background-color: #495057;
  border-color: #6c757d;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-dark td {
  border-color: #6c757d;
  vertical-align: middle;
}

.table-striped > tbody > tr:nth-of-type(odd) > td {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Badge樣式 */
.badge {
  font-size: 0.75rem;
}

/* 載入按鈕樣式 */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 調整大小拖拽控制項 */
.resizer {
  background-color: #dee2e6;
  transition: background-color 0.2s ease;
  position: relative;
}

.resizer:hover {
  background-color: #007bff;
}

.resizer-vertical {
  width: 6px;
  cursor: col-resize;
  border-left: 1px solid #adb5bd;
  border-right: 1px solid #adb5bd;
}

.resizer-horizontal {
  height: 6px;
  cursor: row-resize;
  border-top: 1px solid #adb5bd;
  border-bottom: 1px solid #adb5bd;
  width: 100%;
}

.resizer-vertical:hover::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 20px;
  background-color: white;
  border-radius: 1px;
}

.resizer-horizontal:hover::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 2px;
  background-color: white;
  border-radius: 1px;
}

/* 面板樣式 */
.panel-left, .panel-right, .panel-main {
  min-width: 0;
}

.panel-main {
  flex-grow: 1;
}

/* 防止拖拽時選取文字 */
.resizer {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 按鈕活躍狀態 */
.btn.active {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

/* 空狀態樣式 */
.opacity-50 {
  opacity: 0.5;
}

/* 表格搜尋框樣式 */
.table-responsive input.form-control {
  background-color: #495057;
  border-color: #6c757d;
  color: white;
}

.table-responsive input.form-control:focus {
  background-color: #495057;
  border-color: #007bff;
  color: white;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.table-responsive input.form-control::placeholder {
  color: #adb5bd;
}

/* 滾動條樣式 */
.table-responsive::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .panel-left, .panel-right {
    min-width: 100px;
  }
  
  .main-content .container-fluid {
    height: calc(100vh - 56px);
  }
  
  .table-responsive {
    font-size: 0.8rem;
  }
  
  .nav-pills .nav-link {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}

/* 動畫效果 */
.btn, .nav-link {
  transition: all 0.2s ease-in-out;
}

.card {
  transition: box-shadow 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* 高亮效果 */
.table-dark tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Loading 狀態 */
.btn .fas {
  margin-right: 0.5rem;
}

/* 徽章顏色覆蓋 */
.bg-success {
  background-color: #198754 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}
</style>
