<template>
  <div class="card mb-3 analysis-item" 
       :class="{ 'border-primary bg-light': isSelected }"
       @click="$emit('select', analysis.id)">
    
    <div class="card-header d-flex justify-content-between align-items-center py-2">
      <h6 class="mb-0 analysis-item-title">
        <i class="fas fa-chart-line me-2 text-primary"></i>
        {{ analysis.name }}
      </h6>
      <div class="analysis-item-actions">
        <ActionButton 
          @click.stop="$emit('view', analysis.id)"
          variant="outline-primary"
          icon="eye"
          text=""
          size="sm"
          title="查看" />
        <ActionButton 
          @click.stop="$emit('delete', analysis.id)"
          variant="outline-danger"
          icon="trash"
          text=""
          size="sm"
          title="刪除" />
      </div>
    </div>
    
    <div class="card-body py-2">
      <!-- 項目時間 -->
      <div class="analysis-item-time text-muted small mb-2">
        <i class="fas fa-clock me-1"></i>
        {{ analysis.createdAt }}
      </div>
      
      <!-- 項目徽章 -->
      <div>
        <span class="badge bg-info me-1">
          <i class="fas fa-database me-1"></i>
          {{ analysis.dataCount }} 筆資料
        </span>
        <BadgeStatus :status="analysis.status" />
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from './ActionButton.vue'
import BadgeStatus from './BadgeStatus.vue'

export default {
  name: 'AnalysisItem',
  components: {
    ActionButton,
    BadgeStatus
  },
  props: {
    analysis: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'select',
    'view', 
    'delete'
  ]
}
</script> 