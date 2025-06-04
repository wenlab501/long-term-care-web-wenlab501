<template>
  <div class="h-100 dashboard-container bg-theme-primary">
    <div class="p-3">
      
      <!-- 📊 統計卡片行 (Statistics Cards Row) -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card stats-card bg-primary text-white">
            <div class="card-body text-center">
              <div class="stats-value">{{ formatNumber(totalDataPoints) }}</div>
              <div class="stats-label">總數據點</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card stats-card bg-success text-white">
            <div class="card-body text-center">
              <div class="stats-value">{{ maxCount }}</div>
              <div class="stats-label">最高值</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card stats-card bg-warning text-dark">
            <div class="card-body text-center">
              <div class="stats-value">{{ averageCount.toFixed(1) }}</div>
              <div class="stats-label">平均值</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card stats-card bg-info text-white">
            <div class="card-body text-center">
              <div class="stats-value">{{ dataRegionsCount }}</div>
              <div class="stats-label">有數據區域</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 📈 圖表行 (Charts Row) -->
      <div class="row charts-row">
        <div class="col-md-6 mb-3">
          <div class="card">
            <div class="card-header bg-theme-secondary">
              <h6 class="mb-0 text-theme-primary">
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
        <div class="col-md-6 mb-3">
          <div class="card">
            <div class="card-header bg-theme-secondary">
              <h6 class="mb-0 text-theme-primary">
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
  </div>
</template>

<script>
/**
 * 📊 DashboardView.vue - 數據儀表板組件
 * 
 * 功能說明：
 * 1. 📊 顯示統計數據卡片
 * 2. 📈 提供數據分布柱狀圖
 * 3. 📊 提供區域比例圓餅圖
 * 4. 🎨 使用D3.js進行圖表渲染
 * 5. 📱 響應式設計支援
 */
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'
import { formatNumber } from '../utils/utils.js'

export default {
  name: 'DashboardView',
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   */
  props: {
    /** 📋 合併的表格數據 */
    mergedTableData: {
      type: Array,
      default: () => [],
      required: true
    },
    
    /** 📊 最大計數值 */
    maxCount: {
      type: Number,
      default: 0,
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
    
    /** 📏 容器高度 */
    containerHeight: {
      type: Number,
      default: 500,
      required: true
    },
    /** 🛠️ 是否正在拖曳面板 */
    isPanelDragging: {
      type: Boolean,
      default: false
    }
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup(props) {
    // 📚 組件引用 (Component References)
    const barChart = ref(null)
    const pieChart = ref(null)

    /**
     * 🧮 計算總數據點 (Computed Total Data Points)
     */
    const totalDataPoints = computed(() => {
      return props.mergedTableData?.length || 0
    })

    /**
     * 📊 柱狀圖數據 (Bar Chart Data)
     * 根據count值分組統計
     */
    const salesData = computed(() => {
      if (!props.mergedTableData || props.mergedTableData.length === 0) {
        return [
          { name: '無數據', value: 0, color: '#6c757d' }
        ]
      }
      
      // 根據count值分組
      const ranges = [
        { name: '0-10', min: 0, max: 10, value: 0, color: '#28a745' },
        { name: '11-25', min: 11, max: 25, value: 0, color: '#ffc107' },
        { name: '26-50', min: 26, max: 50, value: 0, color: '#fd7e14' },
        { name: '51-100', min: 51, max: 100, value: 0, color: '#dc3545' },
        { name: '100+', min: 101, max: Infinity, value: 0, color: '#6f42c1' }
      ]
      
      props.mergedTableData.forEach(row => {
        const count = row.count || 0
        const range = ranges.find(r => count >= r.min && count <= r.max)
        if (range) range.value++
      })
      
      return ranges.filter(r => r.value > 0)
    })

    /**
     * 📊 圓餅圖數據 (Pie Chart Data)
     * 顯示數據合併狀態比例
     */
    const marketData = computed(() => {
      if (!props.mergedTableData || props.mergedTableData.length === 0) {
        return [
          { name: '無數據', value: 100, color: '#6c757d' }
        ]
      }
      
      const total = props.mergedTableData.length
      const withData = props.mergedTableData.filter(row => (row.count || 0) > 0).length
      const withoutData = total - withData
      
      return [
        { name: '有數據區域', value: withData, color: '#28a745' },
        { name: '無數據區域', value: withoutData, color: '#dc3545' }
      ].filter(item => item.value > 0)
    })

    /**
     * 📊 創建柱狀圖 (Create Bar Chart)
     */
    const createBarChart = () => {
      if (!barChart.value) return

      const container = barChart.value.parentElement
      if (!container) return

      // 清除現有圖表
      d3.select(barChart.value).selectAll("*").remove()

      const containerRect = container.getBoundingClientRect()
      const margin = { top: 20, right: 30, bottom: 60, left: 80 }
      const width = Math.max(300, containerRect.width - margin.left - margin.right)
      const height = Math.max(200, containerRect.height - margin.top - margin.bottom)

      const svg = d3.select(barChart.value)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("max-width", "100%")
        .style("height", "auto")

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      // 建立比例尺
      const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(salesData.value.map(d => d.name))

      const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(salesData.value, d => d.value) || 1])

      // 添加X軸
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")

      // 添加Y軸
      g.append("g")
        .call(d3.axisLeft(y))

      // 添加Y軸標籤
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("區域數量")

      // 創建柱狀圖
      g.selectAll(".bar")
        .data(salesData.value)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => d.color)
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this).attr("opacity", 0.8)
        })
        .on("mouseout", function() {
          d3.select(this).attr("opacity", 1)
        })
        .append("title")
        .text(d => `${d.name}: ${d.value} 個區域`)

      // 添加數值標籤
      g.selectAll(".label")
        .data(salesData.value)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.name) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => d.value)
    }

    /**
     * 📊 創建圓餅圖 (Create Pie Chart)
     */
    const createPieChart = () => {
      if (!pieChart.value) return

      const container = pieChart.value.parentElement
      if (!container) return

      // 清除現有圖表
      d3.select(pieChart.value).selectAll("*").remove()

      const containerRect = container.getBoundingClientRect()
      const width = Math.max(250, containerRect.width)
      const height = Math.max(200, containerRect.height)
      const radius = Math.min(width, height) / 2 - 10

      const svg = d3.select(pieChart.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("max-width", "100%")
        .style("height", "auto")

      const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)

      // 創建圓餅圖佈局
      const pie = d3.pie()
        .value(d => d.value)
        .sort(null)

      const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)

      const labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40)

      // 創建圓餅片段
      const arcs = g.selectAll(".arc")
        .data(pie(marketData.value))
        .enter().append("g")
        .attr("class", "arc")

      arcs.append("path")
        .attr("d", arc)
        .style("fill", d => d.data.color)
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this).style("opacity", 0.8)
        })
        .on("mouseout", function() {
          d3.select(this).style("opacity", 1)
        })
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value} (${((d.data.value / d3.sum(marketData.value, d => d.value)) * 100).toFixed(1)}%)`)

      // 添加標籤
      arcs.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => {
          const percent = ((d.data.value / d3.sum(marketData.value, d => d.value)) * 100).toFixed(1)
          return percent > 5 ? `${d.data.value}` : '' // 只顯示大於5%的標籤
        })

      // 添加圖例
      const legend = svg.append("g")
        .attr("transform", `translate(20, 20)`)

      const legendItems = legend.selectAll(".legend-item")
        .data(marketData.value)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)

      legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", d => d.color)

      legendItems.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(d => `${d.name} (${d.value})`)
    }

    /**
     * 📈 刷新圖表 (Refresh Charts)
     */
    const refreshCharts = () => {
      nextTick(() => {
        createBarChart()
        createPieChart()
      })
    }

    // 👀 監聽數據變化 (Watch Data Changes)
    watch(() => props.mergedTableData, () => {
      refreshCharts()
    }, { deep: true })

    watch(() => props.containerHeight, () => {
      refreshCharts()
    })

    /**
     * 👀 監聽面板拖曳狀態以調整圖表的指針事件
     */
    watch(() => props.isPanelDragging, (dragging) => {
      nextTick(() => {
        const newPointerEvents = dragging ? 'none' : 'auto';
        if (barChart.value) {
          barChart.value.style.pointerEvents = newPointerEvents;
          // console.log('Bar chart pointer-events set to:', newPointerEvents);
        }
        if (pieChart.value) {
          pieChart.value.style.pointerEvents = newPointerEvents;
          // console.log('Pie chart pointer-events set to:', newPointerEvents);
        }
      });
    }, { immediate: true });

    /**
     * 🚀 組件掛載 (Component Mounted)
     */
    onMounted(() => {
      nextTick(() => {
        refreshCharts()
      })
    })

    // 📤 返回數據和方法 (Return Data and Methods)
    return {
      barChart,
      pieChart,
      totalDataPoints,
      salesData,
      marketData,
      refreshCharts,
      formatNumber
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 儀表板樣式 (Dashboard Styles)
 */

/* 📊 儀表板容器 */
.dashboard-container {
  overflow-y: auto;
  overflow-x: hidden;
}

/* 📊 統計卡片樣式 */
.stats-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stats-value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-1);
}

.stats-label {
  font-size: var(--font-size-small);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

/* 📈 圖表容器樣式 */
.chart-container {
  position: relative;
  width: 100%;
  height: 300px; /* 預設圖表高度 */
  background-color: #ffffff; /* 圖表背景色 */
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* 細微陰影 */
}

.chart-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 📋 卡片樣式增強 */
.card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  background-color: var(--panel-bg);
  border: 1px solid var(--panel-border);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.card-header {
  border-bottom: 1px solid var(--panel-border);
  font-weight: var(--font-weight-semibold);
}

/* 📱 響應式調整 */
@media (max-width: 768px) {
  .stats-value {
    font-size: var(--font-size-h4);
  }
  
  .chart-container {
    height: 250px;
  }
  
  .stats-label {
    font-size: var(--font-size-xs);
  }
}
</style> 