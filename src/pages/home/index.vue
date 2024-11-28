<template>
    <div class="w-screen h-full flex flex-col min-h-screen">
        <!--顶部导航栏-->
        <div class="h-[60px] w-full bg-zinc-500 flex items-center">
            <div class="text-[25px] text-white ml-5">表情包展示图生成器</div>
        </div>
        <!--内容部分-->
        <div class="w-full h-full min-h-[calc(100vh-60px)] flex-grow f-c-c flex-col bg-zinc-100">
            <div class="f-c-c my-3">
                <BreadCrumb></BreadCrumb>
            </div>
            <div class="flex h-full min-h-[1200px] flex-row w-[1100px] flex-grow mx-5 mb-5 rounded-md">
                <!--控件-->
                <div class="w-1/3 flex-grow mr-4 bg-white p-5">
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="picture">上传图片</Label>
                        <Input accept="image/*" v-model="uploadedFiles" @update:modelValue="handleFileChange"
                            id="picture" type="file" />
                    </div>
                </div>
                <!--展示-->
                <div class="w-2/3 flex flex-col bg-white p-5 pb-10 h-full relative bg-cover"
                    :style="{ backgroundImage: `url(${background})` }">
                    <div class="f-c-c w-full absolute top-[150px] left-10">
                        <div :data-content="MemeName" class="text-[60px] text-white font-[Maru] text drop-shadow-lg">
                            {{ MemeName }}
                        </div>
                        <div class="flex flex-col top-5 relative">
                            <div class="text-[20px] text-white font-[Maru] text drop-shadow-lg" data-content="表情包">表情包
                            </div>
                            <div class="text-[20px] text-white font-[Maru] text drop-shadow-lg" data-content="第六弹">第六弹
                            </div>
                        </div>
                    </div>
                    <div
                        class="mt-[200px] min-h-[600px] w-full grid grid-cols-4 gap-4 bg-sky-100 rounded-[20px] box-border p-5 border-8 border-sky-300">
                        <div class="w-full" v-for="file in uploadedFiles" :key="file.name">
                            <img v-if="file.type && file.type.startsWith('image/')" :src="file.url" :alt="file.name"
                                class="w-full h-auto object-cover border-4 border-white bg-white" />
                            <div v-else>{{ file.name }}</div>
                        </div>
                    </div>
                    <div class="w-full bg-sky-300 h-4 absolute bottom-0 left-0"></div>
                </div>
            </div>
        </div>
        <!--底部导航栏-->
        <div class=""></div>
    </div>
</template>
<script lang="js" setup>
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadCrumb from '@/components/BreadCrumb.vue';
import { ref } from 'vue'
import bg from '@/assets/photos/bg.png'

const uploadedFiles = ref([])
const handleFileChange = (files) => {
    if (files) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
        uploadedFiles.value = files
            .filter(file => allowedTypes.includes(file.type))
            .map(file => ({
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file)
            }))
    } else {
        uploadedFiles.value = []
    }
}

//表情包名称
const MemeName = ref('安梦梦Dream')
//背景
const background = ref(bg)
</script>
<style scoped>
.f-c-c {
    display: flex;
    justify-content: center;
    align-items: center;
}

.text {
    z-index: 0;
}

.text::after {
    content: attr(data-content);
    -webkit-text-stroke: 8px #000;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
}
</style>