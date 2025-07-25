<!--
 * @Author: sxx
 * @Desc: 动态添加参数
 * @Date: 2024-07-30 14:25:52
 * @LastEditors: sxx
 * @LastEditTime: 2024-07-30 14:25:52
-->
<script lang="ts" setup>
/* eslint-disable */
import { ref, watch, onMounted } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { cloneDeep, debounce } from 'lodash-es'
// import IconFont from '../iconFont/index.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    value: any[]
    tip?: string
    showButton?: boolean
  }>(),
  {
    title: '添加Query参数',
    value: () => [],
    tip: '',
    showButton: true
  }
)
const columns: TableColumnsType<any> = [
  {
    title: '参数名',
    dataIndex: 'name',
    key: 'name'
  },
  // {
  //   title: '赋值方式',
  //   dataIndex: 'method',
  //   key: 'method',
  //   align: 'center'
  // },
  {
    title: '值',
    dataIndex: 'value',
    key: 'value',
    align: 'center'
  },
  // 操作
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center'
  }
]

const defaultItem = {
  name: '',
  // method: 'value', // 赋值方式：值、变量、表达式
  value: '',
}
const dataSource = ref<any[]>(cloneDeep(props.value))
const handleAddParams = () => {
  dataSource.value.push(cloneDeep(defaultItem))
  console.log(dataSource.value)
}
const emits = defineEmits(['update:value', 'changeContent'])
// const changeContentType = (val: string) => {
//   console.log(val)
//   emits('changeContent', val)
// }
watch(
  () => props.value,
  (val) => {
    dataSource.value = val
  }
)
watch(
  dataSource.value,
  debounce(() => {
    emits('update:value', cloneDeep(dataSource.value))
    console.log('触发addBasechange')
  }, 500)
)
const handleDel = (index: number) => {
  dataSource.value.splice(index, 1)
}
onMounted(() => {
  // if (dataSource.value.length === 0) {
  //   handleAddParams()
  // }
})
</script>

<template>
  <div>
    <AButton v-if="showButton" style="margin-bottom: 10px" @click="handleAddParams">
      <template #icon>
        <PlusOutlined />
      </template>
      {{ title }}
    </AButton>
    <span v-if="tip" class="tips">
      <!-- <IconFont type="icon-icon-question-circle" size="16px"></IconFont> -->
      {{ tip }}
    </span>
    <ATable :columns="columns" :data-source="dataSource" :pagination="false" size="small">
      <template #headerCell="{ column }">
        <span style="font-weight: normal">
          {{ column.title }}
        </span>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'name'">
          <AInput v-model:value="record[column.key!]" :disabled="!showButton"></AInput>
        </template>
        <!-- <template v-if="column.dataIndex === 'method'">
          <ASelect v-model:value="record[column.key!]" disabled>
            <ASelectOption value="value">值</ASelectOption>
          </ASelect>
        </template> -->
        <template v-if="column.dataIndex === 'value'">
          <AInput v-model:value="record[column.key!]" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <DeleteOutlined v-if="showButton" type="icon-shanchu" class="icon-shanchu" @click="handleDel(index)" />
        </template>
      </template>
    </ATable>
  </div>
</template>

<style lang="less" scoped>
.tips {
  margin-bottom: 10px;
  display: inline-block;
  font-size: 12px;
  color: var(--ant-colorTextSecondary);
}
.icon-shanchu {
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: var(--ant-colorErrorHover);
  }
}
</style>
