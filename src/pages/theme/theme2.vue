<template>
  <div
    class="flex h-full min-h-[1200px] flex-row w-[1100px] flex-grow mx-5 mb-5 rounded-md"
  >
    <!--控件-->
    <div class="w-1/3 flex-grow mr-4 bg-white p-5">
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <div class="text-[20px] font-bold">上传文件</div>
        <div>上传图片</div>
        <Input
          accept="image/*"
          v-model="uploadedFiles"
          @update:modelValue="handleFileChange"
          id="picture"
          type="file"
        />
        <div>标题表情包1</div>
        <Input
          accept="image/*"
          @change="handleTitleFileChange($event, 'titlePhoto1')"
          id="titlePhoto1"
          type="file"
          :multiple="false"
        />
        <div>标题表情包2</div>
        <Input
          accept="image/*"
          @change="handleTitleFileChange($event, 'titlePhoto2')"
          id="titlePhoto2"
          type="file"
          :multiple="false"
        />
        <div class="text-[20px] font-bold">补充信息</div>
        <div>表情包名称</div>
        <el-input v-model="MemeName" placeholder="请输入表情包名称"></el-input>
        <div class="flex flex-row items-center">
          <div class="mr-3">背景颜色</div>
          <el-color-picker
          class="mr-3"
            v-model="BgColor"
            show-alpha
            :predefine="predefineColors"
          />
          <div class="mr-3">文字颜色</div>
          <el-color-picker
            v-model="TextColor"
            show-alpha
            :predefine="predefineColors"
          />
        </div>
        <div>文字大小</div>
        <el-slider
          v-model="TextSize"
          :min="1"
          :max="50"
        ></el-slider>
        <div class="text-[20px] font-bold">水印</div>
        <div>上传水印</div>
        <Input
          accept="image/*"
          @change="handleTitleFileChange($event, 'watermark')"
          id="watermark"
          type="file"
          :multiple="false"
        />
        <div>开启水印</div>
        <el-switch v-model="enableWatermark" active-color="#13ce66" />
        <div v-if="enableWatermark" class="flex flex-col">
            <div>水印间距</div>
            X：<el-slider
            v-model="watermarkConfig.gap[0]"
            ></el-slider>
            Y：<el-slider
            v-model="watermarkConfig.gap[1]"
            ></el-slider>
            <div>水印大小</div>
            宽度：<el-slider v-model="watermarkConfig.width" :min="1" :max="100"></el-slider>
            高度：<el-slider v-model="watermarkConfig.height" :min="1" :max="100"></el-slider>
            <div>不透明度</div>
            <el-slider v-model="watermarkConfig.opacity" :min="0" :max="1" :step="0.01"></el-slider>
        </div>
        <div class="text-[20px] font-bold">二维码</div>
        <div>二维码链接</div>
        <el-input v-model="QRtext" placeholder="请输入二维码链接"></el-input>
      </div>
      <el-button class="mt-5" @click="downloadImage">生成展示图</el-button>
    </div>
    <!--展示-->
    <WaterMark
      v-if="enableWatermark"
      class="w-2/3 flex flex-col h-full relative overflow-hidden"
      :image="watermarkConfig.image"
      :opacity="watermarkConfig.opacity"
      :z-index="watermarkConfig.zIndex"
      :gap="watermarkConfig.gap"
      :width="50"
      :height="50"
    >
      <div
        ref="displaySection"
        class="w-full min-h-[600px]"
        :style="{ backgroundColor: BgColor }"
      >
        <!--顶部-->
        <div class="flex flex-row justify-between items-center">
          <img
            v-if="titlePhoto1"
            :src="titlePhoto1.url"
            class="w-[150px] h-[150px]"
          />
          <div
            class="font-bold ml-3"
            :style="{ color: TextColor, fontSize: TextSize + 'px' }"
          >
            {{ MemeName }}
          </div>
          <img
            v-if="titlePhoto2"
            :src="titlePhoto2.url"
            class="w-[150px] h-[150px]"
          />
        </div>
        <!--表情包展示-->
        <div class="bg-white w-full grid grid-cols-4 gap-4 p-4 mb-5">
          <template v-if="uploadedFiles.length > 0">
            <div v-for="file in uploadedFiles" :key="file.name" class="w-full">
              <img
                v-if="file.type && file.type.startsWith('image/')"
                :src="file.url"
                :alt="file.name"
                class="w-full h-auto object-cover border-2 border-gray-300 rounded-lg"
              />
              <div v-else class="text-center">{{ file.name }}</div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="i in 16"
              :key="i"
              class="flex items-center justify-center w-full aspect-square bg-gray-200 text-gray-600 text-2xl border-2 border-dashed border-gray-300 rounded-lg"
            >
              {{ i }}
            </div>
          </template>
        </div>
      </div>
    </WaterMark>
    <div class="w-2/3 flex flex-col h-full relative" v-else>
      <div
        ref="displaySection"
        class="w-full min-h-[600px]"
        :style="{ backgroundColor: BgColor }"
      >
        <!--顶部-->
        <div class="flex flex-row justify-between items-center">
          <img
            v-if="titlePhoto1"
            :src="titlePhoto1.url"
            class="w-[150px] h-[150px]"
          />
          <div
            class="font-bold ml-3"
            :style="{ color: TextColor, fontSize: TextSize + 'px' }"
          >
            {{ MemeName }}
          </div>
          <img
            v-if="titlePhoto2"
            :src="titlePhoto2.url"
            class="w-[150px] h-[150px]"
          />
        </div>
        <!--表情包展示-->
        <div class="bg-white w-full grid grid-cols-4 gap-4 p-4 mb-5">
          <template v-if="uploadedFiles.length > 0">
            <div v-for="file in uploadedFiles" :key="file.name" class="w-full">
              <img
                v-if="file.type && file.type.startsWith('image/')"
                :src="file.url"
                :alt="file.name"
                class="w-full h-auto object-cover"
              />
              <div v-else class="text-center">{{ file.name }}</div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="i in 16"
              :key="i"
              class="flex items-center justify-center w-full aspect-square bg-gray-200 text-gray-600 text-2xl border-2 border-dashed border-gray-300 rounded-lg"
            >
              {{ i }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js" setup>
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadCrumb from '@/components/BreadCrumb.vue';
import { ref,reactive,computed } from 'vue'
import html2canvas from 'html2canvas'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import WaterMark from '@/components/WaterMark.vue';

const watermarkConfig = reactive({
  image: '',
  zIndex: 10,
  rotate: -22,
  gap: [100 , 100],
  width: 50,
  height: 50,
  opacity: 0.1
})

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
      titlePhoto1.value = photo
    } else if (photoType === 'titlePhoto2') {
      titlePhoto2.value = photo
    } else if (photoType === 'watermark') {
      watermarkConfig.image = photo.url // 直接赋值URL字符串
    }
  }
}
//表情包名称
const MemeName = ref('表情包名称')
//标题表情包1
const titlePhoto1 = ref(null)
//标题表情包2
const titlePhoto2 = ref(null)
//水印
const enableWatermark = ref(false)
//背景颜色
const BgColor = ref('rgba(255, 234, 191, 0.87)')
//文字颜色
const TextColor = ref('rgba(255, 69, 0, 0.87)')
//文字大小
const TextSize = ref(30)
//预定义颜色
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

//二维码
const QRtext = ref('https://zb.vip.qq.com/hybrid/emoticonmall/detail?id=240956')
const qrcode = useQRCode(QRtext)
//保存图片
const displaySection = ref(null);
const downloadImage = () => {
  const element = displaySection.value;
  html2canvas(element).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = '表情包展示图.png';
    link.click();
  });
};
</script>
<style scoped>
.f-c-c {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
