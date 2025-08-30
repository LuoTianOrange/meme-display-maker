<template>
    <div ref="displaySection" class="w-full min-h-[200px]" :style="{ backgroundColor: BgColor }">
        <!--顶部-->
        <div class="flex flex-row justify-between items-center min-h-[150px]">
            <img v-if="titlePhoto1" :src="titlePhoto1.url" class="w-[150px] h-[150px]" />
            <div class="font-bold ml-3" :style="{ color: TextColor, fontSize: TextSize + 'px' }">
                {{ MemeName }}
            </div>
            <img v-if="titlePhoto2" :src="titlePhoto2.url" class="w-[150px] h-[150px]" />
            <img v-else-if="enableQRcode" :src="qrcode.value" class="w-[150px] h-[150px]" />
        </div>
        <!--表情包展示-->
        <div class="p-4">
            <div class="bg-white w-full grid grid-cols-4 gap-4 p-4 rounded-lg">
                <template v-if="uploadedFiles.length > 0">
                    <div v-for="file in uploadedFiles" :key="file.name" class="w-full">
                        <img v-if="file.type && file.type.startsWith('image/')" :src="file.url" :alt="file.name"
                            class="w-full h-auto object-cover" />
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
    BgColor: {
        type: String,
        default: '#ffffff'
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
