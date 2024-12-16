<template>
    <div>
        <div :data-text="MemeName" class="text-[60px] font-[MaiYuan] text text-center">
            {{ MemeName }}
        </div>
        <input v-model="text" placeholder="输入弧形文字" />
        <button @click="updateText">刷新弧形文字</button>
        <div class="w-[200px]" id="myElement" ref="myElement"></div>
    </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import CircleType from 'circletype'

const MemeName = ref('天才猫猫明风')

const text = ref('这是弧形文字')
const myElement = ref(null)
let circleType = null

const initCircleType = () => {
    if (circleType) {
        circleType.destroy()
    }
    myElement.value.textContent = text.value
    circleType = new CircleType(myElement.value)
    circleType.radius(300).dir(1)
}

onMounted(() => {
    nextTick(() => {
        initCircleType()
    })
})

const updateText = () => {
    nextTick(() => {
        initCircleType()
    })
}
</script>
<style scoped>
.text {
    -webkit-text-stroke: 8px white;
    /* 白色描边 */
    color: transparent;
    /* 透明文本颜色 */
    filter: drop-shadow(0 5px 0 #548eb6);
}

.text::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(#4ac3f8, #bee7fb);
    /* 渐变色 */
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: 1;
    -webkit-text-stroke: 0;
    /* 去除描边 */
}

.curved-text {
    shape-outside: circle(250px at top right);
    float: right;
    width: 500px;
    height: 500px;
    border: 1px solid black;
    padding: 20px;
    margin-left: 20px;
}
</style>
