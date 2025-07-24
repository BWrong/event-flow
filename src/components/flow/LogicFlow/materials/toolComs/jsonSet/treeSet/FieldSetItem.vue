<!--
 * @Author: ykx
 * @Date: 2023-05-06 16:58:28
 * @LastEditTime: 2023-07-11 18:05:57
 * @LastEditors: your name
 * @Description: 单行渲染(注：这里目前不需要变量和表达式)，TODO:同名处理
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\fieldsSet\FieldSetItem.vue
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Flex, Dropdown, Select, Input, Space, Menu, MenuItem } from 'ant-design-vue'
import type { ReqParam } from '../../../../types'
import { type FieldTypeOption, fullFieldTypeOptions } from '../../../resource/dicts'
import { IconFont } from '../../../resource/components'
import WidgetItem from '../../WidgetItem.vue'
import { defaultValues } from '../../../../common/resolveDs'
const props = withDefaults(
  defineProps<{
    row: ReqParam
    rowList: ReqParam[]
  }>(),
  {
    row: () => ({
      id: '',
      target: '',
      targetType: 'value',
      targetDataType: { type: 'string' },
      sourceType: 'value',
      source: '',
      value: '',
    }),
    rowList: () => []
  }
)

const emits = defineEmits(['update:value', 'onDelete', 'onAdd', 'removeErrorMsg', 'addErrorMsg'])
const triggerValues = (newValues: Record<string, any>) => {
  emits('update:value', { ...props.row, ...newValues })
}
// 是否显示key控件
const showTargetField = computed(() => {
  return (
    !['object', 'array'].includes(props.row.targetDataType?.type) ||
    (['object', 'array'].includes(props.row.targetDataType?.type) && !props.row.isRoot)
  )
})


// 构建字段对象(这里对应多个类型，仅取第一项)
const curPageField = computed(() => {
  if (props?.row?.targetDataType) {
    return {
      targetDataType: props?.row?.targetDataType
    }
  } else {
    return {}
  }
})
const validFailRow = (data: ReqParam) => {
  // 仅校验必填项
  const needValidFields = ['label', 'value']
  let flag = false
  for (const key in data) {
    if (needValidFields.includes(key)) {
      // 兼容数组
      const val = (data as any)[key]
      if ((Array.isArray(val) && val.length === 0) || !val) {
        flag = true
      }
    }
  }
  return flag
}
const showError = computed(() => {
  return validFailRow(props.row)
})

const handleDelete = () => {
  emits('removeErrorMsg', { id: props.row.id })
  emits('onDelete')
}
const handleChange = (key: string, val: string | boolean) => {
  triggerValues({
    [key]: val
  })
}
// 类型切换(处理值类型)
const handleTypeChange = (type: FieldTypeOption['value']) => {
  if (['array', 'object'].includes(type)) {
    triggerValues({
      targetDataType: { type },
      source: 'array' === type ? `{0 item}` : '{0 key}',
      children: [] // 清空子集
    })
  } else {
    triggerValues({
      targetDataType: { type },
      source: defaultValues[type],
      children: [] // 清空子集
    })
  }
}
// 右侧项选择(这里将处理后的名称返回-普通选择)
const handleRightChange = (val: string) => {
  triggerValues({
    source: val
  })
}
const handleAdd = (type: 'brother' | 'child', row: ReqParam) => {
  emits('onAdd', type, row)
}

// 监听触发校验
watch(
  () => props.row,
  (val: ReqParam) => {
    if (validFailRow(val)) {
      emits('addErrorMsg', { id: val.id })
    } else {
      emits('removeErrorMsg', { id: val.id })
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Flex gap="small">
    <Input
      v-if="showTargetField"
      class="shrink-0 basis-150px!"
      :disabled="'array' === row.pType"
      :value="row.target"
      placeholder="参数名"
      @change="(e: any) => handleChange('target', e.target.value)"
    />

    <span v-if="showTargetField" class="shrink-0"> : </span>
    <div :class="showTargetField ? 'basis-150px! shrink-0' : 'basis-342px! shrink-0'">
      <!-- 这里区分下数组对象，单独显示 -->
      <Input
        v-if="['array', 'object'].includes(row.targetDataType?.type)"
        :disabled="true"
        :value="row.source"
      ></Input>
      <template v-else>
        <!-- 普通类型值 -->
        <WidgetItem
          v-if="row.sourceType && row.sourceType === 'value'"
          :value="row.source"
          :cur-page-field="curPageField"
          need-valid
          @update:value="handleRightChange"
        />
      </template>
    </div>

    <!-- 类型选择 -->
    <Select
      style="flex-shrink: 0;flex:0 0 150px"
      :value="row.targetDataType?.type"
      :options="fullFieldTypeOptions"
      placeholder="请选择"
      @change="handleTypeChange"
    />
    <Space>
      <!-- 部分操作项配置 -->
      <IconFont type="icon-delete1" v-if="!row.isRoot" style="cursor: pointer" @click="handleDelete" />
      <!-- 对象数组 & 对象支持子层结构添加 -->
      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem v-if="!row.isRoot" key="brother" @click="handleAdd('brother', row)"> 新增同级 </MenuItem>
            <!-- 仅在对象数据类型 且  值选择类型为节点时才显示新增子项 -->
            <MenuItem
              v-if="['object', 'array'].includes(row.targetDataType?.type)"
              key="child"
              @click="handleAdd('child', row)"
            >
              新增子集
            </MenuItem>
          </Menu>
        </template>
        <IconFont type="icon-plus" />
      </Dropdown>
    </Space>
  </Flex>
</template>

<style scoped lang="less"></style>
