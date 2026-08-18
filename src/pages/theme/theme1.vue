<template>
  <div class="w-full max-w-[1100px] h-full flex lg:flex-row flex-col flex-grow m-5 rounded-md">
    <!--展示-->
    <div class="w-full lg:w-2/3 h-full flex justify-center items-start bg-white p-4 border rounded-md">
      <div class="preview-wrapper" :style="[wrapperStyle, { fontFamily: currentFontFamily }]">
        <div class="preview-content" :style="contentStyle">
          <WaterMark v-if="enableWatermark" class="w-full overflow-hidden relative" :image="watermarkConfig.image"
            :opacity="watermarkConfig.opacity" :z-index="watermarkConfig.zIndex" :gap="watermarkConfig.gap"
            :width="watermarkConfig.width" :height="watermarkConfig.height" :angle="watermarkConfig.angle">
            <DisplayContent :uploadedFiles="uploadedFiles" :titlePhoto1="currentTitlePhoto"
              :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName" :TextColor="TextColor"
              :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext" :backgroundConfig="backgroundConfig" />
          </WaterMark>

          <div class="w-full relative" v-else>
            <DisplayContent :uploadedFiles="uploadedFiles" :titlePhoto1="currentTitlePhoto"
              :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName" :TextColor="TextColor"
              :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext" :backgroundConfig="backgroundConfig" />
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的导出节点 -->
    <div class="export-node-wrapper" style="position: fixed; left: -9999px; top: 0;" aria-hidden="true">
      <div ref="exportNodeRef" :style="{ width: EXPORT_WIDTH + 'px', fontFamily: currentFontFamily }">
        <WaterMark v-if="enableWatermark" class="w-full overflow-hidden relative" :image="watermarkConfig.image"
          :opacity="watermarkConfig.opacity" :z-index="watermarkConfig.zIndex" :gap="watermarkConfig.gap"
          :width="watermarkConfig.width" :height="watermarkConfig.height" :angle="watermarkConfig.angle">
          <DisplayContent ref="exportContentRef" :uploadedFiles="uploadedFiles" :titlePhoto1="currentTitlePhoto"
            :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName" :TextColor="TextColor"
            :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext" :backgroundConfig="backgroundConfig" />
        </WaterMark>

        <div class="w-full relative" v-else>
          <DisplayContent ref="exportContentRef" :uploadedFiles="uploadedFiles" :titlePhoto1="currentTitlePhoto"
            :titlePhoto2="titlePhoto2" :MemeName="MemeName" :ArtistName="ArtistName" :TextColor="TextColor"
            :TextSize="TextSize" :enableQRcode="enableQRcode" :QRtext="QRtext" :backgroundConfig="backgroundConfig" />
        </div>
      </div>
    </div>
    <!-- 控制面板 -->
    <div class="w-full lg:w-1/3 h-full overflow-y-auto flex-grow bg-white mt-4 lg:mt-0 lg:ml-4 p-5 border rounded-md">
      <div class="space-y-6 p-4">

        <!-- 图片管理组件 -->
        <ImageListManager />

        <!-- 分割线 -->
        <div class="border-gray-200 border-t"></div>
        <!-- 基本信息 -->
        <div class="space-y-4">
          <div class="font-bold text-[20px]">基本信息</div>
          <div class="space-y-3">
            <div>
              <label class="block mb-1 font-medium text-sm">表情包名称</label>
              <el-input v-model="MemeName" placeholder="请输入表情包名称" clearable></el-input>
            </div>
            <div>
              <label class="block mb-1 font-medium text-sm">画师名称</label>
              <el-input v-model="ArtistName" placeholder="请输入画师名称" clearable></el-input>
            </div>
          </div>
        </div>

        <!-- 样式设置 -->
        <div class="space-y-4">
          <div class="font-bold text-[20px]">样式设置</div>
          <div class="space-y-4">
            <div>
              <label class="block mb-2 font-medium text-sm">背景颜色</label>
              <div class="gap-2 grid grid-cols-5">
                <div v-for="(preset, index) in presetBackgroundColors" :key="preset.name"
                  @click="selectBackgroundColor(preset, index)" :class="[
                    'w-12 h-12 rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-110 relative group',
                    preset.bgClass,
                    selectedBackgroundIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                  ]" :title="preset.name">
                  <!-- 选中状态的勾号 -->
                  <div v-if="selectedBackgroundIndex === index"
                    class="absolute inset-0 flex justify-center items-center drop-shadow-lg font-bold text-white text-lg">
                    ✓
                  </div>
                  <!-- 悬停时显示颜色名称 -->
                  <div
                    class="-top-8 left-1/2 z-10 absolute bg-gray-800 opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-white text-xs whitespace-nowrap transition-opacity -translate-x-1/2 transform">
                    {{ preset.name }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col space-y-2">
              <div class="flex justify-between items-center">
                <label class="block font-medium text-sm">文字颜色</label>
                <el-color-picker v-model="TextColor" show-alpha :predefine="predefineColors" />
              </div>
            </div>

            <div>
              <label class="block mb-2 font-medium text-sm">文字大小: {{ TextSize }}px</label>
              <el-slider v-model="TextSize" :min="1" :max="50"></el-slider>
            </div>

            <div>
              <label class="block mb-2 font-medium text-sm">字体选择</label>
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
          <div class="font-bold text-[20px]">水印设置</div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="font-medium text-sm">开启水印</label>
              <el-switch v-model="enableWatermark" active-color="#13ce66" />
            </div>

            <div v-if="enableWatermark" class="space-y-3 pl-4 border-blue-200 border-l-2">
              <div>
                <label class="block mb-1 font-medium text-sm">上传水印图片</label>
                <Input accept="image/*" @change="handleTitleFileChange($event, 'watermark')" id="watermark" type="file"
                  :multiple="false" />
              </div>

              <div>
                <label class="block mb-1 font-medium text-sm">水印间距</label>
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
                <label class="block mb-1 font-medium text-sm">水印大小</label>
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
                <label class="block mb-1 font-medium text-sm">不透明度: {{ (watermarkConfig.opacity * 100).toFixed(0)
                }}%</label>
                <el-slider v-model="watermarkConfig.opacity" :min="0" :max="1" :step="0.01"></el-slider>
              </div>

              <div>
                <label class="block mb-1 font-medium text-sm">水印角度: {{ watermarkConfig.angle }}°</label>
                <el-slider v-model="watermarkConfig.angle" :min="-180" :max="180"></el-slider>
              </div>
            </div>
          </div>
        </div>

        <!-- 二维码设置 -->
        <div class="space-y-4">
          <div class="font-bold text-[20px]">二维码设置</div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="font-medium text-sm">开启二维码</label>
              <el-switch v-model="enableQRcode" active-color="#13ce66" />
            </div>

            <div v-if="enableQRcode" class="pl-4 border-blue-200 border-l-2">
              <label class="block mb-1 font-medium text-sm">二维码链接</label>
              <el-input v-model="QRtext" placeholder="请输入二维码链接"></el-input>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="bottom-0 sticky bg-white pt-4 border-gray-200 border-t">
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

// 当前选中字体的 font-family。
const currentFontFamily = computed(() => {
  const familyMap = {
    'MaiYuan': "'MaiYuan', 'Maru', 'tangyuan', sans-serif",
    'Maru': "'Maru', 'MaiYuan', 'tangyuan', sans-serif",
    'tangyuan': "'tangyuan', 'MaiYuan', 'Maru', sans-serif",
    'system': "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    'microsoft': "'Microsoft YaHei', '微软雅黑', sans-serif",
    'serif': "SimSun, 'Times New Roman', serif"
  }
  return familyMap[selectedFont.value] || familyMap['MaiYuan']
})



// 根据当前背景颜色获取对应的 Tailwind 类配置
const backgroundConfig = computed(() => {
  // 直接使用 store 中当前选择的背景配置
  const currentConfig = presetBackgroundColors.value[selectedBackgroundIndex.value]
  return currentConfig || presetBackgroundColors.value[0]
})

// 导出设计尺寸
const EXPORT_WIDTH = 800

// 计算缩放和包装器样式
const scale = computed(() => {

  const containerMaxWidth = 1100
  const actualContainerWidth = Math.min(width.value, containerMaxWidth)

  let availableWidth
  if (width.value >= 1024) {
    availableWidth = (actualContainerWidth * 2 / 3) - 40 // 减去padding和margin
  } else {
    // 小屏幕：预览区域占全宽度
    availableWidth = actualContainerWidth - 40
  }

  // 确保不会过小，最小缩放到0.3
  return Math.max(Math.min(availableWidth / EXPORT_WIDTH, 1), 0.3)
})

// 获取实际内容高度（需要等DOM渲染完成）
const actualHeight = ref(0)

// 包装器样式 - 控制缩放后的占用空间（预览）
const wrapperStyle = computed(() => {
  return {
    width: `${EXPORT_WIDTH * scale.value}px`,
    // 如果有实际高度，使用缩放后的高度；否则使用auto
    height: actualHeight.value > 0 ? `${actualHeight.value * scale.value}px` : 'auto',
    margin: '0 auto', // 水平居中
    overflow: 'visible'
  }
})

// 内容样式 - 固定EXPORT_WIDTH宽度然后缩放（预览）
const contentStyle = computed(() => {
  return {
    width: `${EXPORT_WIDTH}px`,
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

// 导出节点与高度测量
const exportNodeRef = ref(null)
const exportContentRef = ref(null)

// 更新实际高度（从导出节点测量，预览缩放仅做视觉展示）
const updateActualHeight = () => {
  nextTick(() => {
    if (exportContentRef.value && exportContentRef.value.displaySection) {
      actualHeight.value = exportContentRef.value.displaySection.offsetHeight
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
  // 预加载全部自定义字体：切换字体即时生效，也保证导出时字体已就绪
  if (document.fonts) {
    document.fonts.load('32px MaiYuan').catch(() => {})
    document.fonts.load('32px Maru').catch(() => {})
    document.fonts.load('32px tangyuan').catch(() => {})
  }
})

const downloadImage = async () => {
  if (uploadedFiles.value.length === 0) {
    toast.info('请先上传图片')
    console.warn('请先上传图片')
    return
  }

  const node = exportNodeRef.value
  if (!node) {
    toast.error('未找到导出元素')
    console.error('未找到导出元素')
    return
  }

  try {
    // 等待字体加载完成，确保导出的文字样式正确
    await document.fonts.ready
    await nextTick()

    // 直接截取固定设计尺寸的隐藏节点，不做任何 transform 处理，
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: 'white'
    })

    const link = document.createElement('a')
    link.download = `${MemeName.value}展示图.png`
    link.href = dataUrl
    link.click()
    toast.success('成功创建下载任务')
  } catch (error) {
    toast.error('生成图片失败，请稍后重试')
    console.error('生成图片失败:', error)
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
}

.preview-content {
  display: block;
}
</style>
