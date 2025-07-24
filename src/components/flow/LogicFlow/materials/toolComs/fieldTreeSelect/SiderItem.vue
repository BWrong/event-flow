<template>
  <!-- 含有子项，这里仅处理结构体 -->
  <ASubMenu
    :key="menuInfo.key"
    :title="menuInfo.name"
    :icon="getIconNode(menuInfo)"
    v-if="menuInfo.children && menuInfo.children.length > 0"
  >
    <template v-for="item in menuInfo.children" :key="item.name">
      <sider-item
        :menuInfo="item"
        :filterFieldTypes="filterFieldTypes"
        :allowParentSelect="allowParentSelect"
      ></sider-item>
    </template>
  </ASubMenu>
  <!-- 区分是否是ref结构体 -->
  <AMenuItem :title="menuInfo.name" :key="menuInfo.key" @mouseenter="handleMouseenter(menuInfo)" v-else>
    <template #icon>
      <IconFont v-if="menuInfo.type !== 'empty'" size="16px" :type="getIconByType(menuInfo)"></IconFont>
    </template>
    <AFlex justify="space-between" gap="small" :class="[menuInfo.type === 'empty' && 'empty']">
      <span class="text-overflow-ellipsis">{{ menuInfo.name }}</span>
      <template v-if="lazyload(menuInfo)">
        <LoadingOutlined v-if="menuInfo.loading" />
        <RightOutlined v-else />
      </template>
    </AFlex>
  </AMenuItem>
</template>
<script lang="ts" setup>
import { createVNode, computed, inject } from 'vue'
import { RightOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import type { FieldType } from '../../resource/dicts'
import { designerStoreInjectKey } from '../../../designer/injectKeys'

import { useFindTreeVars } from '../../resource/hooks'
import { IconFont } from '../../resource/components'
defineOptions({
  name: 'SubMenu'
})
const props = withDefaults(
  defineProps<{
    menuInfo: any
    allowParentSelect?: boolean // 父级是否允许选择
    filterFieldTypes?: FieldType[] // 过滤变量类型
  }>(),
  {
    filterFieldTypes: () => [],
    allowParentSelect: true
  }
)
const designerStore = inject(designerStoreInjectKey, null)

const options = computed(() => {
  return {
    filterFieldTypes: props.filterFieldTypes,
    allowParentSelect: props.allowParentSelect
  }
})
const { handleMouseenter, lazyload, getIconByType } = useFindTreeVars(designerStore?.state?.editNode!, options)
// 父级目录icon显示(好像不支持slot)
const getIconNode = (menuInfo: any) => {
  return createVNode(IconFont, { size: '16px', type: getIconByType(menuInfo) })
}
</script>
<style lang="less" scoped>
.empty {
  color: rgba(0,0,0,.45)
}
</style>
