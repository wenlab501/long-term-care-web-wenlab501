<template>
  <div class="bg-white text-dark border-top" :style="{ height: bottomPanelHeight + 'px' }">
    <!-- 底部Tab導航 -->
    <div class="bg-light">
      <ul class="nav nav-tabs nav-fill small">
        <li class="nav-item">
          <button 
            class="nav-link text-dark border-0"
            :class="{ 'active bg-white text-primary fw-bold': activeBottomTab === 'table' }"
            @click="$emit('update:activeBottomTab', 'table')">
            數據表格
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link text-dark border-0"
            :class="{ 'active bg-white text-primary fw-bold': activeBottomTab === 'style' }"
            @click="$emit('update:activeBottomTab', 'style')">
            地圖樣式
          </button>
        </li>
      </ul>
    </div>
    
    <!-- 底部Tab內容 -->
    <div ref="bottomTabContentRef" class="tab-content h-100 overflow-auto">
      <!-- 數據表格Tab -->
      <div v-show="activeBottomTab === 'table'" class="h-100">
        <DataTableTab
          :tableData="tableData"
          @highlight-on-map="$emit('highlight-on-map', $event)"
        />
      </div>
      
      <!-- 新的樣式設定 Tab -->
      <div v-show="activeBottomTab === 'style'" class="container-fluid2">
        <div class="row p-3">
          <div class="col-md-4 mb-3">
            <label for="bottomColorSchemeSelect" class="form-label small fw-medium">色票方案:</label>
            <select 
              id="bottomColorSchemeSelect" 
              class="form-select form-select-sm"
              :value="selectedColorScheme"
              @change="$emit('update:selectedColorScheme', $event.target.value)">
              <option v-for="(scheme, key) in appColorSchemes" :key="key" :value="key">
                {{ scheme.name }}
              </option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label for="bottomBorderColorSelect" class="form-label small fw-medium">框線顏色:</label>
            <select 
              id="bottomBorderColorSelect" 
              class="form-select form-select-sm"
              :value="selectedBorderColor"
              @change="$emit('update:selectedBorderColor', $event.target.value)">
              <option value="#000000">黑色</option>
              <option value="#666666">深灰色</option>
              <option value="#CCCCCC">淺灰色</option>
              <option value="#FFFFFF">白色</option>
              <option value="#FF0000">紅色</option>
              <option value="#0000FF">藍色</option>
              <option value="#008000">綠色</option>
              <option value="transparent">無框線 (Transparent)</option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label for="bottomBorderWeightSelect" class="form-label small fw-medium">框線粗細 (px):</label>
            <select 
              id="bottomBorderWeightSelect" 
              class="form-select form-select-sm"
              :value="selectedBorderWeight"
              @change="$emit('update:selectedBorderWeight', parseInt($event.target.value))">
              <option value="0">0 (無)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue'
import DataTableTab from '../tabs/DataTableTab.vue'
import { COLOR_SCHEMES } from '../utils/dataProcessor.js'

export default {
  name: 'BottomPanel',
  components: {
    DataTableTab,
  },
  props: {
    activeBottomTab: { type: String, default: 'table' },
    bottomPanelHeight: { type: Number, default: 300 },
    tableData: { type: Array, default: () => [] },
    selectedColorScheme: { type: String, default: 'viridis' },
    selectedBorderColor: { type: String, default: '#666666' },
    selectedBorderWeight: { type: Number, default: 1 },
    isPanelDragging: { type: Boolean, default: false }
  },
  emits: [
    'update:activeBottomTab',
    'highlight-on-map',
    'update:selectedColorScheme',
    'update:selectedBorderColor',
    'update:selectedBorderWeight',
    'reset-view'
  ],
  setup(props) {
    const appColorSchemes = computed(() => COLOR_SCHEMES)
    const bottomTabContentRef = ref(null)

    watch(() => props.isPanelDragging, (dragging) => {
      nextTick(() => {
        if (bottomTabContentRef.value) {
          bottomTabContentRef.value.style.pointerEvents = dragging ? 'none' : 'auto';
        }
      });
    }, { immediate: true });

    return {
      appColorSchemes,
      bottomTabContentRef
    }
  }
}
</script> 