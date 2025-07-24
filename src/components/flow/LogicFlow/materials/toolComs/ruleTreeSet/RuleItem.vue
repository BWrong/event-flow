<template>
  <a-flex gap="small" style="padding: 12px" align="center">
    <!-- 左侧变量选择 -->
    <field-tree-select
      style="flex: 0 0 150px"
      class="overflow-hidden-one"
      :value="row.target"
      @update:value="handleLeftChange"
    />
    <!-- 连接器 -->
    <a-select
      :value="row.operator"
      style="flex: 0 0 90px"
      :options="relaOptions"
      placeholder="请选择"
      :dropdown-match-select-width="false"
      @change="handleOptChange"
    />
    <template v-if="needSetValue">
      <a-select
        style="flex: 0 0 90px"
        :value="row.sourceType"
        :options="sourceTypeOptions"
        placeholder="请选择"
        @change="(val: string) => commonSetValue({ sourceType: val })"
      />
      <!-- 动态组件显示 -->
      <widget-item
        style="width: auto"
        v-if="row.sourceType && row.sourceType === 'value'"
        :value="row.source"
        :disabled="!row.target"
        :cur-page-field="row"
        @update:value="handleRightChange"
      />
      <!-- 字段选择显示 -->
      <field-tree-select
        v-if="row.sourceType && row.sourceType === 'variable'"
        :value="row.source"
        class="overflow-hidden-one"
        :filter-field-types="filterFieldTypes"
        @update:value="handleRightVarChange"
      />
      <!-- 公式选择显示 -->
      <FormulaSelect
        v-if="row.sourceType && row.sourceType === 'formula'"
        :value="{
          value: row.expression,
          editorValue: row.expressionFull
        }"
        @update:value="handleFormulaSetChange"
      />
    </template>

    <!-- 操作项 -->
    <a-space class="opt-wrapper">
      <minus-outlined title="删除同级" @click="handleDelete" />
      <a-dropdown overlay-class-name="prevent-click-outside-area">
        <PlusOutlined />
        <template #overlay>
          <a-menu @click="handleAdd">
            <a-menu-item key="brother">新增同级</a-menu-item>
            <a-menu-item key="child">新增子集</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <close-circle-filled v-if="showError" class="feed-back-icon" style="color: #ff4d4f" />
      <check-circle-filled v-if="!showError" class="feed-back-icon" style="color: #52c41a" />
    </a-space>
    <!-- 校验显示 -->
  </a-flex>
</template>

<script setup lang="ts">
import { computed, inject, watch, provide } from 'vue'
import { sourceTypeOptions } from '../../resource/dicts'
import type { StructuredCondition } from '../../../types'
import FieldTreeSelect from '../fieldTreeSelect/index.vue'
import { FormulaSelect } from '../formula'
import { notSupConstParamTypes, type FieldType, fieldTypeMap, COMMON_CONDITION } from '../../resource/dicts/fields'
import WidgetItem from '../WidgetItem.vue'
import { getEditorNodeId } from '../../../common/helper'
import type { EditorInfo } from '../formula/types'
import { CloseCircleFilled, MinusOutlined, CheckCircleFilled, PlusOutlined } from '@ant-design/icons-vue'
const props = withDefaults(
  defineProps<{
    row: StructuredCondition
    rowIndex: number
  }>(),
  {
    row: () => ({
      id: getEditorNodeId('bwf-c-u-'),
      operator: undefined,
      targetType: 'value',
      targetVariableType: 'flowTemp',
      target: '',
      operatorName: '',
      sourceType: 'value',
      source: '',
      sourceVariableType: 'flowTemp',
      targetDataType: { type: 'string' }
    }),
    rowIndex: 0
  }
)
const updateConditionRule = inject('updateConditionRule') as any
const addConditionRule = inject('addConditionRule') as any
const delConditionRule = inject('delConditionRule') as any
const addErrorMsg = inject('addErrorMsg') as any
const removeErrorMsg = inject('removeErrorMsg') as any

// 查找符合选择的值类型
const filterFieldTypes = computed(() => {
  const fieldType = props.row.targetDataType?.type
  const target = fieldTypeMap[fieldType] as any
  return target?.allowTypes ?? []
})
// 向下传入，公式会用到
provide('filterFieldTypes', filterFieldTypes)
const curType = computed<FieldType>(() => {
  return props.row?.targetDataType?.type
})

// 连接器选择项(特殊类型的值 则仅支持 为空 不为空 )
const relaOptions = computed(() => {
  if (!curType.value) {
    return [{ label: '等于', value: 'equals' }]
  }
  if (notSupConstParamTypes.includes(curType.value)) {
    return COMMON_CONDITION
  }

  return (fieldTypeMap[curType.value] as any)?.condition ?? COMMON_CONDITION
})
const needSetValue = computed(() => {
  return !['empty', 'not_empty'].includes(props.row.operator || '')
})
// 右侧值清空
const commonSetValue = (info: any) => {
  triggerValues({
    ...info,
    source: undefined,
    sourceName: ''
  })
}
// 左侧变量选择(这里返回两个值)
const handleLeftChange = (value: { varFullName: string; row: any }) => {
  commonSetValue({
    // 新加变量来源
    targetVariableType: value?.row?.variableType,
    target: value.varFullName,
    targetDataType: value?.row?.dataType ?? value?.row
  })
  // 这里将连接条件初始化未第一个options的值
  setTimeout(() => {
    commonSetValue({
      operator: relaOptions.value.length > 0 ? relaOptions.value[0].value : undefined,
      operatorName: relaOptions.value.length > 0 ? relaOptions.value[0].label : undefined
    })
  }, 0)
}
// 表达式选择
const handleFormulaSetChange = (val: EditorInfo) => {
  triggerValues({
    expression: val.value,
    expressionFull: val.editorValue
  })
}
// 连接器选择(清空已选择的值)
const handleOptChange = (val: string, option: any) => {
  commonSetValue({
    operator: val,
    operatorName: option.label
  })
}
// 右侧项选择(这里将处理后的名称返回)
const handleRightChange = (val: string, name?: string) => {
  triggerValues({
    source: val,
    sourceName: name || val
  })
}
// 右侧变量选择
const handleRightVarChange = (value: { varFullName: string; row: any }) => {
  triggerValues({
    // 新加变量来源
    sourceVariableType: value?.row?.variableType,
    source: value.varFullName
  })
}
// 追加逻辑如果是表达式，去校验express字段
const validFailRow = (info: StructuredCondition) => {
  // 仅校验必填项（额外附加字段太多）
  const needValidFields = needSetValue.value
    ? info.sourceType === 'formula'
      ? ['target', 'operator', 'express']
      : ['target', 'operator', 'source']
    : ['target', 'operator']
  let flag = false
  for (const key in info) {
    if (needValidFields.includes(key)) {
      // 兼容数组
      const val = (info as any)[key]
      if ((Array.isArray(val) && val.length === 0) || val === undefined || val === null || val === '') {
        flag = true
      }
    }
  }
  return flag
}
const showError = computed(() => {
  return validFailRow(props.row)
})
const handleAdd = ({ key }: any) => {
  addConditionRule(props.rowIndex, props.row.id, key === 'brother')
}
const handleDelete = () => {
  removeErrorMsg(props.row) // 移除验证项
  delConditionRule(props.rowIndex, props.row?.id)
}

// 值更新
const triggerValues = (refreshValues: any) => {
  // 追加 表达式显示 & 表达式
  let tempRow = { ...props.row, ...refreshValues }
  // const express = `"${tempRow.fieldName || ''}""${
  //   tempRow.conditionType || ''
  // }""${tempRow.value || ''}"`;
  const ruleText = `${tempRow.target || ''}${tempRow.operatorName || ''}${tempRow.sourceName || tempRow.source || ''}`
  tempRow = { ...tempRow, ruleText }
  // 构建下结构
  updateConditionRule(props.rowIndex, props.row.id, tempRow)
}
// 监听触发校验
watch(
  () => props.row,
  (val: StructuredCondition) => {
    if (validFailRow(val)) {
      addErrorMsg(val)
    } else {
      removeErrorMsg(val)
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="less">
.opt-wrapper {
  :deep(.anticon) {
    cursor: pointer;
    &.feed-back-icon {
      cursor: default;
    }
  }
}
.rule-item-wrapper {
  padding: 12px;
}
</style>
