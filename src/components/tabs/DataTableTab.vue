<template>
  <div class="h-100 d-flex flex-column">
    <!-- 數據表格內容 -->
    <div v-if="mergedTableData.length > 0" class="h-100 d-flex flex-column">
      <!-- 搜尋工具列 -->
      <div class="search-container">
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
      
      <!-- 表格容器 -->
      <div class="table-container flex-grow-1">
        <div class="table-responsive custom-scroll h-100">
          <table class="table table-sm table-dark table-striped table-hover">
            <thead>
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
            <tbody>
              <tr v-for="row in sortedAndFilteredTableData" :key="row.id" class="fade-in">
                <td>{{ row.id }}</td>
                <td>
                  <code class="text-info">{{ row.code2 || '-' }}</code>
                </td>
                <td>{{ row.name || '-' }}</td>
                <td>
                  <BadgeCount :count="row.count" />
                </td>
                <td>
                  <BadgeStatus :status="row.merged" />
                </td>
                <td>
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
    
    <!-- 空狀態 -->
    <EmptyState 
      v-else
      icon="table"
      title="暫無數據"
      description="請點擊「載入台南市數據」按鈕載入數據" />
  </div>
</template>

<script>
import { formatNumber } from '../../utils/utils.js'
import BadgeCount from '../common/BadgeCount.vue'
import BadgeStatus from '../common/BadgeStatus.vue'
import EmptyState from '../common/EmptyState.vue'

export default {
  name: 'DataTableTab',
  components: {
    BadgeCount,
    BadgeStatus,
    EmptyState
  },
  props: {
    mergedTableData: {
      type: Array,
      default: () => []
    },
    sortedAndFilteredTableData: {
      type: Array,
      default: () => []
    },
    tableSearchQuery: {
      type: String,
      default: ''
    },
    sortField: {
      type: String,
      default: ''
    },
    sortDirection: {
      type: String,
      default: 'asc'
    }
  },
  emits: [
    'update:tableSearchQuery',
    'sort-table',
    'highlight-on-map'
  ],
  setup(props) {
    /**
     * 取得排序圖標類別
     * @param {string} field - 欄位名稱
     * @returns {string} 圖標CSS類別
     */
    const getSortIcon = (field) => {
      if (props.sortField !== field) return 'fas fa-sort'
      return props.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
    }

    return {
      formatNumber,
      getSortIcon
    }
  }
}
</script> 