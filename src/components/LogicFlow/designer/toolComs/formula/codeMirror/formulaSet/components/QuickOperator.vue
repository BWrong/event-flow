<script lang="ts" setup>
import { Flex, Tooltip } from 'ant-design-vue'
const emits = defineEmits(['operatorSelect'])
const operatorData = [
  { value: '+', tip: '加，number1+number2，可用于数值类型、货币类型加法计算' },
  { value: '-', tip: '减，number1-number2，可用于数值类型、货币类型减法计算' },
  { value: '*', tip: '乘，number1*number2，可用于数值类型、货币类型乘法计算' },
  { value: '/', tip: '除，number1/number2，可用于数值类型、货币类型除法计算' },
  { value: '%', tip: '取余，(number1%number2)，取number1除以number2的余数' },
  { value: '(', tip: '左括号，必须为英文半角' },
  { value: ')', tip: '右括号，必须为英文半角' },
  { value: '[', tip: '左方括号，用于List获取指定下标的元素以及Map获取指定key的value值' },
  { value: ']', tip: '右方括号，用于List获取指定下标的元素以及Map获取指定key的value值' },
  { value: '.', tip: '用于下钻获取对象中字段的值' },
  {
    value: '==',
    tip: '等于，可用于比较数值、货币、文本、日期时间及逻辑表达式之间的“相等”关系。例如IF((logical_test1==logical_test2),value1,value2)'
  },
  {
    value: '!=',
    tip: '不等于，可用于比较数值、货币、文本、日期时间及逻辑表达式之间的“不相等”关系。例如IF((logical_test1!=logical_test2),value1,value2)'
  },
  {
    value: '<',
    tip: '小于，比较数值、日期、货币之间小于的关系（日期比较时意义为 早于），例如IF(AnnualRevenue < 1000000, 1, 2)'
  },
  {
    value: '>',
    tip: '大于，比较入职、日期、货币之间大于的关系（日期比较时意义为 晚于）。IF(AnnualRevenue > 1000000, 1, 2)，'
  },
  {
    value: '<=',
    tip: '小于等于，比较数值、日期、货币之间小于等于（不大于）的关系（日期比较时意义为 不晚于）'
  },
  {
    value: '>=',
    tip: '大于等于，比较数值、日期、货币之间大于等于（不小于）的关系（日期比较时意义为 不早于）'
  },
  {
    value: '&&',
    tip: '与，用于表示logic判定表达式之间 且 的关系。例如：IF((Price<100 && Quantity<5),“Small”, null)'
  },
  {
    value: '||',
    tip: '或，用于表示logic判定表达式之间 或 的关系。例如：IF((ISPICKVAL(Priority , “High”)) || (ISPICKVAL(Status , “New”)),DAYS(NOW(),CreatedDate), 15)'
  },
  {
    value: '&',
    tip: '串联，用于串联 文本值\表达式 ，返回一个文本结果。例如："Expense-" & Trip_Name__c & "-" & ExpenseNum__c'
  }
]
</script>
<template>
  <Flex>
    <Tooltip v-for="item in operatorData" :key="item.value" placement="bottom">
      <template #title>
        <div style="max-width: 300px">{{ item.tip }}</div>
      </template>
      <span class="operator-item mr-1 mb-1 cursor-pointer" @click="emits('operatorSelect', item.value)">
        {{ item.value }}
      </span>
    </Tooltip>
  </Flex>
</template>
<style scoped lang="less">
.operator-item {
  background-color: var(--ant-colorBgBase);
  font-size: 12px;
  border-radius: 2px;
  text-align: center;
  height: 20px;
  width: 20px;
  line-height: 20px;
}
</style>
