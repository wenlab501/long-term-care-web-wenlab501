<template>
  <!-- 📋 底部面板組件 (Bottom Panel Component) -->
  <!-- 提供資料表格顯示和地圖樣式控制功能 -->
  <div class="bg-white text-dark border-top" :style="{ height: bottomPanelHeight + 'px' }">
    
    <!-- 🔗 底部分頁導航 (Bottom Tab Navigation) -->
    <!-- 提供資料表格和地圖樣式兩個分頁的切換功能 -->
    <div class="bg-light">
      <ul class="nav nav-tabs nav-fill small">
        <!-- 📊 資料表格分頁標籤 (Data Table Tab) -->
        <li class="nav-item">
          <button 
            class="nav-link text-dark border-0"
            :class="{ 'active bg-white text-primary fw-bold': activeBottomTab === 'table' }"
            @click="$emit('update:activeBottomTab', 'table')">
            數據表格
          </button>
        </li>
        <!-- 🎨 地圖樣式分頁標籤 (Map Style Tab) -->
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
    
    <!-- 📄 底部分頁內容區域 (Bottom Tab Content Area) -->
    <!-- 根據選中的分頁顯示對應的內容組件 -->
    <div ref="bottomTabContentRef" class="tab-content h-100 overflow-auto">
      
      <!-- 📊 資料表格分頁內容 (Data Table Tab Content) -->
      <!-- 顯示載入的地理資料，支援搜尋、排序、高亮等功能 -->
      <div v-show="activeBottomTab === 'table'" class="h-100">
        <DataTableTab
          :tableData="tableData"
          @highlight-on-map="$emit('highlight-on-map', $event)"
        />
      </div>
      
      <!-- 🎨 地圖樣式設定分頁內容 (Map Style Configuration Tab Content) -->
      <!-- 提供色票方案、邊框顏色、邊框粗細等樣式控制選項 -->
      <div v-show="activeBottomTab === 'style'" class="container-fluid2">
        <div class="row p-3">
          
          <!-- 🎨 色票方案選擇器 (Color Scheme Selector) -->
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
          
          <!-- 🖌️ 邊框顏色選擇器 (Border Color Selector) -->
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
          
          <!-- 📏 邊框粗細選擇器 (Border Weight Selector) -->
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
/**
 * 📋 BottomPanel.vue - 底部面板組件
 * 
 * 功能說明：
 * 1. 📊 提供資料表格的顯示和互動功能
 * 2. 🎨 提供地圖樣式的配置控制界面
 * 3. 🔗 管理底部面板的分頁切換
 * 4. 📡 處理高亮顯示事件的轉發
 * 5. 🛠️ 響應拖曳狀態，調整滑鼠事件處理
 * 
 * 架構說明：
 * - 分頁導航：資料表格、地圖樣式兩個分頁
 * - 內容區域：根據作用中分頁顯示對應組件
 * - 控制選項：色票方案、邊框樣式等設定
 * 
 * 設計理念：
 * - 使用傳統 Options API 結構
 * - 響應式分頁系統
 * - 統一的樣式控制界面
 * - 防止拖曳時的事件衝突
 */

// 🔧 Vue Composition API 引入
import { computed, ref, watch, nextTick } from 'vue'
// 🧩 子組件引入
import DataTableTab from '../tabs/DataTableTab.vue'
// 📦 色票方案配置引入
import { COLOR_SCHEMES } from '../utils/dataProcessor.js'

export default {
  name: 'BottomPanel',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   * 註冊底部面板內使用的子組件
   */
  components: {
    DataTableTab,    // 資料表格分頁組件
  },
  
  /**
   * 🔧 組件屬性定義 (Component Props)
   * 接收來自父組件的配置和狀態數據
   */
  props: {
    /** 🔗 當前作用中的底部分頁標籤 */
    activeBottomTab: { 
      type: String, 
      default: 'table' 
    },
    /** 📏 底部面板高度 (像素) */
    bottomPanelHeight: { 
      type: Number, 
      default: 300 
    },
    /** 📊 表格資料陣列 */
    tableData: { 
      type: Array, 
      default: () => [] 
    },
    /** 🎨 選定的色票方案 ID */
    selectedColorScheme: { 
      type: String, 
      default: 'viridis' 
    },
    /** 🖌️ 選定的邊框顏色 (十六進位色碼) */
    selectedBorderColor: { 
      type: String, 
      default: '#666666' 
    },
    /** 📏 選定的邊框粗細 (像素) */
    selectedBorderWeight: { 
      type: Number, 
      default: 1 
    },
    /** 🛠️ 是否正在拖曳面板 (影響滑鼠事件處理) */
    isPanelDragging: { 
      type: Boolean, 
      default: false 
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   * 定義向父組件發送的事件類型
   */
  emits: [
    'update:activeBottomTab',      // 更新作用中底部分頁
    'highlight-on-map',            // 在地圖上高亮顯示
    'update:selectedColorScheme',  // 更新選定色票方案
    'update:selectedBorderColor',  // 更新選定邊框顏色
    'update:selectedBorderWeight', // 更新選定邊框粗細
    'reset-view'                   // 重設視圖
  ],
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   * 使用 Composition API 設定組件邏輯
   */
  setup(props) {
    /**
     * 🎨 應用程式色票方案計算屬性 (App Color Schemes Computed Property)
     * 從工具模組載入所有可用的色票方案配置
     */
    const appColorSchemes = computed(() => COLOR_SCHEMES)
    
    /**
     * 📚 底部分頁內容容器引用 (Bottom Tab Content Container Reference)
     * 用於控制拖曳時的滑鼠事件處理
     */
    const bottomTabContentRef = ref(null)

    /**
     * 👀 監聽拖曳狀態變化 (Watch Dragging State Changes)
     * 當面板正在拖曳時，禁用底部內容的滑鼠事件，防止衝突
     */
    watch(() => props.isPanelDragging, (dragging) => {
      nextTick(() => {
        if (bottomTabContentRef.value) {
          // 拖曳時禁用滑鼠事件，拖曳結束時恢復
          bottomTabContentRef.value.style.pointerEvents = dragging ? 'none' : 'auto';
        }
      });
    }, { immediate: true }); // immediate: true 表示立即執行一次

    // 📤 返回響應式數據和函數給模板使用
    return {
      appColorSchemes,       // 色票方案配置
      bottomTabContentRef    // 內容容器引用
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 底部面板樣式 (Bottom Panel Styles)
 * 
 * 定義底部面板的視覺樣式，包含分頁導航、內容區域、表單控制項等
 */

/* 📋 面板基礎樣式 (Panel Base Styles) */
.bg-white {
  background-color: #ffffff !important; /* 白色背景 */
}

.border-top {
  border-top: 1px solid #dee2e6 !important; /* 上邊框分隔線 */
}

/* 🔗 分頁導航樣式 (Tab Navigation Styles) */
.nav-tabs {
  border-bottom: 1px solid #dee2e6; /* 分頁底部邊框 */
  margin-bottom: 0; /* 移除預設下邊距 */
}

.nav-link {
  transition: all 0.2s ease; /* 平滑的狀態轉換 */
  padding: 0.5rem 1rem;      /* 適中的內邊距 */
  border: none;              /* 移除預設邊框 */
}

.nav-link:hover {
  background-color: #f8f9fa; /* 懸停時的背景色 */
  color: #495057;            /* 懸停時的文字顏色 */
}

.nav-link.active {
  background-color: #ffffff; /* 作用中分頁的背景色 */
  border-bottom: 2px solid #007bff; /* 作用中分頁的底部邊框 */
  font-weight: 600;          /* 作用中分頁的文字粗細 */
}

/* 📄 分頁內容區域樣式 (Tab Content Area Styles) */
.tab-content {
  background-color: #ffffff; /* 內容區域背景色 */
  min-height: 0;             /* 確保內容區域可以正確縮放 */
}

.tab-content.overflow-auto {
  scrollbar-width: thin;                    /* Firefox 細滾動條 */
  scrollbar-color: #c1c1c1 transparent;    /* Firefox 滾動條顏色 */
}

/* WebKit 瀏覽器 (Chrome, Safari, Edge) 滾動條樣式 */
.tab-content.overflow-auto::-webkit-scrollbar {
  width: 8px;  /* 垂直滾動條寬度 */
  height: 8px; /* 水平滾動條高度 */
}

.tab-content.overflow-auto::-webkit-scrollbar-track {
  background: transparent; /* 透明軌道背景 */
}

.tab-content.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #c1c1c1; /* 滾動條滑塊顏色 */
  border-radius: 4px;        /* 圓角滑塊 */
}

.tab-content.overflow-auto::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1; /* 懸停時的滑塊顏色 */
}

/* 🎨 表單控制項樣式 (Form Controls Styles) */
.form-label {
  font-weight: 500;   /* 中等字重 */
  color: #374151;     /* 深灰色文字 */
  margin-bottom: 0.5rem; /* 標籤下邊距 */
}

.form-select {
  transition: all 0.2s ease; /* 平滑的狀態轉換 */
  border: 1px solid #d1d5db; /* 邊框顏色 */
}

.form-select:focus {
  border-color: #007bff;      /* 聚焦時的邊框顏色 */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* 聚焦時的陰影 */
}

.form-select:hover {
  border-color: #6b7280; /* 懸停時的邊框顏色 */
}

/* 🎨 色票方案預覽樣式 (Color Scheme Preview Styles) */
.color-scheme-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  display: inline-block;
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  .nav-tabs {
    font-size: 0.875rem; /* 在小螢幕上縮小字體 */
  }
  
  .nav-link {
    padding: 0.375rem 0.75rem; /* 在小螢幕上減少內邊距 */
  }
  
  .col-md-4 {
    margin-bottom: 1rem; /* 在小螢幕上增加下邊距 */
  }
  
  .form-select {
    font-size: 0.875rem; /* 在小螢幕上縮小表單字體 */
  }
  
  .tab-content.overflow-auto::-webkit-scrollbar {
    width: 12px;  /* 在觸控設備上增加滾動條寬度 */
    height: 12px;
  }
}

/* 🎨 容器調整 (Container Adjustments) */
.container-fluid2 {
  padding: 0; /* 移除預設內邊距 */
}

.row {
  margin: 0; /* 移除預設外邊距 */
}

/* 🔧 工具提示樣式 (Tooltip Styles) */
.form-label.small {
  font-size: 0.875rem; /* 小號標籤字體 */
}

.fw-medium {
  font-weight: 500 !important; /* 中等字重 */
}
</style> 