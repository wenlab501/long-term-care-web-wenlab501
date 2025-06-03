<template>
  <div class="h-100 bg-light dashboard-container">
    <!-- 統計卡片行 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card stats-card text-white">
          <div class="card-body text-center">
            <div class="stats-value">{{ formatNumber(totalDataPoints) }}</div>
            <div class="stats-label">總數據點</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card text-white">
          <div class="card-body text-center">
            <div class="stats-value">{{ maxCount }}</div>
            <div class="stats-label">最高值</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card text-white">
          <div class="card-body text-center">
            <div class="stats-value">{{ averageCount.toFixed(1) }}</div>
            <div class="stats-label">平均值</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card text-white">
          <div class="card-body text-center">
            <div class="stats-value">{{ dataRegionsCount }}</div>
            <div class="stats-label">有數據區域</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖表行 -->
    <div class="charts-row">
      <div class="col-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-chart-bar"></i> 數據分布 - 柱狀圖
            </h6>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <div ref="barChart" class="chart-content"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-chart-pie"></i> 區域比例 - 圓餅圖
            </h6>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <div ref="pieChart" class="chart-content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as d3 from 'd3'
import { formatNumber } from '../utils/utils.js'

export default {
  name: 'DashboardView',
  props: {
    mergedTableData: Array,
    maxCount: Number,
    averageCount: Number,
    dataRegionsCount: Number,
    containerHeight: Number
  },
  setup(props) {
    const barChart = ref(null)
    const pieChart = ref(null)

    const totalDataPoints = computed(() => {
      return props.mergedTableData?.length || 0
    })

    // Chart data - enhanced with real data
    const salesData = computed(() => {
      if (!props.mergedTableData || props.mergedTableData.length === 0) {
        return [
          { name: '無數據', value: 0 }
        ]
      }
      
      // 根據count值分組
      const ranges = [
        { name: '0-10', min: 0, max: 10, value: 0 },
        { name: '11-25', min: 11, max: 25, value: 0 },
        { name: '26-50', min: 26, max: 50, value: 0 },
        { name: '51-100', min: 51, max: 100, value: 0 },
        { name: '100+', min: 101, max: Infinity, value: 0 }
      ]
      
      props.mergedTableData.forEach(row => {
        const count = row.count || 0
        const range = ranges.find(r => count >= r.min && count <= r.max)
        if (range) range.value++
      })
      
      return ranges.filter(r => r.value > 0)
    })

    const marketData = computed(() => {
      if (!props.mergedTableData || props.mergedTableData.length === 0) {
        return [
          { name: '無數據', value: 100 }
        ]
      }
      
      const total = props.mergedTableData.length
      const merged = props.mergedTableData.filter(row => row.merged === '成功').length
      const unmerged = total - merged
      
      return [
        { name: '已合併', value: merged },
        { name: '未合併', value: unmerged }
      ].filter(item => item.value > 0)
    })

    const createBarChart = () => {
      if (!barChart.value) return

      const container = barChart.value.parentElement
      if (!container) return

      d3.select(barChart.value).selectAll("*").remove()

      const containerRect = container.getBoundingClientRect()
      const margin = { top: 20, right: 30, bottom: 40, left: 60 }
      const width = Math.max(200, containerRect.width - margin.left - margin.right)
      const height = Math.max(150, containerRect.height - margin.top - margin.bottom)

      const svg = d3.select(barChart.value)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("max-width", "100%")
        .style("height", "auto")

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(salesData.value.map(d => d.name))

      const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(salesData.value, d => d.value) || 1])

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
        .append("title")
        .text(d => `${d.name}: ${d.value}`)
    }

    const createPieChart = () => {
      if (!pieChart.value) return

      const container = pieChart.value.parentElement
      if (!container) return

      d3.select(pieChart.value).selectAll("*").remove()

      const containerRect = container.getBoundingClientRect()
      const width = Math.max(200, containerRect.width)
      const height = Math.max(150, containerRect.height)
      const radius = Math.min(width, height) / 2 - 20

      const svg = d3.select(pieChart.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("max-width", "100%")
        .style("height", "auto")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)

      const color = d3.scaleOrdinal()
        .range(["#28a745", "#ffc107", "#dc3545", "#007bff"])

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
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value}`)

      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => `${d.data.name}\n${d.data.value}`)
        .style("font-size", "12px")
        .style("fill", "white")
        .style("font-weight", "bold")
    }

    const refreshCharts = () => {
      nextTick(() => {
        setTimeout(() => {
          createBarChart()
          createPieChart()
        }, 100)
      })
    }

    // Watch for data changes
    watch(() => props.mergedTableData, refreshCharts, { deep: true })
    watch(() => props.containerHeight, refreshCharts)

    onMounted(() => {
      refreshCharts()
      window.addEventListener('resize', refreshCharts)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', refreshCharts)
    })

    return {
      barChart,
      pieChart,
      totalDataPoints,
      salesData,
      marketData,
      formatNumber,
      refreshCharts
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 1rem;
}

.charts-row {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 1rem;
}

.charts-row .col-6 {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.chart-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-body {
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stats-label {
  font-size: 0.875rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style> 