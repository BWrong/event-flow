<template>
  <div :style="{
    display: 'flex',
    width: `${wrapperWidth}px`,
  }">
    <ASelect
      :value="method"
      :options="methodOption"
      style="margin-right: 5px;"
      @change="onMethodChange"
    />
    <!-- 表达式 -->
    <AButton
      v-if="method == 'expression'"
      :class="['flex', content.expression ? 'primary' : '']"
      @click="visible = true"
    >
      {{ content.expression ? '编辑表达式' : '设置表达式' }}
    </AButton>
    
    <!-- 变量 -->
    <FieldTreeSelect
      v-if="method == 'variable'"
      class="flex"
      :value="variableValue"
      @update:value="onFieldSelect"
    />
    <!-- 值 -->
    <AInput
      v-if="method == '' || method == 'value'"
      class="flex"
      :value="value"
      @update:value="onValueChange"
    />
  </div>
  <AModal
    v-if="visible"
    v-model:open="visible"
    title="表达式"
    cancelText="取消"
    okText="确定"
    :onOk="() => visible = false"
    :onCancel="() => visible = false"
  >
    <formula-set
      :value="{
        value: content.expression,
        editorValue: content.expressionFull
      }"
      @update:value="handleFormulaSetChange"
    />
  </AModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { FormulaSet } from '../formula';
  import FieldTreeSelect from '../fieldTreeSelect/index.vue';

  withDefaults(defineProps<{
    method: 'expression' | 'variable' | 'value' | '';
    content: {
      expression: string;
      expressionFull: any;
    };
    variableValue: string;
    variableValueType: string;
    value: string;
    wrapperWidth?: any;
  }>(), {
    wrapperWidth: '100%',
  });
  const emits = defineEmits(['update:method', 'update:content', 'update:variableValue', 'update:variableValueType', 'update:value']);

  const methodOption =  [
    { label: '表达式', value: 'expression' },
    { label: '变量', value: 'variable' },
    { label: '值', value: 'value' },
  ]
  const visible = ref(false);

  const resetVal = () => {
    // console.log('resetVal')
    emits('update:content', { expression: '', expressionFull: '' })
    emits('update:variableValue', '')
    emits('update:variableValueType', '')
    emits('update:value', '')
  }

  const onMethodChange = (val: string) => {
    // console.log('onMethodChange', val)
    emits('update:method', val)
    resetVal()
  }
  const onValueChange = (val: string) => {
    // console.log('handleValueChange', val)
    emits('update:value', val)
  }
  const handleFormulaSetChange = (val: any) => {
    // 这里对结构进行转换
    emits('update:content', { expression: val.value, expressionFull: val.editorValue })
  }
  const onFieldSelect = (fieldItem: { varFullName: string; row: any }) => {
    // console.log('onFieldSelect==', fieldItem)
    emits('update:variableValue', fieldItem.varFullName)
    emits('update:variableValueType', fieldItem.row.variableType)
  }
</script>

<style scoped lang="less">
  .flex {
    display: flex;
  }
</style>
