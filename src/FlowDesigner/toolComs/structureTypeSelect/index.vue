<script lang="ts" setup>
import { CloseCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import type { ValidateStatus } from 'ant-design-vue/es/form/FormItem'
import { computed, ref } from 'vue'

import type { IDataType } from '../../types'
import { buildTree } from '../../utils/flowTree'
import { getItemType, guid } from '../../utils/helper'
import SiderItem from './SiderItem.vue'
import type { IMenuItem } from './type'
const dropdownOpen = ref(false)
const selectHover = ref(false)
const rootMenu = ref<IMenuItem[]>([
  {
    name: '基本类型',
    key: 'type_' + guid(),
    type: 'base',
    isRoot: true,
    children: [
      { name: 'string', type: 'string', key: 'type_' + guid() },
      { name: 'integer', type: 'integer', key: 'type_' + guid() },
      { name: 'number', type: 'number', key: 'type_' + guid() },
      { name: 'date', type: 'date', key: 'type_' + guid() },
      { name: 'boolean', type: 'boolean', key: 'type_' + guid() }
    ]
  },
  // 这里为了和apihub统一,list -> array, set,map -> object
  {
    name: '集合类型',
    type: 'set',
    key: 'type_' + guid(),
    isRoot: true,
    children: [
      { name: 'array', type: 'array', key: 'type_' + guid() },
      { name: 'object', type: 'object', key: 'type_' + guid() },
    ]
  },
  // 目前仅支持apihub
  {
    name: '对象类型',
    type: 'object',
    isRoot: true,
    key: 'type_' + guid(),
    children: [
      { name: 'object', type: 'object', key: 'type_' + guid() },
      // { name: 'apihub', type: 'apihub', key: 'type_' + guid() }
    ]
  }
])
// 平铺结构
const flattedMenus = computed(() => {
  const result: IMenuItem[] = []
  const generatorItem = (arr: IMenuItem[], pKey?: string) => {
    if (arr.length > 0) {
      arr.forEach((item: IMenuItem) => {
        result.push({ ...item, pKey })
        if (item.children && item.children.length > 0) {
          generatorItem(item.children, item.key)
        }
      })
    }
  }
  generatorItem(rootMenu.value)
  return result
})
const props = withDefaults(
  defineProps<{
    value?: IDataType
    validateStatus?: ValidateStatus
    allowParentSelect?: boolean // 父级是否允许选择
  }>(),
  {
    validateStatus: undefined,
    value: () => ({ type: 'string' }),
    allowParentSelect: true
  }
)
const emit = defineEmits(['update:value'])
// 兼容显示(兼容集合显示)
const displayValue = computed(() => {
  return getItemType(props.value)
})
// 这里直接拿路径数组
const handleMenuSelect = ({ key, keyPath }: any) => {
  console.log(keyPath)
  // 根据key获取name
  const selectMenu = flattedMenus.value.find((item: IMenuItem) => item.key === key)
  if (!selectMenu) {
    dropdownOpen.value = false
    return
  }
  // 根据key获取父级集合
  const parentMenusList = keyPath
    .map((pKey: string) => {
      const target = flattedMenus.value.find((item: IMenuItem) => item.key === pKey)
      return target || null
    })
    .filter((item: IMenuItem | null) => !!item)
  console.log(parentMenusList)
  if (parentMenusList.length > 0) {
    const rootItem = parentMenusList.find((item: IMenuItem) => item.isRoot)
    if (rootItem && rootItem.type === 'set') {
      // 这里排除root层
      const result = buildTree(
        parentMenusList.filter((item: IMenuItem) => !item.isRoot),
        {
          rowNames: { id: 'key', pId: 'pKey', children: 'itemTypes' },
          transformRow: (row: any) => {
            return {
              type: row.type // 这里只要type
            }
          }
        }
      )
      console.log(result)
      emit('update:value', result?.[0])
    } else {
      emit('update:value', {
        type: selectMenu.type
      })
    }
  }
  dropdownOpen.value = false
}
</script>

<template>
  <div class="type-dropdown-select-wrapper">
    <ADropdown v-model:open="dropdownOpen" trigger="click" overlay-class-name="var-overlay-wrapper">
      <!-- 这里隐藏select自带的下拉 -->
      <!-- 不能加v-bind:$attrs?? -->
      <ASelect :value="displayValue" :open="false" placeholder="请选择" :style="$attrs.style || {}"
        :status="validateStatus" @mouseenter="selectHover = true" @mouseleave="selectHover = false">
        <template #suffixIcon>
          <CloseCircleOutlined v-if="selectHover && !!value.type" class="text-[12px]"
            @click.stop="emit('update:value', undefined)" />
          <template v-else>
            <UpOutlined v-if="dropdownOpen" class="text-[12px]" />
            <DownOutlined v-else class="text-[12px]" />
          </template>
        </template>
      </ASelect>
      <template #overlay>
        <AMenu @click="handleMenuSelect">
          <template v-for="item in rootMenu" :key="item.key">
            <SiderItem :menu-info="item"></SiderItem>
          </template>
        </AMenu>
      </template>
    </ADropdown>
  </div>
</template>

<style lang="less" scoped>
.type-dropdown-select-wrapper {
  width: 100%;
}

.var-overlay-wrapper {
  max-width: 200px;
}
</style>
