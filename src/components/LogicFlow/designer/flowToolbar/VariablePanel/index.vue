<script lang="ts" setup>
import type { FlowVariables } from '@/components/LogicFlow/types';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { groupBy } from 'lodash-es';
import { computed, ref } from 'vue';
import { getItemType } from '../../../common/helper';
import useDesignerStore from '../../useDesignerStore';
import VariableEditor from './VariableEditor.vue';
import VariableItem from './VariableItem.vue';
const visible = defineModel<boolean>('visible', { default: false })
const { state } = useDesignerStore()
const detailRow = ref()
const editVisible = ref(false)
const editType = ref<'add' | 'edit'>('add')
const editItem = ref<FlowVariables>()
const handleAddVariable = () => {
  editVisible.value = true
  editType.value = 'add'
}
const handleEditItem = (item: FlowVariables) => {
  editVisible.value = true
  editType.value = 'edit'
  editItem.value = item
}
// 获取变量
const variableList = computed(() => {
  return state.flowData?.variables ?? []
})

// 按照类型分组
const variableFlatted = computed(() => {
  return groupBy(variableList.value, 'variableType')
})
// 全局变量
const storesVars = computed(() => {
  return variableFlatted.value['global'] || []
})
// 动作入参变量
const inputVars = computed(() => {
  return variableFlatted.value['input'] || []
})
// 流程中间变量
const flowVars = computed(() => {
  return variableFlatted.value['flow'] || []
})
const variableGroup = computed(() => [
  {
    title: '全局变量',
    children: storesVars.value,
    key: 'global',
    canIedit: false,
    canIdel: false
  },
  {
    title: '入参',
    children: inputVars.value,
    key: 'input',
    canIedit: false,
    canIdel: false
  },
  {
    title: '内部变量',
    children: flowVars.value,
    key: 'flow',
    canIedit: true,
    canIdel: true
  }
])

</script>

<template>
  <transition name="slide-fade">
    <div v-if="visible" class="variable-panel">
      <a-flex align="center" justify="space-between" class="header">
        <span>变量列表</span>
        <a-space>
          <PlusCircleOutlined class="cursor-pointer" size="18px" @click="handleAddVariable" />
          <CloseOutlined class="cursor-pointer" size="18px" @click="visible = false" />
        </a-space>
      </a-flex>
      <div style="height: calc(100% - 48px)" class="variable-body">
        <a-collapse :ghost="true">
          <a-collapse-panel v-for="group in variableGroup" :key="group.key" :header="group.title">
            <VariableItem v-for="item in group.children" :key="item.name" @trigger-item-click="detailRow = item"
              @edit-item="handleEditItem" :showOpt="item.variableType === 'flow'" :item="item" />
          </a-collapse-panel>
        </a-collapse>
        <!-- 底部详情显示 -->
        <Transition name="fade">
          <div v-if="!!detailRow" class="detail-info-wrapper">
            <a-flex justify="space-between" align="center" class="title">
              <span>{{ detailRow.name }}</span>
              <CloseOutlined @click="detailRow = undefined" />
            </a-flex>
            <a-flex class="attr-item-wrapper leading-40px">
              <span class="label">变量名称</span>
              <span class="value" :title="detailRow.name">
                {{ detailRow.name }}
              </span>
            </a-flex>
            <a-flex class="attr-item-wrapper leading-40px">
              <span class="label">变量类型</span>
              <span class="value">
                <!-- TODO: 这里需要优化 -->
                <span :title="detailRow?.typeInfo?.type || detailRow?.dataType?.type"
                  class="overflow-hidden-one text-left">
                  {{ getItemType(detailRow?.typeInfo || detailRow?.dataType) }}
                </span>
              </span>
            </a-flex>
            <a-flex class="attr-item-wrapper leading-40px">
              <span class="label">变量描述</span>
              <span :title="detailRow?.description ?? ''" class="value">
                {{ detailRow?.description ?? '--' }}
              </span>
            </a-flex>
          </div>
        </Transition>
      </div>
    </div>
  </transition>

  <VariableEditor :data="editItem" :type="editType" v-model:visible="editVisible" />
</template>
<style lang="less">
/* 进入之前的样式 */
.slide-fade-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

/* 离开后的样式 */
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 进入和离开的过渡效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
</style>
<style lang="less" scoped>
.variable-panel {
  height: calc(100% - 34px);
  width: 300px;
  background-color: #fff;
  box-shadow: 4px 6px 6px 0 rgba(31, 50, 88, 0.08);
  position: absolute;
  top: 34px;
  bottom: 0;
  left: 0;
  z-index: 100;

  .header {
    border-bottom: 1px solid #DEDEDE;
    height: 40px;
    padding: 10px;
    font-weight: bold;
    color: #555;
  }

  .variable-body {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    position: relative;
  }
}

.switcher-icon {
  color: #717579;
  transition: transform 0.3s;
  cursor: pointer;
  font-size: 12px;
  margin-right: 3px;

  &.expand {
    transform: rotate(-90deg);
  }
}

.detail-info-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;

  .title {
    background-color: #f5f5f5;
    height: 35px;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px;
  }

  .attr-item-wrapper {
    display: flex;
    border-bottom: 1px solid #f0f0f0;

    &>span {
      border-right: 1px solid #f0f0f0;

      &:first-child {
        flex: 0 0 100px;
        color: #838388;
        text-align: right;
      }

      padding-left: 20px;
      padding-right: 20px;
    }

    .value {
      flex: 1;
      font-size: 12px;
    }
  }
}
</style>
