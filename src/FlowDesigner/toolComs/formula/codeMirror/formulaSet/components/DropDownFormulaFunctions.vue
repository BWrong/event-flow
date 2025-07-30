<!--
 * @Author: ykx
 * @Date: 2023-06-21 18:35:06
 * @LastEditTime: 2023-07-04 09:57:21
 * @LastEditors: your name
 * @Description: 函数表达式选择(下拉框)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\components\FormulaFunctions.vue
-->
<script lang="ts" setup>
  import { ref } from 'vue';

  import { CaretDownOutlined } from '@ant-design/icons-vue';
  import type { FlowFormulaFunctionListItem } from '../../../types';
  import FormulaFunctions from './FormulaFunctions.vue';
  const props = defineProps<{
    value: FlowFormulaFunctionListItem;
    selectValue?: FlowFormulaFunctionListItem;
  }>();
  const emits = defineEmits(['update:value', 'update:selectValue']);
  const visible = ref(false);
</script>

<template>
  <APopover
    v-model:open="visible"
    placement="bottomLeft"
    trigger="click"
    :title="false"
    overlay-class-name="lazy-select-list-wrapper"
    :overlayStyle="{ width: '250px' }"
  >
    <template #content>
      <div style="height: 300px">
        <FormulaFunctions
          :value="value"
          :select-value="selectValue"
          @update:value="(val: string) => emits('update:value', val)"
          @update:selectValue="(val: string) => emits('update:selectValue', val)"
          showPopup
        />
      </div>
    </template>
    <a-button>
      插入函数
      <CaretDownOutlined />
    </a-button>
  </APopover>
</template>

<style lang="less"></style>

<style lang="less" scoped></style>
