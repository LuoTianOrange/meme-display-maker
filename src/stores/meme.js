import { ref, reactive,computed } from 'vue'
import { defineStore } from 'pinia'

export const useMemeStore = defineStore('meme', () => {
  // 上传的表情包文件
  const uploadedFiles = ref([])
  
  // 标题表情包
  const titlePhoto1 = ref(null)
  const titlePhoto2 = ref(null)
  const titlePhoto3 = ref(null)
  
  // 表情包基本信息
  const memeName = ref('表情包名称')
  const memeVersion = ref('第十一弹')
  const artistName = ref('')
  
  // 颜色配置
  const textColor1 = ref('#FF7800')
  const textColor2 = ref('#FFEABF')
  const shadowColor = ref('#BF5000')
  const bgColor = ref('#fca5a5') // 默认使用经典红色
  const textColor = ref('rgba(0, 0, 0, 0.80)')
  const borderColor = ref('#FF7800')
  const insideBgColor = ref('rgba(255, 234, 191, 0.6)')
  
  // 样式配置
  const textSize = ref(30)
  const useBgorColor = ref(false)
  const color1 = ref('#fff')
  const color2 = ref('')
  
  // 背景图片
  const background = ref(null)
  
  // 水印配置
  const enableWatermark = ref(false)
  const watermarkConfig = reactive({
    image: null,
    gap: [100, 100],
    width: 50,
    height: 50,
    opacity: 0.3,
    angle: 0,
    zIndex: 1000
  })
  
  // 二维码配置
  const enableQRcode = ref(false)
  const qrText = ref('https://zb.vip.qq.com/hybrid/emoticonmall/detail?id=240956')
  
  // 预定义颜色
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

  // 预设背景颜色搭配（用于背景模式）
  const presetBackgroundColors = ref([
    {
      name: '经典红色',
      bgClass: 'bg-red-100',
      patternClass: 'pattern-color-red-200'
    },
    {
      name: '清新蓝色',
      bgClass: 'bg-blue-100',
      patternClass: 'pattern-color-blue-200'
    },
    {
      name: '活力橙色',
      bgClass: 'bg-orange-100',
      patternClass: 'pattern-color-orange-200'
    },
    {
      name: '自然绿色',
      bgClass: 'bg-green-100',
      patternClass: 'pattern-color-green-200'
    },
    {
      name: '温馨粉色',
      bgClass: 'bg-pink-100',
      patternClass: 'pattern-color-pink-200'
    },
    {
      name: '优雅紫色',
      bgClass: 'bg-purple-100',
      patternClass: 'pattern-color-purple-200'
    },
    {
      name: '阳光黄色',
      bgClass: 'bg-yellow-100',
      patternClass: 'pattern-color-yellow-200'
    },
    {
      name: '清雅青色',
      bgClass: 'bg-cyan-100',
      patternClass: 'pattern-color-cyan-200'
    },
    {
      name: '简约灰色',
      bgClass: 'bg-gray-100',
      patternClass: 'pattern-color-gray-200'
    },
    {
      name: '经典黑白',
      bgClass: 'bg-gray-100',
      patternClass: 'pattern-color-gray-800'
    }
  ])

  // 当前选择的背景色索引
  const selectedBackgroundIndex = ref(0)

  // 背景颜色预设（用于简单的颜色选择）
  const backgroundColorPresets = ref([
    { name: '橙色渐变', color: '#FDEABF', description: '温暖的橙色背景' },
    { name: '蓝色清新', color: '#E3F2FD', description: '清新的蓝色背景' },
    { name: '绿色自然', color: '#E8F5E8', description: '自然的绿色背景' },
    { name: '粉色温馨', color: '#FCE4EC', description: '温馨的粉色背景' },
    { name: '紫色优雅', color: '#F3E5F5', description: '优雅的紫色背景' },
    { name: '黄色阳光', color: '#FFFDE7', description: '阳光的黄色背景' },
    { name: '青色清雅', color: '#E0F2F1', description: '清雅的青色背景' },
    { name: '灰色简约', color: '#F5F5F5', description: '简约的灰色背景' },
    { name: '白色纯净', color: '#FFFFFF', description: '纯净的白色背景' },
    { name: '米色温和', color: '#FFF8E1', description: '温和的米色背景' }
  ])

  // 设置上传的文件
  function setUploadedFiles(files) {
    uploadedFiles.value = files
  }

  // 添加上传的文件
  function addUploadedFiles(files) {
    uploadedFiles.value = [...uploadedFiles.value, ...files]
  }

  // 清除所有上传的文件
  function clearUploadedFiles() {
    uploadedFiles.value = []
  }

  // 设置标题图片
  function setTitlePhoto(key, photo) {
    if (key === 'titlePhoto1') {
      titlePhoto1.value = photo
    } else if (key === 'titlePhoto2') {
      titlePhoto2.value = photo
    } else if (key === 'titlePhoto3') {
      titlePhoto3.value = photo
    }
  }

  // 清除标题图片
  function clearTitlePhoto(key) {
    if (key === 'titlePhoto1') {
      titlePhoto1.value = null
    } else if (key === 'titlePhoto2') {
      titlePhoto2.value = null
    } else if (key === 'titlePhoto3') {
      titlePhoto3.value = null
    }
  }

  // 设置水印图片
  function setWatermarkImage(image) {
    watermarkConfig.image = image
  }

  // 设置背景颜色索引
  function setBackgroundIndex(index) {
    selectedBackgroundIndex.value = index
  }

  // 获取当前选择的背景颜色配置
  const currentBackgroundConfig = computed(() => {
    return presetBackgroundColors.value[selectedBackgroundIndex.value] || presetBackgroundColors.value[0]
  })

  return {
    // 状态
    uploadedFiles,
    titlePhoto1,
    titlePhoto2,
    titlePhoto3,
    memeName,
    memeVersion,
    artistName,
    textColor1,
    textColor2,
    shadowColor,
    bgColor,
    textColor,
    borderColor,
    insideBgColor,
    textSize,
    useBgorColor,
    color1,
    color2,
    background,
    enableWatermark,
    watermarkConfig,
    enableQRcode,
    qrText,
    predefineColors,
    presetBackgroundColors,
    backgroundColorPresets,
    selectedBackgroundIndex,
    currentBackgroundConfig,
    
    // 方法
    setUploadedFiles,
    addUploadedFiles,
    clearUploadedFiles,
    setTitlePhoto,
    clearTitlePhoto,
    setWatermarkImage,
    setBackgroundIndex
  }
})
