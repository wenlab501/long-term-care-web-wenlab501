<template>
  <div class="h-100 d-flex flex-column">
    <!-- 📊 數據表格內容 (Data Table Content) -->
    <div v-if="mergedTableData.length > 0" class="h-100 d-flex flex-column">
      <!-- 🔍 搜尋工具列 (Search Toolbar) -->
      <div class="search-container bg-light">
        <div class="d-flex justify-content-between align-items-center">

          <!-- <div class="my-font-size-sm p-2">
            {{ sortedAndFilteredTableData.length }}
            /
            {{ mergedTableData.length }}
          </div> -->

          <div class="my-font-size-sm p-2" style="width: 250px;">
            <input 
              type="text" 
              class="form-control form-control-sm" 
              :value="tableSearchQuery" 
              @input="$emit('update:tableSearchQuery', $event.target.value)"
              placeholder="搜尋">
          </div>
        </div>
      </div>
      
      <!-- 📋 表格容器 (Table Container) -->
      <div class="table-container flex-grow-1">
        <div class="table-responsive custom-scroll h-100">
          <table class="table table-sm table-hover mb-0">
            <thead class="table-light">
              <tr class="text-center">
                <th class="sortable" @click="$emit('sort-table', 'id')">
                  ID <i :class="getSortIcon('id')"></i>
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
            <tbody>
              <tr v-for="row in sortedAndFilteredTableData" :key="row.id" class="fade-in text-center">
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.count }}</td>
                <td>{{ row.merged }}</td>
                <td>
                  <button 
                    class="btn btn-outline-primary btn-sm" 
                    @click="$emit('highlight-on-map', row)" 
                    title="在地圖上高亮">
                    顯示位置
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 😔 空狀態 (Empty State) -->
    <div class="my-font-size-2xl text-center p-3">沒有資料</div>
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

export default {
  name: 'DataTableTab',

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
}

.search-container input.form-control {
  background-color: white;
  border-color: #ced4da;
  color: #495057;
}

.search-container input.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.search-container input.form-control::placeholder {
  color: #6c757d;
}

/* 📋 表格容器樣式 */
.table-container {
  background-color: white;
  overflow: hidden;
}

/* 📊 表格基礎樣式 */
.table {
  --bs-table-bg: white !important;
  --bs-table-color: #495057 !important;
  background-color: white !important;
  color: #495057 !important;
  margin-bottom: 0;
}

/* 📋 表格標題樣式 */
.table thead th {
  background-color: #f8f9fa !important;
  color: #495057 !important;
  border-color: #dee2e6 !important;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table thead th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.table thead th.sortable:hover {
  background-color: #e9ecef !important;
}

.table thead th.sortable i {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.7;
}

.table thead th.sortable:hover i {
  opacity: 1;
}

/* 📊 表格內容樣式 */
.table tbody td {
  background-color: white !important;
  color: #495057 !important;
  border-color: #dee2e6 !important;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

/* 📋 表格行懸停效果 */
.table tbody tr:hover td {
  background-color: #f8f9fa !important;
  cursor: pointer;
}

/* 🔘 按鈕樣式 */
.btn-outline-primary {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.btn-outline-primary:hover {
  transform: translateY(-1px);
}

/* 💾 程式碼標籤樣式 */
code.text-primary {
  font-size: 0.75rem;
  font-weight: 500;
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
    gap: 0.5rem;
  }
  
  .search-container > div {
    width: 100% !important;
  }
  
  .table {
    font-size: 0.75rem;
  }
  
  .table thead th,
  .table tbody td {
    padding: 0.25rem 0.5rem;
  }
}
</style> 