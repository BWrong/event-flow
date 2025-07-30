<!--
 * @Author: ykx
 * @Date: 2023-06-21 16:30:56
 * @LastEditTime: 2023-07-03 18:19:09
 * @LastEditors: your name
 * @Description: 公式选择(这里不显示公式描述)
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\formula\FormulaSelect.vue
-->
<script setup lang="ts">
import { Input } from 'ant-design-vue';
import { ref } from 'vue';
import { QuestionTip } from '../../../resource/components';
import type { CodeMirrorValue, EditorInfo } from '../types';
import FormulaModal from './formulaSet/FormulaModal.vue';
// 这里后端需要此格式
withDefaults(
  defineProps<{
    value: {
      value: string;
      editorValue?: CodeMirrorValue;
    };
  }>(),
  {
    value: () => ({
      value: '',
      editorValue: { text: '', marks: [], cursor: { line: 0, ch: 0 } },
    }),
  },
);
const visible = ref(false);
const emits = defineEmits(['update:value']);
</script>

<template>
  <div class="formula-select-wrapper">
    <Input v-if="!value.value" readonly value="请选择" @click="visible = true" style="color: var(--ant-colorPrimary);"
      class="cursor-pointer"></Input>
    <QuestionTip v-else theme="white" placement="bottom" :tip="value.editorValue?.text ?? ''">
      <Input readonly value="公式计算结果" @click="visible = true" style="color: var(--ant-colorPrimary);"
        class="cursor-pointer"></Input>
    </QuestionTip>

    <formula-modal v-model:visible="visible" :value="value"
      @onOk="(val: EditorInfo) => emits('update:value', val)"></formula-modal>
  </div>
</template>

<style scoped lang="less"></style>
