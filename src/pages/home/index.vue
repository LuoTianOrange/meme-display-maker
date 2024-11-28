<template>
    <div class="w-screen h-full flex flex-col min-h-screen">
        <!--顶部导航栏-->
        <div class="h-[60px] w-full bg-zinc-500"></div>
        <!--内容部分-->
        <div class="w-full h-full min-h-[calc(100vh-60px)] flex-grow f-c-c flex-col bg-zinc-100">
            <div class="f-c-c my-3">
                <BreadCrumb></BreadCrumb>
            </div>
            <div class="flex h-full flex-row max-w-screen-lg w-full flex-grow mx-5 mb-5 rounded-md">
                <!--控件-->
                <div class="w-2/3 flex-grow mr-4 bg-white">
                    <div class="grid w-full max-w-sm items-center gap-1.5">
                        <Label for="picture">上传图片</Label>
                        <Input id="picture" type="file" />
                    </div>
                </div>
                <!--展示-->
                <div class="w-1/3 flex-grow bg-white rounded-md"></div>
            </div>
        </div>
        <!--底部导航栏-->
        <div class="w-full"></div>
    </div>
</template>
<script setup>
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadCrumb from '@/components/BreadCrumb.vue';
</script>
<style scoped>
.f-c-c {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>