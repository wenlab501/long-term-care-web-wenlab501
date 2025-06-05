<template>
  <div class="data-table-tab-component h-100 d-flex flex-column">
    <!-- Search Toolbar -->
    <div class="search-toolbar-container p-2 bg-light border-bottom">
      <input
        type="text"
        class="form-control form-control-sm"
        v-model="searchQuery"
        placeholder="搜尋名稱、ID、數量..."
      />
    </div>

    <!-- Table Container -->
    <div v-if="filteredAndSortedData.length > 0" class="table-container flex-grow-1">
      <div class="table-responsive custom-scroll h-100">
        <table class="table table-sm table-hover table-striped mb-0">
          <thead class="table-light sticky-top">
            <tr class="text-center">
              <th @click="sortTable('id')" class="sortable-header">
                ID <i :class="getSortIcon('id')"></i>
              </th>
              <th @click="sortTable('name')" class="sortable-header">
                名稱 <i :class="getSortIcon('name')"></i>
              </th>
              <th @click="sortTable('count')" class="sortable-header">
                數量 <i :class="getSortIcon('count')"></i>
              </th>
              <th @click="sortTable('merged')" class="sortable-header">
                合併狀態 <i :class="getSortIcon('merged')"></i>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredAndSortedData"
              :key="item.id || item.code2 || index"
              class="text-center align-middle"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.count }}</td>
              <td>{{ item.merged ? '是' : '否' }}</td>
              <td>
                <button
                  class="btn btn-primary btn-sm py-0 px-1"
                  @click="$emit('highlight-on-map', item)"
                  title="在地圖上高亮顯示"
                >
                  顯示位置
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state-container flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="text-center text-muted">
        <i class="fas fa-table fa-3x mb-3"></i>
        <p v-if="searchQuery">找不到符合搜尋「{{ searchQuery }}」的結果。</p>
        <p v-else-if="!props.tableData || props.tableData.length === 0">目前沒有資料可顯示。請先載入數據。</p>
        <p v-else>沒有符合目前篩選條件的資料。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
    default: () => []
  }
});

defineEmits(['highlight-on-map']);

const searchQuery = ref('');
const currentSortKey = ref('id'); // Default sort key
const currentSortOrder = ref('asc'); // Default sort order

const filteredAndSortedData = computed(() => {
  if (!props.tableData || !Array.isArray(props.tableData)) {
    console.warn('[DataTableTab] tableData is not a valid array. Returning empty.', props.tableData);
    return [];
  }

  let data = [...props.tableData];

  // Filter data
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    if (query) {
      data = data.filter(item => {
        const nameMatch = item.name && String(item.name).toLowerCase().includes(query);
        const idMatch = item.id && String(item.id).toLowerCase().includes(query);
        const code2Match = item.code2 && String(item.code2).toLowerCase().includes(query);
        const countMatch = item.count !== undefined && item.count !== null && String(item.count).toLowerCase().includes(query);
        return nameMatch || idMatch || code2Match || countMatch;
      });
    }
  }

  // Sort data
  if (currentSortKey.value) {
    data.sort((a, b) => {
      let valA = a[currentSortKey.value];
      let valB = b[currentSortKey.value];

      // Handle undefined or null values by treating them as smaller
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';
      
      // Convert numbers to strings for consistent comparison if one is string and other is number,
      // or use numeric comparison if both are numbers.
      const isValANumber = typeof valA === 'number';
      const isValBNumber = typeof valB === 'number';

      if (isValANumber && isValBNumber) {
        // Numeric sort
        return currentSortOrder.value === 'asc' ? valA - valB : valB - valA;
      } else {
        // String sort (case-insensitive)
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA < valB) return currentSortOrder.value === 'asc' ? -1 : 1;
        if (valA > valB) return currentSortOrder.value === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }
  return data;
});

function sortTable(key) {
  if (currentSortKey.value === key) {
    currentSortOrder.value = currentSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortKey.value = key;
    currentSortOrder.value = 'asc';
  }
}

function getSortIcon(key) {
  if (currentSortKey.value !== key) {
    return 'fas fa-sort'; // Default sort icon
  }
  if (currentSortOrder.value === 'asc') {
    return 'fas fa-sort-up'; // Ascending sort icon
  }
  return 'fas fa-sort-down'; // Descending sort icon
}

onMounted(() => {
  console.log('[DataTableTab] Component Mounted. Initial props.tableData count:', props.tableData?.length);
});

</script>

<style scoped>
.data-table-tab-component {
  font-size: 0.875rem; /* Base font size for the component */
}

.search-toolbar-container input.form-control {
  background-color: white;
  border-color: #ced4da; /* Standard Bootstrap border color */
  color: #495057; /* Standard Bootstrap text color */
}
.search-toolbar-container input.form-control:focus {
  border-color: #007bff; /* Primary color focus */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Primary color shadow */
}
.search-toolbar-container input.form-control::placeholder {
  color: #6c757d; /* Muted placeholder text */
}

.table-container {
  overflow-y: auto; /* Allows vertical scrolling for the table body */
}

.table {
  --bs-table-bg: white;
  --bs-table-color: #212529; /* Darker text for better readability */
  --bs-table-striped-bg: #f8f9fa; /* Light gray for striped rows */
  --bs-table-hover-bg: #e9ecef; /* Slightly darker hover */
}

.table thead.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10; /* Ensures header stays above scrolling content */
  background-color: #f8f9fa; /* Light background for header */
}

.table th {
  font-weight: 600; /* Bolder header text */
  text-transform: uppercase;
  font-size: 0.75rem; /* Smaller header text */
  letter-spacing: 0.5px;
  vertical-align: middle;
  white-space: nowrap; /* Prevent header text wrapping */
}

.table th.sortable-header {
  cursor: pointer;
  user-select: none; /* Prevent text selection on click */
}
.table th.sortable-header:hover {
  background-color: #e2e6ea; /* Darker hover for sortable headers */
}
.table th.sortable-header i {
  margin-left: 0.3em;
  font-size: 0.9em; /* Slightly smaller icons */
  opacity: 0.7;
}
.table th.sortable-header:hover i {
  opacity: 1;
}

.table td {
  font-size: 0.85rem; /* Slightly smaller body text */
  padding: 0.4rem 0.5rem; /* Adjust padding for tighter rows */
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: var(--bs-table-hover-bg); /* Consistent hover effect */
}

.text-success { color: #198754 !important; } /* Bootstrap success green */
.text-danger { color: #dc3545 !important; } /* Bootstrap danger red */

.empty-state-container {
  background-color: #f8f9fa; /* Light background for empty state */
}
.empty-state-container i {
  color: #adb5bd; /* Muted icon color */
}
.empty-state-container p {
  font-size: 0.95rem;
  color: #495057; /* Slightly darker text for empty state message */
}

/* Custom Scrollbar (optional, for WebKit browsers) */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #ced4da; /* Scrollbar thumb color */
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #adb5bd; /* Darker on hover */
}
</style> 