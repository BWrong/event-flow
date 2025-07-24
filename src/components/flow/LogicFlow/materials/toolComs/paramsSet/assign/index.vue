<!--
 * @Author: ykx
 * @Date: 2023-05-06 16:58:28
 * @LastEditTime: 2023-07-18 15:33:56
 * @LastEditors: youkaixing 15982819091@163.com
 * @Description: 赋值设置
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\fieldsSet\Index.vue
-->
<script setup lang="ts">
import { watch, ref, provide } from 'vue'

import { getFlowNode, getFlowParentNode } from '../../../../common/flowTree'
import { DragList } from '../../../resource/components'
import { guid } from '../../../../common/helper'
import type { StructuredCondition } from 'src/LogicFlow/types'
import FieldSetItem from './FieldSetItem.vue'
import { Form, Flex, Button } from 'ant-design-vue'
const props = withDefaults(
  defineProps<{
    value: StructuredCondition[]
  }>(),
  {
    value: () => []
  }
)
provide('allowParentSelect', true); // 变量组件是否支持父级选择
const formItemContext = Form.useInjectFormItemContext()
const tempValues = ref<StructuredCondition[]>([])

const emit = defineEmits(['update:value', 'onDelete', 'update:validFailItems']);
// 这里要声明所有字段，否则useForm无法正确校验
const perRow = (): StructuredCondition => {
  return {
    target: '',
    source: undefined,
    sourceVariableType: 'flowTemp',
    sourceType: 'value',
    operator: 'equals',
    targetType: 'variable',
    targetVariableType: 'flowTemp',
    expression: '',
    expressionFull: null,
    targetDataType: {
      type: undefined
    },
    id: guid()
  }
}
const getChildrenByKey = (key: string) => {
  let children: StructuredCondition[] = []
  // 查找当前节点的父级children
  const parentNode = getFlowParentNode(key, props.value)
  if (Array.isArray(parentNode)) {
    children = parentNode
  } else {
    children = parentNode?.children ?? []
  }
  return children
}
const triggerUpdate = (list: any) => {
  emit('update:value', list)
  // 触发下校验更新
  formItemContext && formItemContext.onFieldChange()
}
// 修改单项
const updateRow = (key: string, val: any) => {
  const children = getChildrenByKey(key)
  if (children && children.length > 0) {
    const index = children.findIndex((item: StructuredCondition) => item.id === key)
    children.splice(index, 1, val)
    triggerUpdate(props.value)
  }
}
// 新增操作， 区分首层和子层
const handleAdd = (type: 'brother' | 'child', key?: string) => {
  if (key) {
    if (type === 'brother') {
      const children = getChildrenByKey(key)
      if (children && children.length > 0) {
        children.push(perRow())
        triggerUpdate(props.value)
      }
    } else {
      const curItem = getFlowNode(key, props.value) // 查找到当前节点
      if (curItem) {
        if (!curItem.children) {
          curItem.children = []
          triggerUpdate(props.value)
        }
        curItem.children.push(perRow())
      }
    }
  } else {
    // 首层
    triggerUpdate([...props.value, perRow()])
  }
}
// const validFailItemsIds = computed(() => {
//   return props.validFailItems.map((item: ValidFailPbpInputType) => item.id);
// });
// 校验添加
// const addErrorMsg = (row: ValidFailPbpInputType) => {
//   if (!validFailItemsIds.value.includes(row?.id)) {
//     emit('update:validFailItems', [...props.validFailItems, row]);
//   }
// };
// 校验移除
// const removeErrorMsg = (row: ValidFailPbpInputType) => {
//   if (validFailItemsIds.value.includes(row?.id)) {
//     const tempItems = cloneDeep(props.validFailItems);
//     const index = validFailItemsIds.value.indexOf(row?.id);
//     tempItems.splice(index, 1);
//     emit('update:validFailItems', tempItems);
//   }
// };
const handleDel = (key: string) => {
  const children = getChildrenByKey(key)
  if (children && children.length > 0) {
    const index = children.findIndex((item: StructuredCondition) => item.id === key)
    children.splice(index, 1)
    emit('onDelete', key)
    triggerUpdate(props.value)
  }
}
watch(
  () => props.value,
  (val: StructuredCondition[]) => {
    tempValues.value = val // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
    // 初始化追加唯一id
    tempValues.value.forEach((item: StructuredCondition) => {
      !item.id && (item.id = guid())
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="field-set-wrapper">
    <Button style="margin-bottom: 10px" type="primary" @click="handleAdd('brother')">
      <IconFont class="mr-1" type="icon-plus" />
      添加
    </Button>
    <Flex gap="middle" class="field-set-item-header" align="center">
      <span style="flex: 0 0 25%;padding-left: 15px">赋值目标</span>
      <span style="flex: 0 0 20%">操作</span>
      <span style="flex: 0 0 15%">赋值方式</span>
      <span style="flex: 1 1 0%"></span>
      <span style="flex: 0 0 32px">操作</span>
    </Flex>
    <template v-if="true">
      <DragList
        v-if="tempValues.length > 0"
        :show-add-icon="false"
        :show-del-icon="false"
        :list="tempValues"
        height="auto"
        @update:list="triggerUpdate"
      >
        <template #itemRender="{ record }">
          <FieldSetItem
            :row="record"
            :rowList="tempValues"
            @update:value="(val: any) => updateRow(record.id, val)"
            @on-delete="handleDel(record.id)"
            @on-add="(type: 'brother' | 'child') => handleAdd(type, record.id)"
          />
        </template>
      </DragList>
      <p v-else class="empty-text" style="margin-top: 10px">暂无赋值</p>
    </template>
  </div>
</template>

<style scoped lang="less"></style>
