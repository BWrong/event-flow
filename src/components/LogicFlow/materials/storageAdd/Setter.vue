<template>
  <div class="add-storage-config-wrapper">
    <p style="font-size: 15px;">新增 LocalStorage</p>
    <AButton type="primary" size="small" style="margin: 10px 0;" @click="addData">添加</AButton>
    <ATable :columns="columns" :data-source="formState.storageData" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'localKey'">
          <SelectValue v-model:method="record[column.dataIndex].method"
            v-model:content="record[column.dataIndex].content"
            v-model:variable-value="record[column.dataIndex].variableValue"
            v-model:variable-value-type="record[column.dataIndex].variableValueType"
            v-model:value="record[column.dataIndex].value" :wrapper-width="256" />
        </template>
        <template v-if="column.dataIndex === 'localValue'">
          <SelectValue v-model:method="record[column.dataIndex].method"
            v-model:content="record[column.dataIndex].content"
            v-model:variable-value="record[column.dataIndex].variableValue"
            v-model:variable-value-type="record[column.dataIndex].variableValueType"
            v-model:value="record[column.dataIndex].value" :wrapper-width="256" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <AButton type="link" danger size="small" @click="removeData(record)">删除</AButton>
        </template>
      </template>
    </ATable>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { ref, watch } from 'vue';
import SelectValue from '../../designer/toolComs/selectValue/index.vue';
import { FlowAddStorageNode } from './index';

const props = withDefaults(
  defineProps<{
    value: any
  }>(),
  {
    value: () => FlowAddStorageNode.props
  }
)
const defaultConfit = {
  method: 'value', // 值类型
  content: { // 表达式
    expression: '',
    expressionFull: null,
  },
  variableValue: '', // 变量值
  variableValueType: '', // 变量值类型
  value: '', // 值
}
const columns = [
  {
    title: 'key',
    dataIndex: 'localKey',
    key: 'localKey',
  },
  {
    title: 'value',
    dataIndex: 'localValue',
    key: 'localValue',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 80,
  }
]
const formState = ref<any>(cloneDeep(FlowAddStorageNode.props))

const addData = () => {
  console.log('addData==', formState.value)
  formState.value.storageData.push({
    localKey: cloneDeep(defaultConfit),
    localValue: cloneDeep(defaultConfit),
  })
}
const removeData = (record: any) => {
  const index = formState.value.storageData.findIndex((item: any) => item === record)
  formState.value.storageData.splice(index, 1)
}
watch(
  () => props.value,
  (val: any) => {
    if (val) {
      formState.value = val // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="less">
.flex {
  flex: 1;
}

.primary {
  color: #0e86f7;
}
</style>
