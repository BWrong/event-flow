<!--
 * @Author: ykx
 * @Date: 2023-02-23 14:47:18
 * @LastEditTime: 2024-03-14 16:19:40
 * @LastEditors: Anxure
 * @Description: 部分通用基础拖拽列表
 * @FilePath: \easycube-ui\src\widgets\globalComponents\DragList.vue
-->
<template>
  <div class="option-container">
    <VueDraggableNext
      :list="list"
      :item-key="itemKey"
      v-bind="{
        group: 'list-drag',
        'ghost-class': 'ghost',
        animation: 200,
        handle: '.drag-handle'
      }"
      @end="handleDragEnd"
    >
      <div class="option-item" v-for="(element, index) in list" :key="element[itemKey]">
        <span class="drag-handle" />
        <div
          class="editor-btn overflow-hidden-one"
          :style="{
            height: typeof height === 'string' ? height : height + 'px'
          }"
        >
          <slot :record="element" :index="index" name="itemRender" />
          <minus-circle-outlined v-if="showDelIcon" class="minus-icon drag-icon" @click="delOption(index)" />
        </div>
      </div>
    </VueDraggableNext>
    <a-space>
      <span
        v-if="showAddIcon"
        class="fade-item-bg-wrapper no-width no-bg text-[var(--ant-colorPrimary)]"
        @click="addOption"
      >
        <PlusOutlined style="margin-right: 3px" />
        新增参数
      </span>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { cloneDeep } from 'lodash-es'
import { ref, reactive, watch } from 'vue'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
/*eslint no-undef: "off"*/
defineOptions({
  name: 'SDragList'
})
const props = withDefaults(
  defineProps<{
    list: any[]
    perRow?: object
    itemKey?: string
    addText?: string
    checked?: boolean
    colorList?: string[]
    height?: string | number
    showAddIcon?: boolean
    showDelIcon?: boolean
  }>(),
  {
    value: () => [],
    perRow: () => ({}),
    itemKey: 'id',
    addText: '添加',
    checked: false,
    colorList: () => [],
    height: 30,
    showAddIcon: true,
    showDelIcon: true
  }
)
const emits = defineEmits(['update:list'])
const optionColor = ref('')
function addOption() {
  const tempList = cloneDeep(props.list)
  const perRow = { ...props.perRow }
  tempList.push(perRow)
  emits('update:list', tempList, 'add')
}
function handleDragEnd() {
  emits('update:list', props.list)
}
function delOption(index: number) {
  const tempList = cloneDeep(props.list)
  const item = tempList.splice(index, 1)
  emits('update:list', tempList, 'del', item[0])
}
const selectColor = (index: any, color: any) => {
  const newList = cloneDeep(props.list)
  newList[index].color = color
  emits('update:list', newList)
}
</script>
<style scoped lang="less">
@blk: #13161b;
@bl: #0052d9;
.option-item {
  width: 100%;
  position: relative;
  display: flex;
  margin-top: 8px;
  align-items: center;
  .color-set {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .drag-icon {
    &:deep(.anticon) {
      color: #97a3b7;
      width: 24px;
      cursor: pointer;
      svg {
        font-size: 16px;
        font-weight: bold;
      }
      &:hover {
        color: @blk;
      }
    }
  }

  .editor-btn {
    margin-left: 6px;
    padding-left: 20px;

    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      border-color: @bl;
    }
  }
}

.add-btn {
  display: flex;
  align-items: center;
  color: @bl;
  margin-top: 8px;
  cursor: pointer;
  :deep(.anticon) {
    flex: 0 0 24px;
    svg {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .add-txt {
    display: inline-block;
    margin-left: 6px;
    height: 22px;
    line-height: 24px;
  }
}
.config-item {
  margin-bottom: 14px;
  .config-label {
    color: #7f868e;
    font-size: 12px;
    margin-bottom: 4px;
  }
}
.drag-handle {
  display: inline-block;
  position: absolute;
  left: 2px;
  width: 20px;
  height: 16px;
  top: 50%;
  transform: translateY(-8px);
  cursor: move;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQuNSAxMy41YS41LjUgMCAxIDEgMCAxIC41LjUgMCAwIDEgMC0xWm03IDBhLjUuNSAwIDEgMSAwIDEgLjUuNSAwIDAgMSAwLTFabS03LTRhLjUuNSAwIDEgMSAwIDEgLjUuNSAwIDAgMSAwLTFabTcgMGEuNS41IDAgMSAxIDAgMSAuNS41IDAgMCAxIDAtMVptLTctNGEuNS41IDAgMSAxIDAgMSAuNS41IDAgMCAxIDAtMVptNyAwYS41LjUgMCAxIDEgMCAxIC41LjUgMCAwIDEgMC0xWm0tNy00YS41LjUgMCAxIDEgMCAxIC41LjUgMCAwIDEgMC0xWm03IDBhLjUuNSAwIDEgMSAwIDEgLjUuNSAwIDAgMSAwLTFaIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=);
}
.color-list {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  .color-item {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 5px;
  }
}
.icon {
  font-size: 12px;
  color: #fff !important;
  position: absolute;
  top: 3px;
  left: -2px;
}
</style>
