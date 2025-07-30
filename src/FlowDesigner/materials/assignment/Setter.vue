<template>
  <div class="assign-node-config-wrapper">
    <AFormItem class="block-item" label="赋值设置" :name="['props', 'fillRules', 'structured']">
      <DataAssignSet v-model:value="formState.fillRules.structured" />
    </AFormItem>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { ref, watch } from 'vue';
import { DataAssignSet } from '../../toolComs';
import { FlowAssignmentNode, type FlowAssignmentNodeProps } from './index';
const props = withDefaults(
  defineProps<{
    value: FlowAssignmentNodeProps
  }>(),
  {
    value: () => FlowAssignmentNode.props
  }
)

const formState = ref<FlowAssignmentNodeProps>(cloneDeep(FlowAssignmentNode.props))
watch(
  () => props.value,
  (val: FlowAssignmentNodeProps) => {
    if (val) {
      formState.value = val // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less"></style>
