<!--
 * @Author: ykx
 * @Date: 2023-05-06 16:58:28
 * @LastEditTime: 2023-07-18 15:33:56
 * @LastEditors: youkaixing 15982819091@163.com
 * @Description: 动作入参
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\fieldsSet\Index.vue
-->
<script setup lang="ts">
import { Flex } from 'ant-design-vue'
import type { BaseParam } from 'src/LogicFlow/types'
import FieldSetItem from './FieldSetItem.vue'
const props = withDefaults(
  defineProps<{
    value: BaseParam[]
  }>(),
  {
    value: () => []
  }
)
const emit = defineEmits(['update:value'])

const perRow = (): BaseParam => {
  return {
    name: '',
    variableName: '',
    dataType: {
      type: 'string'
    },
    description: '',
    defaultValue: ''
  }
}
</script>

<template>
  <div class="field-set-wrapper">
    <Flex gap="middle" class="field-set-item-header" align="center">
      <span style="flex: 0 0 100px">参数名称</span>
      <span style="flex: 0 0 100px">类型</span>
      <span style="flex: 0 0 100px">默认值</span>
      <span style="flex: 1 1 0%">说明</span>
    </Flex>
    <template v-if="value.length > 0">
      <FieldSetItem
        v-for="record in value"
        :key="record.name"
        :row="record"
      />
    </template>
    <p v-else class="empty-text" style="margin-top: 10px">暂无入参</p>
  </div>
</template>

<style scoped lang="less"></style>
