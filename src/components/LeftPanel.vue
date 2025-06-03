<template>
  <div class="bg-light border-end p-3 flex-grow-1 custom-scroll">
    <h5 class="text-primary fw-bold mb-3">
      <i class="fas fa-sliders-h"></i> 左側控制面版
    </h5>
    
    <!-- 台南市數據載入按鈕 -->
    <div class="mb-4">
      <button class="btn btn-success mb-2" @click="$emit('load-tainan-data')" :disabled="isLoadingData">
        <i class="fas fa-download"></i>
        {{ isLoadingData ? '載入中...' : '載入台南市數據' }}
      </button>
      <small class="text-muted d-block">
        載入GeoJSON和Excel數據進行合併
      </small>
    </div>

    <!-- 開始分析按鈕 -->
    <div class="mb-4">
      <button class="btn btn-analyze mb-2" @click="$emit('start-analysis')" :disabled="!canStartAnalysis">
        <i class="fas fa-play"></i>
        開始分析
      </button>
      <small class="text-muted d-block">
        對載入的數據進行分析處理
      </small>
    </div>
    
    <!-- 色票方案選擇 -->
    <div class="mb-3">
      <label class="form-label fw-semibold">
        <i class="fas fa-palette me-1"></i>
        色票方案
      </label>
      <select 
        class="form-select" 
        :value="selectedColorScheme" 
        @change="$emit('update:selectedColorScheme', $event.target.value)">
        <optgroup label="🐍 Python matplotlib">
          <option value="viridis">Viridis (預設)</option>
          <option value="plasma">Plasma</option>
          <option value="inferno">Inferno</option>
          <option value="magma">Magma</option>
          <option value="cividis">Cividis (色盲友善)</option>
        </optgroup>
        <optgroup label="🔬 Python seaborn">
          <option value="seaborn_rocket">Rocket</option>
          <option value="seaborn_mako">Mako</option>
        </optgroup>
        <optgroup label="📊 科學視覺化">
          <option value="coolwarm">CoolWarm</option>
          <option value="rdylbu">RdYlBu (發散)</option>
        </optgroup>
        <optgroup label="🎨 經典色票">
          <option value="default">預設</option>
          <option value="heat">熱力圖</option>
          <option value="blues">藍色系</option>
          <option value="greens">綠色系</option>
          <option value="reds">紅色系</option>
          <option value="rainbow">彩虹光譜</option>
        </optgroup>
      </select>
    </div>
    
    <div class="mb-3">
      <label class="form-label fw-semibold">圖層控制</label>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="layer1" :checked="showLayer1" @change="$emit('update:showLayer1', $event.target.checked)">
        <label class="form-check-label" for="layer1">商店標記</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="layer2" :checked="showLayer2" @change="$emit('update:showLayer2', $event.target.checked)">
        <label class="form-check-label" for="layer2">熱點區域</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="layer3" :checked="showTainanLayer" @change="$emit('update:showTainanLayer', $event.target.checked)">
        <label class="form-check-label" for="layer3">台南市區域</label>
      </div>
    </div>
    
    <div class="mb-3">
      <label class="form-label fw-semibold">篩選條件</label>
      <select class="form-select" :value="selectedFilter" @change="$emit('update:selectedFilter', $event.target.value)">
        <option value="">全部</option>
        <option value="convenience">便利商店</option>
        <option value="supermarket">超市</option>
        <option value="restaurant">餐廳</option>
      </select>
    </div>
    
    <div class="card bg-light border-0 mt-4">
      <div class="card-body p-3">
        <h6 class="card-title text-primary mb-2">
          <i class="fas fa-info-circle"></i> 狀態信息
        </h6>
        <small class="text-muted d-block">面板寬度: {{ leftPanelWidth }}px</small>
        <small class="text-muted d-block" v-if="tainanDataSummary">
          台南數據: {{ tainanDataSummary.mergedCount }}/{{ tainanDataSummary.totalFeatures }} 
          ({{ tainanDataSummary.mergeRate }}%)
        </small>
        <small class="text-muted d-block">
          分析項目: {{ analysisList.length }} 個
        </small>
        <small class="text-muted d-block">
          色票方案: {{ selectedColorScheme.toUpperCase() }}
        </small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftPanel',
  props: {
    isLoadingData: Boolean,
    canStartAnalysis: Boolean,
    showLayer1: Boolean,
    showLayer2: Boolean,
    showTainanLayer: Boolean,
    selectedFilter: String,
    selectedColorScheme: String,
    leftPanelWidth: Number,
    tainanDataSummary: Object,
    analysisList: Array
  },
  emits: [
    'load-tainan-data',
    'start-analysis',
    'update:showLayer1',
    'update:showLayer2',
    'update:showTainanLayer',
    'update:selectedFilter',
    'update:selectedColorScheme'
  ]
}
</script> 