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
                    <div class="f-c-c w-full absolute top-[125px] left-10">
                        <div :data-text="MemeName" class="text-[85px] font-[MaiYuan] text text-center">
                            {{ MemeName }}
                        </div>
                        <div class="flex flex-col top-5 relative">
                            <div class="text-[30px] font-[MaiYuan] text2 mb-[-18px]" data-text="表情包">表情包
                            </div>
                            <div class="text-[30px] font-[MaiYuan] text2" data-text="第六弹">第六弹
                            </div>
                        </div>
                    </div>
                    <div
                        class="mt-[200px] min-h-[600px] w-full grid grid-cols-4 gap-4 bg-sky-200 rounded-[20px] box-border p-5 border-8 border-sky-500">
                        <div class="w-full" v-for="file in uploadedFiles" :key="file.name">
                            <img v-if="file.type && file.type.startsWith('image/')" :src="file.url" :alt="file.name"
                                class="w-full h-auto object-cover
                                image-border" />
                            <div v-else>{{ file.name }}</div>
                        </div>
                    </div>
                    <div class="w-full bg-sky-500 h-4 absolute bottom-0 left-0"></div>
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

.text2 {
    -webkit-text-stroke: 4px white;
    /* 白色描边 */
    color: transparent;
    /* 透明文本颜色 */
    filter: drop-shadow(0 5px 0 #548eb6);
}

.text2::before {
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

.image-border {
    position: relative;
    filter: drop-shadow(3px 3px 0 rgba(255, 255, 255, 1))
            drop-shadow(-3px 3px 0 rgba(255, 255, 255, 1))
            drop-shadow(3px -3px 0 rgba(255, 255, 255, 1))
            drop-shadow(-3px -3px 0 rgba(255, 255, 255, 1));
}

.image-border::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25)); /* 向下的阴影 */
    pointer-events: none; /* 确保伪元素不会影响鼠标事件 */
}
</style>