<template>
  <div class="w-full h-full flex flex-col min-h-screen">
    <!--顶部导航栏-->
    <div class="h-[60px] w-full bg-zinc-500 flex items-center">
      <div class="text-[25px] text-white ml-5">表情包展示图生成器</div>
    </div>
    <!--内容部分-->
    <div class="w-full h-full min-h-[calc(100vh-60px)] flex-grow f-c-c flex-col bg-zinc-100">
      <div class="f-c-c my-3">
        <BreadCrumb></BreadCrumb>
      </div>
      <RouterView></RouterView>
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
import html2canvas from 'html2canvas'
import { useQRCode } from '@vueuse/integrations/useQRCode'

import bg from '@/assets/photos/5de6de.jpg'
// import photo1 from '@/assets/photos/20.png'
// import photo2 from '@/assets/photos/08.png'
// import photo3 from '@/assets/photos/14.png'

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
