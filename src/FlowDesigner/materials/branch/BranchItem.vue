<script setup lang="ts">
import { AlertOutlined, DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Input as AInput, Popconfirm as APopconfirm, Popover as APopover, message } from 'ant-design-vue';
import { computed, inject, ref } from 'vue';
import FlowNodeChildren from '../../components/FlowNodeChildren.vue';
import FlowNodeHandler from '../../components/FlowNodeHandler.vue';
import { designerStoreInjectKey, themeInjectKey } from '../../injectKeys';
import type { FlowBranchRouter, FlowMaterial, FlowNode } from '../../types';
import { vFocus } from '../../utils/vFocus';


const props = withDefaults(
  defineProps<{
    data: FlowBranchRouter;
    parentData: FlowNode; // 存在children中的数据（用于获取实际存的配置）
    index: number;
  }>(),
  {
    data: null,
    parentData: null,
    index: 0,
  },
);
const emits = defineEmits(['update']);
const theme = inject(themeInjectKey);

const editingTitle = ref(false)
const editTitleValue = ref('')
function handleEditTitle() {
  if (!props.data.props.isDefaultBranch) {
    editingTitle.value = true
    editTitleValue.value = props.data.name || ''
  }
}
function handleSaveTitle() {
  editingTitle.value = false
  if (editTitleValue.value) {
    Object.assign(props.data, { name: editTitleValue.value })
    editTitleValue.value = ''
  }
}

const designerStore = inject(designerStoreInjectKey);
function handleEditCondition() {
  if (!props.data.props.isDefaultBranch) {
    designerStore.setEditNode(props.parentData, {
      hideBaseInfo: true,
      branchRouter: props.data,
    });
  } else {
    message.warning('默认分支不能编辑')
  }
}
function handleDeleteNode() {
  designerStore.removeNode(props.index, props.parentData.children)
}
function onAddNode(material: FlowMaterial) {
  const node = designerStore.addNode(material, 0, props.data.children)
  designerStore.setEditNode(node)
}
function handleMoveLeft() {
  const children = props.parentData.children || []
  if (props.index > 0) {
    children.splice(props.index - 1, 0, children.splice(props.index, 1)[0])
    emits('update')
  }
}
function handleMoveRight() {
  const children = props.parentData.children || []
  if (props.index < children.length - 1) {
    children.splice(props.index + 1, 0, children.splice(props.index, 1)[0])
    emits('update')
  }
}

const checkInfo = computed(() => {
  const parentCheckInfo = designerStore.state.validateInfo[props.parentData.id];
  const checkInfo = parentCheckInfo?.children?.find((item) => item.id === props.data.id);
  return checkInfo || { type: 'default', messages: [] };
});

</script>

<template>
  <div class="flow-node-branch-router">
    <div class="flow-node-branch-line"></div>
    <div class="flow-node-branch-condition" :id="data.id">
      <div class="flow-node-condition-card flow-node-box" @click.stop="handleEditCondition"
        :class="{ selected: designerStore.state.setterProps?.branchRouter?.id === data.id, error: checkInfo?.type === 'error', warning: checkInfo?.type === 'warning' }">
        <div class="flow-node-condition-header">
          <div @click.stop>
            <AInput v-if="editingTitle" class="flow-node-condition-title edit-input" v-model:value="editTitleValue"
              allow-clear v-focus size="small" @blur="handleSaveTitle" @press-enter="handleSaveTitle" />
            <span class="flow-node-condition-title" @click.stop="handleEditTitle" v-else>
              {{ data?.name }}
            </span>
          </div>
          <span class="flow-node-condition-priority">
            <template v-if="parentData.props.isParallel">
              并行
            </template>
            <template v-else>
              优先级{{ index + 1 }}
            </template>
          </span>
        </div>
        <div class="flow-node-condition-content">
          {{ data.props?.valueText || data.description || '无描述信息' }}
        </div>
      </div>

      <template v-if="!data.props.isDefaultBranch">
        <!-- 左移，右移 -->
        <template v-if="parentData.children.length > 2">
          <div class="flow-node-condition-switch to-left" title="左移">
            <LeftOutlined @click="handleMoveLeft" />
          </div>
          <div class="flow-node-condition-switch to-right" title="右移">
            <RightOutlined @click="handleMoveRight" />
          </div>
        </template>
        <div class="flow-node-toolbar">
          <a-popover title="配置错误" :get-popup-container="el => el.parentElement.parentElement"
            v-if="checkInfo?.type !== 'default'">
            <template #content>
              <p class="flow-node-error-message" v-for="item in checkInfo?.messages" :key="item">{{ item }}</p>
            </template>
            <AlertOutlined class="flow-node-toolbar-item"
              :class="{ error: checkInfo?.type === 'error', warning: checkInfo?.type === 'warning' }" />
          </a-popover>
          <EditOutlined class="flow-node-toolbar-item" @click.stop="handleEditCondition" />
          <a-popconfirm title="确定删除该节点？" ok-text="确定" cancel-text="取消" @confirm="handleDeleteNode"
            :get-popup-container="el => el.parentElement.parentElement" :overlayStyle="{ width: '160px' }"
            okType="danger" v-if="parentData.children.length > 2">
            <DeleteOutlined class="flow-node-toolbar-item error" />
          </a-popconfirm>
        </div>
      </template>
    </div>
    <FlowNodeHandler hide-arrow @add="onAddNode" />

    <!-- 调用基础渲染 -->
    <FlowNodeChildren :nodes="data?.children" />
  </div>
</template>

<style scoped lang="less">
.flow-node-branch-router {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px 0;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #dedede;
  }

  &>.flow-node-branch-line {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      border-top: 2px solid #dedede;
      height: 0;
      width: 100%;
      left: 0;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      border-bottom: 2px solid #dedede;
      height: 0;
      width: 100%;
      left: 0;
    }
  }

  &:first-child {
    &>.flow-node-branch-line {

      &::before,
      &::after {
        width: calc(100% / 2);
        right: 0;
        left: auto;
      }
    }

    &>.flow-node-branch-condition>.flow-node-condition-switch.to-left {
      display: none !important;
    }
  }

  &:nth-last-of-type(2) {
    &>.flow-node-branch-condition>.flow-node-condition-switch.to-right {
      display: none !important;
    }
  }

  &:last-of-type {
    &>.flow-node-branch-line {

      &::before,
      &::after {
        width: calc(100% / 2);
        left: 0;
        right: auto;
      }
    }
  }

  :deep(.flow-node-outer:last-child) {
    .flow-node-handler-wrapper:after {
      display: none;
    }
  }

  :deep(.flow-node-outer:not(:last-child)) {
    .flow-node-handler-wrapper:after {
      display: block;
    }
  }
}

.flow-node-branch-condition {
  width: 220px;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  pointer-events: auto;

  .flow-node-condition-card {
    min-height: 70px;
    padding: 5px 10px 10px 10px;
    border-radius: 8px;
    border: 2px solid transparent;
    box-shadow: 0 1px 4px 0 rgba(10, 30, 65, 0.16);
    transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);

    &.selected {
      border-color: v-bind(theme) !important;
    }

    &.error {
      border: 2px solid #FF5502;
    }

    &.warning {
      border: 2px solid #FAAD14;
    }

    .flow-node-condition-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .flow-node-condition-title {
        max-width: 120px;
        font-size: 13px;
        color: #f60;
        display: inline-flex;
        height: 22px;

        &.edit-input {
          height: 23px;
        }
      }

      .flow-node-condition-priority {
        color: #999;
        font-size: 12px;
      }
    }

    .flow-node-condition-content {
      padding: 10px;
      margin-top: 10px;
      border-radius: 6px;
      background: #F7F7F7;
      font-size: 12px;
      line-height: 1.5;
      color: #777;
      min-height: 38px;
    }
  }

  &:hover {
    .flow-node-condition-switch {
      visibility: visible;
      pointer-events: auto;
      opacity: 1;
    }

    .flow-node-toolbar {
      opacity: 1;
      top: -24px;
      transform: scale(1);
    }
  }

  &.node-flash>.flow-node-box {
    animation: flash 1s ease infinite;
  }
}

.flow-node-condition-switch {
  position: absolute;
  width: 13px;
  cursor: pointer;
  height: 100%;
  align-items: center;
  color: #999;
  background: rgba(126, 134, 142, 0.08);
  transition: all .5s ease;
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
  display: flex;

  &.to-right {
    right: 0;
    top: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &.to-left {
    left: 0;
    top: 0;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:hover {
    background-color: hsla(0, 0%, 60.8%, 0.2);
  }
}

.flow-node-toolbar {
  position: absolute;
  top: -20px;
  right: 6px;
  z-index: 2;
  cursor: pointer;
  opacity: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: all .3s ease;
  transform: scale(0.8);

  .flow-node-toolbar-item {
    background: v-bind(theme);
    margin-left: 2px;
    padding: 4px;
    border-radius: 4px;
    color: #fff;

    &.error {
      background: #ff4d4f;
    }

    &.warning {
      background: #ff4d4f;
    }
  }
}

@keyframes flash {

  from,
  50%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
}
</style>
