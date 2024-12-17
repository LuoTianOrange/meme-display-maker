<template>
  <div class="watermark-wrapper">
    <slot></slot>
    <div class="watermark-container">
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
import { computed, onMounted, onBeforeUnmount } from 'vue'

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
    }
})

const getImageCount = () => {
  const cols = Math.ceil(window.innerWidth / (props.width + props.gap[0]))
  const rows = Math.ceil(window.innerHeight / (props.height + props.gap[1]))
  return cols * rows
}

const imageCount = computed(getImageCount)

const watermarkImage = (n) => {
  const cols = Math.ceil(window.innerWidth / (props.width + props.gap[0]))
  const row = Math.floor(n / cols)
  const col = n % cols
  return {
    position: 'absolute',
    top: `${row * (props.height + props.gap[1])}px`,
    left: `${col * (props.width + props.gap[0])}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    opacity: props.opacity,
    pointerEvents: 'none',
    zIndex: props.zIndex,
  }
}

const handleResize = () => {
  imageCount.value = getImageCount()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
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
