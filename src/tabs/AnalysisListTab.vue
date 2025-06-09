<template>
  <div class="custom-scroll h-100">
    <!-- 分析項目列表 -->
    <div v-if="analysisList.length > 0">
      <AnalysisItem
        v-for="analysis in analysisList" 
        :key="analysis.id"
        :analysis="analysis"
        :isSelected="selectedAnalysisId === analysis.id"
        @select="$emit('select-analysis', analysis.id)"
        @view="$emit('view-analysis', analysis.id)"
        @delete="$emit('delete-analysis', analysis.id)" />
    </div>
    
    <!-- 空狀態 -->
    暫無分析項目，點擊左側「開始分析」按鈕創建分析項目
  </div>
</template>

<script>
import AnalysisItem from '../components/common/AnalysisItem.vue'

export default {
  name: 'AnalysisListTab',
  components: {
    AnalysisItem
  },
  props: {
    analysisList: {
      type: Array,
      default: () => []
    },
    selectedAnalysisId: {
      type: [Number, String],
      default: null
    }
  },
  emits: [
    'select-analysis',
    'view-analysis',
    'delete-analysis'
  ]
}
</script> 