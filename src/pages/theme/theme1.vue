<template>
  <div class="flex h-full lg:flex-row flex-col-reverse max-w-[1100px] w-full flex-grow m-5 rounded-md">
    <!--控件-->
    <div class="lg:w-1/3 w-full h-full flex-grow lg:mr-4 lg:mt-0 mt-4 bg-white p-5 sticky">
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <div class="text-[20px] font-bold">上传文件</div>
        <div>上传图片</div>
        <div class="w-full flex flex-row flex-nowrap items-center">
          <Input ref="fileInput" accept="image/*" @change="handleFileChange" id="picture" type="file" multiple />
          <el-button class="ml-2" v-if="uploadedFiles.length > 0" @click="cleanFiles">删除</el-button>
        </div>
        <div>标题表情包</div>
        <div class="w-full flex flex-row flex-nowrap items-center">
          <Input ref="photoInput1" class="w-full" accept="image/*"
            @change="handleTitleFileChange($event, 'titlePhoto1')" id="titlePhoto1" type="file" :multiple="false" />
          <el-button class="ml-2" v-if="titlePhoto1" @click="cleanPhoto1">删除</el-button>
        </div>
        <!-- <div>标题表情包2</div>
        <div class="w-full flex flex-row flex-nowrap items-center">
          <Input ref="photoInput2" class="w-full" accept="image/*"
            @change="handleTitleFileChange($event, 'titlePhoto2')" id="titlePhoto2" type="file" :multiple="false" />
          <el-button class="ml-2" v-if="titlePhoto2" @click="cleanPhoto2">删除</el-button>
        </div> -->
        <div class="text-[20px] font-bold">补充信息</div>
        <div>表情包名称</div>
        <el-input v-model="MemeName" placeholder="请输入表情包名称" clearable></el-input>
        <div>画师名称</div>
        <el-input v-model="ArtistName" placeholder="请输入画师名称" clearable></el-input>

        <div>背景颜色</div>
        <div class="grid grid-cols-5 gap-2 mb-3">
          <div v-for="(preset, index) in presetBackgroundColors" :key="preset.name"
            @click="selectBackgroundColor(preset, index)" :class="[
              'w-12 h-12 rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-110 relative group',
              preset.bgClass,
              selectedBackgroundIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
            ]" :title="preset.name">
            <!-- 选中状态的勾号 -->
            <div v-if="selectedBackgroundIndex === index"
              class="absolute inset-0 flex items-center justify-center text-white text-lg font-bold drop-shadow-lg">
              ✓
            </div>
            <!-- 悬停时显示颜色名称 -->
            <div
              class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {{ preset.name }}
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center">
          <div class="mr-3">文字颜色</div>
          <el-color-picker v-model="TextColor" show-alpha :predefine="predefineColors" />
        </div>
        <div>文字大小</div>
        <el-slider v-model="TextSize" :min="1" :max="50"></el-slider>
        <div class="text-[20px] font-bold">水印</div>
        <div>开启水印</div>
        <el-switch v-model="enableWatermark" active-color="#13ce66" />
        <div v-if="enableWatermark" class="flex flex-col">
          <div>上传水印</div>
          <Input accept="image/*" @change="handleTitleFileChange($event, 'watermark')" id="watermark" type="file"
            :multiple="false" />
          <div>水印间距</div>
          X：<el-slider v-model="watermarkConfig.gap[0]"></el-slider>
          Y：<el-slider v-model="watermarkConfig.gap[1]"></el-slider>
          <div>水印大小</div>
          宽度：<el-slider v-model="watermarkConfig.width" :min="1" :max="100"></el-slider>
          高度：<el-slider v-model="watermarkConfig.height" :min="1" :max="100"></el-slider>
          <div>不透明度</div>
          <el-slider v-model="watermarkConfig.opacity" :min="0" :max="1" :step="0.01"></el-slider>
          <div>水印角度</div>
          <el-slider v-model="watermarkConfig.angle" :min="-180" :max="180"></el-slider>
        </div>
        <div class="text-[20px] font-bold">二维码</div>
        <div>开启二维码</div>
        <el-switch v-model="enableQRcode" active-color="#13ce66" />
        <div v-if="enableQRcode">
          <div>二维码链接</div>
          <el-input v-model="QRtext" placeholder="请输入二维码链接"></el-input>
        </div>
      </div>
      <el-button class="mt-5" @click="downloadImage">生成展示图</el-button>
    </div>
    <!--展示-->
    <div class="lg:w-2/3 w-full h-full font-[MaiYuan]" id="display-section">
      <WaterMark v-if="enableWatermark" class="w-full flex flex-col h-full relative overflow-hidden"
        :image="watermarkConfig.image" :opacity="watermarkConfig.opacity" :z-index="watermarkConfig.zIndex"
        :gap="watermarkConfig.gap" :width="watermarkConfig.width" :height="watermarkConfig.height"
        :angle="watermarkConfig.angle">
        <DisplayContent ref="displayContentRef" :uploadedFiles="uploadedFiles" :titlePhoto1="titlePhoto1"
          :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName"
          :TextColor="TextColor" :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext"
          :backgroundConfig="backgroundConfig" />
      </WaterMark>

      <div class="w-full flex flex-col h-full relative" v-else>
        <DisplayContent ref="displayContentRef" :uploadedFiles="uploadedFiles" :titlePhoto1="titlePhoto1"
          :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName"
          :TextColor="TextColor" :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext"
          :backgroundConfig="backgroundConfig" />
      </div>
    </div>
  </div>
</template>
<script lang="js" setup>
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadCrumb from '@/components/BreadCrumb.vue';
import { ref, reactive, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemeStore } from '@/stores/meme'
import { useWindowSize } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import WaterMark from '@/components/WaterMark.vue';
import DisplayContent from '@/components/DisplayContent.vue';
import { toPng } from 'html-to-image';

const { width, height } = useWindowSize()

// 使用共享的store
const memeStore = useMemeStore()

// 从store中获取响应式数据
const {
  uploadedFiles,
  titlePhoto1,
  titlePhoto2,
  memeName: MemeName,
  artistName: ArtistName,
  textColor: TextColor,
  textSize: TextSize,
  enableWatermark,
  watermarkConfig,
  enableQRcode,
  qrText: QRtext,
  predefineColors,
  presetBackgroundColors,
  selectedBackgroundIndex
} = storeToRefs(memeStore)

// 根据当前背景颜色获取对应的 Tailwind 类配置
const backgroundConfig = computed(() => {
  // 直接使用 store 中当前选择的背景配置
  const currentConfig = presetBackgroundColors.value[selectedBackgroundIndex.value]
  return currentConfig || presetBackgroundColors.value[0]
})

// 选择背景颜色
const selectBackgroundColor = (preset, index) => {
  // 只更新背景配置索引，不再设置 BgColor
  memeStore.setBackgroundIndex(index)
}

let fileInput = ref(null)
let photoInput1 = ref(null)
let photoInput2 = ref(null)

const handleFileChange = (e) => {
  let files = Array.from(e.target.files)
  if (files) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
    const processedFiles = files
      .filter(file => allowedTypes.includes(file.type))
      .map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      }))
    memeStore.setUploadedFiles(processedFiles)
  } else {
    memeStore.clearUploadedFiles()
  }
}

const cleanFiles = () => {
  memeStore.clearUploadedFiles()
  fileInput.value.input.value = ''//清空input已选择的文件
}

const cleanPhoto1 = () => {
  memeStore.clearTitlePhoto('titlePhoto1')
  photoInput1.value.input.value = ''//清空input已选择的文件
}

const cleanPhoto2 = () => {
  memeStore.clearTitlePhoto('titlePhoto2')
  photoInput2.value.input.value = ''//清空input已选择的文件
}

// 处理上传的标题图片和水印
const handleTitleFileChange = (event, photoType) => {
  const file = event.target.files[0]
  if (file) {
    const photo = {
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file)
    }
    if (photoType === 'titlePhoto1') {
      memeStore.setTitlePhoto('titlePhoto1', photo)
    } else if (photoType === 'titlePhoto2') {
      memeStore.setTitlePhoto('titlePhoto2', photo)
    } else if (photoType === 'watermark') {
      memeStore.setWatermarkImage(photo.url) // 直接赋值URL字符串
    }
  }
}

//保存图片
const displayContentRef = ref(null);

const downloadImage = () => {
  const node = document.getElementById('display-section')
  toPng(node)
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = `${MemeName.value}展示图.png`
      link.href = dataUrl
      link.click()
    })
    .catch((error) => {
      console.error('oops, something went wrong!', error)
    });
}
</script>
<style scoped>
.f-c-c {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
