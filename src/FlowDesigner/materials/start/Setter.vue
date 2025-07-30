<template>
  <div class="start-node-config-wrapper">
    <AFormItem class="block-item" label="流程入参">
      <a-table :columns="columns" :data-source="params" v-if="params.length > 0" size="small" bordered
        :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <!-- {{ getItemType(record.type) }} -->
            {{ record.type }}
          </template>
        </template>
      </a-table>
      <a-empty v-else :image="simpleImage" description="暂无入参" />
    </AFormItem>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';
import { computed, inject } from 'vue';
import { designerStoreInjectKey } from '../../injectKeys';
import type { FlowNodeProps } from '../../types';
import { FlowStartNode } from './index';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
withDefaults(
  defineProps<{
    value: FlowNodeProps
  }>(),
  {
    value: () => FlowStartNode.props
  }
)
const flowStore = inject(designerStoreInjectKey);
const params = computed(() => flowStore?.state.flowData?.props.params || []);
const columns = [
  {
    title: '参数名称',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
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

<style scoped lang="less"></style>
