<!--
 * @Author: ykx
 * @Date: 2023-06-24 15:19:58
 * @LastEditTime: 2023-07-03 17:58:05
 * @LastEditors: your name
 * @Description: 公式选择
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\formula\FormulaTextarea.vue
-->
<script setup lang="ts">
  import { type CodeMirrorValue } from '#src/types/editor';

  import FormulaSet from './FormulaSet.vue';

  // 这里后端需要此格式
  withDefaults(
    defineProps<{
      value: {
        valueName?: string;
        value: string;
        editorValue?: CodeMirrorValue;
      };
      excludeFields?: string[];
      fieldIndex?: number;
    }>(),
    {
      value: () => ({
        value: '',
        editorValue: { text: '', marks: [], cursor: { line: 0, ch: 0 } },
        valueName: '',
      }),
    },
  );

  const emits = defineEmits(['update:value']);
</script>

<template>
  <FormulaSet
    :value="value"
    :exclude-fields="excludeFields"
    :field-index="fieldIndex"
    @update:value="(params: any) => emits('update:value', params)"
  >
    <template #default="{ data: { triggerValue, visibleInfo } }">
      <ATextarea
        readonly
        :rows="4"
        :title="triggerValue?.valueName"
        placeholder="请设置公式"
        :value="triggerValue?.valueName"
        @click="visibleInfo.flag = true"
      />
    </template>
  </FormulaSet>
</template>

<style scoped lang="less"></style>
