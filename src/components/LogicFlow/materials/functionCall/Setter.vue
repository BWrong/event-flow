<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { ref, watch } from 'vue';

import { FlowFunctionCallNode } from '.';

const props = withDefaults(
  defineProps<{
    value: any;
  }>(),
  {
    value: () => FlowFunctionCallNode.props,
  }
);
const formState = ref<any>(cloneDeep(FlowFunctionCallNode.props));
// TODO
const getMethods = () => {
  return {
    'console.log': 'console.log',
  }
}
const methods = getMethods?.() || {};
console.log(methods);
watch(
  () => props.value,
  (val: any) => {
    if (val) {
      formState.value = val; // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
    }
  },
  { immediate: true }
);
const columns = [
  {
    title: '参数名',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: '类型',
    dataIndex: 'type', // 值、变量、表达式
    width: '20%',
  },
  {
    title: '参数值',
    dataIndex: 'value',
  },
];
const sourceTypeOptions = [
  {
    label: '值',
    value: 'value',
  },
  {
    label: '变量',
    value: 'variable',
  },
  {
    label: '表达式',
    value: 'formula',
  },
];
function handleSetParams(name) {
  console.log(name);
  const functionBody = methods[name]?.value;
  // 从函数体中提取参数
  const params = functionBody.match(/\(([^)]*)\)/)[1].split(',');
  formState.value.functionParams = params.map((item) => {
    return {
      name: item,
      type: 'value',
      value: '',
    };
  });
  console.log(formState);
}
</script>

<template>
  <AForm layout="vertical">
    <AFormItem label="执行函数">
      <ASelect v-model:value="formState.functionName" allow-clear @change="handleSetParams">
        <ASelectOption v-for="(item, key) in methods" :key="key" :value="key">
          {{ key }}
        </ASelectOption>
      </ASelect>
    </AFormItem>
    <AFormItem label="参数配置">
      <ATable :columns="columns" :data-source="formState.functionParams" size="small" bordered :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <ASelect v-model:value="record.type" :options="sourceTypeOptions" />
          </template>
          <template v-if="column.dataIndex === 'value' && validateInfos">
            <ValidItem :validate-info="modelRef?.sourceType === 'formula' ? validateInfos.expression : validateInfos.source
              ">
              <div class="min-w-0 flex-1">
                <WidgetItem v-if="record.type === 'value'" :value="record.value" :cur-page-field="record"
                  @update:value="(val: string) => triggerValues({ source: val })" />
                <!-- 字段选择显示 -->
                <FieldTreeSelect v-if="record.type === 'variable'" :value="record.value"
                  :filter-field-types="getValidFieldTypes(modelRef.targetDataType?.type)"
                  @update:value="handleSourceVarChange" />
                <!-- 公式选择显示 -->
                <FormulaSelect v-if="record.type === 'formula'" :value="{
                  value: row.expression,
                  editorValue: row.expressionFull,
                }" @update:value="handleFormulaSetChange" />
              </div>
            </ValidItem>
          </template>
        </template>
      </ATable>
    </AFormItem>
  </AForm>
</template>

<style scoped lang="less"></style>
