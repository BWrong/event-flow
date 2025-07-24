<script lang="ts" setup>
import { computed } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
defineOptions({
  name: 'SIconFont'
})
const props = withDefaults(
  defineProps<{
    type: string
    color?: string
    size?: string | number
  }>(),
  {
    type: '',
    color: '',
    size: 14
  }
)
const onlineUrl = (import.meta as any).env.VITE_ICONFONT_URL
const scriptUrl = (import.meta as any).env.PROD ? '/iconfont/iconfont.js' : onlineUrl
const scriptUrls = [scriptUrl]
const wrapStyleObj = computed(() => {
  const { size, color } = props
  const fontSize = typeof size === 'string' ? parseInt(size) : size
  return {
    fontSize: fontSize + 'px',
    color
  }
})
</script>
<template>
  <component
    :is="
      createFromIconfontCN({
        scriptUrl: scriptUrls
      })
    "
    :type="type"
    v-bind="$attrs"
    :style="{...wrapStyleObj, ...($attrs.style as any)}"
  ></component>
</template>
<style scoped lang="less"></style>
