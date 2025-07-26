<template>
  <div class="flow-branch-container">
    <div class="flow-branch-add-wrapper" ref="wrapperRef">
      <div class="flow-branch-add-trigger" @click="handleAddBranch">
        <Icon style="width: 1.5em; height: 1.5em; margin-right: 8px; fill: currentColor; " /> 添加分支
      </div>
      <ATooltip placement="bottom" title="删除节点" v-if="config?.allowDelete">
        <APopconfirm title="是否删除当前分支节点？" :overlayStyle="{ width: '200px' }" ok-text="确定" cancel-text="取消"
          @confirm="handleDeleteNode" ok-type="danger" :get-popup-container="() => wrapperRef"
          @open-change="onOpenChange">
          <DeleteOutlined class="flow-branch-delete" />
        </APopconfirm>
      </ATooltip>
    </div>
    <div class="flow-branch-inner" v-if="data?.children && data.children.length > 0">
      <BranchItem v-for="(branch, index) in data.children" :key="branch.id" :index="index" :data="branch"
        :parent-data="data" @edit="state.editBranchRouter = branch" @update="handleUpdateBranch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DeleteOutlined } from '@ant-design/icons-vue';
import { Popconfirm as APopconfirm, Tooltip as ATooltip } from 'ant-design-vue';
import { inject, reactive, ref } from 'vue';
import { designerStoreInjectKey, parentNodesInjectKey, themeInjectKey } from '../../designer/injectKeys';
import type { FlowBranchRouter, FlowMaterialConfig, FlowNode, FlowNodeProps } from '../../types';
import BranchItem from './BranchItem.vue';
import { createBranchNodeData } from './helper';
import Icon from './icon.svg?component';

const props = defineProps<{
  data: FlowNode<FlowNodeProps, FlowBranchRouter>,
  config: FlowMaterialConfig,
  index: number
}>()
const wrapperRef = ref<HTMLElement>(null)
const theme = inject(themeInjectKey);
const designerStore = inject(designerStoreInjectKey);
const parentNodes = inject(parentNodesInjectKey)
interface State {
  editBranchRouter: null | FlowBranchRouter
}
const state = reactive<State>({
  editBranchRouter: null
})
function handleAddBranch() {
  const children = props.data.children || [];
  const newBranch = createBranchNodeData(`条件分支${children.length}`, {
    conditionType: 'structured',
    nodeId: props.data.id
  });
  children.splice(-1, 0, newBranch);
  // 先隐藏，可能导致第一次的引用失效
  // designerStore.updateNode({
  //   ...props.data,
  //   children
  // }, props.index, parentNodes.value)
  designerStore.setEditNode(props.data, {
    hideBaseInfo: true,
    branchRouter: newBranch
  })
}
function handleUpdateBranch() {
  designerStore.updateNode({
    ...props.data,
  }, props.index, parentNodes.value)
}
function handleDeleteNode() {
  designerStore.removeNode(props.index, parentNodes.value)
}
function onOpenChange(open: boolean) {
  wrapperRef.value.style.zIndex = open ? '3' : '1'
}
</script>

<style scoped lang="less">
.flow-branch-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 16px auto 0;

  .flow-branch-add-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    height: 36px;
    transform: translateX(-50%) translateY(-50%);
    transform-origin: center center;
    transition: all 0.3s ease;
    background: #fff;
    border-radius: 18px;
    border: 2px solid #dedede;

    .flow-branch-add-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      user-select: none;
      font-size: 12px;
      line-height: 32px;
      color: #222;
      cursor: pointer;
    }

    .flow-branch-delete {
      pointer-events: auto;
      top: -20px;
      right: 0;
      font-size: 12px;
      position: absolute;
      opacity: 0;
      transition: all .3s ease;
      color: #fff;
      padding: 4px;
      border-radius: 4px;
      background-color: #ff4d4f;
      transform: scale(0.8);
    }

    &:hover {
      color: v-bind(theme);
      border: 2px solid v-bind(theme);

      .flow-branch-delete {
        opacity: 1;
        top: -24px;
        transform: scale(1);
      }
    }
  }

  .flow-branch-inner {
    position: relative;
    display: inline-flex;
    justify-content: center;

    &::before {
      position: absolute;
      height: 100%;
      width: 2px;
      background-color: #F7F7F7;
      content: '';
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>
