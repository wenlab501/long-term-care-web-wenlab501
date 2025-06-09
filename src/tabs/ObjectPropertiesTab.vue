<template>
  <!-- 📋 物件屬性分頁組件 (Object Properties Tab Component) -->
  <!-- 顯示地圖上選中物件的詳細屬性資訊 -->
  <div class="object-properties-tab">
    
    <!-- 📊 有選中物件時的屬性顯示區域 (Properties Display Area When Object Selected) -->
    <div v-if="selectedFeature" class="properties-content">
      <div class="mb-3">
        <!-- 📝 屬性標題 (Properties Title) -->
        <h6 class="text-primary mb-2">物件屬性</h6>
        
        <!-- 📋 屬性列表顯示 (Properties List Display) -->
        <!-- 當物件有屬性資料時，遍歷顯示所有屬性 -->
        <template v-if="hasProperties">
          <DetailItem
            v-for="(value, key) in selectedFeature.properties"
            :key="key"
            :label="formatLabel(key)"
            :value="formatValue(value)"
          />
        </template>
        
        <!-- 🚫 無屬性資料時的提示 (No Properties Data Message) -->
        <div v-else class="text-muted">
          此物件沒有屬性資料
        </div>
      </div>
    </div>
    
    <!-- 🔍 未選中物件時的提示訊息 (No Object Selected Message) -->
    <div v-else class="text-muted text-center p-3">
      請點擊地圖上的物件以查看其屬性
    </div>
  </div>
</template>

<script>
/**
 * 📋 ObjectPropertiesTab.vue - 物件屬性分頁組件
 * 
 * 功能說明：
 * 1. 📊 顯示地圖上選中物件的詳細屬性資訊
 * 2. 🔄 與 Pinia store 整合，響應選中物件的變化
 * 3. 📝 提供屬性名稱的本地化顯示
 * 4. 🎨 格式化屬性值，提升可讀性
 * 5. 🚫 處理無選中物件或無屬性的情況
 * 
 * 架構說明：
 * - 狀態管理：從 Pinia store 獲取選中物件
 * - 資料處理：格式化屬性名稱和數值
 * - 視圖渲染：使用 DetailItem 組件顯示屬性
 * 
 * 設計理念：
 * - 響應式設計，自動更新選中物件資訊
 * - 用戶友好的屬性名稱顯示
 * - 清晰的視覺層次和資訊組織
 */

// 🧩 組件引入
import DetailItem from '../components/common/DetailItem.vue'
// 📦 Pinia 狀態管理引入
import { useDataStore } from '../stores/dataStore'
// 🔧 Vue Composition API 引入
import { computed } from 'vue'

export default {
  name: 'ObjectPropertiesTab',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   * 註冊物件屬性分頁內使用的子組件
   */
  components: {
    DetailItem    // 詳細資訊項目組件
  },
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   * 使用 Composition API 設定組件邏輯
   */
  setup() {
    // 📦 取得 Pinia 數據存儲實例
    const dataStore = useDataStore()
    
    /**
     * 📊 選中物件計算屬性 (Selected Feature Computed Property)
     * 從 Pinia store 獲取當前選中的地圖物件
     * 提供響應式的選中物件數據
     */
    const selectedFeature = computed(() => dataStore.selectedFeature)
    
    /**
     * 📋 是否有屬性計算屬性 (Has Properties Computed Property)
     * 檢查選中物件是否包含有效的屬性資料
     * 
     * @returns {boolean} 是否有屬性資料
     */
    const hasProperties = computed(() => {
      return !!selectedFeature.value?.properties && 
             Object.keys(selectedFeature.value.properties).length > 0
    })

    // 📤 返回響應式數據給模板使用
    return {
      selectedFeature,    // 選中物件
      hasProperties       // 是否有屬性
    }
  },
  
  /**
   * 🛠️ 組件方法定義 (Component Methods)
   * 定義資料格式化和處理方法
   */
  methods: {
    /**
     * 📝 格式化屬性標籤 (Format Property Label)
     * 將英文屬性名稱轉換為中文顯示名稱
     * 
     * @param {string} key - 原始屬性名稱
     * @returns {string} 格式化後的顯示名稱
     */
    formatLabel(key) {
      // 屬性名稱對照表，提供中文化顯示
      const labelMap = {
        'PTVNAME': '區域名稱',
        '中位數': '中位數',
        'name': '名稱',
        'count': '數量',
        'area': '面積',
        'population': '人口',
        'density': '密度'
      }
      return labelMap[key] || key
    },
    
    /**
     * 🎨 格式化屬性值 (Format Property Value)
     * 根據值的類型進行適當的格式化處理
     * 
     * @param {any} value - 原始屬性值
     * @returns {string} 格式化後的顯示值
     */
    formatValue(value) {
      // 數字類型：添加千分位分隔符
      if (typeof value === 'number') {
        return value.toLocaleString()
      }
      // 其他類型：直接返回
      return value
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 物件屬性分頁樣式 (Object Properties Tab Styles)
 * 
 * 定義物件屬性分頁的視覺樣式和佈局
 */

/* 📋 分頁容器基礎樣式 (Tab Container Base Styles) */
.object-properties-tab {
  height: 100%;           /* 佔滿容器高度 */
  overflow-y: auto;       /* 內容溢出時可垂直滾動 */
}

/* 📊 屬性內容區域樣式 (Properties Content Area Styles) */
.properties-content {
  padding: 1rem;          /* 內邊距，提供適當的留白 */
}

/* 📝 屬性標題樣式 (Properties Title Styles) */
.properties-content h6 {
  border-bottom: 1px solid #dee2e6; /* 底部分隔線 */
  padding-bottom: 0.5rem;            /* 底部內邊距 */
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  .properties-content {
    padding: 0.75rem;     /* 在小螢幕上減少內邊距 */
  }
  
  .properties-content h6 {
    font-size: 1rem;      /* 在小螢幕上調整標題字體大小 */
  }
}
</style> 