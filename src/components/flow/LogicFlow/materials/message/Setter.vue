<template>
  <div>
    <AFormItem
      label="提示类型"
    >
      <ASelect
        :style="{ width: '300px' }"
        v-model:value="formState.noticeType"
        :options="option"
      />
    </AFormItem>
    <AFormItem
      label="提示显示时长(秒)"
    >
      <AInputNumber
        :style="{ width: '200px' }"
        v-model:value="formState.duration"
      />
    </AFormItem>
    <AFormItem :name="['props', 'content', 'expression']" label="消息内容" :rules="[{ required: true, message: '消息内容是必填字段' }]">
      <!-- 公式选择显示 -->
      <formula-set
        :value="{
          value: formState.content.expression,
          editorValue: formState.content.expressionFull
        }"
        @update:value="handleFormulaSetChange"
      />
    </AFormItem>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { cloneDeep } from 'lodash-es'
  import { FlowMessageNode } from './index';
  import { FormulaSet } from '../toolComs/formula';

  const props = withDefaults(
    defineProps<{
      value: any
    }>(),
    {
      value: () => FlowMessageNode.props
    }
  )
  const formState = ref<any>(cloneDeep(FlowMessageNode.props))
  const option = [
    { label: '成功', value: 'success' },
    { label: '警告', value: 'warning' },
    { label: '错误', value: 'error' },
    { label: '通知', value: 'info' },
  ]
  const handleFormulaSetChange = (val: any) => {
    // console.log('aaa', val)
    // 这里对结构进行转换
    formState.value.content.expression = val.value;
    formState.value.content.expressionFull = val.editorValue;
  }
  watch(
    () => props.value,
    (val: any) => {
      if (val) {
        formState.value = val // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
      }
    },
    { immediate: true }
  )
</script>

<style scoped lang="less">

</style>
