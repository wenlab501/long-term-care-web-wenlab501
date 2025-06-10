<template>
  <!-- 📊 多圖層資料表格分頁組件 (Multi-Layer Data Table Tab Component) -->
  <!-- 為每個開啟的圖層提供獨立的表格分頁 -->
  <div class="my-data-table-tab-component h-100 d-flex flex-column">
    <!-- 🔍 全域搜尋工具列 (Global Search Toolbar) -->
    <!-- 提供跨圖層的即時搜尋功能 -->
    <div class="my-search-toolbar-container p-2 bg-light border-bottom">
      <input
        type="text"
        class="form-control form-control-sm"
        v-model="globalSearchQuery"
        placeholder="搜尋所有圖層的名稱、ID、數量..."
      />
    </div>

    <!-- 📑 圖層分頁導航 (Layer Tabs Navigation) -->
    <!-- 顯示所有開啟圖層的分頁 -->
    <div v-if="visibleLayers.length > 0" class="layer-tabs-nav bg-white border-bottom">
      <ul class="nav nav-tabs nav-fill small">
        <li v-for="layer in visibleLayers" :key="layer.id" class="nav-item">
          <button
            class="nav-link text-dark border-0 px-2 py-1"
            :class="{
              'active bg-primary text-white': activeLayerTab === layer.id,
              'bg-light': activeLayerTab !== layer.id,
            }"
            @click="setActiveLayerTab(layer.id)"
            :title="`顯示 ${layer.name} 的表格資料`"
          >
            <span class="layer-tab-name">{{ layer.name }}</span>
            <span class="badge bg-secondary ms-1" v-if="getLayerDataCount(layer)">
              {{ getLayerDataCount(layer) }}
            </span>
          </button>
        </li>
      </ul>
    </div>

    <!-- 📋 圖層表格內容區域 (Layer Table Content Area) -->
    <!-- 顯示當前選中圖層的表格資料 -->
    <div v-if="visibleLayers.length > 0" class="flex-grow-1 overflow-hidden">
      <!-- 📊 當前圖層的表格 (Current Layer Table) -->
      <div
        v-for="layer in visibleLayers"
        :key="layer.id"
        v-show="activeLayerTab === layer.id"
        class="h-100"
      >
        <!-- 🔄 載入中狀態 (Loading State) -->
        <div v-if="layer.isLoading" class="h-100 d-flex align-items-center justify-content-center">
          <div class="text-center">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
            <p class="text-muted">正在載入 {{ layer.name }} 的資料...</p>
          </div>
        </div>

        <!-- 📋 表格內容 (Table Content) -->
        <div
          v-else-if="layer.isLoaded && getFilteredData(layer).length > 0"
          class="h-100 d-flex flex-column"
        >
          <!-- 📊 圖層統計資訊 (Layer Statistics) -->
          <div class="layer-stats-bar bg-light px-3 py-2 border-bottom">
            <div class="row align-items-center small">
              <div class="col-auto">
                <strong>{{ layer.name }}</strong>
              </div>
              <div class="col-auto text-muted">總計: {{ getLayerDataCount(layer) }} 筆</div>
              <div class="col-auto text-muted" v-if="globalSearchQuery">
                搜尋結果: {{ getFilteredData(layer).length }} 筆
              </div>
            </div>
          </div>

          <!-- 📋 實際表格 (Actual Table) -->
          <div class="table-container flex-grow-1 overflow-auto">
            <table class="table table-sm table-hover table-striped mb-0">
              <!-- 📝 表格標題列 (Table Header) -->
              <thead class="table-light sticky-top">
                <tr class="text-center">
                  <!-- 🔢 ID 欄位標題 -->
                  <th @click="handleSort(layer.id, 'id')" class="my-sortable">
                    ID
                    <i v-if="getSortIcon(layer.id, 'id')" :class="getSortIcon(layer.id, 'id')"></i>
                  </th>
                  <!-- 📝 名稱欄位標題 -->
                  <th @click="handleSort(layer.id, 'name')" class="my-sortable">
                    名稱
                    <i
                      v-if="getSortIcon(layer.id, 'name')"
                      :class="getSortIcon(layer.id, 'name')"
                    ></i>
                  </th>
                  <!-- 📊 數量欄位標題 -->
                  <th @click="handleSort(layer.id, 'count')" class="my-sortable">
                    數量
                    <i
                      v-if="getSortIcon(layer.id, 'count')"
                      :class="getSortIcon(layer.id, 'count')"
                    ></i>
                  </th>
                  <!-- 🎛️ 操作欄位標題 -->
                  <th>操作</th>
                </tr>
              </thead>

              <!-- 📄 表格內容列 -->
              <tbody>
                <tr
                  v-for="(item, index) in getSortedData(layer)"
                  :key="item.id || item.name || index"
                  class="text-center align-middle"
                >
                  <!-- 🔢 ID 資料欄 -->
                  <td>{{ item.id }}</td>
                  <!-- 📝 名稱資料欄 -->
                  <td>{{ item.name }}</td>
                  <!-- 📊 數量資料欄 -->
                  <td>{{ formatValue(item.count) }}</td>
                  <!-- 🎛️ 操作按鈕欄 -->
                  <td>
                    <button
                      class="btn btn-primary btn-sm py-0 px-1"
                      @click="handleHighlight(item, layer)"
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

        <!-- 📭 空狀態顯示 (Empty State for this layer) -->
        <div v-else class="h-100 d-flex align-items-center justify-content-center bg-light">
          <div class="text-center text-muted">
            <i class="fas fa-table fa-3x mb-3"></i>
            <h5>{{ layer.name }}</h5>
            <p v-if="globalSearchQuery">找不到符合搜尋「{{ globalSearchQuery }}」的結果。</p>
            <p v-else-if="!layer.isLoaded">此圖層尚未載入資料。</p>
            <p v-else>此圖層沒有可顯示的資料。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 📭 無開啟圖層的空狀態 (No Layers Open Empty State) -->
    <div v-else class="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
      <div class="text-center text-muted">
        <i class="fas fa-layer-group fa-3x mb-3"></i>
        <h5>沒有開啟的圖層</h5>
        <p>請在左側面板開啟圖層以查看資料表格。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * 📊 DataTableTab.vue - 多圖層資料表格分頁組件
   *
   * 功能說明：
   * 1. 📋 為每個開啟的圖層提供獨立的表格分頁
   * 2. 🔍 提供跨圖層的全域搜尋功能
   * 3. 📊 支援每個圖層獨立的排序功能
   * 4. 🎯 提供地圖高亮顯示功能
   * 5. 📤 支援單一圖層資料匯出
   * 6. 🔄 響應圖層開啟/關閉狀態
   *
   * 架構說明：
   * - 圖層分頁：動態顯示所有開啟的圖層
   * - 表格區域：每個圖層獨立的表格內容
   * - 搜尋系統：全域搜尋功能
   * - 排序系統：每個圖層獨立的排序狀態
   *
   * 設計理念：
   * - 使用 Vue 3 Composition API
   * - 與 Pinia dataStore 整合
   * - 響應式的多圖層管理
   * - 友善的用戶體驗設計
   */

  // 🔧 Vue Composition API 引入
  import { ref, computed, defineEmits, onMounted, watch } from 'vue';
  // 📦 Pinia 狀態管理引入
  import { useDataStore } from '@/stores/dataStore.js';

  /**
   * 📡 組件事件定義 (Component Events)
   * 定義向父組件發送的事件
   */
  const emit = defineEmits(['highlight-on-map']);

  // 📦 取得 Pinia 數據存儲實例
  const dataStore = useDataStore();

  // 📊 響應式資料狀態 (Reactive Data State)
  /** 🔍 全域搜尋查詢字串 */
  const globalSearchQuery = ref('');
  /** 📑 當前作用中的圖層分頁 */
  const activeLayerTab = ref(null);
  /** 📊 每個圖層的排序狀態 */
  const layerSortStates = ref({});

  /**
   * 🗺️ 可見圖層計算屬性 (Visible Layers Computed Property)
   * 獲取所有開啟且有資料的圖層
   */
  const visibleLayers = computed(() => {
    const allLayers = dataStore.getAllLayers();
    return allLayers.filter((layer) => layer.visible);
  });

  /**
   * 📑 設定作用中圖層分頁 (Set Active Layer Tab)
   * @param {string} layerId - 圖層 ID
   */
  const setActiveLayerTab = (layerId) => {
    activeLayerTab.value = layerId;
  };

  /**
   * 📊 取得圖層資料數量 (Get Layer Data Count)
   * @param {Object} layer - 圖層物件
   * @returns {number} 資料數量
   */
  const getLayerDataCount = (layer) => {
    return layer.tableData?.length || 0;
  };

  /**
   * 🔍 取得過濾後的資料 (Get Filtered Data)
   * 根據全域搜尋條件過濾圖層資料
   * @param {Object} layer - 圖層物件
   * @returns {Array} 過濾後的資料陣列
   */
  const getFilteredData = (layer) => {
    if (!layer.tableData) return [];

    let filtered = layer.tableData;

    // 🔍 全域搜尋過濾邏輯
    if (globalSearchQuery.value) {
      const query = globalSearchQuery.value.toLowerCase();
      filtered = filtered.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(query);
        const idMatch = String(item.id).includes(query);
        const countMatch = String(item.count).includes(query);
        return nameMatch || idMatch || countMatch;
      });
    }

    return filtered;
  };

  /**
   * 📊 取得排序後的資料 (Get Sorted Data)
   * 對過濾後的資料進行排序
   * @param {Object} layer - 圖層物件
   * @returns {Array} 排序後的資料陣列
   */
  const getSortedData = (layer) => {
    const filtered = getFilteredData(layer);
    const sortState = layerSortStates.value[layer.id];

    if (!sortState || !sortState.key) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const aValue = a[sortState.key];
      const bValue = b[sortState.key];

      // 字串類型的比較
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // 數值類型的比較
      return sortState.order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  /**
   * 📊 處理排序點擊 (Handle Sort Click)
   * @param {string} layerId - 圖層 ID
   * @param {string} key - 排序欄位
   */
  const handleSort = (layerId, key) => {
    if (!layerSortStates.value[layerId]) {
      layerSortStates.value[layerId] = { key: null, order: 'asc' };
    }

    const sortState = layerSortStates.value[layerId];

    if (sortState.key === key) {
      // 切換排序方向
      sortState.order = sortState.order === 'asc' ? 'desc' : 'asc';
    } else {
      // 設定新的排序欄位
      sortState.key = key;
      sortState.order = 'asc';
    }
  };

  /**
   * 🎨 取得排序圖示 (Get Sort Icon)
   * @param {string} layerId - 圖層 ID
   * @param {string} key - 欄位名稱
   * @returns {string} FontAwesome 圖示類別
   */
  const getSortIcon = (layerId, key) => {
    const sortState = layerSortStates.value[layerId];
    if (!sortState || sortState.key !== key) {
      return 'fas fa-sort';
    }
    return sortState.order === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };

  /**
   * 🎯 處理地圖高亮顯示 (Handle Map Highlighting)
   * @param {Object} item - 要高亮的項目
   * @param {Object} layer - 圖層物件
   */
  const handleHighlight = (item, layer) => {
    console.log('準備高亮顯示:', { item, layer: layer.name });

    if (!item || !item.name) {
      console.warn('無法高亮顯示：資料為空或缺少名稱');
      return;
    }

    console.log('發送高亮事件:', item.name);
    emit('highlight-on-map', item.name);
  };

  /**
   * 🎨 格式化數值 (Format Value)
   * @param {any} value - 原始值
   * @returns {string} 格式化後的值
   */
  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value || '-';
  };

  /**
   * 👀 監聽可見圖層變化，自動設定第一個可見圖層為預設分頁
   */
  watch(
    () => visibleLayers.value,
    (newLayers) => {
      // 如果沒有可見圖層，清除選中的分頁
      if (newLayers.length === 0) {
        activeLayerTab.value = null;
        return;
      }

      // 如果當前沒有選中分頁，或選中的分頁不在可見列表中，選中第一個
      if (!activeLayerTab.value || !newLayers.find((layer) => layer.id === activeLayerTab.value)) {
        activeLayerTab.value = newLayers[0].id;
      }
    },
    { deep: true, immediate: true }
  );

  /**
   * 🚀 組件掛載事件 (Component Mounted Event)
   */
  onMounted(() => {
    console.log('[MultiLayerDataTableTab] Component Mounted');

    // 初始化第一個可見圖層為作用中分頁
    if (visibleLayers.value.length > 0 && !activeLayerTab.value) {
      activeLayerTab.value = visibleLayers.value[0].id;
    }
  });
</script>

<style scoped>
  /**
   * 🎨 多圖層資料表格樣式 (Multi-Layer Data Table Styles)
   */

  /* 📊 組件基礎樣式 */
  .my-data-table-tab-component {
    font-size: 0.875rem;
  }

  /* 🔍 搜尋工具列樣式 */
  .my-search-toolbar-container input.form-control {
    background-color: white;
    border-color: #ced4da;
    color: #495057;
  }

  .my-search-toolbar-container input.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .my-search-toolbar-container input.form-control::placeholder {
    color: #6c757d;
  }

  /* 📑 圖層分頁導航樣式 */
  .layer-tabs-nav {
    border-bottom: 1px solid #dee2e6;
  }

  .layer-tabs-nav .nav-tabs {
    border-bottom: none;
  }

  .layer-tabs-nav .nav-link {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    transition: all 0.2s ease;
    border-radius: 0;
  }

  .layer-tabs-nav .nav-link:hover {
    background-color: #e9ecef;
  }

  .layer-tabs-nav .nav-link.active {
    border-bottom: 2px solid #007bff;
  }

  .layer-tab-name {
    font-weight: 500;
  }

  /* 📊 圖層統計列樣式 */
  .layer-stats-bar {
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
  }

  /* 📋 表格容器樣式 */
  .table-container {
    overflow-y: auto;
  }

  /* 📊 表格基礎樣式 */
  .table {
    --bs-table-bg: white;
    --bs-table-color: #212529;
    --bs-table-striped-bg: #f8f9fa;
    --bs-table-hover-bg: #e9ecef;
  }

  /* 📝 表格標題樣式 */
  .table thead.sticky-top {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #f8f9fa;
  }

  .table th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
    vertical-align: middle;
    white-space: nowrap;
  }

  /* 📊 可排序標題樣式 */
  .table th.my-sortable {
    cursor: pointer;
    user-select: none;
  }

  .table th.my-sortable:hover {
    background-color: #e2e6ea;
  }

  .table th.my-sortable i {
    margin-left: 0.3em;
    font-size: 0.9em;
    opacity: 0.7;
  }

  .table th.my-sortable:hover i {
    opacity: 1;
  }

  /* 📄 表格內容樣式 */
  .table td {
    font-size: 0.85rem;
    padding: 0.4rem 0.5rem;
    vertical-align: middle;
  }

  .table tbody tr:hover {
    background-color: var(--bs-table-hover-bg);
  }

  /* 📭 空狀態樣式 */
  .bg-light {
    background-color: #f8f9fa !important;
  }

  /* 🎛️ 按鈕樣式調整 */
  .btn-primary.btn-sm {
    transition: all 0.2s ease;
  }

  .btn-primary.btn-sm:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  /* 📱 響應式設計調整 */
  @media (max-width: 768px) {
    .layer-tab-name {
      font-size: 0.7rem;
    }

    .badge {
      font-size: 0.6rem;
    }

    .layer-stats-bar .row > .col-auto {
      margin-bottom: 0.25rem;
    }
  }

  /* 🎨 載入動畫 */
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }

  /* 📊 徽章樣式 */
  .badge {
    font-size: 0.7rem;
  }
</style>
