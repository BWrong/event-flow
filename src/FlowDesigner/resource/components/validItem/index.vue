<!-- 提示框的校验 -->
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Tooltip } from 'ant-design-vue'
/*eslint no-undef: "off"*/
defineOptions({
  name: 'SValidItem'
})
const open = ref(false)
const isError = ref(false)
const props = withDefaults(
  defineProps<{
    validateInfo: { help?: any; validateStatus?: '' | 'error' | 'warning' | 'success' | 'validating' }
  }>(),
  {}
)
watch(
  () => props.validateInfo,
  () => {
    isError.value = props.validateInfo.validateStatus === 'error'
  },
  {
    deep: true
  }
)
const handleOpenChange = (visible: boolean) => {
  open.value = props.validateInfo.validateStatus === 'error' ? visible : false
}
</script>
<!-- 采用两个变量控制 -->
<template>
  <Tooltip
    placement="top"
    :open="isError && open"
    :title="validateInfo?.help?.[0]?.[0]"
    @open-change="handleOpenChange"
  >
    <slot />
  </Tooltip>
</template>

<style scoped lang="less"></style>
