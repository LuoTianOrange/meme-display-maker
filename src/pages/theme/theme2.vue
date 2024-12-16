<template>
  <div
    class="flex h-full min-h-[1200px] flex-row w-[1100px] flex-grow mx-5 mb-5 rounded-md"
  >
    <!--控件-->
    <div class="w-1/3 flex-grow mr-4 bg-white p-5">
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <div>上传图片</div>
        <Input
          accept="image/*"
          v-model="uploadedFiles"
          @update:modelValue="handleFileChange"
          id="picture"
          type="file"
        />
        <div>表情包名称</div>
        <el-input v-model="MemeName" placeholder="请输入表情包名称"></el-input>
        <div>标题表情包1</div>
        <Input
          accept="image/*"
          @change="handleTitleFileChange($event, 'titlePhoto1')"
          id="titlePhoto1"
          type="file"
        />
        <div>标题表情包2</div>
        <Input
          accept="image/*"
          @change="handleTitleFileChange($event, 'titlePhoto2')"
          id="titlePhoto2"
          type="file"
        />
        <div>表情包代数</div>
        <el-input
          v-model="MemeVersion"
          placeholder="请输入表情包代数"
        ></el-input>
        <div>背景颜色</div>
        <el-color-picker
          v-model="BgColor"
          show-alpha
          :predefine="predefineColors"
        />
        <div>水印</div>
        <div>上传水印</div>
        <Input
          accept="image/*"
          @change="handleTitleFileChange($event, 'watermark')"
          id="watermark"
          type="file"
        />
        <div>开启水印</div>
        <el-switch v-model="enableWatermark" active-color="#13ce66" />
        <div>二维码</div>
        <el-input v-model="QRtext" placeholder="请输入二维码链接"></el-input>
      </div>
      <el-button class="mt-5" @click="downloadImage">生成展示图</el-button>
    </div>
    <!--展示-->
    <el-watermark
      class="w-2/3 flex flex-col h-full relative watermark"
      :image="watermarkConfig.image"
      :z-index="watermarkConfig.zIndex"
      :rotate="watermarkConfig.rotate"
      :gap="watermarkConfig.gap"
      :offset="watermarkConfig.offset"
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
          <div class="text-[50px] font-bold ml-3 text-[rgba(255,255,255,0.9)]">
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
          <div class="w-full" v-for="file in uploadedFiles" :key="file.name">
            <img
              v-if="file.type && file.type.startsWith('image/')"
              :src="file.url"
              :alt="file.name"
              class="w-full h-auto object-cover image-border"
            />
            <div v-else>{{ file.name }}</div>
          </div>
        </div>
      </div>
    </el-watermark>
  </div>
</template>
<script lang="js" setup>
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadCrumb from '@/components/BreadCrumb.vue';
import { ref,reactive } from 'vue'
import html2canvas from 'html2canvas'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const watermarkConfig = reactive({
  image: '',
  zIndex: 10,
  rotate: -22,
  gap: [100, 100],
  offset: [],
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
      console.log(watermarkConfig);

    }
  }
}
//表情包名称
const MemeName = ref('灯火橘Channel')
//标题表情包1
const titlePhoto1 = ref(null)
//标题表情包2
const titlePhoto2 = ref(null)
//水印
const enableWatermark = ref(false)
//背景颜色
const BgColor = ref('rgba(255, 234, 191, 0.6)')
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
//表情包代数
const MemeVersion = ref('第十一弹')
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

.watermark {
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 使水印不影响鼠标事件 */
}
</style>
