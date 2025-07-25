<!--
 * @Author: ykx
 * @Date: 2023-03-19 11:40:52
 * @LastEditTime: 2023-06-20 15:57:16
 * @LastEditors: your name
 * @Description: 条件树设置
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\ruleTreeSet\Index.vue
-->
<template>
  <div :class="['rule-set-container has-scroll', state.conditions.criteriaList.length === 0 && 'no-left-margin']">
    <div v-if="state.conditions.criteriaList.length > 0" class="rule-list-container">
      <div class="rule-group-wrapper">
        <!-- 关系设置项  当前子集 项 > 时显示-->
        <div v-if="state.conditions.criteriaList.length > 1" class="rule-relation-wrapper">
          <div class="rule-line" />
          <a-select :value="state.conditions.combineType" style="width: 60px" class="rule-trigger"
            :options="combineTypeOptions" @change="handleChange" />
        </div>
        <!-- {{ state.conditions.rules }} -->
        <!-- 具体规则项列表 -->
        <div :class="['rule-list-wrapper', state.conditions.criteriaList.length > 1 && 'has-child']">
          <template v-for="(rule, index) in state.conditions.criteriaList" :key="rule.id">
            <!-- 含有组渲染 -->
            <RuleGroupItem v-if="rule.combineType" :row="rule" :row-index="index" />
            <!-- 单项渲染 -->
            <RuleItem v-else :row-index="index" :row="rule" />
          </template>
        </div>
      </div>
    </div>
    <div v-else class="footer" @click="handleAdd">
      <PlusOutlined />
      新增条件规则
    </div>
    <div v-if="state.validFailItems.length > 0" class="rule-valid-result">
      存在
      <strong style="color: #1780e3; font-size: 16px">{{ state.validFailItems.length }}</strong>
      处校验失败，请完善或移除相关条件。
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { Form } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { provide, readonly, ref, watch } from 'vue'
import { getEditorNodeId } from '../../../common/helper'
import type { Structured, StructuredCondition, ValidFailItemType } from '../../../types'
import { combineTypeOptions } from '../../resource/dicts'
import { useCondionTree } from '../hooks/useCondionTree'
import RuleGroupItem from './RuleGroupItem.vue'
import RuleItem from './RuleItem.vue'
const props = withDefaults(
  defineProps<{
    value: Structured
    targetType?: StructuredCondition['targetType']
    validFailItems?: ValidFailItemType[] // 校验结果
  }>(),
  {
    value: () => ({
      combineType: 'and',
      combineTypeName: '且',
      criteriaList: [],
      id: ''
    }),
    targetType: 'value',
    validFailItems: () => []
  }
)
provide('allowParentSelect', true) // 变量组件是否支持父级选择
const formItemContext = Form.useInjectFormItemContext()

const emits = defineEmits(['update:value', 'update:validFailItems'])
const options = ref({
  // 这里更新值
  updateDataFn: (conditions: Structured) => {
    emits('update:value', conditions)
    // 触发下校验更新
    formItemContext && formItemContext.onFieldChange()
  },
  // 传入单个默认
  perCondition: (): StructuredCondition => {
    return {
      id: getEditorNodeId('bwf-c-u-'),
      operator: undefined,
      targetType: props.targetType || 'value',
      targetVariableType: 'flowTemp',
      target: '',
      operatorName: '',
      sourceType: 'value',
      sourceVariableType: 'flowTemp',
      source: '',
      targetDataType: { type: 'string' }
    }
  }
})
const {
  state,
  updateConditionRule,
  updateRuleAttr,
  handleChange,
  handleAdd,
  delConditionRule,
  addConditionRule,
  addErrorMsg,
  removeErrorMsg
} = useCondionTree(options)

provide('state', readonly(state))

provide('updateRuleAttr', updateRuleAttr)
provide('updateConditionRule', updateConditionRule)
provide('addConditionRule', addConditionRule)
provide('delConditionRule', delConditionRule)

provide('addErrorMsg', addErrorMsg)
provide('removeErrorMsg', removeErrorMsg)

watch(
  () => props.value,
  (val: Structured | undefined) => {
    if (val) {
      state.conditions = cloneDeep(val)
      state.validFailItems = cloneDeep(props.validFailItems)
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
.rule-set-container.has-scroll {
  overflow-x: auto;
}

.footer {
  color: var(--ant-colorPrimary);
  cursor: pointer;
}
</style>
