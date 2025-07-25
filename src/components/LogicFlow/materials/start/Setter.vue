<template>
  <div class="start-node-config-wrapper">
    <AFormItem class="block-item" label="动作入参">
      <ActionInputParamsSet :value="value.inputs" />
    </AFormItem>
  </div>
</template>

<script setup lang="ts">
import type { FlowNodeProps } from 'src/LogicFlow/types';
import { ActionInputParamsSet } from '../../designer/toolComs';
import { FlowStartNode } from './index';
const props = withDefaults(
  defineProps<{
    value: FlowNodeProps
  }>(),
  {
    value: () => FlowStartNode.props
  }
)
const emits = defineEmits(['update:value']);
</script>

<style scoped lang="less"></style>
