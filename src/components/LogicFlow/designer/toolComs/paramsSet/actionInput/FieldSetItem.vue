<!--
 * @Author: ykx
 * @Date: 2023-05-06 16:58:28
 * @LastEditTime: 2023-07-11 18:05:57
 * @LastEditors: your name
 * @Description: 单行渲染
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\fieldsSet\FieldSetItem.vue
-->
<script setup lang="ts">
import { Flex } from 'ant-design-vue';
import type { BaseParam } from 'src/LogicFlow/types';
import { getItemType } from '../../../../common/helper';
const props = withDefaults(
  defineProps<{
    row: BaseParam
  }>(),
  {
    row: () => ({
      name: '',
      dataType: {
        type: 'string'
      },
      variableName: '',
      description: '',
      defaultValue: ''
    })
  }
)
const emits = defineEmits(['update:value'])
</script>

<template>
  <Flex gap="middle" align="center" :class="['field-set-item-wrapper']">
    <span style="flex: 0 0 100px">
      {{ row.name }}
    </span>
    <span style="flex: 0 0 100px">
      {{ getItemType(row.dataType) }}
    </span>
    <span style="flex: 0 0 100px">
      {{ row.defaultValue }}
    </span>
    <span :title="row.description" class="overflow-hidden-one" style="flex: 1 1 0%">
      {{ row.description }}
    </span>
  </Flex>
</template>

<style scoped lang="less">
.field-set-item-wrapper {
  width: 100%;
  height: 40px;
}
</style>
