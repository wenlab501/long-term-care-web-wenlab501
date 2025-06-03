<template>
  <div id="home" class="container-fluid h-100 p-0">
    <!-- Top Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">
          <i class="fas fa-map-marked-alt"></i> 空間分析視覺化平台
        </span>
        <div class="navbar-nav ms-auto">
          <router-link to="/design" class="nav-link text-white">
            <i class="fas fa-palette"></i> 設計系統
          </router-link>
        </div>
      </div>
    </nav>
    
    <div class="row h-100 g-0" style="height: calc(100vh - 56px);">
      <!-- Left Control Panel -->
      <div class="panel-left d-flex" :style="{ width: store.leftPanelWidth + 'px' }">
        <div class="bg-light border-end p-3 flex-grow-1">
          <h5>左側控制面版</h5>
          <div class="mb-3">
            <label class="form-label">圖層控制</label>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="layer1" 
                     v-model="store.showLayer1" @change="toggleLayer('layer1')">
              <label class="form-check-label" for="layer1">交通資料圖層</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="layer2" 
                     v-model="store.showLayer2" @change="toggleLayer('layer2')">
              <label class="form-check-label" for="layer2">人口密度圖層</label>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">篩選條件</label>
            <select class="form-select" v-model="store.selectedFilter">
              <option value="">全部</option>
              <option value="filter1">篩選 1</option>
              <option value="filter2">篩選 2</option>
            </select>
          </div>
          <div class="mb-3">
            <small class="text-muted">面板寬度: {{ store.leftPanelWidth }}px</small>
          </div>
          <!-- D3.js 圓餅圖示意圖 -->
          <div class="mb-3">
            <h6>區域人口統計</h6>
            <div id="pie-chart"></div>
          </div>
        </div>
        <!-- Left Resizer -->
        <div class="resizer resizer-vertical" 
             @mousedown="startResize($event, 'left')"
             title="拖曳調整面板寬度">
        </div>
      </div>

      <!-- Main Screen with Tabs -->
      <div class="panel-main d-flex flex-column" :style="{ width: store.mainPanelWidth + 'px' }">
        <!-- Tab Navigation -->
        <nav class="bg-white border-bottom">
          <div class="nav nav-tabs" id="main-nav-tab" role="tablist">
            <button class="nav-link" @click="switchMainTab('map')" 
                    :class="{ active: activeMainTab === 'map' }">
              <i class="fas fa-map"></i> 地圖
            </button>
            <button class="nav-link" @click="switchMainTab('dashboard')"
                    :class="{ active: activeMainTab === 'dashboard' }">
              <i class="fas fa-chart-bar"></i> 儀表板
            </button>
          </div>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content flex-grow-1">
          <!-- 地圖頁面 -->
          <div class="tab-pane fade h-100" :class="{ 'show active': activeMainTab === 'map' }" 
               :style="{ height: store.mapHeight + 'px' }">
            <div id="map" ref="mapContainer" class="h-100 w-100"></div>
          </div>
          
          <!-- 儀表板頁面 -->
          <div class="tab-pane fade h-100 p-4" :class="{ 'show active': activeMainTab === 'dashboard' }"
               :style="{ height: store.mapHeight + 'px' }">
            <div class="row h-100">
              <div class="col-md-6 mb-3">
                <div class="card h-100">
                  <div class="card-header">
                    <h5 class="card-title mb-0">區域人口分布</h5>
                  </div>
                  <div class="card-body d-flex justify-content-center align-items-center">
                    <div id="dashboard-pie-chart"></div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="card h-100">
                  <div class="card-header">
                    <h5 class="card-title mb-0">月度趨勢分析</h5>
                  </div>
                  <div class="card-body d-flex justify-content-center align-items-center">
                    <div id="dashboard-line-chart"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">季度統計</h5>
                  </div>
                  <div class="card-body d-flex justify-content-center align-items-center" style="min-height: 300px;">
                    <div id="dashboard-bar-chart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Horizontal Resizer -->
        <div class="resizer resizer-horizontal" 
             @mousedown="startResize($event, 'horizontal')"
             title="拖曳調整地圖高度">
        </div>
        
        <!-- Bottom Control Panel with Tabs -->
        <div class="bg-secondary text-white" :style="{ height: store.bottomPanelHeight + 'px' }">
          <!-- Bottom Tab Navigation -->
          <nav class="bg-secondary">
            <div class="nav nav-tabs nav-dark border-0" role="tablist">
              <button class="nav-link text-white border-0" @click="switchBottomTab('controls')" 
                      :class="{ active: activeBottomTab === 'controls', 'bg-primary': activeBottomTab === 'controls' }">
                <i class="fas fa-cog"></i> 控制
              </button>
              <button class="nav-link text-white border-0" @click="switchBottomTab('info')"
                      :class="{ active: activeBottomTab === 'info', 'bg-primary': activeBottomTab === 'info' }">
                <i class="fas fa-info-circle"></i> 資訊
              </button>
            </div>
          </nav>
          
          <!-- Bottom Tab Content -->
          <div class="tab-content h-100 overflow-auto p-3">
            <!-- 控制頁面 -->
            <div class="tab-pane fade" :class="{ 'show active': activeBottomTab === 'controls' }">
              <div class="row">
                <div class="col-4">
                  <label class="form-label text-white">資料範圍</label>
                  <select class="form-select form-select-sm" v-model="dataRange">
                    <option value="all">全部資料</option>
                    <option value="recent">近期資料</option>
                    <option value="custom">自訂範圍</option>
                  </select>
                </div>
                <div class="col-4">
                  <label class="form-label text-white">縮放級別</label>
                  <input type="number" class="form-control form-control-sm" 
                         v-model.number="mapZoomLevel" 
                         @input="updateMapZoom"
                         min="1" max="18">
                </div>
                <div class="col-4">
                  <label class="form-label text-white">&nbsp;</label>
                  <button class="btn btn-primary btn-sm w-100" @click="resetView">重置視圖</button>
                </div>
              </div>
              <div class="mt-2">
                <small>座標: {{ store.currentCoords.lat }}, {{ store.currentCoords.lng }}</small>
              </div>
              <!-- D3.js 柱狀圖 -->
              <div class="mt-2">
                <div id="bar-chart"></div>
              </div>
            </div>
            
            <!-- 資訊頁面 -->
            <div class="tab-pane fade" :class="{ 'show active': activeBottomTab === 'info' }">
              <div class="row">
                <div class="col-6">
                  <h6 class="text-white">統計資訊</h6>
                  <small>總數據點: {{ formatNumber(store.totalCount) }}</small><br>
                  <small>選中項目: {{ store.selectedCount }}</small><br>
                  <small class="text-light">面板高度: {{ store.bottomPanelHeight }}px</small>
                </div>
                <div class="col-6">
                  <h6 class="text-white">系統狀態</h6>
                  <small>地圖級別: {{ store.zoomLevel }}</small><br>
                  <small>活躍圖層: {{ getActiveLayersCount() }}</small><br>
                  <small>更新時間: {{ getCurrentTime() }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Control Panel with Tabs -->
      <div class="panel-right d-flex" :style="{ width: store.rightPanelWidth + 'px' }">
        <!-- Right Resizer -->
        <div class="resizer resizer-vertical" 
             @mousedown="startResize($event, 'right')"
             title="拖曳調整面板寬度">
        </div>
        <div class="bg-light border-start flex-grow-1 d-flex flex-column">
          <!-- Right Tab Navigation -->
          <nav class="bg-light border-bottom">
            <div class="nav nav-tabs" role="tablist">
              <button class="nav-link" @click="switchRightTab('tools')" 
                      :class="{ active: activeRightTab === 'tools' }">
                <i class="fas fa-tools"></i> 工具
              </button>
              <button class="nav-link" @click="switchRightTab('stats')"
                      :class="{ active: activeRightTab === 'stats' }">
                <i class="fas fa-chart-pie"></i> 統計
              </button>
            </div>
          </nav>
          
          <!-- Right Tab Content -->
          <div class="tab-content flex-grow-1 p-3">
            <!-- 工具頁面 -->
            <div class="tab-pane fade" :class="{ 'show active': activeRightTab === 'tools' }">
              <h5>工具面版</h5>
              <div class="mb-3">
                <label class="form-label">圖表類型</label>
                <div class="btn-group-vertical d-grid gap-1">
                  <button class="btn btn-outline-primary btn-sm" @click="setChartType('bar')">柱狀圖</button>
                  <button class="btn btn-outline-primary btn-sm" @click="setChartType('pie')">圓餅圖</button>
                  <button class="btn btn-outline-primary btn-sm" @click="setChartType('line')">折線圖</button>
                </div>
              </div>
              <div class="mb-3">
                <router-link to="/design" class="btn btn-info btn-sm w-100">設計系統預覽</router-link>
              </div>
              <div class="mb-3">
                <small class="text-muted">面板寬度: {{ store.rightPanelWidth }}px</small>
              </div>
            </div>
            
            <!-- 統計頁面 -->
            <div class="tab-pane fade" :class="{ 'show active': activeRightTab === 'stats' }">
              <h5>統計面版</h5>
              <div class="mb-3">
                <label class="form-label">數據統計</label>
                <div class="card">
                  <div class="card-body p-2">
                    <small>總數量: {{ formatNumber(store.totalCount) }}</small><br>
                    <small>選中項目: {{ store.selectedCount }}</small><br>
                    <small>圖層1物件: {{ layer1ObjectCount }}</small><br>
                    <small>圖層2物件: {{ layer2ObjectCount }}</small>
                  </div>
                </div>
              </div>
              <!-- D3.js 折線圖 -->
              <div class="mb-3">
                <h6>趨勢圖</h6>
                <div id="line-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useMapStore } from '@/stores/mapStore.js'
import L from 'leaflet'
import * as d3 from 'd3'
import { formatNumber } from '@/utils/utils.js'

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'HomeView',
  setup() {
    const store = useMapStore()
    const mapContainer = ref(null)
    const activeMainTab = ref('map')
    const activeBottomTab = ref('controls')
    const activeRightTab = ref('tools')
    const dataRange = ref('all')
    const mapZoomLevel = ref(store.zoomLevel)
    const layer1ObjectCount = ref(0)
    const layer2ObjectCount = ref(0)
    
    let map = null
    let trafficLayer = null
    let populationLayer = null

    // 監聽store中的zoomLevel變化
    watch(() => store.zoomLevel, (newZoom) => {
      mapZoomLevel.value = newZoom
      if (map && map.getZoom() !== newZoom) {
        map.setZoom(newZoom)
      }
    })

    // 更新地圖縮放
    const updateMapZoom = () => {
      if (map && mapZoomLevel.value >= 1 && mapZoomLevel.value <= 18) {
        map.setZoom(mapZoomLevel.value)
        store.updateMapState({ zoomLevel: mapZoomLevel.value })
      }
    }

    // 切換主要標籤頁
    const switchMainTab = (tab) => {
      activeMainTab.value = tab
      if (tab === 'map' && map) {
        setTimeout(() => {
          map.invalidateSize()
        }, 100)
      } else if (tab === 'dashboard') {
        setTimeout(() => {
          initializeDashboardCharts()
        }, 200)
      }
    }

    // 切換底部標籤頁
    const switchBottomTab = (tab) => {
      activeBottomTab.value = tab
    }

    // 切換右側標籤頁
    const switchRightTab = (tab) => {
      activeRightTab.value = tab
      if (tab === 'stats') {
        setTimeout(() => {
          initializeRightChart()
        }, 200)
      }
    }

    // 獲取活躍圖層數量
    const getActiveLayersCount = () => {
      let count = 0
      if (store.showLayer1) count++
      if (store.showLayer2) count++
      return count
    }

    // 獲取當前時間
    const getCurrentTime = () => {
      return new Date().toLocaleTimeString('zh-TW')
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
        startWidth = store.leftPanelWidth
      } else if (type === 'right') {
        startWidth = store.rightPanelWidth
      } else if (type === 'horizontal') {
        startHeight = store.bottomPanelHeight
      }
      
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
      event.preventDefault()
    }

    const handleResize = (event) => {
      if (!isResizing) return
      
      if (resizeType === 'left') {
        const deltaX = event.clientX - startX
        const newWidth = startWidth + deltaX
        store.updateLeftPanelWidth(newWidth)
      } else if (resizeType === 'right') {
        const deltaX = event.clientX - startX
        const newWidth = startWidth - deltaX
        store.updateRightPanelWidth(newWidth)
      } else if (resizeType === 'horizontal') {
        const deltaY = event.clientY - startY
        const newHeight = startHeight - deltaY
        store.updateBottomPanelHeight(newHeight)
      }
      
      // Resize map after panel resize
      if (map && activeMainTab.value === 'map') {
        setTimeout(() => {
          map.invalidateSize()
        }, 100)
      }
    }

    const stopResize = () => {
      isResizing = false
      resizeType = ''
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }

    // Window resize handler
    const handleWindowResize = () => {
      store.updateWindowSize()
      
      if (map && activeMainTab.value === 'map') {
        setTimeout(() => {
          map.invalidateSize()
        }, 100)
      }
    }

    // 圖層切換功能
    const toggleLayer = (layerName) => {
      if (layerName === 'layer1' && trafficLayer) {
        if (store.showLayer1) {
          map.addLayer(trafficLayer)
        } else {
          map.removeLayer(trafficLayer)
        }
      } else if (layerName === 'layer2' && populationLayer) {
        if (store.showLayer2) {
          map.addLayer(populationLayer)
        } else {
          map.removeLayer(populationLayer)
        }
      }
    }

    const initializeMap = () => {
      if (!mapContainer.value) return

      // 初始化地圖 (以台北為中心)
      map = L.map(mapContainer.value).setView([25.0330, 121.5654], store.zoomLevel)

      // 添加地圖圖層
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // 創建交通資料圖層 (圖層1)
      trafficLayer = L.layerGroup()
      const trafficData = [
        { lat: 25.0400, lng: 121.5600, name: '台北車站', type: 'mrt' },
        { lat: 25.0500, lng: 121.5500, name: '中山站', type: 'mrt' },
        { lat: 25.0300, lng: 121.5700, name: '市政府站', type: 'mrt' },
        { lat: 25.0450, lng: 121.5450, name: '公車總站', type: 'bus' },
        { lat: 25.0250, lng: 121.5650, name: '轉運站', type: 'bus' },
        { lat: 25.0350, lng: 121.5550, name: '停車場A', type: 'parking' },
        { lat: 25.0550, lng: 121.5350, name: '停車場B', type: 'parking' }
      ]

      trafficData.forEach(point => {
        let color, icon
        if (point.type === 'mrt') {
          color = 'blue'
          icon = '🚇'
        } else if (point.type === 'bus') {
          color = 'green'
          icon = '🚌'
        } else {
          color = 'red'
          icon = '🅿️'
        }
        
        L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px;">${icon}</div>`,
            className: 'custom-marker',
            iconSize: [30, 30]
          })
        }).bindPopup(`<strong>${point.name}</strong><br>類型: ${point.type}`).addTo(trafficLayer)
      })
      layer1ObjectCount.value = trafficData.length

      // 創建人口密度圖層 (圖層2)
      populationLayer = L.layerGroup()
      const populationData = [
        { lat: 25.0450, lng: 121.5450, density: 'high', population: 15000, area: '信義區' },
        { lat: 25.0250, lng: 121.5650, density: 'medium', population: 8000, area: '大安區' },
        { lat: 25.0550, lng: 121.5350, density: 'low', population: 3000, area: '中山區' },
        { lat: 25.0350, lng: 121.5750, density: 'high', population: 12000, area: '松山區' },
        { lat: 25.0150, lng: 121.5450, density: 'medium', population: 6000, area: '大同區' }
      ]

      populationData.forEach(area => {
        let color, opacity
        if (area.density === 'high') {
          color = '#ff0000'
          opacity = 0.7
        } else if (area.density === 'medium') {
          color = '#ff9900'
          opacity = 0.5
        } else {
          color = '#ffff00'
          opacity = 0.3
        }
        
        L.circle([area.lat, area.lng], {
          color: color,
          fillColor: color,
          radius: area.population / 20,
          fillOpacity: opacity,
          weight: 2
        }).bindPopup(`
          <strong>${area.area}</strong><br>
          人口密度: ${area.density}<br>
          人口數: ${area.population.toLocaleString()}人
        `).addTo(populationLayer)
      })
      layer2ObjectCount.value = populationData.length

      // 根據初始狀態添加圖層
      if (store.showLayer1) {
        map.addLayer(trafficLayer)
      }
      if (store.showLayer2) {
        map.addLayer(populationLayer)
      }

      // 監聽地圖移動事件，更新到store
      map.on('mousemove', (e) => {
        store.updateMapState({
          currentCoords: {
            lat: e.latlng.lat.toFixed(4),
            lng: e.latlng.lng.toFixed(4)
          }
        })
      })

      map.on('zoomend', () => {
        const zoom = map.getZoom()
        mapZoomLevel.value = zoom
        store.updateMapState({ zoomLevel: zoom })
      })
    }

    // D3.js 圖表初始化
    const initializeCharts = () => {
      // 清除已存在的圖表
      d3.select('#pie-chart').selectAll('*').remove()
      d3.select('#bar-chart').selectAll('*').remove()

      // 左側面板 - 圓餅圖
      const pieData = [
        { name: '中山區', value: 30, color: '#ff6b6b' },
        { name: '大安區', value: 40, color: '#4ecdc4' },
        { name: '信義區', value: 30, color: '#45b7d1' }
      ]
      
      const pieWidth = 150
      const pieHeight = 150
      const radius = Math.min(pieWidth, pieHeight) / 2 - 10

      const pie = d3.pie().value(d => d.value)
      const arc = d3.arc().innerRadius(0).outerRadius(radius)

      const pieSvg = d3.select('#pie-chart')
        .append('svg')
        .attr('width', pieWidth)
        .attr('height', pieHeight)
        .append('g')
        .attr('transform', `translate(${pieWidth/2}, ${pieHeight/2})`)

      const arcs = pieSvg.selectAll('.arc')
        .data(pie(pieData))
        .enter().append('g')
        .attr('class', 'arc')

      arcs.append('path')
        .attr('d', arc)
        .style('fill', d => d.data.color)
        .style('stroke', '#fff')
        .style('stroke-width', 2)

      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .style('font-size', '10px')
        .style('fill', '#fff')

      // 下方面板 - 柱狀圖
      const barData = [
        { name: '1月', value: 20 },
        { name: '2月', value: 35 },
        { name: '3月', value: 25 },
        { name: '4月', value: 45 }
      ]

      const barWidth = 250
      const barHeight = 100
      const barMargin = { top: 10, right: 10, bottom: 25, left: 30 }

      const x = d3.scaleBand()
        .range([0, barWidth - barMargin.left - barMargin.right])
        .domain(barData.map(d => d.name))
        .padding(0.1)

      const y = d3.scaleLinear()
        .range([barHeight - barMargin.top - barMargin.bottom, 0])
        .domain([0, d3.max(barData, d => d.value)])

      const barSvg = d3.select('#bar-chart')
        .append('svg')
        .attr('width', barWidth)
        .attr('height', barHeight)
        .append('g')
        .attr('transform', `translate(${barMargin.left}, ${barMargin.top})`)

      barSvg.selectAll('.bar')
        .data(barData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.value))
        .attr('height', d => barHeight - barMargin.top - barMargin.bottom - y(d.value))
        .style('fill', '#007bff')

      // 添加x軸
      barSvg.append('g')
        .attr('transform', `translate(0, ${barHeight - barMargin.top - barMargin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', '10px')
    }

    // 右側面版圖表
    const initializeRightChart = () => {
      d3.select('#line-chart').selectAll('*').remove()

      const lineData = [
        { x: 0, y: 20 },
        { x: 1, y: 35 },
        { x: 2, y: 25 },
        { x: 3, y: 45 },
        { x: 4, y: 30 }
      ]

      const lineWidth = 150
      const lineHeight = 100
      const lineMargin = { top: 10, right: 10, bottom: 10, left: 10 }

      const xLine = d3.scaleLinear()
        .range([0, lineWidth - lineMargin.left - lineMargin.right])
        .domain(d3.extent(lineData, d => d.x))

      const yLine = d3.scaleLinear()
        .range([lineHeight - lineMargin.top - lineMargin.bottom, 0])
        .domain(d3.extent(lineData, d => d.y))

      const line = d3.line()
        .x(d => xLine(d.x))
        .y(d => yLine(d.y))
        .curve(d3.curveMonotoneX)

      const lineSvg = d3.select('#line-chart')
        .append('svg')
        .attr('width', lineWidth)
        .attr('height', lineHeight)
        .append('g')
        .attr('transform', `translate(${lineMargin.left}, ${lineMargin.top})`)

      lineSvg.append('path')
        .datum(lineData)
        .attr('class', 'line')
        .attr('d', line)
        .style('fill', 'none')
        .style('stroke', '#28a745')
        .style('stroke-width', 2)

      lineSvg.selectAll('.dot')
        .data(lineData)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xLine(d.x))
        .attr('cy', d => yLine(d.y))
        .attr('r', 3)
        .style('fill', '#28a745')
    }

    // 初始化儀表板圖表
    const initializeDashboardCharts = () => {
      setTimeout(() => {
        // 清除舊圖表
        d3.select('#dashboard-pie-chart').selectAll('*').remove()
        d3.select('#dashboard-line-chart').selectAll('*').remove()
        d3.select('#dashboard-bar-chart').selectAll('*').remove()

        // 儀表板圓餅圖
        const dashboardPieData = [
          { name: '中山區', value: 228000, color: '#ff6b6b' },
          { name: '大安區', value: 309000, color: '#4ecdc4' },
          { name: '信義區', value: 232000, color: '#45b7d1' },
          { name: '其他區域', value: 150000, color: '#96ceb4' }
        ]
        
        const dashPieWidth = 280
        const dashPieHeight = 280
        const dashRadius = Math.min(dashPieWidth, dashPieHeight) / 2 - 30

        const dashPie = d3.pie().value(d => d.value)
        const dashArc = d3.arc().innerRadius(50).outerRadius(dashRadius)

        const dashPieSvg = d3.select('#dashboard-pie-chart')
          .append('svg')
          .attr('width', dashPieWidth)
          .attr('height', dashPieHeight)
          .append('g')
          .attr('transform', `translate(${dashPieWidth/2}, ${dashPieHeight/2})`)

        const arcs = dashPieSvg.selectAll('.arc')
          .data(dashPie(dashboardPieData))
          .enter().append('g')
          .attr('class', 'arc')

        arcs.append('path')
          .attr('d', dashArc)
          .style('fill', d => d.data.color)
          .style('stroke', '#fff')
          .style('stroke-width', 3)

        arcs.append('text')
          .attr('transform', d => `translate(${dashArc.centroid(d)})`)
          .attr('text-anchor', 'middle')
          .text(d => d.data.name)
          .style('font-size', '12px')
          .style('fill', '#fff')
          .style('font-weight', 'bold')

        // 儀表板折線圖
        const dashLineData = [
          { month: '1月', value: 745000 },
          { month: '2月', value: 758000 },
          { month: '3月', value: 765000 },
          { month: '4月', value: 769000 },
          { month: '5月', value: 775000 },
          { month: '6月', value: 780000 }
        ]

        const dashLineWidth = 300
        const dashLineHeight = 250
        const dashLineMargin = { top: 20, right: 30, bottom: 40, left: 70 }

        const dashLineSvg = d3.select('#dashboard-line-chart')
          .append('svg')
          .attr('width', dashLineWidth)
          .attr('height', dashLineHeight)

        const xScale = d3.scaleBand()
          .range([dashLineMargin.left, dashLineWidth - dashLineMargin.right])
          .domain(dashLineData.map(d => d.month))

        const yScale = d3.scaleLinear()
          .range([dashLineHeight - dashLineMargin.bottom, dashLineMargin.top])
          .domain(d3.extent(dashLineData, d => d.value))

        const dashLine = d3.line()
          .x(d => xScale(d.month) + xScale.bandwidth() / 2)
          .y(d => yScale(d.value))
          .curve(d3.curveMonotoneX)

        dashLineSvg.append('path')
          .datum(dashLineData)
          .attr('fill', 'none')
          .attr('stroke', '#007bff')
          .attr('stroke-width', 3)
          .attr('d', dashLine)

        dashLineSvg.selectAll('.dot')
          .data(dashLineData)
          .enter().append('circle')
          .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
          .attr('cy', d => yScale(d.value))
          .attr('r', 5)
          .attr('fill', '#007bff')

        // 添加軸
        dashLineSvg.append('g')
          .attr('transform', `translate(0, ${dashLineHeight - dashLineMargin.bottom})`)
          .call(d3.axisBottom(xScale))

        dashLineSvg.append('g')
          .attr('transform', `translate(${dashLineMargin.left}, 0)`)
          .call(d3.axisLeft(yScale).tickFormat(d => (d/1000) + 'K'))

        // 儀表板柱狀圖
        const dashBarData = [
          { quarter: 'Q1', value: 2268000 },
          { quarter: 'Q2', value: 2324000 },
          { quarter: 'Q3', value: 2290000 },
          { quarter: 'Q4', value: 2355000 }
        ]

        const dashBarWidth = 600
        const dashBarHeight = 250
        const dashBarMargin = { top: 20, right: 30, bottom: 40, left: 80 }

        const dashBarSvg = d3.select('#dashboard-bar-chart')
          .append('svg')
          .attr('width', dashBarWidth)
          .attr('height', dashBarHeight)

        const xBarScale = d3.scaleBand()
          .range([dashBarMargin.left, dashBarWidth - dashBarMargin.right])
          .domain(dashBarData.map(d => d.quarter))
          .padding(0.2)

        const yBarScale = d3.scaleLinear()
          .range([dashBarHeight - dashBarMargin.bottom, dashBarMargin.top])
          .domain([0, d3.max(dashBarData, d => d.value)])

        dashBarSvg.selectAll('.bar')
          .data(dashBarData)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => xBarScale(d.quarter))
          .attr('width', xBarScale.bandwidth())
          .attr('y', d => yBarScale(d.value))
          .attr('height', d => dashBarHeight - dashBarMargin.bottom - yBarScale(d.value))
          .attr('fill', '#28a745')

        // 添加軸
        dashBarSvg.append('g')
          .attr('transform', `translate(0, ${dashBarHeight - dashBarMargin.bottom})`)
          .call(d3.axisBottom(xBarScale))

        dashBarSvg.append('g')
          .attr('transform', `translate(${dashBarMargin.left}, 0)`)
          .call(d3.axisLeft(yBarScale).tickFormat(d => (d/1000000).toFixed(1) + 'M'))
      }, 100)
    }

    const resetView = () => {
      if (map) {
        map.setView([25.0330, 121.5654], 10)
        mapZoomLevel.value = 10
        store.updateMapState({ zoomLevel: 10 })
      }
    }

    const setChartType = (type) => {
      console.log('圖表類型設定為:', type)
      store.updateChartType(type)
    }

    onMounted(() => {
      setTimeout(() => {
        initializeMap()
        initializeCharts()
        if (activeMainTab.value === 'dashboard') {
          initializeDashboardCharts()
        }
        if (activeRightTab.value === 'stats') {
          initializeRightChart()
        }
      }, 200)
      
      window.addEventListener('resize', handleWindowResize)
    })

    onUnmounted(() => {
      if (map) {
        map.remove()
      }
      window.removeEventListener('resize', handleWindowResize)
    })

    return {
      store,
      mapContainer,
      activeMainTab,
      activeBottomTab,
      activeRightTab,
      dataRange,
      mapZoomLevel,
      layer1ObjectCount,
      layer2ObjectCount,
      resetView,
      setChartType,
      startResize,
      formatNumber,
      switchMainTab,
      switchBottomTab,
      switchRightTab,
      toggleLayer,
      updateMapZoom,
      getActiveLayersCount,
      getCurrentTime
    }
  }
}
</script>

<style scoped>
#home {
  font-family: 'Noto Sans TC', sans-serif;
  height: 100vh;
  overflow: hidden;
}

#map {
  z-index: 1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
}

.card {
  font-size: 0.875rem;
}

.bg-secondary {
  background-color: #6c757d !important;
}

/* Tab 樣式 */
.nav-tabs {
  border-bottom: 1px solid #dee2e6;
}

.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  color: #495057;
  background-color: #f8f9fa;
  margin-right: 2px;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

.nav-tabs .nav-link:hover {
  border-color: #e9ecef #e9ecef #dee2e6;
  isolation: isolate;
}

.nav-tabs .nav-link.active {
  color: #495057;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}

/* 底部tab的特殊樣式 */
.nav-dark .nav-link {
  background-color: transparent;
  border-radius: 0.375rem 0.375rem 0 0;
  margin-right: 4px;
}

.nav-dark .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-dark .nav-link.active {
  background-color: #007bff !important;
  color: white !important;
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

/* 圖表容器樣式 */
#dashboard-pie-chart,
#dashboard-line-chart,
#dashboard-bar-chart {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#pie-chart,
#bar-chart,
#line-chart {
  min-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 確保tab內容有正確的高度 */
.tab-content {
  height: 100%;
}

.tab-pane {
  height: 100%;
}

/* 自定義marker樣式 */
.custom-marker {
  background: none !important;
  border: none !important;
}

/* 小屏幕響應式設計 */
@media (max-width: 768px) {
  .nav-tabs .nav-link {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  
  .col-4 {
    margin-bottom: 0.5rem;
  }
  
  #pie-chart,
  #bar-chart,
  #line-chart {
    min-height: 80px;
  }
}
</style> 