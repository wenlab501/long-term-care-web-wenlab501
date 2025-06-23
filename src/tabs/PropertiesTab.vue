<script>
  import DetailItem from '../components/DetailItem.vue';
  import { useDataStore } from '../stores/dataStore';
  import { computed } from 'vue';

  export default {
    name: 'PropertiesTab',

    /**
     * 🧩 組件註冊 (Component Registration)
     * 註冊物件屬性分頁內使用的子組件
     */
    components: {
      DetailItem, // 詳細資訊項目組件
    },

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup() {
      // 📦 取得 Pinia 數據存儲實例
      const dataStore = useDataStore();

      /**
       * 📊 選中物件計算屬性 (Selected Feature Computed Property)
       * 從 Pinia store 獲取當前選中的地圖物件
       * 提供響應式的選中物件數據
       */
      const selectedFeature = computed(() => dataStore.selectedFeature);

      const selectedLayer = computed(() => {
        if (!selectedFeature.value?.properties?.layerId) {
          return null;
        }

        const layerId = selectedFeature.value.properties.layerId;
        const layer = dataStore.findLayerById(layerId);
        return layer;
      });

      /**
       * 🏷️ 圖層名稱計算屬性 (Layer Name Computed Property)
       * 根據 selectedFeature.properties.layerId 從 dataStore 的 layers 中找到對應的圖層名稱
       */
      const layerName = computed(() => {
        if (!selectedFeature.value?.properties?.layerId) {
          return null;
        }

        const layerId = selectedFeature.value.properties.layerId;
        const layer = dataStore.findLayerById(layerId);
        return layer ? layer.layerName : layerId;
      });

      /**
       * 📋 是否有屬性計算屬性 (Has Properties Computed Property)
       * 檢查選中物件是否包含有效的屬性資料
       *
       * @returns {boolean} 是否有屬性資料
       */
      const hasProperties = computed(() => {
        return (
          !!selectedFeature.value?.properties?.propertyData &&
          Object.keys(selectedFeature.value.properties.propertyData).length > 0
        );
      });

      /**
       * 🎯 是否為分析圖層物件 (Is Analysis Layer Object)
       * 檢查選中物件是否為分析圖層的物件
       */
      const isAnalysisObject = computed(() => {
        return selectedFeature.value?.properties?.layerId === 'analysis-layer';
      });

      /**
       * 📍 範圍內點位清單 (Points In Range List)
       * 獲取分析圖層物件範圍內的點清單
       */
      const pointsInRange = computed(() => {
        if (!isAnalysisObject.value) return [];
        return selectedFeature.value?.properties?.pointsInRange || [];
      });

      /**
       * 🏢 範圍內多邊形清單 (Polygon In Range List)
       * 獲取分析圖層物件範圍內的多邊形清單
       */
      const polygonInRange = computed(() => {
        if (!isAnalysisObject.value) return [];
        return selectedFeature.value?.properties?.polygonInRange || [];
      });

      /**
       * 📋 範圍內所有物件清單 (All Objects In Range List)
       * 整合點物件和多邊形物件的統一清單
       */
      const allObjectsInRange = computed(() => {
        const points = pointsInRange.value.map(obj => ({ ...obj, objectType: 'point' }));
        const polygons = polygonInRange.value.map(obj => ({ ...obj, objectType: 'polygon' }));
        return [...points, ...polygons];
      });

      /**
       * 📊 圖層統計 (Layer Statistics)
       * 獲取範圍內各圖層的統計信息（點物件）
       */
      const layerStats = computed(() => {
        if (!isAnalysisObject.value) return {};
        return selectedFeature.value?.properties?.layerStats || {};
      });

      /**
       * 🏢 多邊形圖層統計 (Polygon Layer Statistics)
       * 獲取範圍內各圖層的統計信息（多邊形物件）
       */
      const polygonStats = computed(() => {
        if (!isAnalysisObject.value) return {};
        return selectedFeature.value?.properties?.polygonStats || {};
      });

      /**
       * 📊 整合統計 (Combined Statistics)
       * 整合點物件和多邊形物件的統計
       */
      const combinedStats = computed(() => {
        const combined = { ...layerStats.value };
        Object.entries(polygonStats.value).forEach(([layerName, count]) => {
          const key = `${layerName} (多邊形)`;
          combined[key] = count;
        });
        return combined;
      });

      // 📤 返回響應式數據給模板使用
      return {
        selectedFeature, // 選中物件
        selectedLayer, // 選中圖層
        layerName, // 圖層名稱
        hasProperties, // 是否有屬性
        isAnalysisObject, // 是否為分析圖層物件
        pointsInRange, // 範圍內點位清單
        polygonInRange, // 範圍內多邊形清單
        allObjectsInRange, // 範圍內所有物件清單
        layerStats, // 點圖層統計
        polygonStats, // 多邊形圖層統計
        combinedStats, // 整合統計
      };
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
          PTVNAME: '區域名稱',
          中位數: '中位數',
          name: '名稱',
          count: '數量',
          area: '面積',
          population: '人口',
          density: '密度',
          // 分析圖層專用標籤
          '分析點名稱': '分析點名稱',
          '分析範圍名稱': '分析範圍名稱',
          '緯度': '緯度',
          '經度': '經度',
          '中心緯度': '中心緯度',
          '中心經度': '中心經度',
          '分析半徑': '分析半徑',
          '建立時間': '建立時間',
          '關聯分析點': '關聯分析點',
        };
        return labelMap[key] || key;
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
          return value.toLocaleString();
        }
        // 其他類型：直接返回
        return value;
      },
    },
  };
</script>

<template>
  <div class="h-100 flex-grow-1 d-flex flex-column my-bgcolor-gray-200">
    <div v-if="selectedFeature" class="my-bgcolor-white h-100">
      <div>
        <div
          v-if="selectedLayer"
          :class="`my-bgcolor-${selectedLayer.colorName}`"
          :style="{ minHeight: '4px' }"
        ></div>

        <div class="p-3">
          <DetailItem label="圖層" :value="layerName" />
          <template v-if="hasProperties">
            <DetailItem
              v-for="(value, key) in selectedFeature.properties.propertyData"
              :key="key"
              :label="formatLabel(key)"
              :value="formatValue(value)"
            />
          </template>

          <!-- 🎯 分析圖層專用：範圍內物件清單 -->
          <template v-if="isAnalysisObject && (pointsInRange.length > 0 || polygonInRange.length > 0)">

            <!-- 📍 點物件清單 -->
            <template v-if="pointsInRange.length > 0">
              <hr class="my-3">

              <div class="my-title-xs-gray mb-3">
                範圍內點物件 {{ pointsInRange.length }}
              </div>
              <DetailItem
                v-for="(point, index) in pointsInRange"
                :key="index"
                :label="point.properties.layerName"
                :value="`${point.properties.name} (${point.distance}m)`"
              />
            </template>

            <!-- 🏢 多邊形物件清單 -->
            <template v-if="polygonInRange.length > 0">
              <hr class="my-3">

              <div class="my-title-xs-gray mb-3">
                範圍內面域物件 {{ polygonInRange.length }}
              </div>
              <DetailItem
                v-for="(polygon, index) in polygonInRange"
                :key="index"
                :label="polygon.properties.layerName"
                :value="polygon.properties.name"
              />
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- 📭 無點擊地圖上物件的空狀態 -->
    <div v-else class="flex-grow-1 d-flex align-items-center justify-content-center">
      <div class="text-center">
        <div class="my-title-md-gray p-3">沒有點擊地圖上的物件</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
