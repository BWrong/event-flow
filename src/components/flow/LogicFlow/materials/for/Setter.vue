<script setup lang="ts">
import type { TreeVariableItem, FlowVariables, VariableType, IDataType } from '../../types'
import { type FlowForNodeProps, FlowForNode } from './index'
import { useFindTreeVars } from '../resource/hooks/useFindTreeVars'
import { reactive, ref, watch, inject, computed } from 'vue'
import { message } from 'ant-design-vue'
import { formRges } from '../../common/validate'
import { FieldTreeSelect } from '../toolComs'
import { designerStoreInjectKey } from '../../designer/injectKeys'
import { QuestionTip } from '../resource/components'
const props = withDefaults(
  defineProps<{
    value: FlowForNodeProps
  }>(),
  {
    value: () => FlowForNode.props
  }
)
const lastLoopEntry = ref('')
const lastLoopSubscript = ref('')
const loopEntryDataType = ref<IDataType>()
const rulesRef = reactive({
  'loopCollection.name': [
    {
      required: true,
      message: '集合变量 是必填字段'
    }
  ],
  loopEntry: [
    {
      required: true,
      message: '条目变量 是必填字段'
    },
    {
      pattern: formRges.loopEntry,
      message: '大小写字母、数字、下划线， 首位支持"$"，不支持数字',
      trigger: 'blur'
    }
  ]
})
const formState = ref<FlowForNodeProps>(FlowForNode.props)

const designerStore = inject(designerStoreInjectKey, null)

const { resultTreeData } = useFindTreeVars(designerStore?.state?.editNode!)
const allVarsNames = computed(() => {
  return resultTreeData.value.map((varItem: TreeVariableItem) => {
    return varItem.name
  })
})
const updateOutputVariableList = () => {
  formState.value.variableList = [
    {
      name: formState.value.loopEntry,
      variableType: 'flowTemp' as VariableType,
      dataType: loopEntryDataType.value
    },
    {
      name: formState.value.loopSubscript,
      variableType: 'flowTemp' as VariableType,
      dataType: { type: 'number' } as IDataType
    }
  ].filter((item: Partial<FlowVariables>) => !!item.name)
}
// 获取选择的集合变量，对外构建一个variableList,用于子集选择
const handleVarChange = (value: { varFullName: string; row: any }) => {
  formState.value.loopCollection.name = value.varFullName
  formState.value.loopCollection.variableType = value.row.variableType
  console.log(value.row)
  loopEntryDataType.value =
    value?.row?.dataType?.itemTypes?.[0]?.dataType ?? value?.row?.dataType?.itemTypes?.[0] ?? null // 兼容apihub获取值

  updateOutputVariableList()
}
const handleLoopEntryChange = (e: any) => {
  formState.value.loopEntry = e.target.value
  if (
    !allVarsNames.value.includes(e.target.value) &&
    (!e.target.value || e.target.value !== formState.value.loopSubscript)
  ) {
    lastLoopEntry.value = e.target.value
  }
}
const handleLoopEntryBlur = (e: any) => {
  if (
    allVarsNames.value.includes(e.target.value) ||
    (e.target.value && e.target.value === formState.value.loopSubscript)
  ) {
    formState.value.loopEntry = lastLoopEntry.value // 还原到上次
    message.error('存在重复的变量名,请重新输入')
    return
  }
  formState.value.loopEntry = e.target.value
  lastLoopEntry.value = e.target.value
  // 同步下变量名
  updateOutputVariableList()
}

const handleLoopSubscriptChange = (e: any) => {
  formState.value.loopSubscript = e.target.value
  if (
    !allVarsNames.value.includes(e.target.value) &&
    (!e.target.value || e.target.value !== formState.value.loopEntry)
  ) {
    lastLoopSubscript.value = e.target.value
  }
}
const handleLoopSubscriptBlur = (e: any) => {
  if (allVarsNames.value.includes(e.target.value) || (e.target.value && e.target.value === formState.value.loopEntry)) {
    formState.value.loopSubscript = lastLoopSubscript.value // 还原到上次
    message.error('存在重复的变量名,请重新输入')
    return
  }
  formState.value.loopSubscript = e.target.value
  lastLoopSubscript.value = e.target.value
  // 同步下变量名
  updateOutputVariableList()
}

lastLoopEntry.value = formState.value.loopEntry
lastLoopSubscript.value = formState.value.loopSubscript
watch(
  () => props.value,
  async (val: FlowForNodeProps) => {
    if (val) {
      formState.value = val // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="for-node-config-wrapper">
    <header class="mb-1" style="font-weight: bold">遍历目标</header>
    <AFormItem :name="['props', 'loopCollection', 'name']" class="normal-label" :rules="rulesRef['loopCollection.name']">
      <template #label>
        <QuestionTip label="集合变量" tip="当前节点需要循环处理的集合类型变量"></QuestionTip>
      </template>
      <field-tree-select
        :value="formState.loopCollection.name"
        :filterFieldTypes="['array']"
        :allowParentSelect="false"
        @update:value="handleVarChange"
      />
    </AFormItem>
    <a-row :gutter="20">
      <a-col :span="12"> </a-col>
    </a-row>
    <a-divider class="small" />
    <header class="mb-1" style="font-weight: bold">遍历条目</header>
    <a-row :gutter="20">
      <a-col :span="12">
        <AFormItem :name="['props', 'loopEntry']" class="normal-label" :rules="rulesRef.loopEntry">
          <template #label>
            <QuestionTip label="条目变量" tip="用于保存当前节点循环处理单条记录结果的变量"></QuestionTip>
          </template>
          <a-input
            placeholder="请输入"
            :value="formState.loopEntry"
            @change="handleLoopEntryChange"
            @blur="handleLoopEntryBlur"
          />
        </AFormItem>
      </a-col>
      <a-col :span="12">
        <AFormItem :name="['props', 'loopSubscript']" class="normal-label">
          <template #label>
            <QuestionTip label="条目下标" tip="用于保存循环中当前数据的下标"></QuestionTip>
          </template>
          <a-input
            placeholder="请输入"
            :value="formState.loopSubscript"
            @change="handleLoopSubscriptChange"
            @blur="handleLoopSubscriptBlur"
          />
        </AFormItem>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less"></style>
