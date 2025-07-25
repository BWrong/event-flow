<!-- 变量选择：TODO:不支持数组子项选择 -->
<template>
  <div class="var-dropdown-select-wrapper">
    <ADropdown v-model:open="dropdownOpen" trigger="click" :overlayStyle="{ width: dropDownWidth + 'px' }"
      @openChange="handleOpenChange" overlayClassName="field-tree-select-dropdown-wrapper">
      <!-- 这里隐藏select自带的下拉 -->
      <ASelect v-if="mode === 'select'" :value="!value ? undefined : value" :open="false" style="width: 100%"
        :status="(status as SelectStatus)" :placeholder="placeholder" @mouseenter="selectHover = true"
        @mouseleave="selectHover = false">
        <template #suffixIcon>
          <CloseCircleOutlined v-if="selectHover && !!value" class="text-[12px]" @click.stop="handleClear" />
          <template v-else>
            <UpOutlined class="text-[12px]" v-if="dropdownOpen" />
            <DownOutlined class="text-[12px]" v-else />
          </template>
        </template>
      </ASelect>
      <!-- 按钮触发 -->
      <AButton v-else>
        {{ buttonText }}
        <CaretDownOutlined />
      </AButton>
      <template #overlay>
        <AMenu @click="handleMenuSelect" class="var-menu-wrapper">
          <template v-if="resultTreeData.length > 0">
            <template v-for="item in resultTreeData" :key="item.key">
              <sider-item :filterFieldTypes="filterFieldTypes" :allowParentSelect="allowParentSelect"
                :menuInfo="item"></sider-item>
            </template>
          </template>
          <AMenuItem v-else key="empty_item" class="empty"> 无选项 </AMenuItem>
          <template v-if="showAddVar">
            <a-menu-divider></a-menu-divider>
            <a-menu-item key="add-var">
              <span style="color: var(--ant-colorPrimary)">
                <PlusOutlined />
                新增变量
              </span>
            </a-menu-item>
          </template>
        </AMenu>
      </template>
    </ADropdown>
  </div>
</template>
<script lang="ts" setup>
import { CaretDownOutlined, CloseCircleOutlined, DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons-vue'
import { Form } from 'ant-design-vue'
import { computed, inject, ref } from 'vue'
import { designerStoreInjectKey } from '../../injectKeys'
import type { FieldType } from '../../resource/dicts'
import { useFindTreeVars } from '../../resource/hooks'
import SiderItem from './SiderItem.vue'
type SelectStatus = '' | 'error' | 'warning'
const props = withDefaults(
  defineProps<{
    value?: string
    status?: '' | 'error' | 'warning' | 'success' | 'validating'
    placeholder?: string
    showAddVar?: boolean
    dropDownWidth?: number
    allowParentSelect?: boolean // 父级是否允许选择
    filterFieldTypes?: FieldType[] // 过滤变量类型
    omitFieldNames?: string[] // 指定排除变量
    mode?: 'select' | 'button'
    buttonText?: string
  }>(),
  {
    value: undefined,
    showAddVar: true,
    dropDownWidth: 200,
    mode: 'select',
    filterFieldTypes: () => [],
    allowParentSelect: true,
    placeholder: '请选择变量'
  }
)
const formItemContext = Form.useInjectFormItemContext()

/*******顶层传入的一些变量*******/
const provideOmitFieldNames = inject('omitFieldNames', undefined)
const provideAllowParentSelect = inject('allowParentSelect', undefined)
const designerStore = inject(designerStoreInjectKey, null)

const dropdownOpen = ref(false)
const selectHover = ref(false)
const options = computed(() => {
  return {
    filterFieldTypes: props.filterFieldTypes,
    allowParentSelect: provideAllowParentSelect === undefined ? props.allowParentSelect : provideAllowParentSelect,
    omitFieldNames: provideOmitFieldNames === undefined ? props.omitFieldNames : provideOmitFieldNames
  }
})
const { flattedVars, resultTreeData, resetVars } = useFindTreeVars(
  designerStore?.state?.editNode!,
  options
)
const emit = defineEmits(['update:value'])
// 这里直接拿路径数组
const handleMenuSelect = ({ key, keyPath }: any) => {
  if (key.includes('empty_item')) {
    return
  }
  if (key === 'add-var') {
    dropdownOpen.value = false;
    designerStore.state.createVariable = true
    return
  }
  // 根据key获取name
  const namePath = keyPath.map((pKey: string) => {
    const target = flattedVars.value.find((item: any) => item.key === pKey)
    return target?.name
  })
  // 这里返回两个值（varFullName-变量完整拼接，row-当前行数据,feat：追加最外层变量类别variableType）
  const rowInfo = flattedVars.value.find((item: any) => item.key === key);
  const variableType = flattedVars.value.find((item: any) => item.key === keyPath[0])?.origin?.variableType ?? 'flowTemp';
  emit('update:value', {
    varFullName: namePath.join('.'),
    row: rowInfo ? { ...rowInfo.origin, variableType } : null
  })
  formItemContext && formItemContext.onFieldChange()
  dropdownOpen.value = false
}
const handleOpenChange = (flag: boolean) => {
  // 每次打开重置tree
  if (flag) {
    resetVars()
  }
}
const handleClear = () => {
  emit('update:value', {
    varFullName: '',
    row: undefined
  })
  formItemContext && formItemContext.onFieldChange()
}
</script>
<style lang="less">
.field-tree-select-dropdown-wrapper {
  .ant-dropdown-menu-submenu-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ant-dropdown-menu-title-content {
    min-width: 0;
  }
}

.var-menu-wrapper.ant-dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
</style>
<style lang="less" scoped>
.empty {
  color: rgba(0, 0, 0, 0.45);
}

.var-dropdown-select-wrapper {
  width: 100%;
}
</style>
