<template>
    <div class="w-full h-[60px] top-0 z-[999] lg:sticky flex items-center bg-white dark:bg-gray-800 drop-shadow-sm">
        <div class="w-full max-w-5xl flex justify-between items-center mx-auto">
            <div class="flex-nowrap ml-5 font-bold text-[20px] text-black dark:text-white">表情包展示图生成器</div>
            <el-select v-model="theme" placeholder="主题选择" class="!w-full !max-w-[120px] xl:!max-w-[240px] mr-4">
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
