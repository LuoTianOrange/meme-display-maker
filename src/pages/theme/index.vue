<template>
  <div class="w-full h-full flex flex-col min-h-screen">
    <!--顶部导航栏-->
    <HeadBar></HeadBar>
    <!--内容部分-->
    <div class="w-full h-full min-h-[calc(100vh-60px)] flex-grow flex justify-center items-center flex-col bg-zinc-100">
      <RouterView></RouterView>
    </div>
    <!--底部导航栏-->
    <div class=""></div>
  </div>
</template>
<script lang="js" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeadBar from '@/components/HeadBar.vue'

const router = useRouter()
const route = useRoute()

</script>
<style scoped>
.text {
  -webkit-text-stroke: 8px white;
  /* 白色描边 */
  color: transparent;
  /* 透明文本颜色 */
  filter: drop-shadow(0 5px 0 var(--shadowColor));
}

.text::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(var(--textColor1), var(--textColor2));
  /* 渐变色 */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 1;
  -webkit-text-stroke: 0;
  /* 去除描边 */
}

.text2 {
  -webkit-text-stroke: 4px white;
  /* 白色描边 */
  color: transparent;
  /* 透明文本颜色 */
  filter: drop-shadow(0 5px 0 var(--shadowColor));
}

.text2::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(var(--textColor1), var(--textColor2));
  /* 渐变色 */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 1;
  -webkit-text-stroke: 0;
  /* 去除描边 */
}

.image-border {
  position: relative;
  filter: drop-shadow(3px 3px 0 rgba(255, 255, 255, 1)) drop-shadow(-3px 3px 0 rgba(255, 255, 255, 1)) drop-shadow(3px -3px 0 rgba(255, 255, 255, 1)) drop-shadow(-3px -3px 0 rgba(255, 255, 255, 1));
}

.image-border::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  /* 向下的阴影 */
  pointer-events: none;
  /* 确保伪元素不会影响鼠标事件 */
}
</style>
