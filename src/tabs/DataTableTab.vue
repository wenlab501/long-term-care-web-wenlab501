<template>
  <!-- 📊 資料表格分頁組件 (Data Table Tab Component) -->
  <!-- 提供資料的表格化顯示、搜尋、排序和高亮功能 -->
  <div class="my-data-table-tab-component h-100 d-flex flex-column">
    
    <!-- 🔍 搜尋工具列 (Search Toolbar) -->
    <!-- 提供即時搜尋功能，可搜尋名稱、ID、數量等欄位 -->
    <div class="my-search-toolbar-container p-2 bg-light border-bottom">
      <input
        type="text"
        class="form-control form-control-sm"
        v-model="searchQuery"
        placeholder="搜尋名稱、ID、數量..."
      />
    </div>

    <!-- 📋 表格容器 (Table Container) -->
    <!-- 顯示過濾和排序後的資料，包含固定表頭和可捲動內容 -->
    <div v-if="filteredAndSortedData.length > 0" class="my-table-container flex-grow-1">
      <div class="table-responsive my-custom-scroll h-100">
        <table class="table table-sm table-hover table-striped mb-0">
          
          <!-- 📝 表格標題列 (Table Header) -->
          <!-- 固定在頂部的標題列，支援點擊排序功能 -->
          <thead class="table-light sticky-top">
            <tr class="text-center">
              <!-- 🔢 ID 欄位標題 (ID Column Header) -->
              <th @click="handleSort('id')" class="my-sortable">
                ID
                <i v-if="currentSortKey === 'id'" 
                   :class="currentSortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
              </th>
              <!-- 📝 名稱欄位標題 (Name Column Header) -->
              <th @click="handleSort('name')" class="my-sortable">
                名稱
                <i v-if="currentSortKey === 'name'" 
                   :class="currentSortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
              </th>
              <!-- 📊 數量欄位標題 (Count Column Header) -->
              <th @click="handleSort('count')" class="my-sortable">
                數量
                <i v-if="currentSortKey === 'count'" 
                   :class="currentSortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
              </th>
              <!-- 🔗 合併狀態欄位標題 (Merged Status Column Header) -->
              <th @click="handleSort('merged')" class="my-sortable">
                合併狀態 <i :class="getSortIcon('merged')"></i>
              </th>
              <!-- 🎛️ 操作欄位標題 (Actions Column Header) -->
              <th>操作</th>
            </tr>
          </thead>
          
          <!-- 📄 表格內容列 (Table Body) -->
          <!-- 顯示實際資料的可捲動區域 -->
          <tbody>
            <tr
              v-for="(item, index) in filteredAndSortedData"
              :key="item.id || item.name || index"
              class="text-center align-middle"
            >
              <!-- 🔢 ID 資料欄 (ID Data Column) -->
              <td>{{ item.id }}</td>
              <!-- 📝 名稱資料欄 (Name Data Column) -->
              <td>{{ item.name }}</td>
              <!-- 📊 數量資料欄 (Count Data Column) -->
              <td>{{ item.count }}</td>
              <!-- 🔗 合併狀態資料欄 (Merged Status Data Column) -->
              <td>{{ item.merged ? '是' : '否' }}</td>
              <!-- 🎛️ 操作按鈕欄 (Actions Button Column) -->
              <td>
                <button
                  class="btn btn-primary btn-sm py-0 px-1"
                  @click="handleHighlight(item)"
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

    <!-- 📭 空狀態顯示 (Empty State Display) -->
    <!-- 當沒有資料或搜尋無結果時的提示界面 -->
    <div v-else class="my-empty-state-container flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="text-center text-muted">
        <i class="fas fa-table fa-3x mb-3"></i>
        <!-- 🔍 搜尋無結果提示 (No Search Results Message) -->
        <p v-if="searchQuery">找不到符合搜尋「{{ searchQuery }}」的結果。</p>
        <!-- 📭 無資料提示 (No Data Message) -->
        <p v-else-if="!props.tableData || props.tableData.length === 0">目前沒有資料可顯示。請先載入數據。</p>
        <!-- 🔍 無符合條件資料提示 (No Matching Data Message) -->
        <p v-else>沒有符合目前篩選條件的資料。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 📊 DataTableTab.vue - 資料表格分頁組件
 * 
 * 功能說明：
 * 1. 📋 以表格形式顯示地理資料
 * 2. 🔍 提供即時搜尋功能，支援多欄位搜尋
 * 3. 📊 提供欄位排序功能，支援昇序和降序
 * 4. 🎯 提供地圖高亮顯示功能
 * 5. 📭 提供友善的空狀態顯示
 * 6. 📱 響應式設計，適應不同螢幕尺寸
 * 
 * 架構說明：
 * - 搜尋工具列：即時搜尋輸入框
 * - 表格區域：固定標題列 + 可捲動內容
 * - 空狀態：無資料時的友善提示
 * 
 * 設計理念：
 * - 使用 Vue 3 Composition API
 * - 響應式資料處理
 * - 可存取性友善的表格設計
 * - 直觀的排序和搜尋互動
 */

// 🔧 Vue Composition API 引入
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';

/**
 * 🔧 組件屬性定義 (Component Props)
 * 接收來自父組件的資料
 */
const props = defineProps({
  /** 📊 表格資料陣列，包含要顯示的所有資料項目 */
  tableData: {
    type: Array,
    required: true,
    default: () => []
  }
});

/**
 * 📡 組件事件定義 (Component Events)
 * 定義向父組件發送的事件
 */
const emit = defineEmits(['highlight-on-map']);

// 📊 響應式資料狀態 (Reactive Data State)
/** 🔍 搜尋查詢字串 */
const searchQuery = ref('');
/** 📊 當前排序欄位 */
const currentSortKey = ref('id'); // 預設按 ID 排序
/** 📊 當前排序方向 */
const currentSortOrder = ref('asc'); // 預設昇序排列

/**
 * 🎯 處理地圖高亮顯示 (Handle Map Highlighting)
 * 當用戶點擊「顯示位置」按鈕時觸發
 * 
 * @param {Object} item - 要高亮顯示的資料項目
 */
const handleHighlight = (item) => {
  console.log('準備高亮顯示:', { item })
  
  // 驗證資料項目是否存在
  if (!item) {
    console.warn('無法高亮顯示：資料為空')
    return
  }
  
  // 驗證名稱欄位是否存在
  if (!item.name) {
    console.warn('無法高亮顯示：名稱為空')
    return
  }
  
  console.log('發送高亮事件:', item.name)
  // 向父組件發送高亮事件
  emit('highlight-on-map', item.name)
}

/**
 * 🔍 過濾和排序資料計算屬性 (Filtered and Sorted Data Computed Property)
 * 根據搜尋查詢和排序設定處理原始資料
 */
const filteredAndSortedData = computed(() => {
  console.log('過濾數據:', { 
    hasData: !!props.tableData,
    dataLength: props.tableData?.length
  })
  
  // 如果沒有資料，返回空陣列
  if (!props.tableData) return []
  
  let filtered = props.tableData
  
  // 🔍 搜尋過濾邏輯 (Search Filtering Logic)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      // 在名稱、ID、數量欄位中搜尋
      const nameMatch = item.name?.toLowerCase().includes(query)
      const idMatch = String(item.id).includes(query)
      const countMatch = String(item.count).includes(query)
      return nameMatch || idMatch || countMatch
    })
  }
  
  // 📊 排序邏輯 (Sorting Logic)
  if (currentSortKey.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[currentSortKey.value]
      const bValue = b[currentSortKey.value]
      
      // 字串類型的比較
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return currentSortOrder.value === 'asc' 
          ? aValue.localeCompare(bValue)  // 昇序：A-Z
          : bValue.localeCompare(aValue)  // 降序：Z-A
      }
      
      // 數值類型的比較
      return currentSortOrder.value === 'asc'
        ? aValue - bValue  // 昇序：小到大
        : bValue - aValue  // 降序：大到小
    })
  }
  
  console.log('過濾後數據:', { 
    filteredLength: filtered.length,
    firstItem: filtered[0]
  })
  
  return filtered
})

/**
 * 📊 處理排序點擊 (Handle Sort Click)
 * 當用戶點擊表格標題時觸發排序
 * 
 * @param {string} key - 要排序的欄位名稱
 */
const handleSort = (key) => {
  if (currentSortKey.value === key) {
    // 如果點擊的是當前排序欄位，切換排序方向
    currentSortOrder.value = currentSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 如果點擊的是新欄位，設定為新的排序欄位並重設為昇序
    currentSortKey.value = key
    currentSortOrder.value = 'asc'
  }
}

/**
 * 🎨 取得排序圖示 (Get Sort Icon)
 * 根據當前排序狀態返回對應的 FontAwesome 圖示類別
 * 
 * @param {string} key - 欄位名稱
 * @returns {string} FontAwesome 圖示類別
 */
function getSortIcon(key) {
  if (currentSortKey.value !== key) {
    return 'fas fa-sort'; // 預設排序圖示
  }
  if (currentSortOrder.value === 'asc') {
    return 'fas fa-sort-up'; // 昇序排序圖示
  }
  return 'fas fa-sort-down'; // 降序排序圖示
}

/**
 * 🚀 組件掛載事件 (Component Mounted Event)
 * 記錄組件初始化狀態
 */
onMounted(() => {
  console.log('[DataTableTab] Component Mounted. Initial props.tableData count:', props.tableData?.length);
});
</script>

<style scoped>
/**
 * 🎨 資料表格分頁樣式 (Data Table Tab Styles)
 * 
 * 定義表格組件的視覺樣式，包含搜尋框、表格、滾動條等元素
 */

/* 📊 組件基礎樣式 (Component Base Styles) */
.my-data-table-tab-component {
  font-size: 0.875rem; /* 組件基礎字體大小 */
}

/* 🔍 搜尋工具列樣式 (Search Toolbar Styles) */
.my-search-toolbar-container input.form-control {
  background-color: white;           /* 白色背景 */
  border-color: #ced4da;            /* Bootstrap 標準邊框顏色 */
  color: #495057;                   /* Bootstrap 標準文字顏色 */
}

.my-search-toolbar-container input.form-control:focus {
  border-color: #007bff;            /* 聚焦時的主要藍色邊框 */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* 聚焦時的藍色陰影 */
}

.my-search-toolbar-container input.form-control::placeholder {
  color: #6c757d; /* 淡色的佔位符文字 */
}

/* 📋 表格容器樣式 (Table Container Styles) */
.my-table-container {
  overflow-y: auto; /* 允許表格內容垂直捲動 */
}

/* 📊 表格基礎樣式 (Table Base Styles) */
.table {
  --bs-table-bg: white;             /* 表格背景色 */
  --bs-table-color: #212529;        /* 深色文字，提升可讀性 */
  --bs-table-striped-bg: #f8f9fa;   /* 條紋列的淺灰色背景 */
  --bs-table-hover-bg: #e9ecef;     /* 懸停時的稍深背景色 */
}

/* 📝 表格標題樣式 (Table Header Styles) */
.table thead.sticky-top {
  position: sticky;           /* 固定定位 */
  top: 0;                    /* 固定在頂部 */
  z-index: 10;              /* 確保標題在捲動內容之上 */
  background-color: #f8f9fa; /* 標題的淺色背景 */
}

.table th {
  font-weight: 600;          /* 粗體標題文字 */
  text-transform: uppercase; /* 大寫轉換 */
  font-size: 0.75rem;       /* 較小的標題文字 */
  letter-spacing: 0.5px;    /* 字母間距 */
  vertical-align: middle;    /* 垂直居中對齊 */
  white-space: nowrap;       /* 防止標題文字換行 */
}

/* 📊 可排序標題樣式 (Sortable Header Styles) */
.table th.my-sortable {
  cursor: pointer;           /* 手型游標 */
  user-select: none;         /* 防止點擊時選取文字 */
}

.table th.my-sortable:hover {
  background-color: #e2e6ea; /* 懸停時的深色背景 */
}

.table th.my-sortable i {
  margin-left: 0.3em;        /* 圖示左邊距 */
  font-size: 0.9em;          /* 稍小的圖示尺寸 */
  opacity: 0.7;              /* 半透明圖示 */
}

.table th.my-sortable:hover i {
  opacity: 1;                /* 懸停時完全不透明 */
}

/* 📄 表格內容樣式 (Table Body Styles) */
.table td {
  font-size: 0.85rem;        /* 稍小的內容文字 */
  padding: 0.4rem 0.5rem;    /* 調整內邊距以獲得緊湊的列 */
  vertical-align: middle;     /* 垂直居中對齊 */
}

.table tbody tr:hover {
  background-color: var(--bs-table-hover-bg); /* 一致的懸停效果 */
}

/* 🎨 狀態顏色樣式 (Status Color Styles) */
.text-success { 
  color: #198754 !important; /* Bootstrap 成功綠色 */
}

.text-danger { 
  color: #dc3545 !important; /* Bootstrap 危險紅色 */
}

/* 📭 空狀態樣式 (Empty State Styles) */
.my-empty-state-container {
  background-color: #f8f9fa; /* 空狀態的淺色背景 */
}

.my-empty-state-container i {
  color: #adb5bd; /* 淡色圖示 */
}

.my-empty-state-container p {
  font-size: 0.95rem;        /* 空狀態訊息的字體大小 */
  color: #495057;            /* 稍深的空狀態訊息文字 */
}

/* 📱 自定義滾動條樣式 (Custom Scrollbar Styles) */
/* 適用於 WebKit 瀏覽器 (Chrome, Safari, Edge) */
.my-custom-scroll::-webkit-scrollbar {
  width: 8px;                /* 垂直滾動條寬度 */
  height: 8px;               /* 水平滾動條高度 */
}

.my-custom-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;       /* 滾動條軌道背景 */
  border-radius: 10px;       /* 圓角軌道 */
}

.my-custom-scroll::-webkit-scrollbar-thumb {
  background: #ced4da;       /* 滾動條滑塊顏色 */
  border-radius: 10px;       /* 圓角滑塊 */
}

.my-custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;       /* 懸停時的深色滑塊 */
}

/* 📱 響應式設計調整 (Responsive Design Adjustments) */
@media (max-width: 768px) {
  .my-data-table-tab-component {
    font-size: 0.8rem;        /* 在小螢幕上縮小字體 */
  }
  
  .table th {
    font-size: 0.7rem;        /* 在小螢幕上縮小標題字體 */
    padding: 0.3rem 0.4rem;   /* 在小螢幕上減少標題內邊距 */
  }
  
  .table td {
    font-size: 0.8rem;        /* 在小螢幕上縮小內容字體 */
    padding: 0.3rem 0.4rem;   /* 在小螢幕上減少內容內邊距 */
  }
  
  .btn-sm {
    font-size: 0.75rem;       /* 在小螢幕上縮小按鈕字體 */
    padding: 0.2rem 0.4rem;   /* 在小螢幕上減少按鈕內邊距 */
  }
  
  .my-custom-scroll::-webkit-scrollbar {
    width: 12px;              /* 在觸控設備上增加滾動條寬度 */
    height: 12px;
  }
}

/* 🎛️ 按鈕樣式調整 (Button Style Adjustments) */
.btn-primary.btn-sm {
  transition: all 0.2s ease; /* 平滑的按鈕效果轉換 */
}

.btn-primary.btn-sm:hover {
  transform: translateY(-1px); /* 懸停時輕微上移效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* 懸停時陰影效果 */
}
</style> 