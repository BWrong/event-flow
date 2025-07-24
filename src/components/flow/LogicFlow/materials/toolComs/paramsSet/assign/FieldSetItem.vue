<!--
 * @Author: ykx
 * @Date: 2023-05-06 16:58:28
 * @LastEditTime: 2023-07-11 18:05:57
 * @LastEditors: your name
 * @Description: 单行渲染
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\fieldsSet\FieldSetItem.vue
-->
<script setup lang="ts">
import { Form, Select, Flex, Space } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { computed, reactive, watch, nextTick } from 'vue'
import { ValidItem } from '../../../resource/components'
import { type FieldType, fieldTypeMap, sourceTypeOptions, type ISourceType } from '../../../resource/dicts'
import type { EditorInfo } from '../../formula/types'
import type { StructuredCondition } from 'src/LogicFlow/types'
import FieldTreeSelect from '../../fieldTreeSelect/index.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { FormulaSelect } from '../../formula'
import WidgetItem from '../../WidgetItem.vue'

const props = withDefaults(
  defineProps<{
    row: StructuredCondition
    rowList: StructuredCondition[]
  }>(),
  {
    row: () => ({
      target: '',
      source: undefined,
      sourceType: 'value',
      sourceVariableType: 'flowTemp',
      operator: 'equals',
      targetType: 'variable',
      targetVariableType: 'flowTemp',
      targetDataType: {
        type: undefined
      },
      id: ''
    })
  }
)
const useForm = Form.useForm
const modelRef = computed(() => {
  return props.row
})
// 连接器选择项,这里返回死的
const relaOptions = computed(() => {
  return [{ label: '等于', value: 'equals' }]
})
// 自定义类型校验
const checktypeInfo = async (_rule: Rule, value: { type: string }) => {
  if (!value?.type) {
    return Promise.reject('请选择类型')
  } else {
    return Promise.resolve()
  }
}
const { validate, validateInfos } = useForm(
  modelRef,
  reactive({
    source: [
      {
        required: true,
        message: '赋值不能为空'
      }
    ],
    expression: [
      {
        required: true,
        message: '表达式不能为空'
      }
    ],
    target: [
      {
        required: true,
        message: '赋值目标必填'
      }
    ],
    typeInfo: [{ required: true, validator: checktypeInfo }]
  })
)
const emits = defineEmits(['update:value', 'onDelete', 'onAdd'])
const triggerValues = (newValues: Record<string, any>) => {
  emits('update:value', { ...props.row, ...newValues })
}

// 右侧值清空
const commonSetValue = (info: any) => {
  triggerValues({
    ...info,
    source: undefined
  })
}
// 值类型切换
const handleSourceTypeChange = async (val: ISourceType) => {
  commonSetValue({ sourceType: val })
}
// 查找符合选择的值类型(如果无类型，则默认支持全部变量选择)
const getValidFieldTypes = (fieldType?: FieldType) => {
  const target = fieldTypeMap[fieldType] as any
  return target?.allowTypes ?? []
}
// 变量选择(赋值目标)
const handleTargetVarChange = (value: { varFullName: string; row: any }) => {
  commonSetValue({
    target: value?.varFullName ?? '',
    targetVariableType: value?.row?.variableType,
    targetDataType: value?.row?.dataType ?? value?.row,
    targetConfig: value?.row?.extra ? JSON.stringify(value?.row?.extra) : '',
  })
}

// 变量选择 (赋值)
const handleSourceVarChange = (value: { varFullName: string; row: any }) => {
  triggerValues({
    sourceVariableType: value?.row?.variableType,
    source: value?.varFullName ?? ''
  })
}
// 表达式选择
const handleFormulaSetChange = (val: EditorInfo) => {
  triggerValues({
    expression: val.value,
    expressionFull: val.editorValue
  })
}
// 监听触发校验(新增 | 删除),这里不要await
watch(
  () => props.rowList,
  () => {
    validate()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div :class="['field-set-item-wrapper']">
    <Flex gap="middle">
      <ValidItem :validate-info="validateInfos.target">
        <!-- 会出现警告？ -->
        <a-form-item-rest>
          <FieldTreeSelect
            class="overflow-hidden-one"
            style="flex: 0 0 25%"
            :status="validateInfos.target.validateStatus"
            :value="modelRef.target"
            @update:value="handleTargetVarChange"
          />
        </a-form-item-rest>
      </ValidItem>
      <!-- 连接器 -->
      <Select
        :value="modelRef.operator"
        style="flex: 0 0 20%"
        :options="relaOptions"
        placeholder="请选择"
        disabled
        :dropdown-match-select-width="false"
      />
      <Select
        class="overflow-hidden-one"
        style="flex: 0 0 15%"
        :value="modelRef.sourceType"
        :options="Array.from(sourceTypeOptions)"
        placeholder="请选择"
        @change="handleSourceTypeChange"
      />
      <ValidItem :validate-info="modelRef.sourceType === 'formula' ? validateInfos.expression : validateInfos.source">
        <div class="min-w-0 flex-1">
          <WidgetItem
            v-if="modelRef.sourceType && modelRef.sourceType === 'value'"
            :value="modelRef.source"
            :cur-page-field="modelRef"
            @update:value="(val: string) => triggerValues({ source: val })"
          />
          <!-- 字段选择显示 -->
          <FieldTreeSelect
            v-if="modelRef.sourceType && modelRef.sourceType === 'variable'"
            :value="modelRef.source"
            :filter-field-types="getValidFieldTypes(modelRef.targetDataType?.type)"
            @update:value="handleSourceVarChange"
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
        </div>
      </ValidItem>
      <Space style="flex: 0 0 32px">
        <DeleteOutlined style="cursor: pointer" @click="emits('onDelete')" />
      </Space>
    </Flex>
  </div>
</template>

<style scoped lang="less">
.field-set-item-wrapper {
  width: 100%;
}
</style>
