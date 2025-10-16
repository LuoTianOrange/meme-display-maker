<template>
  <div class="flex h-full lg:flex-row flex-col max-w-[1100px] w-full flex-grow m-5 rounded-md">
    <!--展示-->
    <div class="lg:w-2/3 w-full h-full flex items-start justify-center  bg-white border rounded-md p-4">
      <div class="preview-wrapper" :class="currentFontClass" :style="wrapperStyle">
        <div class="preview-content" :style="contentStyle" id="display-section">
          <WaterMark v-if="enableWatermark" class="w-full relative overflow-hidden" :image="watermarkConfig.image"
            :opacity="watermarkConfig.opacity" :z-index="watermarkConfig.zIndex" :gap="watermarkConfig.gap"
            :width="watermarkConfig.width" :height="watermarkConfig.height" :angle="watermarkConfig.angle">
            <DisplayContent ref="displayContentRef" :uploadedFiles="uploadedFiles" :titlePhoto1="currentTitlePhoto"
              :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName" :TextColor="TextColor"
              :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext" :backgroundConfig="backgroundConfig" />
          </WaterMark>

          <div class="w-full relative" v-else>
            <DisplayContent ref="displayContentRef" :uploadedFiles="uploadedFiles" :titlePhoto1="currentTitlePhoto"
              :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName" :TextColor="TextColor"
              :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext" :backgroundConfig="backgroundConfig" />
          </div>
        </div>
      </div>
    </div>
    <!-- 控制面板 -->
    <div class="lg:w-1/3 w-full h-full flex-grow lg:ml-4 lg:mt-0 mt-4 bg-white border rounded-md p-5 overflow-y-auto">
      <div class="p-4 space-y-6">

        <!-- 图片管理组件 -->
        <ImageListManager />

        <!-- 分割线 -->
        <div class="border-t border-gray-200"></div>
        <!-- 基本信息 -->
        <div class="space-y-4">
          <div class="text-[20px] font-bold">基本信息</div>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">表情包名称</label>
              <el-input v-model="MemeName" placeholder="请输入表情包名称" clearable></el-input>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">画师名称</label>
              <el-input v-model="ArtistName" placeholder="请输入画师名称" clearable></el-input>
            </div>
          </div>
        </div>

        <!-- 样式设置 -->
        <div class="space-y-4">
          <div class="text-[20px] font-bold">样式设置</div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">背景颜色</label>
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
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
            </div>

            <div class="flex flex-col space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium">文字颜色</label>
                <el-color-picker v-model="TextColor" show-alpha :predefine="predefineColors" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">文字大小: {{ TextSize }}px</label>
              <el-slider v-model="TextSize" :min="1" :max="50"></el-slider>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">字体选择</label>
              <el-select v-model="selectedFont" placeholder="选择字体" class="w-full">
                <el-option v-for="font in fontOptions" :key="font.value" :label="font.label" :value="font.value"
                  :style="{ fontFamily: font.family }">
                  {{ font.label }}
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- 水印设置 -->
        <div class="space-y-4">
          <div class="text-[20px] font-bold">水印设置</div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">开启水印</label>
              <el-switch v-model="enableWatermark" active-color="#13ce66" />
            </div>

            <div v-if="enableWatermark" class="space-y-3 pl-4 border-l-2 border-blue-200">
              <div>
                <label class="block text-sm font-medium mb-1">上传水印图片</label>
                <Input accept="image/*" @change="handleTitleFileChange($event, 'watermark')" id="watermark" type="file"
                  :multiple="false" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">水印间距</label>
                <div class="space-y-2">
                  <div>
                    <span class="text-xs">X轴: {{ watermarkConfig.gap[0] }}</span>
                    <el-slider v-model="watermarkConfig.gap[0]" :min="10" :max="200"></el-slider>
                  </div>
                  <div>
                    <span class="text-xs">Y轴: {{ watermarkConfig.gap[1] }}</span>
                    <el-slider v-model="watermarkConfig.gap[1]" :min="10" :max="200"></el-slider>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">水印大小</label>
                <div class="space-y-2">
                  <div>
                    <span class="text-xs">宽度: {{ watermarkConfig.width }}</span>
                    <el-slider v-model="watermarkConfig.width" :min="10" :max="150"></el-slider>
                  </div>
                  <div>
                    <span class="text-xs">高度: {{ watermarkConfig.height }}</span>
                    <el-slider v-model="watermarkConfig.height" :min="10" :max="150"></el-slider>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">不透明度: {{ (watermarkConfig.opacity * 100).toFixed(0)
                }}%</label>
                <el-slider v-model="watermarkConfig.opacity" :min="0" :max="1" :step="0.01"></el-slider>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">水印角度: {{ watermarkConfig.angle }}°</label>
                <el-slider v-model="watermarkConfig.angle" :min="-180" :max="180"></el-slider>
              </div>
            </div>
          </div>
        </div>

        <!-- 二维码设置 -->
        <div class="space-y-4">
          <div class="text-[20px] font-bold">二维码设置</div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">开启二维码</label>
              <el-switch v-model="enableQRcode" active-color="#13ce66" />
            </div>

            <div v-if="enableQRcode" class="pl-4 border-l-2 border-blue-200">
              <label class="block text-sm font-medium mb-1">二维码链接</label>
              <el-input v-model="QRtext" placeholder="请输入二维码链接"></el-input>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
          <el-button class="w-full" type="primary" size="large" @click="downloadImage"
            :disabled="uploadedFiles.length === 0">
            生成展示图
          </el-button>
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
import { ref, reactive, computed, watchEffect, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemeStore } from '@/stores/meme'
import { useWindowSize } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import WaterMark from '@/components/WaterMark.vue';
import DisplayContent from '@/components/DisplayContent.vue';
import ImageListManager from '@/components/ImageListManager.vue';
import { toPng } from 'html-to-image';

const { width, height } = useWindowSize()

// 使用共享的store
const memeStore = useMemeStore()

// 从store中获取响应式数据
const {
  uploadedFiles,
  titlePhoto1,
  titlePhoto2,
  currentTitlePhoto,
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

// 字体选择相关
const selectedFont = ref('MaiYuan')
const fontOptions = [
  { label: '荆南麦圆体 (MaiYuan)', value: 'MaiYuan', family: 'MaiYuan' },
  { label: '禅圆体 (Maru)', value: 'Maru', family: 'Maru' },
  { label: '汤圆体 (TangYuan)', value: 'tangyuan', family: 'tangyuan' },
  { label: '系统默认 (无衬线)', value: 'system', family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { label: '微软雅黑', value: 'microsoft', family: 'Microsoft YaHei, sans-serif' },
  { label: '宋体 (衬线)', value: 'serif', family: 'SimSun, serif' }
]

// 计算当前字体类名
const currentFontClass = computed(() => {
  const fontMap = {
    'MaiYuan': 'font-[MaiYuan]',
    'Maru': 'font-[Maru]',
    'tangyuan': 'font-[tangyuan]',
    'system': 'font-sans',
    'microsoft': 'font-[Microsoft_YaHei]',
    'serif': 'font-serif'
  }
  return fontMap[selectedFont.value] || 'font-[MaiYuan]'
})



// 根据当前背景颜色获取对应的 Tailwind 类配置
const backgroundConfig = computed(() => {
  // 直接使用 store 中当前选择的背景配置
  const currentConfig = presetBackgroundColors.value[selectedBackgroundIndex.value]
  return currentConfig || presetBackgroundColors.value[0]
})

// 预览容器 - 固定800px宽度，整体缩放适应屏幕
const PREVIEW_WIDTH = 800   // 固定预览宽度800px

// 计算缩放和包装器样式
const scale = computed(() => {
  // 简化计算：直接使用实际的预览区域宽度
  // 考虑到整体容器max-w-[1100px]的限制
  const containerMaxWidth = 1100
  const actualContainerWidth = Math.min(width.value, containerMaxWidth)

  let availableWidth
  if (width.value >= 1024) {
    // lg及以上：预览区域占2/3，但需要减去左侧面板和间距
    availableWidth = (actualContainerWidth * 2 / 3) - 40 // 减去padding和margin
  } else {
    // 小屏幕：预览区域占全宽度
    availableWidth = actualContainerWidth - 40
  }

  // 确保不会过小，最小缩放到0.3
  return Math.max(Math.min(availableWidth / PREVIEW_WIDTH, 1), 0.3)
})

// 获取实际内容高度（需要等DOM渲染完成）
const actualHeight = ref(0)

// 包装器样式 - 控制缩放后的占用空间
const wrapperStyle = computed(() => {
  return {
    width: `${PREVIEW_WIDTH * scale.value}px`,
    // 如果有实际高度，使用缩放后的高度；否则使用auto
    height: actualHeight.value > 0 ? `${actualHeight.value * scale.value}px` : 'auto',
    margin: '0 auto', // 水平居中
    overflow: 'visible'
  }
})

// 内容样式 - 固定800px宽度然后缩放
const contentStyle = computed(() => {
  return {
    width: `${PREVIEW_WIDTH}px`,
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left'
  }
})

// 选择背景颜色
const selectBackgroundColor = (preset, index) => {
  // 只更新背景配置索引，不再设置 BgColor
  memeStore.setBackgroundIndex(index)
}

// 处理水印上传
const handleTitleFileChange = (event, photoType) => {
  const file = event.target.files[0]
  if (file) {
    const photo = {
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file)
    }
    if (photoType === 'watermark') {
      memeStore.setWatermarkImage(photo.url) // 直接赋值URL字符串
    }
  }
}

// 保存图片
const displayContentRef = ref(null);

// 更新实际高度
const updateActualHeight = () => {
  nextTick(() => {
    if (displayContentRef.value && displayContentRef.value.displaySection) {
      actualHeight.value = displayContentRef.value.displaySection.offsetHeight
    }
  })
}

// 监听内容变化，更新高度
watchEffect(() => {
  // 当uploadedFiles变化时，重新计算高度
  uploadedFiles.value
  updateActualHeight()
})

onMounted(() => {
  updateActualHeight()
})

const downloadImage = async () => {
  if (uploadedFiles.value.length === 0) {
    toast.info('请先上传图片')
    console.warn('请先上传图片')
    return
  }

  const node = document.getElementById('display-section')
  if (!node) {
    toast.error('未找到预览元素')
    console.error('未找到预览元素')
    return
  }

  try {
    // 临时移除缩放，确保生成原始尺寸的图像
    const originalTransform = node.style.transform
    node.style.transform = 'scale(1)'
    node.style.width = `${PREVIEW_WIDTH}px`

    const dataUrl = await toPng(node, {
      width: PREVIEW_WIDTH, // 固定宽度800px
      pixelRatio: 2, // 高清输出
      backgroundColor: 'white' // 确保背景色
    })

    // 恢复原始样式
    node.style.transform = originalTransform
    node.style.width = ''

    const link = document.createElement('a')
    link.download = `${MemeName.value}展示图.png`
    toast.success('成功创建下载任务')
    link.href = dataUrl
    link.click()

  } catch (error) {
    toast.error('生成图片失败，请稍后重试', error)
    console.error('生成图片失败:', error)
    // 恢复样式，即使出错也要确保界面正常
    node.style.transform = contentStyle.value.transform
    node.style.width = contentStyle.value.width
  }
}
</script>
<style scoped>
.f-c-c {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-wrapper {
  display: inline-block;
  /* 使用inline-block以适应内容尺寸 */
}

.preview-content {
  display: block;
  /* transform缩放不会改变布局空间，需要手动调整 */
}
</style>
