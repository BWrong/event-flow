<template>
  <div class="start-node-config-wrapper">
    <AFormItem class="block-item" label="动作入参">
      <div class="field-set-wrapper">
        <a-table :columns="columns" :data-source="value" v-if="value.length > 0">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'dataType'">
              {{ getItemType(record.dataType) }}
            </template>
          </template>
        </a-table>
        <p v-else class="empty-text" style="margin-top: 10px">暂无入参</p>
      </div>
    </AFormItem>
  </div>
</template>

<script setup lang="ts">
import { getItemType } from '../../common/helper';
import type { FlowNodeProps } from '../../types';
import { FlowStartNode } from './index';
withDefaults(
  defineProps<{
    value: FlowNodeProps
  }>(),
  {
    value: () => FlowStartNode.props
  }
)
const columns = [
  {
    title: '参数名称',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'dataType',
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
  },
  {
    title: '说明',
    dataIndex: 'description',
  },
]
</script>

<style scoped lang="less">
.field-set-item-wrapper {
  width: 100%;
  height: 40px;
}
</style>
