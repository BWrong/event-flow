<script setup lang="ts">
import { Input } from 'ant-design-vue';
import { ref } from 'vue';
import type { FieldType } from '../../resource/dicts';
import JsonModal from './JsonModal.vue';
const modalVisible = ref(false);

const props = withDefaults(
  defineProps<{
    value: string;
    fieldType?: FieldType // 值类型（用于默认值设置 或者 校验设置值的结构）
  }>(),
  {
    value: '',
  },
);
const emits = defineEmits(['update:value']);
</script>

<template>
  <div class="w-full">
    <!-- a-input高度被限制了？？用div模拟 -->
    <Input readonly :title="value" placeholder="点击设置" :value="value" @click="modalVisible = true"></Input>
    <JsonModal v-model:visible="modalVisible" :value="value" :fieldType="fieldType"
      @on-ok="(val: string) => emits('update:value', val)" />
  </div>
</template>

<style scoped lang="less"></style>
