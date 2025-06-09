<template>
  <div class="object-properties-tab">
    <div v-if="selectedFeature" class="properties-content">
      <div class="mb-3">
        <h6 class="text-primary mb-2">物件屬性</h6>
        <template v-if="hasProperties">
          <DetailItem
            v-for="(value, key) in selectedFeature.properties"
            :key="key"
            :label="formatLabel(key)"
            :value="formatValue(value)"
          />
        </template>
        <div v-else class="text-muted">
          此物件沒有屬性資料
        </div>
      </div>
    </div>
    <div v-else class="text-muted text-center p-3">
      請點擊地圖上的物件以查看其屬性
    </div>
  </div>
</template>

<script>
import DetailItem from '../components/common/DetailItem.vue'
import { useDataStore } from '../stores/dataStore'
import { computed } from 'vue'

export default {
  name: 'ObjectPropertiesTab',
  components: {
    DetailItem
  },
  setup() {
    const dataStore = useDataStore()
    
    // 從 store 讀取 selectedFeature
    const selectedFeature = computed(() => dataStore.selectedFeature)
    
    // 計算是否有屬性
    const hasProperties = computed(() => {
      return !!selectedFeature.value?.properties && 
             Object.keys(selectedFeature.value.properties).length > 0
    })

    return {
      selectedFeature,
      hasProperties
    }
  },
  methods: {
    formatLabel(key) {
      // 將屬性名稱轉換為更易讀的格式
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
    formatValue(value) {
      // 根據值的類型進行格式化
      if (typeof value === 'number') {
        return value.toLocaleString()
      }
      return value
    }
  }
}
</script>

<style scoped>
.object-properties-tab {
  height: 100%;
  overflow-y: auto;
}

.properties-content {
  padding: 1rem;
}

.properties-content h6 {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}
</style> 