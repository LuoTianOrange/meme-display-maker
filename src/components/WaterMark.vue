<template>
  <div class="watermark-wrapper" ref="wrapperRef">
    <slot></slot>
    <div class="watermark-container" v-if="imageCount > 0 && image">
      <img
        v-for="n in imageCount"
        :key="n"
        :src="image"
        :style="watermarkImage(n - 1)"
        alt=""
      />
    </div>
    <!-- <div class="watermark" :style="watermarkStyle"></div> -->
  </div>
</template>

<script lang="js" setup>
import { computed, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useElementSize } from '@vueuse/core'

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
        type: Number,
        default: 50
    },
    height: {
        type: Number,
        default: 50
    },
    gap: {
        type: Array,
        default: () => [100, 100]
    },
    zIndex: {
        type: Number,
        default: 10
    },
    angle: {
        type: Number,
        default: 0
    }
})

const wrapperRef = ref(null)

// 使用容器大小而不是窗口大小
const { width: containerWidth, height: containerHeight } = useElementSize(wrapperRef)

const cols = computed(() => {
  return Math.ceil(containerWidth.value / (props.width + props.gap[0]))
})

const getImageCount = () => {
  const cols = Math.ceil(containerWidth.value / (props.width + props.gap[0]))
  const rows = Math.ceil(containerHeight.value / (props.height + props.gap[1]))
  return cols * rows
}

const imageCount = computed(getImageCount)

const watermarkImage = (n) => {
  // const cols = Math.ceil(window.innerWidth / (props.width + props.gap[0]))
  // const row = Math.floor(n / cols)
  // const col = n % cols

  const currentCols = cols.value
  const row = Math.floor(n / currentCols)
  const col = n % currentCols
  return {
    position: 'absolute',
    top: `${row * (props.height + props.gap[1])}px`,
    left: `${col * (props.width + props.gap[0])}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    opacity: props.opacity,
    pointerEvents: 'none',
    zIndex: props.zIndex,
    transform: `rotate(${props.angle}deg)`
  }
}

// const handleResize = () => {
//   imageCount.value = getImageCount()
// }

// onMounted(() => {
//   window.addEventListener('resize', handleResize)
// })

// onBeforeUnmount(() => {
//   window.removeEventListener('resize', handleResize)
// })
</script>

<style scoped>
.watermark-wrapper {
  display: grid;
  place-items: center;
  position: relative;
  height: 100%;
  overflow: hidden;
}

.watermark-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
