<template>
  <div>
    <ApiHubor
      v-model:requestInfo="formState"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { cloneDeep } from 'lodash-es'
  // import { FlowServiceCallNode, type FlowAssignmentNodeProps } from './index'
  import ApiHubor from './api-hubor/OperateHttp/index.vue';
  import { FlowServiceCallNode } from './index';

  const props = withDefaults(
    defineProps<{
      value: any
    }>(),
    {
      value: () => FlowServiceCallNode.props
    }
  )
  const formState = ref<any>(cloneDeep(FlowServiceCallNode.props))
  watch(
    () => props.value,
    (val: any) => {
      if (val) {
        formState.value = val // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
      }
    },
    { immediate: true }
  )
</script>

<style scoped lang="less">

</style>
