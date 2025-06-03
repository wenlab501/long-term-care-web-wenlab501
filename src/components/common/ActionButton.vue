<template>
  <button 
    :class="buttonClass" 
    :disabled="disabled"
    @click="$emit('click')"
    type="button">
    <i :class="`fas fa-${icon}`"></i>
    {{ text }}
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ActionButton',
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'sm'
    },
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props) {
    /**
     * 計算按鈕CSS類別
     * @returns {string} CSS類別字符串
     */
    const buttonClass = computed(() => {
      return `btn btn-${props.variant} btn-${props.size}`
    })

    return {
      buttonClass
    }
  }
}
</script> 