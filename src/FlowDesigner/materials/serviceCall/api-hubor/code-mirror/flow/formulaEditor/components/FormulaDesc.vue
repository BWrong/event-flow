<!--
 * @Author: ykx
 * @Date: 2023-06-21 18:36:15
 * @LastEditTime: 2023-07-03 18:48:39
 * @LastEditors: your name
 * @Description: 右侧描述显示
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\components\FormulaDesc.vue
-->
<script lang="ts" setup>
import type { FlowFormulaFunctionListItem } from '../../../types';

defineProps<{
  dataSource: FlowFormulaFunctionListItem;
}>();
</script>

<template>
  <div class="formula-desc">
    <header v-if="dataSource.name">
      {{ dataSource.name }}
    </header>

    <main v-html="dataSource.desc" />

    <!-- <footer>
      <a>了解详情</a>
    </footer> -->
  </div>
</template>

<style lang="less" scoped>
.formula-desc {
  font-size: 12px;
  color: #555;
  line-height: 26px;
  > header {
    height: 30px;
    border-bottom: 1px solid #e1e3e5;
    padding-left: 10px;
    line-height: 30px;
  }

  > main {
    padding: 5px 10px;
    > :deep(i) {
      font-style: normal;
      color: #761086;
    }
    > :deep(strong) {
      font-weight: normal;
      margin: 0 4px;
      padding: 2px 4px;
      color: #008dcd;
      background: #e9f3fe;
      border-radius: 3px;
    }
  }

  > footer {
    display: inline-block;
    margin: 15px 0 0 10px;
    > a {
      color: #248af9;
      text-decoration: underline;
    }
  }
}
</style>
