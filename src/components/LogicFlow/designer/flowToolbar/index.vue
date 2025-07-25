<template>
  <div class="logic-flow-toolbar">
    <div class="left-toolbar">
      <a-space>
        <a-tooltip title="变量设置" placement="bottom">
          <FunctionOutlined @click="showVariablePanel = true" />
        </a-tooltip>
      </a-space>
      <ADivider type="vertical" />
      <a-space>
        <LeftCircleOutlined class="action-icon" :class="{ disabled: !canUndo }" @click="designerStore.history.undo" />
        <RightCircleOutlined class="action-icon" :class="{ disabled: !canRedo }" @click="designerStore.history.redo" />
      </a-space>
      <ADivider type="vertical" />
      <a-space>
        <MinusCircleOutlined class="action-icon" @click="designerStore.zoomOut" />
        <span size="small" class="flow-zoom" @dblclick="designerStore.zoomReset">{{ designerStore.state.zoom
          }}%</span>
        <PlusCircleOutlined class="action-icon" @click="designerStore.zoomIn" />
      </a-space>
      <slot name="toolbar-left"></slot>
    </div>
    <div class="right-toolbar">
      <slot name="toolbar-right"> </slot>
      <div class="flow-check-info" @click="openErrPanel">
        校验结果：
        <a-badge :count="validateInfoFlat.length" v-if="validateInfoFlat.length"></a-badge>
        <CheckCircleOutlined :style="{ color: '#87D068', fontSize: '16px' }" v-else />
      </div>
    </div>
  </div>
  <!-- 变量设置面板 -->
  <VariablePanel v-model:visible="showVariablePanel" />
  <!-- 错误信息面板 -->
  <ErrorPanel v-model:visible="showErrPanel" :list="errorTableData" />

</template>

<script setup lang="ts">
import { CheckCircleOutlined, FunctionOutlined, LeftCircleOutlined, MinusCircleOutlined, PlusCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { Divider as ADivider, Space as ASpace, Tooltip as ATooltip } from 'ant-design-vue';
import { computed, inject, ref } from 'vue';
import type { ErrorInfoItem, ValidateInfo } from '../../types';
import { designerStoreInjectKey, type DesignerStoreType } from '../injectKeys';
import ErrorPanel from './ErrorPanel.vue';
import VariablePanel from './VariablePanel/index.vue';

const designerStore = inject(designerStoreInjectKey) as DesignerStoreType
const canUndo = computed(() => designerStore?.history.canUndo.value)
const canRedo = computed(() => designerStore?.history.canRedo.value)
// 变量设置面板
const showVariablePanel = ref(false);

const errorTableData = ref<ErrorInfoItem[]>([])
const showErrPanel = ref(false)
const validateInfoFlat = computed(() => {
  const result: ValidateInfo[] = [];
  Object.entries(designerStore?.state.validateInfo || {}).forEach(([id, info]) => {
    const { type, messages, children } = info
    if (children) {
      children.forEach(child => {
        result.push({
          type: child.type,
          id: child.id,
          messages: child.messages
        })
      })
    } else {
      result.push({
        type,
        id,
        messages
      })
    }
  })
  return result
}
)
function openErrPanel() {
  const list: ErrorInfoItem[] = []
  const nodesMap = designerStore?.getFlatFlowNodes()
  validateInfoFlat.value.forEach(item => {
    const node = nodesMap[item?.id!]
    if (node) {
      list.push({
        type: item.type,
        position: {
          name: node.name,
          id: node.id,
        },
        messages: item.messages?.join('; ') || ''
      })
    }
  })
  errorTableData.value = list
  showErrPanel.value = true
}


</script>

<style scoped lang="less">
.logic-flow-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f2f2f3;
  border-bottom: 1px solid #dadadd;
  padding: 4px 10px;
  line-height: 24px;
  z-index: 100;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);


  .action-icon {
    color: #3e3e3c;
    cursor: pointer;

    &.disabled {
      opacity: 0.4;
    }
  }

  .flow-zoom {
    color: #3E3E3C;
    font-size: 12px;
  }

  .left-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #555;
  }

  .right-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .flow-check-info {
    display: flex;
    align-items: center;
    color: #AAAAAA;
    font-size: 12px;
    cursor: pointer;
  }

  .flow-error {
    color: red;
    background: red;
  }
}
</style>
