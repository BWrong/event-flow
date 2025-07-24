<!--
 * @Author: ykx
 * @Date: 2023-03-19 11:40:52
 * @LastEditTime: 2023-06-19 17:06:18
 * @LastEditors: your name
 * @Description: 条件树组渲染(如何处理联合类型，单文件里面)
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\ruleTreeSet\RuleGroupItem.vue
-->
<template>
  <div>
    <!-- 多项 -->
    <div
      v-if="row.id && row.criteriaList && row.criteriaList.length > 0"
      class="rule-set-container"
    >
      <!-- 为父节点 -->
      <div class="rule-list-container">
        <div class="rule-group-wrapper">
          <div class="rule-relation-wrapper">
            <div class="rule-line" />
            <a-select
              style="width: 60px"
              class="rule-trigger"
              :value="row.combineType"
              :options="combineTypeOptions"
              @change="handleChange"
            />
          </div>
          <!-- {{ props.row.rules }} -->
          <!-- 具体规则项列表 -->
          <div :class="['rule-list-wrapper', 'has-child']">
            <rule-group-item
              v-for="(rule, index) in row.criteriaList"
              :key="rule.ruleId"
              :row-index="index"
              :row="rule"
            />
          </div>
        </div>
      </div>
    </div>
    <rule-item
      v-else
      :row-index="rowIndex"
      :row="row"
    />
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import RuleItem from './RuleItem.vue';
import type { Structured, StructuredCondition } from '../../../types';
import { combineTypeOptions } from '../../resource/dicts';
const props = withDefaults(
  defineProps<{
    row:Structured | StructuredCondition | any;
    rowIndex: number;
  }>(),
  {
    row: () => ({
      id: '',
      condition: 'AND',
      conditionName: '且',
      criteriaList: [],
    }),
    rowIndex: 0,
  }
);

const updateRuleAttr = inject('updateRuleAttr') as any;
// 监听连接器变化(骗编辑器的), 这里名称值都更新
const handleChange = (val: string, option: any) => {
  updateRuleAttr('combineType', val, props.row);
  updateRuleAttr('combineTypeName', option.label, props.row);
};
</script>
<style scoped lang="less"></style>
