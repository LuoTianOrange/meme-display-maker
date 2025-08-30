<template>
  <div class="w-full h-full flex flex-col min-h-screen">
    <!--顶部导航栏-->
    <div class="h-[60px] w-full bg-zinc-500 flex items-center justify-between">
      <div class="text-[25px] text-white ml-5">表情包展示图生成器</div>
      <div class="flex items-center gap-3 mr-5">
        <!-- <el-button @click="switchTheme('theme1')" :type="currentTheme === 'theme1' ? 'primary' : 'default'"
          :plain="currentTheme !== 'theme1'" size="large">
          主题一
        </el-button>
        <el-button @click="switchTheme('theme2')" :type="currentTheme === 'theme2' ? 'primary' : 'default'"
          :plain="currentTheme !== 'theme2'" size="large">
          主题二
        </el-button> -->
      </div>
    </div>
    <!--内容部分-->
    <div class="w-full h-full min-h-[calc(100vh-60px)] flex-grow f-c-c flex-col bg-zinc-100">
      <!-- <div class="f-c-c my-3">
        <BreadCrumb></BreadCrumb>
      </div> -->
      <RouterView></RouterView>
    </div>
    <!--底部导航栏-->
    <div class=""></div>
  </div>
</template>
<script lang="js" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前主题
const currentTheme = computed(() => {
  return route.name || 'theme2' // 默认为theme2
})

// 切换主题
const switchTheme = (theme) => {
  router.push({ name: theme })
}
</script>
<style scoped>
.f-c-c {
  display: flex;
  justify-content: center;
  align-items: center;
}

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
