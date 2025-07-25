<script lang="ts" setup>
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { getItemType } from '../../../common/resolveDs'
import type { FlowVariables } from '../../../types'
import useDesignerStore from '../../useDesignerStore'
withDefaults(
  defineProps<{
    item: FlowVariables
    showOpt?: boolean
  }>(),
  {
    item: () => ({
      dataType: { type: 'string' },
      description: '',
      name: '',
      variableType: 'flow'
    }),
    showOpt: true
  }
)
const { delVariable } = useDesignerStore()
const emits = defineEmits(['triggerItemClick', 'editItem'])
const editVariable = (item: FlowVariables) => {
  emits('editItem', item)
}
// 判断如果是服务结构体类型，则不允许删除
const deleteVariable = (item: FlowVariables) => {
  Modal.confirm({
    title: '确定删除变量吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      delVariable(item.id!)
    }
  })
}
</script>
<template>
  <div @click="emits('triggerItemClick', item)" class="variable-item">
    <span :title="`${item.name}(${getItemType(item.dataType)})`" class="name-container">
      <span>{{ item.name }}</span>
      <span class="type-label">
        {{ getItemType(item.dataType) }}
      </span>
    </span>
    <span v-if="showOpt" class="operation">
      <EditOutlined class="edit-icon" @click.stop="editVariable(item)" />
      <DeleteOutlined class="delete-icon" @click.stop="deleteVariable(item)" />
    </span>
  </div>
</template>
<style scoped lang="less">
.variable-item {
  display: flex;
  cursor: pointer;
  line-height: 20px;
  padding: 4px 8px;
}

.variable-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  display: flex;
  cursor: pointer;

  .operation {
    visibility: visible;
  }
}

.name-container {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-label {
  margin-left: 8px;
  font-style: italic;
  color: rgba(0, 0, 0, 0.45);
}

.operation {
  display: flex;
  align-items: center;
  visibility: hidden;
  margin-left: 12px;
  flex-shrink: 0;
}

.edit-icon {
  color: #999;
  cursor: pointer;
}

.delete-icon {
  margin-left: 4px;
  color: #999;
  cursor: pointer;
}
</style>
