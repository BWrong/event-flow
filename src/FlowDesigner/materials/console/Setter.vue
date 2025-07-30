<template>
  <div class="console-node-config-wrapper">
    <AFormItem class="block-item" label="日志种类" :name="['props', 'logType']"
      :rules="[{ required: true, message: '日志种类是必填字段' }]">
      <a-select style="width: 250px" placeholder="请选择" v-model:value="formState.logType">
        <a-select-option v-for="item in logTypeOptions" :key="item.value" :value="item.value">
          <component class="mr-1" v-if="item.icon" :is="item.icon" :style="{ color: item.iconColor }" />
          {{ item.label }}
        </a-select-option>
      </a-select>
    </AFormItem>
    <AFormItem :name="['props', 'content', 'expression']" label="消息内容"
      :rules="[{ required: true, message: '消息内容是必填字段' }]">
      <!-- 公式选择显示 -->
      <formula-set :value="{
        value: formState.content.expression,
        editorValue: formState.content.expressionFull
      }" @update:value="handleFormulaSetChange" />
    </AFormItem>
  </div>
</template>

<script setup lang="ts">
import { CloseCircleOutlined, WarningOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import { ref, watch } from 'vue'
import { FormulaSet } from '../../toolComs/formula'
import type { EditorInfo } from '../../toolComs/formula/types'
import { FlowConsoleNode, type FlowConsoleNodeProps } from './index'
const logTypeOptions = [
  { label: '错误', value: 'error', icon: CloseCircleOutlined, iconColor: '#ff4d4f' },
  { label: '警告', value: 'warning', icon: WarningOutlined, iconColor: '#faad14' },
  { label: '日志', value: 'log', icon: WarningOutlined, iconColor: '#1677ff' },
] as const
const props = withDefaults(
  defineProps<{
    value: FlowConsoleNodeProps
  }>(),
  {
    value: () => FlowConsoleNode.props
  }
)
const formState = ref<FlowConsoleNodeProps>(cloneDeep(FlowConsoleNode.props))

const handleFormulaSetChange = (val: EditorInfo) => {
  console.log(val)
  // 这里对结构进行转换
  formState.value.content.expression = val.value
  formState.value.content.expressionFull = val.editorValue;
}

watch(
  () => props.value,
  (val: FlowConsoleNodeProps) => {
    if (val) {
      formState.value = val
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less"></style>
