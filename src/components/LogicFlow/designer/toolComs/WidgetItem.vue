<script setup lang="ts">
import { DatePicker, Input, InputNumber, Select } from 'ant-design-vue';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { computed, ref, watch } from 'vue';
import { guid } from '../../common/helper';
import type { StructuredCondition } from '../../types';
import { JsonSelect } from './jsonSet';

const props = withDefaults(
  defineProps<{
    value: any;
    disabled?: boolean;
    curPageField: StructuredCondition;
    curConnectType?: string;
    placeholderText?: string;
  }>(),
  {
    value: '',
    disabled: false,
    placeholderText: '请先选择变量',
    curPageField: () => ({
      targetDataType: {
        type: 'string',
      },
      id: guid(),
      operator: 'equals',
      source: '',
      targetVariableType: 'flowTemp',
      sourceVariableType: 'flowTemp',
      target: '',
      targetType: 'variable',
      sourceType: 'value',
    }),
    curConnectType: '',
    needValid: false,
  },
);
const emits = defineEmits(['update:value']);
// 兼容部分控件空显示
const realVal = ref();
const curFieldType = computed(() => {
  return (props.curPageField && props.curPageField.targetDataType?.type) || 'string';
});
const inputChange = (e: any) => {
  realVal.value = e.target.value;
  emits('update:value', realVal.value);
};
const numberChange = (val: number) => {
  emits('update:value', val);
};
const dateChange = (val: string) => {
  emits('update:value', val);
};
// 下拉选择变化(将名称返回)
const selectChange = (val: (string | number) | (number | string)[]) => {
  emits('update:value', val);
};
watch(
  () => props.value,
  (val: any) => {
    // 普通逻辑
    if (typeof val !== 'boolean' && !val) {
      realVal.value = curFieldType.value === 'string' ? '' : undefined;
    } else {
      realVal.value = cloneDeep(val);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div :class="['rule-widget-item']">
    <!-- 空显示 -->
    <span v-if="disabled" class="placeholder-text">
      {{ placeholderText }}
    </span>
    <template v-else>
      <template v-if="['string'].includes(curFieldType)">
        <!-- string类型 -->
        <Input :value="realVal" placeholder="请输入" @change="inputChange" />
      </template>
      <template v-else-if="['number', 'integer'].includes(curFieldType)">
        <!-- string类型 -->
        <InputNumber class="w-full" :value="realVal" placeholder="请输入" @change="numberChange" />
      </template>
      <template v-else-if="['boolean'].includes(curFieldType)">
        <!-- boolean类型 -->
        <Select class="w-150px" :value="!realVal ? undefined : realVal" placeholder="请选择" :options="[
          {
            label: 'true',
            value: true,
          },
          {
            label: 'false',
            value: false,
          },
        ]" @change="selectChange" />
      </template>
      <template v-else-if="['null'].includes(curFieldType)">
        <!-- boolean类型 -->
        <Input value="null" disabled />
      </template>
      <template v-else-if="curFieldType === 'date'">
        <DatePicker class="w-180px" :value="realVal" value-format="YYYY-MM-DD HH:mm:ss" :show-time="{
          defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
        }" @change="dateChange" />
      </template>
      <!-- json设置器 -->
      <template v-else-if="['structureObject', 'array', 'object'].includes(curFieldType)">
        <JsonSelect :value="realVal" :field-type="curFieldType" placeholder="请选择" @update:value="selectChange" />
      </template>
      <span v-else class="text-[var(--ant-colorTextTertiary)]">
        未知类型
      </span>
    </template>
  </div>
</template>

<style scoped lang="less">
.rule-widget-item {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 120px;
  align-items: center;

  .placeholder-text {
    color: var(--ant-colorTextQuaternary);
  }
}
</style>
