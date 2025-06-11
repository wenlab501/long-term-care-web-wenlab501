<script setup>
  import { ref, computed, defineEmits, onMounted, watch } from 'vue';
  import { useDataStore } from '@/stores/dataStore.js';

  const emit = defineEmits(['highlight-on-map']);

  const dataStore = useDataStore();

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
   * 📊 取得排序後的資料 (Get Sorted Data)
   * @param {Object} layer - 圖層物件
   * @returns {Array} 排序後的資料陣列
   */
  const getSortedData = (layer) => {
    if (!layer.tableData) return [];

    const sortState = layerSortStates.value[layer.id];
    if (!sortState || !sortState.key) {
      return layer.tableData;
    }

    return [...layer.tableData].sort((a, b) => {
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

  // 記錄上一次的圖層列表用於比較
  const previousLayers = ref([]);

  /**
   * 👀 監聽可見圖層變化，自動切換到新開啟的圖層分頁
   */
  watch(
    () => visibleLayers.value,
    (newLayers) => {
      // 如果沒有可見圖層，清除選中的分頁
      if (newLayers.length === 0) {
        activeLayerTab.value = null;
        previousLayers.value = [];
        return;
      }

      // 找出新增的圖層（比較新舊圖層列表）
      const previousLayerIds = previousLayers.value.map((layer) => layer.id);
      const newLayerIds = newLayers.map((layer) => layer.id);
      const addedLayerIds = newLayerIds.filter((id) => !previousLayerIds.includes(id));

      // 如果有新增的圖層，自動切換到最新新增的圖層
      if (addedLayerIds.length > 0) {
        const newestAddedLayerId = addedLayerIds[addedLayerIds.length - 1];
        activeLayerTab.value = newestAddedLayerId;
        console.log(
          `🔄 自動切換到新開啟的圖層: ${newLayers.find((layer) => layer.id === newestAddedLayerId)?.name}`
        );
      }
      // 如果當前沒有選中分頁，或選中的分頁不在可見列表中，選中第一個
      else if (
        !activeLayerTab.value ||
        !newLayers.find((layer) => layer.id === activeLayerTab.value)
      ) {
        activeLayerTab.value = newLayers[0].id;
      }

      // 更新記錄的圖層列表
      previousLayers.value = [...newLayers];
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

<template>
  <!-- 📊 多圖層資料表格分頁組件 -->
  <div class="h-100 d-flex flex-column">
    <!-- 📑 圖層分頁導航 -->
    <div v-if="visibleLayers.length > 0" class="bg-white border-bottom">
      <ul class="nav nav-tabs nav-fill">
        <li v-for="layer in visibleLayers" :key="layer.id" class="nav-item">
          <button
            class="nav-link"
            :class="{
              active: activeLayerTab === layer.id,
            }"
            @click="setActiveLayerTab(layer.id)"
            :title="`顯示 ${layer.name} 的表格資料`"
          >
            {{ layer.name }}
            <span class="badge bg-secondary ms-2" v-if="getLayerDataCount(layer)">
              {{ getLayerDataCount(layer) }}
            </span>
          </button>
        </li>
      </ul>
    </div>

    <!-- 📋 圖層表格內容區域 -->
    <div v-if="visibleLayers.length > 0" class="flex-grow-1 overflow-hidden">
      <div
        v-for="layer in visibleLayers"
        :key="layer.id"
        v-show="activeLayerTab === layer.id"
        class="h-100"
      >
        <!-- 🔄 載入中狀態 -->
        <div v-if="layer.isLoading" class="h-100 d-flex align-items-center justify-content-center">
          <div class="text-center">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
            <p class="text-muted">正在載入 {{ layer.name }} 的資料...</p>
          </div>
        </div>

        <!-- 📋 表格內容 -->
        <div
          v-else-if="layer.isLoaded && getSortedData(layer).length > 0"
          class="h-100 d-flex flex-column"
        >
          <!-- 📊 圖層統計資訊 -->
          <div class="bg-light px-3 py-2 border-bottom">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <strong>{{ layer.name }}</strong>
                <span class="text-muted ms-2">總計: {{ getLayerDataCount(layer) }} 筆</span>
              </div>
            </div>
          </div>

          <!-- 📋 Bootstrap 表格 -->
          <div class="flex-grow-1 overflow-auto">
            <table class="table table-sm table-hover table-striped mb-0">
              <thead class="table-light sticky-top">
                <tr class="text-center">
                  <th
                    @click="handleSort(layer.id, 'id')"
                    class="user-select-none"
                    style="cursor: pointer"
                  >
                    ID
                    <i :class="getSortIcon(layer.id, 'id')" class="ms-1"></i>
                  </th>
                  <th
                    @click="handleSort(layer.id, 'name')"
                    class="user-select-none"
                    style="cursor: pointer"
                  >
                    名稱
                    <i :class="getSortIcon(layer.id, 'name')" class="ms-1"></i>
                  </th>
                  <th
                    @click="handleSort(layer.id, 'count')"
                    class="user-select-none"
                    style="cursor: pointer"
                  >
                    數量
                    <i :class="getSortIcon(layer.id, 'count')" class="ms-1"></i>
                  </th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in getSortedData(layer)"
                  :key="item.id || item.name || index"
                  class="text-center align-middle"
                >
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ formatValue(item.count) }}</td>
                  <td>
                    <button
                      class="btn btn-primary btn-sm"
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

        <!-- 📭 空狀態顯示 -->
        <div v-else class="h-100 d-flex align-items-center justify-content-center bg-light">
          <div class="text-center text-muted">
            <i class="fas fa-table fa-3x mb-3"></i>
            <h5>{{ layer.name }}</h5>
            <p v-if="!layer.isLoaded">此圖層尚未載入資料。</p>
            <p v-else>此圖層沒有可顯示的資料。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 📭 無開啟圖層的空狀態 -->
    <div v-else class="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
      <div class="text-center text-muted">
        <i class="fas fa-layer-group fa-3x mb-3"></i>
        <h5>沒有開啟的圖層</h5>
        <p>請在左側面板開啟圖層以查看資料表格。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 最小化自定義樣式，主要使用 Bootstrap */
</style>
