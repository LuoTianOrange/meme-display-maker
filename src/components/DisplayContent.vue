<template>
    <div ref="displaySection"
        :class="['w-full', 'pattern-grid-md', backgroundConfig.bgClass, backgroundConfig.patternClass]"
        style="min-height: auto;">
        <!--顶部-->
        <div class="grid grid-cols-4 gap-4 min-h-[200px] pt-4 px-4">
            <div class="w-full">
                <img v-if="titlePhoto1" :src="titlePhoto1.url" class="w-full aspect-square object-cover" />
                <div v-else class="w-full aspect-square bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-600">
                    标题图片
                </div>
            </div>
            <div class="col-span-2 flex flex-col justify-center">
                <div class="text-[60px] text-stroke" :style="{ color: TextColor }">
                    表情包展示
                </div>
                <div :style="{ color: TextColor, fontSize: TextSize + 'px', lineHeight: TextSize + 5 +'px' }">
                    {{ MemeName }}
                </div>
                <div class="text-[20px]" :style="{ color: TextColor }">
                    画师：{{ ArtistName }}
                </div>
            </div>
            <div class="flex items-center justify-center">
                <img v-if="enableQRcode" :src="qrcode.value" class="w-full aspect-square object-cover" />
            </div>
        </div>

        <!--表情包展示-->
        <div class="p-4">
            <div class="bg-white w-full grid grid-cols-4 gap-4 p-4 rounded-lg">
                <template v-if="uploadedFiles.length > 0">
                    <div v-for="file in uploadedFiles" :key="file.name" class="w-full">
                        <img v-if="file.type && file.type.startsWith('image/')" :src="file.url" :alt="file.name"
                            class="w-full aspect-square object-cover" />
                        <div v-else class="text-center">{{ file.name }}</div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="i in 16" :key="i"
                        class="flex items-center justify-center w-full aspect-square bg-gray-200 text-gray-600 text-2xl border-2 border-dashed border-gray-300 rounded-lg">
                        {{ i }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

// 定义props
const props = defineProps({
    uploadedFiles: {
        type: Array,
        default: () => []
    },
    titlePhoto1: {
        type: Object,
        default: null
    },
    titlePhoto2: {
        type: Object,
        default: null
    },
    MemeName: {
        type: String,
        default: ''
    },
    ArtistName: {
        type: String,
        default: ''
    },
    TextColor: {
        type: String,
        default: '#000000'
    },
    TextSize: {
        type: Number,
        default: 24
    },
    enableQRcode: {
        type: Boolean,
        default: false
    },
    QRtext: {
        type: String,
        default: ''
    },
    backgroundConfig: {
        type: Object,
        default: () => ({
            bgClass: 'bg-red-100',
            patternClass: 'pattern-color-red-300'
        })
    }
})

// 二维码
const qrcode = computed(() => {
    return useQRCode(props.QRtext || 'https://zb.vip.qq.com/hybrid/emoticonmall/detail?id=240956')
})

// 暴露displaySection ref给父组件
const displaySection = ref(null)
defineExpose({
    displaySection
})
</script>

<style scoped>
.text-stroke {
    /* 添加阴影效果增强视觉效果，确保在不支持 -webkit-text-stroke 的浏览器中也有描边效果 */
    text-shadow:
        2px 2px 0 white,
        -2px 2px 0 white,
        2px -2px 0 white,
        -2px -2px 0 white,
        0 2px 0 white,
        0 -2px 0 white,
        2px 0 0 white,
        -2px 0 0 white;
}
</style>
