<!--
  BottomContent.vue
  功能：
  1. 提供底部內容區域
  2. 管理表格和樣式視圖的切換
  3. 顯示數據表格和地圖樣式設置
  4. 支援響應式設計
-->

<template>
  <div class="bottom-content">
    <!-- 底部標籤導航 -->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: activeBottomTab === 'table' }"
          @click="$emit('update:activeBottomTab', 'table')"
        >
          數據表格
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: activeBottomTab === 'style' }"
          @click="$emit('update:activeBottomTab', 'style')"
        >
          地圖樣式
        </button>
      </li>
    </ul>

    <!-- 底部內容區域 -->
    <div class="tab-content">
      <!-- 表格視圖 -->
      <div
        v-if="activeBottomTab === 'table'"
        class="tab-pane fade show active"
        role="tabpanel"
      >
        <DataTableTab :tableData="mergedTableData" />
      </div>

      <!-- 樣式設置視圖 -->
      <div
        v-else-if="activeBottomTab === 'style'"
        class="tab-pane fade show active"
        role="tabpanel"
      >
        <div class="container-fluid">
          <div class="row p-3">
            <!-- 色票方案選擇 -->
            <div class="col-md-4 mb-3">
              <label for="colorSchemeSelect" class="form-label small fw-medium">色票方案:</label>
              <select 
                id="colorSchemeSelect" 
                class="form-select form-select-sm"
                :value="selectedColorScheme"
                @change="$emit('update:selectedColorScheme', $event.target.value)"
              >
                <option v-for="(scheme, key) in colorSchemes" :key="key" :value="key">
                  {{ scheme.name }}
                </option>
              </select>
            </div>
            <!-- 框線顏色選擇 -->
            <div class="col-md-4 mb-3">
              <label for="borderColorSelect" class="form-label small fw-medium">框線顏色:</label>
              <select 
                id="borderColorSelect" 
                class="form-select form-select-sm"
                :value="selectedBorderColor"
                @change="$emit('update:selectedBorderColor', $event.target.value)"
              >
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
            <!-- 框線粗細選擇 -->
            <div class="col-md-4 mb-3">
              <label for="borderWeightSelect" class="form-label small fw-medium">框線粗細 (px):</label>
              <select 
                id="borderWeightSelect" 
                class="form-select form-select-sm"
                :value="selectedBorderWeight"
                @change="$emit('update:selectedBorderWeight', parseInt($event.target.value))"
              >
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
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import DataTableTab from './tabs/DataTableTab.vue'
import { COLOR_SCHEMES } from '../utils/dataProcessor.js'

// Props
defineProps({
  activeTab: {
    type: String,
    default: 'map'
  },
  activeBottomTab: {
    type: String,
    default: 'table'
  },
  mergedTableData: {
    type: Array,
    default: () => []
  },
  selectedColorScheme: {
    type: String,
    default: 'viridis'
  },
  selectedBorderColor: {
    type: String,
    default: '#666666'
  },
  selectedBorderWeight: {
    type: Number,
    default: 1
  }
})

// Emits
defineEmits([
  'update:activeBottomTab',
  'update:selectedColorScheme',
  'update:selectedBorderColor',
  'update:selectedBorderWeight'
])

// 顏色方案
const colorSchemes = COLOR_SCHEMES
</script>

<style scoped>
.bottom-content {
  background-color: var(--bs-light);
  border-top: 1px solid var(--bs-border-color);
  padding: 1rem;
}

.nav-tabs {
  border-bottom: 1px solid var(--bs-border-color);
  margin-bottom: 1rem;
}

.nav-link {
  color: var(--bs-gray-600);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.nav-link.active {
  color: var(--bs-primary);
  border-bottom: 2px solid var(--bs-primary);
  background: none;
}

.tab-content {
  height: 300px;
  overflow: auto;
}
</style> 