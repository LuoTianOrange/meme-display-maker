<template>
    <div>
        <div :data-text="MemeName"
            class="text-[60px] font-[MaiYuan] text text-center">
            {{ MemeName }}
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const MemeName = ref('天才猫猫明风')

</script>
<style scoped>
.text {
    -webkit-text-stroke: 8px white; /* 白色描边 */
    color: transparent; /* 透明文本颜色 */
    filter: drop-shadow(0 5px 0 #548eb6);
}

.text::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(#4ac3f8,#bee7fb); /* 渐变色 */
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: 1;
    -webkit-text-stroke: 0; /* 去除描边 */
}


</style>
