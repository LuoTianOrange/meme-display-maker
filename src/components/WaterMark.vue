<template>
    <div class="watermark-wrapper">
      <slot></slot>
      <div class="watermark" :style="watermarkStyle"></div>
    </div>
  </template>
  
  <script lang="js" setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    image: {
      type: String,
      required: true
    },
    opacity: {
      type: Number,
      default: 0.3
    },
    width: {
      type: String,
      default: '50px'
    },
    height: {
      type: String,
      default: '50px'
    },
    gap: {
      type: Array,
      default: () => [100, 100]
    },
    rotate: {
      type: Number,
      default: -22
    },
    zIndex: {
      type: Number,
      default: 10
    }
  })
  
  const watermarkStyle = computed(() => {
    const [gapX, gapY] = props.gap
    return {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundImage: `url(${props.image})`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${props.width} ${props.height}`,
      backgroundPosition: `0 ${gapY}px`,
      opacity: props.opacity,
      transform: `rotate(${props.rotate}deg)`,
      pointerEvents: 'none',
      zIndex: props.zIndex
    }
  })
  </script>
  
  <style scoped>
  .watermark-wrapper {
    position: relative;
    /* width: 100%; */
    height: 100%;
  }
  .watermark {
    /* 样式由绑定的 style 属性控制 */
  }
  </style>