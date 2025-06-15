<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useDataStore } from '@/stores/dataStore.js';

  const dataStore = useDataStore();

  const activeLayerTab = ref(null); /** 📑 當前作用中的圖層分頁 */

  // 獲取所有開啟且有資料的圖層
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
   * 📊 當前圖層摘要 (Current Layer Summary)
   */
  const currentLayerSummary = computed(() => {
    if (!activeLayerTab.value) return null;
    const layer = visibleLayers.value.find((l) => l.layerId === activeLayerTab.value);
    return layer ? layer.summaryData || null : null;
  });

  /**
   * 📊 取得當前選中圖層名稱 (Get Current Selected Layer Name)
   */
  const currentLayerName = computed(() => {
    if (!activeLayerTab.value) return '無開啟圖層';
    const layer = visibleLayers.value.find((l) => l.layerId === activeLayerTab.value);
    return layer ? layer.name || '未知圖層' : '無開啟圖層';
  });

  /**
   * 📊 計算圖層統計數據 (Calculate Layer Statistics)
   * @param {Object} layer - 圖層物件
   */
  const getLayerStats = (layer) => {
    const data = layer.tableData || [];
    if (data.length === 0) {
      return {
        total: 0,
        max: 0,
        average: 0,
        hasDataCount: 0,
      };
    }

    // 計算統計數據
    const counts = data.map((item) => {
      // 動態獲取數值欄位
      const numericFields = Object.keys(item).filter((key) => {
        const value = item[key];
        return typeof value === 'number' && !isNaN(value);
      });

      // 優先使用常見的數值欄位名稱
      const priorityFields = ['count', 'value', 'amount', 'population', 'density'];
      const field = priorityFields.find((f) => numericFields.includes(f)) || numericFields[0];

      return field ? item[field] || 0 : 0;
    });

    const validCounts = counts.filter((c) => c > 0);
    const total = data.length;
    const max = counts.length > 0 ? Math.max(...counts) : 0;
    const average = counts.length > 0 ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
    const hasDataCount = validCounts.length;

    return {
      total,
      max,
      average,
      hasDataCount,
    };
  };

  // /**
  //  * 📊 當前圖層統計數據 (Current Layer Statistics)
  //  */
  // const currentLayerStats = computed(() => {
  //   if (!activeLayerTab.value) return { total: 0, max: 0, average: 0, hasDataCount: 0 };
  //   const layer = visibleLayers.value.find((l) => l.id === activeLayerTab.value);
  //   return layer ? getLayerStats(layer) : { total: 0, max: 0, average: 0, hasDataCount: 0 };
  // });

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
      const previousLayerIds = previousLayers.value.map((layer) => layer.layerId);
      const newLayerIds = newLayers.map((layer) => layer.layerId);
      const addedLayerIds = newLayerIds.filter((id) => !previousLayerIds.includes(id));

      // 如果有新增的圖層，自動切換到最新新增的圖層
      if (addedLayerIds.length > 0) {
        const newestAddedLayerId = addedLayerIds[addedLayerIds.length - 1];
        activeLayerTab.value = newestAddedLayerId;
        console.log(
          `🔄 自動切換到新開啟的圖層: ${newLayers.find((layer) => layer.layerId === newestAddedLayerId)?.name}`
        );
      }
      // 如果當前沒有選中分頁，或選中的分頁不在可見列表中，選中第一個
      else if (
        !activeLayerTab.value ||
        !newLayers.find((layer) => layer.layerId === activeLayerTab.value)
      ) {
        activeLayerTab.value = newLayers[0].layerId;
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
    console.log('[DashboardView] Component Mounted');

    // 初始化第一個可見圖層為作用中分頁
    if (visibleLayers.value.length > 0 && !activeLayerTab.value) {
      activeLayerTab.value = visibleLayers.value[0].layerId;
    }
  });
</script>

<template>
  <!-- 📊 多圖層資料儀表板視圖組件 -->
  <div class="h-100 my-dashboard-container">
    <div class="d-flex flex-column h-100">
      <!-- 📑 圖層分頁導航 -->
      <div v-if="visibleLayers.length > 0" class="">
        <ul class="nav nav-tabs nav-fill">
          <li
            v-for="layer in visibleLayers"
            :key="layer.layerId"
            class="nav-item d-flex flex-column align-items-center"
          >
            <!-- tab按鈕 -->
            <div
              class="btn nav-link rounded-0 border-0 position-relative d-flex align-items-center justify-content-center my-bg-color-gray-200"
              :class="{
                active: activeLayerTab === layer.layerId,
              }"
              @click="setActiveLayerTab(layer.layerId)"
            >
              <div class="my-title-sm">{{ layer.name }}</div>
              <div class="my-content-xs ms-2" v-if="getLayerStats(layer).total">
                {{ getLayerStats(layer).total }}
              </div>
            </div>
            <div class="w-100" style="height: 4px" :style="{ backgroundColor: layer.color }"></div>
          </li>
        </ul>
      </div>

      <!-- 📊 圖層儀表板內容 -->
      <div class="flex-grow-1 overflow-auto">
        <!-- 有開啟圖層時的內容 -->
        <div v-if="visibleLayers.length > 0 && activeLayerTab" class="p-4">
          <!-- 📊 當前圖層資訊 -->
          <div class="mb-4">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                  {{ currentLayerName }}
                </h5>
              </div>
            </div>
          </div>

          <!-- 📊 圖層摘要資料 -->
          <div class="row flex-grow-1">
            <div class="col-12">
              <div class="card h-100">
                <div class="card-header">
                  <h6 class="mb-0">圖層摘要資料</h6>
                </div>
                <div class="card-body">
                  <div v-if="currentLayerSummary" class="summary-content">
                    <pre class="json-display p-3 rounded">{{
                      JSON.stringify(currentLayerSummary, null, 2)
                    }}</pre>
                  </div>
                  <div v-else class="text-center py-5">
                    <h5>沒有摘要資料</h5>
                    <p>此圖層沒有可用的摘要資訊</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 沒有開啟圖層時的空狀態 -->
        <div v-else class="flex-grow-1 d-flex align-items-center justify-content-center">
          <div class="text-center">
            <div class="my-title-xl my-2">沒有開啟的圖層</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .my-dashboard-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--my-bg-color-gray-200); /* 資料儀表版底色為 gray-200 */
  }

  .stats-card {
    transition: transform 0.2s ease;
  }

  .stats-card:hover {
    transform: translateY(-2px);
  }

  .stats-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .stats-label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .json-display {
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #dee2e6;
  }

  .summary-content {
    height: 100%;
    overflow: hidden;
  }
</style>
