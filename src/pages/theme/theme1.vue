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
        <div>标题表情包3</div>
        <Input
          accept="image/*"
          @change="handleTitleFileChange($event, 'titlePhoto3')"
          id="titlePhoto3"
          type="file"
        />
        <div>字体颜色/阴影颜色</div>
        <div class="flex flex-row">
          <el-color-picker v-model="textColor1" :predefine="predefineColors" />
          <el-color-picker v-model="textColor2" :predefine="predefineColors" />
          <div class="mx-3">|</div>
          <el-color-picker v-model="shadowColor" :predefine="predefineColors" />
        </div>
        <div>表情包代数</div>
        <el-input
          v-model="MemeVersion"
          placeholder="请输入表情包代数"
        ></el-input>
        <div>外背景</div>
        <el-switch
          v-model="useBgorColor"
          class="mb-2"
          active-text="使用图片"
          inactive-text="使用颜色"
        />
        <div class="flex flex-row items-center">
          <el-color-picker v-model="color1" :predefine="predefineColors" />
          <el-color-picker v-model="color2" :predefine="predefineColors" />
        </div>
        <div>上传背景</div>
        <Input
          accept="image/*"
          v-model="background"
          @update:modelValue="background"
          id="background"
          type="file"
        />
        <div>内背景</div>
        <el-color-picker
          v-model="insideBgColor"
          show-alpha
          :predefine="predefineColors"
        />
        <div>边框</div>
        <el-color-picker v-model="borderColor" :predefine="predefineColors" />
        <div>二维码</div>
        <el-input v-model="QRtext" placeholder="请输入二维码链接"></el-input>
      </div>
      <el-button class="mt-5" @click="downloadImage">生成展示图</el-button>
    </div>
    <!--展示-->
    <div
      ref="displaySection"
      class="w-2/3 flex flex-col bg-white p-5 pb-10 h-full relative bg-cover"
      :style="backgroundStyle()"
    >
      <img
        :src="qrcode"
        class="absolute top-5 left-5 w-[100px] h-[100px] bg-orange-500"
      />
      <!--顶部表情包-->
      <div class="absolute top-[30px] w-full f-c-c flex justify-center">
        <img
          :src="titlePhoto1.url"
          v-if="titlePhoto1"
          class="mt-3 max-h-[140px] overflow-hidden w-[140px] h-full object-cover -rotate-12 image-border"
        />
        <img
          :src="titlePhoto2.url"
          v-if="titlePhoto2"
          class="w-[160px] max-h-[160px] overflow-hidden h-full object-cover image-border"
        />
        <img
          :src="titlePhoto3.url"
          v-if="titlePhoto3"
          class="mt-3 max-h-[140px] overflow-hidden w-[140px] h-full object-cover rotate-12 image-border"
        />
      </div>
      <!--表情包名称-->
      <div class="f-c-c w-full absolute top-[125px] left-10">
        <div
          :data-text="MemeName"
          class="text-[85px] font-[MaiYuan] text text-center"
          :style="{
            '--textColor1': textColor1,
            '--textColor2': textColor2,
            '--shadowColor': shadowColor,
          }"
        >
          {{ MemeName }}
        </div>
        <div class="flex flex-col top-5 relative">
          <div
            class="text-[30px] font-[MaiYuan] text2 mb-[-18px]"
            data-text="表情包"
            :style="{
              '--textColor1': textColor1,
              '--textColor2': textColor2,
              '--shadowColor': shadowColor,
            }"
          >
            表情包
          </div>
          <div
            class="text-[30px] font-[MaiYuan] text2"
            :data-text="MemeVersion"
            :style="{
              '--textColor1': textColor1,
              '--textColor2': textColor2,
              '--shadowColor': shadowColor,
            }"
          >
            {{ MemeVersion }}
          </div>
        </div>
      </div>
      <!--表情包展示-->
      <div
        class="mt-[200px] min-h-[600px] w-full grid grid-cols-4 gap-4 rounded-[20px] box-border p-5 border-8"
        :style="{
          borderColor: borderColor,
          backgroundColor: insideBgColor,
        }"
      >
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
      <!--底部边框-->
      <div
        :style="{ backgroundColor: borderColor }"
        class="w-full h-4 absolute bottom-0 left-0"
      ></div>
    </div>
  </div>
</template>
<script lang="js" setup>
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BreadCrumb from '@/components/BreadCrumb.vue';
import { ref } from 'vue'

import { useQRCode } from '@vueuse/integrations/useQRCode'

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

//处理标题表情包
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
    } else if (photoType === 'titlePhoto3') {
      titlePhoto3.value = photo
    }
  }
}

const backgroundStyle = () => {
    if (useBgorColor.value) {
        return { backgroundImage: `url(${background.value})` };
    } else {
        if (color2.value) {
            return { background: `linear-gradient(${color1.value}, ${color2.value})` };
        } else {
            return { backgroundColor: color1.value };
        }
    }
}

//表情包名称
const MemeName = ref('灯火橘Channel')
//标题表情包1
const titlePhoto1 = ref(null)
//标题表情包2
const titlePhoto2 = ref(null)
//标题表情包3
const titlePhoto3 = ref(null)

//背景
const useBgorColor = ref(false)
const background = ref(bg)
//背景渐变色1
const color1 = ref('#fff')
//背景渐变色2
const color2 = ref('')
//内背景颜色
const insideBgColor = ref('rgba(255, 234, 191, 0.6)')
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
//边框颜色
const borderColor = ref('#FF7800')
//文字渐变色1
const textColor1 = ref('#FF7800')
//文字渐变色2
const textColor2 = ref('#FFEABF')
//阴影颜色
const shadowColor = ref('#BF5000')
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

.text {
  -webkit-text-stroke: 8px white;
  /* 白色描边 */
  color: transparent;
  /* 透明文本颜色 */
  filter: drop-shadow(0 5px 0 var(--shadowColor));
}

.text::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(var(--textColor1), var(--textColor2));
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
  filter: drop-shadow(0 5px 0 var(--shadowColor));
}

.text2::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(var(--textColor1), var(--textColor2));
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
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  /* 向下的阴影 */
  pointer-events: none;
  /* 确保伪元素不会影响鼠标事件 */
}
</style>
