<template>
  <div class="w-full">
    <div class="text-[20px] font-bold mb-3">图片管理</div>
    
    <!-- 上传区域 -->
    <div class="mb-4">
      <div class="mb-2">添加图片</div>
      <div class="flex items-center gap-2">
        <el-button @click="triggerFileInput" type="primary">
          选择图片
        </el-button>
        <input 
          ref="fileInput" 
          accept="image/*" 
          @change="handleFileAdd" 
          type="file" 
          multiple 
          class="hidden"
        />
        <el-button v-if="uploadedFiles.length > 0" @click="clearAllFiles" type="danger">
          清空全部
        </el-button>
      </div>
    </div>

    <!-- 图片列表 -->
    <div v-if="uploadedFiles.length > 0" class="mb-4">
      <div class="mb-2">图片列表（{{ uploadedFiles.length }}张）</div>
      <div class="text-xs text-gray-500 mb-2">可拖拽排序，影响展示图中的显示顺序</div>
      
      <div 
        ref="listContainer"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-3 image-list-container border rounded-lg p-3 bg-gray-50 narrow-screen-single-col"
      >
        <div 
          v-for="(file, index) in uploadedFiles" 
          :key="file.id"
          class="relative group cursor-move border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-blue-400 transition-colors image-item"
          :class="{ 'border-blue-500 bg-blue-50': selectedTitleFromList === file.id }"
        >
          <!-- 图片预览 -->
          <div class="aspect-square relative">
            <img 
              :src="file.url" 
              :alt="file.name" 
              class="w-full h-full object-cover"
            />
            
            <!-- 遮罩层 -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 md:group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-100 flex gap-1 transition-opacity">
                <!-- 设为标题按钮 -->
                <el-button 
                  @click.stop="setAsTitle(file.id)"
                  @mousedown.stop
                  @touchstart.stop
                  size="small"
                  :type="selectedTitleFromList === file.id ? 'primary' : 'default'"
                  class="text-xs"
                >
                  {{ selectedTitleFromList === file.id ? '已选' : '标题' }}
                </el-button>
                <!-- 删除按钮 -->
                <el-button 
                  @click.stop="removeFile(file.id)"
                  @mousedown.stop
                  @touchstart.stop
                  size="small"
                  type="danger"
                  class="text-xs"
                >
                  删除
                </el-button>
              </div>
            </div>

            <!-- 标题标识 -->
            <div 
              v-if="selectedTitleFromList === file.id" 
              class="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded"
            >
              标题
            </div>

            <!-- 序号 -->
            <div class="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
              {{ index + 1 }}
            </div>
          </div>

          <!-- 文件名 -->
          <div class="p-1 text-xs text-gray-600 truncate bg-white" :title="file.name">
            {{ file.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 标题选择区域 -->
    <div class="mb-4">
      <div class="text-[18px] font-semibold mb-2">标题表情包</div>
      <div class="text-sm text-gray-600 mb-2">
        可以从图片列表中选择作为标题，或单独上传标题图片
      </div>
      
      <!-- 当前标题显示 -->
      <div v-if="currentTitlePhoto" class="mb-3 p-3 border rounded-lg bg-blue-50">
        <div class="text-sm font-medium mb-2">当前标题图片：</div>
        <div class="flex items-center gap-3">
          <img 
            :src="currentTitlePhoto.url" 
            :alt="currentTitlePhoto.name" 
            class="w-16 h-16 object-cover rounded border"
          />
          <div class="flex-1">
            <div class="text-sm font-medium">{{ currentTitlePhoto.name }}</div>
            <div class="text-xs text-gray-500">
              {{ selectedTitleFromList ? '来源：图片列表' : '来源：单独上传' }}
            </div>
          </div>
          <el-button @click="clearTitle" size="small" type="danger">
            清除
          </el-button>
        </div>
      </div>

      <!-- 单独上传标题 -->
      <div class="flex items-center gap-2">
        <el-button @click="triggerTitleInput" type="primary">
          上传标题图片
        </el-button>
        <input 
          ref="titleInput" 
          accept="image/*"
          @change="handleTitleUpload" 
          type="file" 
          class="hidden"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemeStore } from '@/stores/meme'
import { Input } from '@/components/ui/input'
import Sortable from 'sortablejs'

const memeStore = useMemeStore()
const { 
  uploadedFiles, 
  selectedTitleFromList, 
  currentTitlePhoto
} = storeToRefs(memeStore)

const {
  addFileToList,
  removeFileFromList,
  reorderFiles,
  clearUploadedFiles,
  setTitleFromList,
  setTitlePhoto,
  clearTitlePhoto
} = memeStore

const fileInput = ref(null)
const titleInput = ref(null)
const listContainer = ref(null)
let sortableInstance = null

// 触发文件选择
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 触发标题文件选择
const triggerTitleInput = () => {
  if (titleInput.value) {
    titleInput.value.click()
  }
}

// 处理文件添加
const handleFileAdd = (e) => {
  const files = Array.from(e.target.files)
  if (files.length > 0) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    files.forEach(file => {
      if (allowedTypes.includes(file.type)) {
        addFileToList(file)
      }
    })
    // 清空input - 修复清空问题
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    // 重新初始化拖拽
    reinitSortable()
  }
}

// 处理标题上传
const handleTitleUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const photo = {
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file)
    }
    setTitlePhoto('titlePhoto1', photo)
    // 清空input
    if (titleInput.value) {
      titleInput.value.value = ''
    }
  }
}

// 删除文件
const removeFile = (id) => {
  removeFileFromList(id)
  // 重新初始化拖拽
  reinitSortable()
}

// 清空所有文件
const clearAllFiles = () => {
  clearUploadedFiles()
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
}

// 设为标题
const setAsTitle = (fileId) => {
  if (selectedTitleFromList.value === fileId) {
    // 如果已经是标题，则取消选择
    setTitleFromList(null)
  } else {
    setTitleFromList(fileId)
  }
}

// 清除标题
const clearTitle = () => {
  if (selectedTitleFromList.value) {
    setTitleFromList(null)
  } else {
    clearTitlePhoto('titlePhoto1')
    if (titleInput.value) {
      titleInput.value.value = ''
    }
  }
}

// 初始化拖拽排序
const initSortable = () => {
  if (listContainer.value && uploadedFiles.value.length > 0) {
    if (sortableInstance) {
      sortableInstance.destroy()
    }
    
    sortableInstance = Sortable.create(listContainer.value, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      // 不过滤按钮，让整个图片项可拖拽
      filter: false,
      // 简化触屏支持
      delay: 0,
      delayOnTouchStart: false,
      onEnd: (evt) => {
        const oldIndex = evt.oldIndex
        const newIndex = evt.newIndex
        
        if (oldIndex !== newIndex) {
          const newOrder = [...uploadedFiles.value]
          const item = newOrder.splice(oldIndex, 1)[0]
          newOrder.splice(newIndex, 0, item)
          reorderFiles(newOrder)
        }
      }
    })
  }
}

// 在组件挂载时初始化拖拽
onMounted(() => {
  nextTick(() => {
    initSortable()
  })
})

// 监听文件列表变化，重新初始化拖拽
const reinitSortable = () => {
  nextTick(() => {
    initSortable()
  })
}

// 监听uploadedFiles变化
watch(uploadedFiles, () => {
  reinitSortable()
}, { deep: true })
</script>

<style scoped>
.cursor-move:hover {
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}

/* 防止拖拽时选择文本 */
.image-item {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.image-item * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 增加图片列表容器高度 */
.image-list-container {
  max-height: 70vh;
  overflow-y: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .image-list-container {
    max-height: 50vh;
  }
}

/* 特别窄屏（小于480px）显示1列 */
@media (max-width: 479px) {
  .narrow-screen-single-col {
    grid-template-columns: 1fr;
    column-gap: 4rem; /* 横向64px */
    row-gap: 0.75rem; /* 纵向12px */
    padding-left: 2rem; /* 左侧空白32px */
    padding-right: 2rem; /* 右侧空白32px */
  }
}

/* 小于1024px都用大横向间距 */
@media (max-width: 1023px) {
  .narrow-screen-single-col {
    column-gap: 4rem; /* 横向64px */
    row-gap: 0.75rem; /* 纵向12px */
  }
}

/* 滚动条样式 */
.image-list-container::-webkit-scrollbar {
  width: 8px;
}

.image-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.image-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.image-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Sortable样式 */
:global(.sortable-ghost) {
  opacity: 0.5;
  transform: scale(0.95);
}

:global(.sortable-chosen) {
  transform: scale(1.05);
  z-index: 999;
}

:global(.sortable-drag) {
  transform: rotate(5deg);
}
</style>