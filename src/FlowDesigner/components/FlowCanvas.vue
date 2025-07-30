<template>
  <div class="flow-canvas-bg" @wheel.prevent="handleWheel" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
    @mouseup="handleMouseUp" @mouseleave="handleMouseUp" ref="canvasRef">
    <div class="flow-canvas-scale-inner" :style="transformStyle">
      <div class="flow-canvas-content">
        <FlowNodeChildren :nodes="nodes" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onUnmounted, ref } from 'vue';
import { designerStoreInjectKey } from '../injectKeys';
import type { Flow } from '../types';
import { zoomMax, zoomMin, zoomStep } from '../useDesignerStore';
import FlowNodeChildren from './FlowNodeChildren.vue';

const props = defineProps<{
  data?: Flow | null,
  zoom?: number
}>()

const designerStore = inject(designerStoreInjectKey)!

const nodes = computed(() => props.data?.children || [])
const currentZoom = computed({
  get: () => designerStore.state.zoom,
  set: (value) => designerStore.state.zoom = value
})

const scale = computed(() => currentZoom.value / 100)

// 画布位置状态
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const startPosition = ref({ x: 0, y: 0 })
const startDragPosition = ref({ x: 0, y: 0 })

// 计算transform样式
const transformStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${position.value.x}px, ${position.value.y}px)`,
  transformOrigin: '0 0' // 修改变换原点到左上角
}))

// 处理滚轮缩放
const handleWheel = (e: WheelEvent) => {
  if (e.metaKey || e.ctrlKey) {
    e.preventDefault()
    const delta = -Math.sign(e.deltaY) * zoomStep
    const newZoom = Math.min(Math.max(currentZoom.value + delta, zoomMin), zoomMax)

    // 获取容器和当前缩放信息
    const container = e.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    const oldScale = scale.value
    const newScale = newZoom / 100

    // 计算鼠标在视口中的位置
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // 计算鼠标在当前缩放和平移下对应的内容坐标
    const contentX = (mouseX / oldScale) - position.value.x
    const contentY = (mouseY / oldScale) - position.value.y

    // 计算新的位置，保持鼠标指向的内容点不变
    position.value = {
      x: (mouseX / newScale) - contentX,
      y: (mouseY / newScale) - contentY
    }

    // 更新缩放值
    currentZoom.value = newZoom
  }
}

// 处理鼠标拖动
const handleMouseDown = (e: MouseEvent) => {

  if (e.button === 0) { // 左键且点击在画布上
    isDragging.value = true
    startPosition.value = {
      x: e.clientX,
      y: e.clientY
    }
    startDragPosition.value = {
      x: position.value.x,
      y: position.value.y
    }
    // 改变鼠标样式
    document.body.style.cursor = 'grabbing'
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    const dx = (e.clientX - startPosition.value.x) / scale.value
    const dy = (e.clientY - startPosition.value.y) / scale.value

    position.value = {
      x: startDragPosition.value.x + dx,
      y: startDragPosition.value.y + dy
    }
  }
}

const handleMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    document.body.style.cursor = ''
  }
}

// 组件卸载时清理
onUnmounted(() => {
  document.body.style.cursor = ''
})
</script>

<style scoped lang="less">
.flow-canvas-bg {
  background: #F7F7F7 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAABZLkSWAAAAR0lEQVRYCe3QQQ0AIAwAsYF/BXtjAIUQHvMwkp6CSyNEgAABAgQIECBAgAABAgQIECBAgAABAgQI/Ckwum7n2ue9za6D9XUBBeUC8oQjgoIAAAAASUVORK5CYII=) repeat scroll;
  background-size: 20px 20px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.flow-canvas-scale-inner {
  position: relative;
  will-change: transform;
  transition: none; // 移除transition以提升拖动性能
  min-height: 100%;
  min-width: 100%;
}

.flow-canvas-content {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 55px 20px;
  min-width: 100%;
  min-height: 100%;
  user-select: none;
}

:deep(.flow-node) {
  pointer-events: auto; // 恢复节点的事件
  cursor: default; // 在节点上使用默认光标

  * {
    pointer-events: auto; // 确保节点内的所有元素都能响应事件
  }
}
</style>
