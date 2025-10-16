<template>
    <div class="h-[60px] w-full lg:sticky top-0 z-[999] bg-white flex items-center dark:bg-gray-800 drop-shadow-sm">
        <div class="flex items-center justify-between mx-auto max-w-5xl w-full">
            <div class="text-[20px] font-bold text-black dark:text-white ml-5 flex-nowrap">表情包展示图生成器</div>
            <el-select v-model="theme" placeholder="主题选择" class="!max-w-[240px] !w-full">
                <el-option v-for="i in themeList" :key="i.value" :label="i.label" :value="i.value"
                    @click="switchTheme(i.value)"></el-option>
            </el-select>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const theme = ref('theme1') // 默认主题
const themeList = [
    {
        value: 'theme1',
        label: '主题1'
    }
]

// 当前主题
const currentTheme = computed(() => {
    return route.name || 'theme2' // 默认为theme2
})

// 切换主题
const switchTheme = (theme) => {
    router.push({ name: theme })
}
</script>
<style scoped></style>
