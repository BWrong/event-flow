<!--
 * @Author: ykx
 * @Date: 2023-01-30 15:55:56
 * @LastEditTime: 2023-03-25 16:03:13
 * @LastEditors: your name
 * @Description: 搜索组件，直接修改样式不方便
 * @FilePath: \easycube-ui\packages\lowerCodeComs\src\configComponents\CInput.vue
-->
<template>
  <a-input
    placeholder="请输入"
    allow-clear
    :value="value"
    v-bind="$attrs"
    @change="handleChange"
    @pressEnter="handleSearch"
  >
    <template #suffix>
      <icon-font
        style="color: #939daa"
        type="icon-sousuo"
        @click="handleSearch"
      />
    </template>
  </a-input>
</template>
<script lang="ts" setup>

  /*eslint no-undef: "off"*/
  defineOptions({
    name: 'SInputSearch',
  });
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['update:value', 'onSearch', 'onClear']);
  const handleChange = (e: any) => {
    emit('update:value', e.target.value);
    if (!e.target.value) {
      emit('onClear');
    }
  };
  const handleSearch = () => {
    emit('onSearch', props.value);
  };
  // 不用change触发，外部改变的时候不要触发
  // watch(() => props.value, (val: string) => {
  //   if (!val) {
  //     emit('onClear')
  //   }
  // })
</script>
<style scoped lang="less"></style>
