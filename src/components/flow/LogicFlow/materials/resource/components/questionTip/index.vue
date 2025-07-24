<!--
 * @Author: ykx
 * @Date: 2023-05-11 10:49:46
 * @LastEditTime: 2024-06-11 17:04:32
 * @LastEditors: Anxure
 * @Description: 快捷提示（支持字符串,字符串数组，如果需要更多自定义，请自行实现）
 * @FilePath: \easycube-apps\packages\components\src\globalComponents\QuestionTip.vue
-->

<template>
  <span
    v-if="tip"
    :style="{ display: blocked ? 'block' : 'inline-block' }"
  >
    <template v-if="true">
      <Tooltip
        v-if="tip && theme === 'dark'"
        :placement="placement"
        :overlayStyle="cardStyle"
      >
        <template #title>
          <template v-if="Array.isArray(tip)">
            <p
              v-for="(str, index) in tip"
              :key="index"
            >
              {{ str }}
            </p>
          </template>
          <p v-else>{{ tip }}</p>
        </template>
        <slot>
          {{ label }} <QuestionCircleOutlined />
        </slot>
      </Tooltip>
      <!-- 白色提示 -->
      <Popover
        v-if="tip && theme === 'white'"
        :title="false"
        :placement="placement"
        :overlayInnerStyle="cardStyle"
      >
        <template #content>
          <template v-if="Array.isArray(tip)">
            <p
              v-for="(str, index) in tip"
              :key="index"
            >
              {{ str }}
            </p>
          </template>
          <p v-else>{{ tip }}</p>
        </template>
        <slot>
          {{ label }} <QuestionCircleOutlined />
        </slot>
      </Popover>
    </template>
  </span>
  <span v-else>{{ emptyText }}</span>
</template>

<script setup lang="ts">
  import { type TooltipPlacement } from 'ant-design-vue/es/tooltip/Tooltip';
  import { Popover , Tooltip } from 'ant-design-vue'
  import { QuestionCircleOutlined } from '@ant-design/icons-vue'
  // eslint-disable-next-line no-undef
  defineOptions({
    name: 'SQuestionTip',
  });
  withDefaults(
    defineProps<{
      label?: string;
      cardStyle?: any;
      tip?: string | string[];
      placement?: TooltipPlacement;
      blocked?: boolean;
      theme?: 'dark' | 'white';
      emptyText?: string;
    }>(),
    {
      label: '',
      emptyText: '-',
      cardStyle: () => ({ maxWidth: '300px',maxHeight: '300px',overflowY: 'auto' }),
      placement: 'right',
      blocked: false,
      tip: '',
      theme: 'dark',
    },
  );
</script>

<style scoped lang="less"></style>
