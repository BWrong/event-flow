<script setup lang="ts">
  import { useModal } from '@opentiny/tiny-engine';
  import { CloseIcon } from '@opentiny/tiny-engine-common';
  import { iconActivation, iconDel, iconEdit } from '@opentiny/vue-icon';
  import { ref } from 'vue';

  import useFlow from './apis';
  import EditFlowDialog from './EditFlowDialog.vue';
  import LogicFlowDesigner from './LogicFlow/designer/index.vue';
  import { nodes as materials } from './LogicFlow/materials';

  import './LogicFlow/styles/index.less';

  const TinyIconEdit = iconEdit();
  const TinyIconDel = iconDel();
  const TinyIconActivation = iconActivation();

  const { confirm } = useModal();
  const emits = defineEmits(['close']);
  const closePanel = () => emits('close');
  const { state, currentFlow, selectFlow, deleteFlow, updateFlow, setUnSaved } = useFlow();

  const editDialogRef = ref();
  function handleEdit(item) {
    editDialogRef.value.openDialog(item);
  }
  function handleDel(item) {
    confirm({
      title: '提示',
      status: 'warning',
      message: `您确定要删除事件编排 【${item.displayName}】 吗?`,
      exec() {
        deleteFlow(item.id);
      },
      cancel() {},
    });
  }
  function onChange() {
    setUnSaved();
  }
</script>

<template>
  <div class="flow-panel">
    <div class="title">
      <span>可视化事件流编排</span>
      <CloseIcon @close="closePanel"></CloseIcon>
    </div>
    <div class="flow-content">
      <div class="flow-list">
        <!-- TODO: 支持树形显示 -->
        <div
          v-for="item in state.flows"
          :key="item.id"
          class="flow-item"
          :class="{ active: item.id === state.currentFlowId }"
          @click="selectFlow(item.id)"
        >
          <div class="flow-item-text">
            <div class="name">{{ item.displayName }}</div>
            <div class="meta">
              Id: {{ item.id }}&nbsp;&nbsp;组件Id：{{ item.props?.eventComponentId }}
            </div>
            <div class="meta">
              触发: {{ item.props?.eventComponentType }}{{ item.props?.eventLabel }}
            </div>
          </div>
          <div class="flow-item-action">
            <TinyIconEdit @click.stop="handleEdit(item)" />
            <TinyIconDel @click.stop="handleDel(item)" />
          </div>
        </div>
      </div>
      <div class="flow-design">
        <LogicFlowDesigner
          v-if="currentFlow"
          v-model:data="currentFlow"
          :materials="materials"
          :stores-variables="state.storesVariables"
          @change="onChange"
        ></LogicFlowDesigner>
        <div
          v-else
          class="flow-empty"
        >
          <TinyIconActivation class="flow-empty-icon" />
          请点击左侧事件流进行编辑
        </div>
      </div>
    </div>
    <EditFlowDialog
      ref="editDialogRef"
      @confirm="updateFlow"
    ></EditFlowDialog>
  </div>
</template>

<style scoped lang="less">
  :global(#tiny-engine-left-panel.engine\.plugins\.flow) {
    width: auto !important;
    right: 0 !important;
  }

  .flow-panel {
    // width: 100vw;
    height: 100%;
    position: relative;
    width: calc(100% - 39px);
    background: var(--te-common-bg-default);
    box-shadow: 6px 0px 3px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    // position: absolute;
    // left: 0;
    // top: 0;
    // z-index: 99999;
    // box-sizing: border-box;

    .title {
      padding: 10px;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: var(--te-common-text-primary);
      font-weight: 600;
      border-bottom: 1px solid var(--te-common-border-default);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .flow-content {
    flex: 1;
    display: flex;
  }

  .flow-list {
    flex: 0 0 300px;
    border-right: 1px solid var(--te-common-border-default);
    padding: 10px;

    .flow-item {
      padding: 10px;
      display: flex;
      border: 1px solid var(--te-common-border-default);
      margin-bottom: 10px;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        border-color: #1576ff;
      }

      &.active {
        border-color: #1576ff;
        background: lighten(#1576ff, 40%);
      }
    }

    .flow-item-text {
      flex: 1;
      min-width: 0;

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 6px;
      }

      .meta {
        color: gray;
        font-size: 12px;
        margin-bottom: 4px;
      }
    }

    .flow-item-action {
      flex: 0 0 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 6px;
    }
  }

  .flow-design {
    flex: 1;
  }

  .flow-empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #999;
    font-size: 12px;
    background: #fafafa;

    .flow-empty-icon {
      font-size: 90px;
      fill: #e6e6e6;
      margin-bottom: 10px;
    }
  }
</style>
