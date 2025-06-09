<template>
  <!-- 📊 DashboardView.vue - 數據儀表板視圖組件 (Dashboard View Component) -->
  <!-- 提供統計數據視覺化，包含統計卡片和多種圖表展示 -->
  <div class="h-100 dashboard-container bg-theme-primary">
    <div class="p-3 d-flex flex-column h-100">
      
      <!-- 📊 統計卡片行 (Statistics Cards Row) -->
      <!-- 顯示四個主要統計指標：總數據點、最高值、平均值、有數據區域 -->
      <div class="row mb-4">
        <!-- 📊 總數據點統計卡片 (Total Data Points Card) -->
        <div class="col-md-3 mb-3">
          <div class="card stats-card bg-primary text-white">
            <div class="card-body text-center">
              <div class="stats-value">{{ formatNumber(totalDataPoints) }}</div>
              <div class="stats-label">總數據點</div>
            </div>
          </div>
        </div>
        
        <!-- 📈 最高值統計卡片 (Maximum Value Card) -->
        <div class="col-md-3 mb-3">
          <div class="card stats-card bg-success text-white">
            <div class="card-body text-center">
              <div class="stats-value">{{ maxCount }}</div>
              <div class="stats-label">最高值</div>
            </div>
          </div>
        </div>
        
        <!-- 📊 平均值統計卡片 (Average Value Card) -->
        <div class="col-md-3 mb-3">
          <div class="card stats-card bg-warning text-dark">
            <div class="card-body text-center">
              <div class="stats-value">{{ averageCount.toFixed(1) }}</div>
              <div class="stats-label">平均值</div>
            </div>
          </div>
        </div>
        
        <!-- 📍 有數據區域統計卡片 (Data Regions Count Card) -->
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
      <!-- 包含柱狀圖和圓餅圖的響應式佈局 -->
      <div class="row charts-row flex-grow-1 overflow-hidden">
        <!-- 📊 柱狀圖區域 (Bar Chart Area) -->
        <div class="col-md-6 mb-3 d-flex flex-column h-100">
          <div class="card d-flex flex-column flex-grow-1">
            <div class="card-header bg-theme-secondary">
              <h6 class="mb-0 text-theme-primary">
                <i class="fas fa-chart-bar"></i> 數據分布 - 柱狀圖
              </h6>
            </div>
            <div class="card-body flex-grow-1 overflow-hidden position-relative">
              <div class="chart-container">
                <div ref="barChart" class="chart-content"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 🍰 圓餅圖區域 (Pie Chart Area) -->
        <div class="col-md-6 mb-3 d-flex flex-column h-100">
          <div class="card d-flex flex-column flex-grow-1">
            <div class="card-header bg-theme-secondary">
              <h6 class="mb-0 text-theme-primary">
                <i class="fas fa-chart-pie"></i> 區域比例 - 圓餅圖
              </h6>
            </div>
            <div class="card-body flex-grow-1 overflow-hidden position-relative">
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
 * 📊 DashboardView.vue - 數據儀表板視圖組件
 * 
 * 功能說明：
 * 1. 📊 顯示統計數據卡片（總數據點、最高值、平均值、有數據區域）
 * 2. 📈 提供數據分布柱狀圖，展示不同數值範圍的區域分布
 * 3. 🍰 提供區域比例圓餅圖，展示有數據與無數據區域的比例
 * 4. 🎨 使用 D3.js 進行高品質圖表渲染
 * 5. 📱 完全響應式設計，支援各種裝置
 * 6. 🔄 自動監聽數據變化並即時更新圖表
 * 
 * 技術架構：
 * - Vue 3 Composition API 管理組件狀態
 * - D3.js 負責圖表繪製和互動效果
 * - Bootstrap 5 提供響應式佈局
 * - 自動計算最佳圖表尺寸
 * 
 * 設計理念：
 * - 清晰的數據視覺化
 * - 直觀的用戶界面
 * - 高效能圖表渲染
 */

// 🔧 Vue Composition API 引入
import { ref, computed, watch, onMounted, nextTick } from 'vue'
// 📊 D3.js 圖表庫引入
import * as d3 from 'd3'
// 🛠️ 工具函數引入
import { formatNumber } from '../utils/utils.js'

export default {
  name: 'DashboardView',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   * 當前組件不使用子組件
   */
  components: {
  },
  
  /**
   * 📥 組件屬性定義 (Component Props)
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
    },
    
    /** 📊 總計數值 */
    totalCount: {
      type: Number,
      default: 0
    },
    
    /** 📍 作用中標記數量 */
    activeMarkers: {
      type: Number,
      default: 0
    },
    
    /** 📊 台南數據摘要 */
    tainanDataSummary: {
      type: Object,
      default: null
    }
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup(props) {
    // 📚 組件引用 (Component References)
    /** 📊 柱狀圖 DOM 引用 */
    const barChart = ref(null)
    /** 🍰 圓餅圖 DOM 引用 */
    const pieChart = ref(null)

    /**
     * 🧮 計算總數據點 (Computed Total Data Points)
     * 基於合併表格數據計算總數據點數量
     */
    const totalDataPoints = computed(() => {
      return props.mergedTableData?.length || 0
    })

    /**
     * 📊 柱狀圖數據 (Bar Chart Data)
     * 根據 count 值分組統計，展示不同數值範圍的分布
     */
    const salesData = computed(() => {
      if (!props.mergedTableData || props.mergedTableData.length === 0) {
        return [
          { name: '無數據', value: 0, color: '#6c757d' }
        ]
      }
      
      // 📊 根據 count 值定義分組範圍
      const ranges = [
        { name: '0-10', min: 0, max: 10, value: 0, color: '#28a745' },
        { name: '11-25', min: 11, max: 25, value: 0, color: '#ffc107' },
        { name: '26-50', min: 26, max: 50, value: 0, color: '#fd7e14' },
        { name: '51-100', min: 51, max: 100, value: 0, color: '#dc3545' },
        { name: '100+', min: 101, max: Infinity, value: 0, color: '#6f42c1' }
      ]
      
      // 🔍 遍歷數據並分組計數
      props.mergedTableData.forEach(row => {
        const count = row.count || 0
        const range = ranges.find(r => count >= r.min && count <= r.max)
        if (range) range.value++
      })
      
      // 🎯 只返回有數據的範圍
      return ranges.filter(r => r.value > 0)
    })

    /**
     * 🍰 圓餅圖數據 (Pie Chart Data)
     * 顯示有數據與無數據區域的比例分布
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
     * 使用 D3.js 繪製響應式柱狀圖
     */
    const createBarChart = () => {
      if (!barChart.value) return

      const container = barChart.value.parentElement
      if (!container) return

      // 🗑️ 清除現有圖表
      d3.select(barChart.value).selectAll("*").remove()

      // 📏 計算圖表尺寸
      const containerRect = container.getBoundingClientRect()
      const margin = { top: 20, right: 30, bottom: 60, left: 80 }
      const width = Math.max(300, containerRect.width - margin.left - margin.right)
      const height = Math.max(200, containerRect.height - margin.top - margin.bottom)

      // 🎨 創建 SVG 容器
      const svg = d3.select(barChart.value)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("max-width", "100%")
        .style("height", "auto")

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      // 📏 建立比例尺
      const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(salesData.value.map(d => d.name))

      const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(salesData.value, d => d.value) || 1])

      // 📐 添加 X 軸
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")

      // 📐 添加 Y 軸
      g.append("g")
        .call(d3.axisLeft(y))

      // 🏷️ 添加 Y 軸標籤
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("區域數量")

      // 📊 創建柱狀圖
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

      // 🏷️ 添加數值標籤
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
     * 🍰 創建圓餅圖 (Create Pie Chart)
     * 使用 D3.js 繪製響應式圓餅圖
     */
    const createPieChart = () => {
      if (!pieChart.value) return

      const container = pieChart.value.parentElement
      if (!container) return

      // 🗑️ 清除現有圖表
      d3.select(pieChart.value).selectAll("*").remove()

      // 📏 計算圖表尺寸
      const containerRect = container.getBoundingClientRect()
      const width = Math.max(250, containerRect.width)
      const height = Math.max(200, containerRect.height)
      const radius = Math.min(width, height) / 2 - 10

      // 🎨 創建 SVG 容器
      const svg = d3.select(pieChart.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("max-width", "100%")
        .style("height", "auto")

      const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)

      // 🍰 創建圓餅圖佈局
      const pie = d3.pie()
        .value(d => d.value)
        .sort(null)

      const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)

      const labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40)

      // 🎨 創建圓餅片段
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

      // 🏷️ 添加標籤
      arcs.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => {
          const percent = ((d.data.value / d3.sum(marketData.value, d => d.value)) * 100).toFixed(1)
          return percent > 5 ? `${d.data.value}` : '' // 只顯示大於 5% 的標籤
        })

      // 📋 添加圖例
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
     * 🔄 刷新圖表 (Refresh Charts)
     * 在下一個 tick 中重新繪製所有圖表
     */
    const refreshCharts = () => {
      nextTick(() => {
        createBarChart()
        createPieChart()
      })
    }

    // 👀 監聽器設定 (Watchers Setup)
    
    /**
     * 👀 監聽數據變化 (Watch Data Changes)
     * 當表格數據改變時自動重新繪製圖表
     */
    watch(() => props.mergedTableData, () => {
      refreshCharts()
    }, { deep: true })

    /**
     * 👀 監聽容器高度變化 (Watch Container Height Changes)
     * 當容器高度改變時重新計算圖表尺寸
     */
    watch(() => props.containerHeight, () => {
      refreshCharts()
    })

    /**
     * 👀 監聽面板拖曳狀態 (Watch Panel Dragging State)
     * 在拖曳時禁用圖表的指針事件，避免意外互動
     */
    watch(() => props.isPanelDragging, (dragging) => {
      nextTick(() => {
        if (barChart.value) {
          barChart.value.style.pointerEvents = dragging ? 'none' : 'auto';
          console.log(`DashboardView: 柱狀圖指針事件設為 ${barChart.value.style.pointerEvents}`);
        }
        if (pieChart.value) {
          pieChart.value.style.pointerEvents = dragging ? 'none' : 'auto';
          console.log(`DashboardView: 圓餅圖指針事件設為 ${pieChart.value.style.pointerEvents}`);
        }
      });
    }, { immediate: true });

    // 🚀 生命週期事件處理 (Lifecycle Event Handlers)
    
    /**
     * 🚀 組件掛載事件 (Component Mounted Event)
     * 初始化所有圖表
     */
    onMounted(() => {
      nextTick(() => {
        refreshCharts()
      })
    })

    // 📤 返回給模板使用的數據和方法 (Return Data and Methods for Template)
    return {
      // 📚 組件引用
      barChart,              // 柱狀圖 DOM 引用
      pieChart,              // 圓餅圖 DOM 引用
      
      // 📊 計算屬性
      totalDataPoints,       // 總數據點數量
      salesData,             // 柱狀圖數據
      marketData,            // 圓餅圖數據
      
      // 🔄 方法
      refreshCharts,         // 刷新圖表方法
      formatNumber           // 數字格式化工具函數
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 DashboardView 組件專屬樣式 (DashboardView Component Scoped Styles)
 * 提供儀表板的視覺風格和響應式佈局
 */

/* 📊 儀表板容器樣式 (Dashboard Container Styles) */
.dashboard-container {
  overflow-y: auto;                 /* 垂直滾動 */
  overflow-x: hidden;               /* 隱藏水平滾動 */
}

/* 📊 統計卡片樣式 (Statistics Card Styles) */
.stats-card {
  border-radius: var(--radius-lg);   /* 大圓角 */
  box-shadow: var(--shadow-md);      /* 中等陰影 */
  transition: var(--transition-base); /* 平滑過渡效果 */
}

.stats-card:hover {
  transform: translateY(-2px);       /* 懸停時向上移動 */
  box-shadow: var(--shadow-lg);      /* 增強陰影效果 */
}

.stats-value {
  font-size: var(--font-size-h2);    /* 大字體顯示數值 */
  font-weight: var(--font-weight-bold); /* 粗體 */
  margin-bottom: var(--spacing-1);   /* 底部間距 */
}

.stats-label {
  font-size: var(--font-size-small); /* 小字體標籤 */
  text-transform: uppercase;          /* 大寫轉換 */
  letter-spacing: 0.5px;             /* 字母間距 */
  opacity: 0.9;                      /* 略微透明 */
}

/* 📈 圖表容器樣式 (Chart Container Styles) */
.chart-container {
  position: relative;               /* 相對定位 */
  width: 100%;                      /* 滿寬 */
  height: 350px;                    /* 固定高度 */
  background-color: #ffffff;        /* 圖表背景色 */
  border-radius: 0.25rem;           /* 圓角 */
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* 細微陰影 */
}

.chart-content {
  width: 100%;                      /* 滿寬 */
  height: 100%;                     /* 滿高 */
  display: flex;                    /* Flexbox 佈局 */
  justify-content: center;          /* 水平置中 */
  align-items: center;              /* 垂直置中 */
}

/* 📋 卡片樣式增強 (Enhanced Card Styles) */
.card {
  border-radius: var(--radius-lg);         /* 大圓角 */
  box-shadow: var(--shadow-md);            /* 中等陰影 */
  transition: var(--transition-base);      /* 平滑過渡 */
  background-color: var(--panel-bg);      /* 面板背景色 */
  border: 1px solid var(--panel-border);  /* 面板邊框 */
}

.card:hover {
  box-shadow: var(--shadow-lg);            /* 懸停時增強陰影 */
}

.card-header {
  border-bottom: 1px solid var(--panel-border); /* 底部邊框 */
  font-weight: var(--font-weight-semibold);     /* 半粗體 */
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  /* 📱 平板和手機螢幕 */
  .stats-value {
    font-size: var(--font-size-h4);  /* 較小的數值字體 */
  }
  
  .stats-label {
    font-size: var(--font-size-xs);  /* 更小的標籤字體 */
  }
  
  .chart-container {
    height: 300px;                   /* 減少圖表高度 */
  }
}
</style> 