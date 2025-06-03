<template>
  <div class="h-100 d-flex flex-column">
    <!-- 📊 數據表格內容 (Data Table Content) -->
    <div v-if="mergedTableData.length > 0" class="h-100 d-flex flex-column">
      <!-- 🔍 搜尋工具列 (Search Toolbar) -->
      <div class="search-container bg-secondary">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="text-white mb-0">
            <i class="fas fa-table"></i>
            合併數據表格 ({{ sortedAndFilteredTableData.length }}/{{ mergedTableData.length }} 筆)
          </h6>
          <div style="width: 250px;">
            <input 
              type="text" 
              class="form-control form-control-sm" 
              :value="tableSearchQuery" 
              @input="$emit('update:tableSearchQuery', $event.target.value)"
              placeholder="搜尋 Code2、Name 或 Count...">
          </div>
        </div>
      </div>
      
      <!-- 📋 表格容器 (Table Container) -->
      <div class="table-container flex-grow-1">
        <div class="table-responsive custom-scroll h-100">
          <table class="table table-sm table-dark table-striped table-hover mb-0">
            <thead class="table-header-dark">
              <tr>
                <th class="sortable" @click="$emit('sort-table', 'id')">
                  ID <i :class="getSortIcon('id')"></i>
                </th>
                <th class="sortable" @click="$emit('sort-table', 'code2')">
                  Code2 <i :class="getSortIcon('code2')"></i>
                </th>
                <th class="sortable" @click="$emit('sort-table', 'name')">
                  Name <i :class="getSortIcon('name')"></i>
                </th>
                <th class="sortable" @click="$emit('sort-table', 'count')">
                  Count <i :class="getSortIcon('count')"></i>
                </th>
                <th class="sortable" @click="$emit('sort-table', 'merged')">
                  合併狀態 <i :class="getSortIcon('merged')"></i>
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody class="table-body-dark">
              <tr v-for="row in sortedAndFilteredTableData" :key="row.id" class="fade-in table-row-hover">
                <td class="text-center">{{ row.id }}</td>
                <td>
                  <code class="text-info bg-dark px-1 rounded">{{ row.code2 || '-' }}</code>
                </td>
                <td class="text-light">{{ row.name || '-' }}</td>
                <td class="text-center">
                  <BadgeCount :count="row.count" />
                </td>
                <td class="text-center">
                  <BadgeStatus :status="row.merged" />
                </td>
                <td class="text-center">
                  <button 
                    class="btn btn-outline-light btn-sm" 
                    @click="$emit('highlight-on-map', row)" 
                    title="在地圖上高亮">
                    <i class="fas fa-map-marker-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 😔 空狀態 (Empty State) -->
    <EmptyState 
      v-else
      icon="table"
      title="暫無數據"
      description="請點擊「載入台南市數據」按鈕載入數據" />
  </div>
</template>

<script>
/**
 * 📋 DataTableTab.vue - 數據表格標籤組件
 * 
 * 功能說明：
 * 1. 📊 顯示合併後的台南數據表格
 * 2. 🔍 提供搜尋和排序功能
 * 3. 🎯 支援地圖高亮聯動
 * 4. 🏷️ 顯示數據徽章和狀態
 * 5. 📱 響應式設計支援
 */
import { formatNumber } from '../../utils/utils.js'
import BadgeCount from '../common/BadgeCount.vue'
import BadgeStatus from '../common/BadgeStatus.vue'
import EmptyState from '../common/EmptyState.vue'

export default {
  name: 'DataTableTab',
  
  /**
   * 🧩 組件註冊 (Component Registration)
   */
  components: {
    BadgeCount,
    BadgeStatus,
    EmptyState
  },
  
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
    
    /** 📋 排序和篩選後的表格數據 */
    sortedAndFilteredTableData: {
      type: Array,
      default: () => [],
      required: true
    },
    
    /** 🔍 表格搜尋關鍵字 */
    tableSearchQuery: {
      type: String,
      default: '',
      required: true
    },
    
    /** 📊 排序欄位 */
    sortField: {
      type: String,
      default: '',
      required: true
    },
    
    /** 📊 排序方向 */
    sortDirection: {
      type: String,
      default: 'asc',
      required: true
    }
  },
  
  /**
   * 📡 組件事件定義 (Component Events)
   */
  emits: [
    'update:tableSearchQuery',
    'sort-table',
    'highlight-on-map'
  ],
  
  /**
   * 🔧 組件設定函數 (Component Setup)
   */
  setup(props) {
    /**
     * 🔄 取得排序圖標類別 (Get Sort Icon Class)
     * @param {string} field - 欄位名稱
     * @returns {string} 圖標CSS類別
     */
    const getSortIcon = (field) => {
      if (props.sortField !== field) return 'fas fa-sort'
      return props.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
    }

    // 📤 返回數據和方法 (Return Data and Methods)
    return {
      formatNumber,
      getSortIcon
    }
  }
}
</script>

<style scoped>
/**
 * 🎨 數據表格樣式 (Data Table Styles)
 */

/* 🔍 搜尋容器樣式 */
.search-container {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--secondary-dark) !important;
}

.search-container input.form-control {
  background-color: var(--input-bg);
  border-color: var(--input-border);
  color: var(--text-primary);
}

.search-container input.form-control:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.search-container input.form-control::placeholder {
  color: var(--input-placeholder);
}

/* 📋 表格容器樣式 */
.table-container {
  background-color: var(--secondary-dark);
  overflow: hidden;
}

/* 📊 表格基礎樣式 */
.table-dark {
  --bs-table-bg: var(--secondary-dark) !important;
  --bs-table-color: var(--text-light) !important;
  background-color: var(--secondary-dark) !important;
  color: var(--text-light) !important;
  margin-bottom: 0;
}

/* 📋 表格標題樣式 */
.table-header-dark th {
  background-color: var(--secondary-dark) !important;
  color: var(--text-light) !important;
  border-color: var(--border-color) !important;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  font-size: var(--font-size-xs);
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
}

.table-header-dark th.sortable {
  cursor: pointer;
  user-select: none;
  transition: var(--transition-base);
}

.table-header-dark th.sortable:hover {
  background-color: var(--secondary-hover) !important;
}

.table-header-dark th.sortable i {
  margin-left: var(--spacing-2);
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

.table-header-dark th.sortable:hover i {
  opacity: 1;
}

/* 📊 表格內容樣式 */
.table-body-dark td {
  background-color: var(--secondary-dark) !important;
  color: var(--text-light) !important;
  border-color: rgba(255,255,255,0.1) !important;
  font-size: var(--font-size-small);
  padding: var(--spacing-2) var(--spacing-3);
}

/* 📋 表格行懸停效果 */
.table-row-hover:hover td {
  background-color: var(--bg-overlay-light) !important;
  cursor: pointer;
}

/* 🎨 斑馬條紋效果 */
.table-striped > tbody > tr:nth-of-type(odd) > td {
  --bs-table-accent-bg: rgba(255,255,255,0.05) !important;
  background-color: rgba(255,255,255,0.05) !important;
}

/* 🔘 按鈕樣式 */
.btn-outline-light {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  transition: var(--transition-base);
}

.btn-outline-light:hover {
  background-color: var(--text-light);
  color: var(--secondary-dark);
  transform: translateY(-1px);
}

/* 💾 程式碼標籤樣式 */
code.text-info {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* 🎬 淡入動畫 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 📱 響應式調整 */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    gap: var(--spacing-2);
  }
  
  .search-container > div {
    width: 100% !important;
  }
  
  .table-dark {
    font-size: var(--font-size-xs);
  }
  
  .table-header-dark th,
  .table-body-dark td {
    padding: var(--spacing-1) var(--spacing-2);
  }
}
</style> 