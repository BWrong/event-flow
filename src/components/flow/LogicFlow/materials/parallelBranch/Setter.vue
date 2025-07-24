<!-- 注：这里不能使用表单内置校验 -->
<template>
  <div class="branch-item-node-config-wrapper">
    <ARow :gutter="10">
      <ACol :span="12">
        <AFormItem class="normal-label required-symbol" name="name" label="节点名称">
          <AInput placeholder="请输入" v-model:value="formState.name" @change="triggerNode" />
        </AFormItem>
      </ACol>
      <ACol :span="12">
        <AFormItem class="normal-label" name="id" label="编码">
          <AInput :value="formState.id" disabled />
        </AFormItem>
      </ACol>
    </ARow>
    <FormItem class="normal-label" name="description" label="描述">
      <ATextarea
        placeholder="请输入节点描述"
        :maxlength="200"
        show-count
        v-model:value="formState.description"
        @change="triggerNode"
      />
    </FormItem>
    <ADivider/>
    <a-alert
      class="mb-3"
      message="当流程数据不满足所有其他分支条件时，会执行默认分支。（该分支不能编辑或删除）"
      type="warning"
      show-icon
      v-if="formState.props.isDefaultBranch"
    />
    <a-alert
      v-else
      class="mb-3"
      :message="
        formState.props.conditionType === 'structured'
          ? '当满足以下规则条件时，流程进入当前分支。'
          : '以下表达式返回值需为Boolean类型。当表达式值为true时，流程进入当前分支。'
      "
      type="info"
      show-icon
    />
    <template v-if="!formState.props.isDefaultBranch">
      <AFormItem name="conditionType" label="条件配置方式">
        <a-radio-group
          v-model:value="formState.props.conditionType"
          :options="[
            { label: '结构化', value: 'structured' },
            { label: '表达式', value: 'expression' }
          ]"
          @change="triggerNode"
        ></a-radio-group>
      </AFormItem>
      <AFormItem name="structured" label="条件规则" v-if="formState.props.conditionType === 'structured'">
        <RuleTreeSet v-model:value="formState.props.structured" />
      </AFormItem>
      <AFormItem name="expression" label="表达式" v-else>
        <!-- 公式选择显示 -->
        <formula-set
          :value="{
            value: formState.props.expression,
            editorValue: formState.props.expressionFull
          }"
          @update:value="handleFormulaSetChange"
        />
      </AFormItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue'
import { createBranchNodeData } from './helper'
import { FlowParallelBranchNode as FlowBranchNode } from './index'
import { FlowMaterial, FlowBranchRouter, FlowNodeProps, FlowRunnerMap } from '../../types'
import { RuleTreeSet } from '../toolComs'
import { FormulaSet } from '../toolComs/formula'
import type { EditorInfo } from '../toolComs/formula/types'
import { designerStoreInjectKey } from '../../designer/injectKeys'
import { cloneDeep } from 'lodash-es'
const props = withDefaults(
  defineProps<{
    node: FlowMaterial<FlowNodeProps, FlowBranchRouter>
  }>(),
  {
    node: () => FlowBranchNode
  }
)
const emits = defineEmits<{
  (e: 'update:node', node: FlowMaterial<FlowNodeProps, FlowBranchRouter>): void
}>()
const designerStore = inject(designerStoreInjectKey)
const branchIndex = ref(0)
const formState = ref<FlowBranchRouter>(createBranchNodeData())
const branchRouter = computed(() => {
  return designerStore.state.setterProps.branchRouter
})
// 更新值
const triggerNode = () => {
  const tempNode = cloneDeep(props.node)
  tempNode[branchIndex.value].props = {
    ...tempNode[branchIndex.value],
    ...formState.value
  }

  emits('update:node', tempNode)
}
const handleFormulaSetChange = (val: EditorInfo) => {
  console.log(val)
  // 这里对结构进行转换
  formState.value.props.expression = val.value
  formState.value.props.expressionFull = val.editorValue
  triggerNode()
}
// 监听节点变化，获取当前分支配置
watch(
  branchRouter,
  (val: FlowBranchRouter) => {
    if (props.node) {
      const childrenNodes = props.node.children
      if (childrenNodes.length > 0 && branchRouter.value) {
        branchIndex.value = childrenNodes.findIndex((item: FlowBranchRouter) => item.id === val.id)
        formState.value = childrenNodes[branchIndex.value] ?? ({} as FlowBranchRouter)
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less"></style>
