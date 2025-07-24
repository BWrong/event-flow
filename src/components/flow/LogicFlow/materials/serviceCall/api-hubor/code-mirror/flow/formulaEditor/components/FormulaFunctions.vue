<!--
 * @Author: ykx
 * @Date: 2023-06-21 18:35:06
 * @LastEditTime: 2023-07-04 09:57:21
 * @LastEditors: your name
 * @Description: 函数表达式选择
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\components\FormulaFunctions.vue
-->
<script lang="ts" setup>
import { computed } from 'vue'

import { fieldTypeMap } from '../../../../dict'

import { funcList } from '../../../common/flowFuns'
import { useTree } from '../../../hooks/useTree'
import type { FlowFormulaFunctionListItem } from '../../../types'

defineProps<{
  value: FlowFormulaFunctionListItem
  selectValue?: FlowFormulaFunctionListItem
}>()
const emits = defineEmits(['update:value', 'update:selectValue'])

// 追加funcType字段
const newFuncList = computed(() => {
  return funcList.map((item: any) => {
    if (item.children && item.children.length > 0) {
      item.children = item.children.map((lItem: FlowFormulaFunctionListItem) => {
        return { ...lItem, funcType: item.value }
      })
    }
    return item
  })
})
const { searchValue, filteredFields, expandedKeys, autoExpandParent, onExpand } = useTree(newFuncList.value)
const handleEnter = (item: FlowFormulaFunctionListItem) => {
  emits('update:value', { ...item, funcType: item.funcType })
}
const handleSelectChange = (keys: string[], { selectedNodes }: any) => {
  if (selectedNodes.length === 0 || selectedNodes[0]?.children) {
    return
  }
  emits('update:selectValue', { ...selectedNodes[0], funcType: selectedNodes[0]?.funcType })
}
</script>

<template>
  <div class="formula-functions">
    <div class="search-header">
      <i class="iconfont icon-sousuo" />
      <input v-model="searchValue" placeholder="搜索函数" />
      <i class="iconfont icon-close" />
    </div>
    <ATree
      v-if="filteredFields.length > 0"
      class="function-list"
      :field-names="{ label: 'name', key: 'value' }"
      :tree-data="filteredFields"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
      @select="handleSelectChange"
    >
      <template #title="item">
        <!-- 字段渲染-->
        <div v-if="!item.children" class="function-item" :title="item.name" @mouseenter="handleEnter(item)">
          <span class="name overflow-hidden-one" :title="item.name">
            {{ item.name }}
          </span>
          <span
            class="tag"
            :style="{
              color: fieldTypeMap[item.valueType as FlowFormulaFunctionListItem['valueType']].color,
              backgroundColor:
                fieldTypeMap[item.valueType as FlowFormulaFunctionListItem['valueType']]
                  .backgroundColor,
            }"
          >
            {{ fieldTypeMap[item.valueType as FlowFormulaFunctionListItem['valueType']].text }}
          </span>
        </div>
        <div v-else :title="item.name" class="overflow-hidden-one">
          {{ item.name }}
        </div>
      </template>
    </ATree>
    <p v-else style="margin-top: 20px; text-align: center">暂无匹配的函数</p>
  </div>
</template>

<style lang="less">
.formula-functions {
  .function-list {
    padding-bottom: 5px;
    padding-top: 5px;
    flex: 1;
    width: 100%;
    overflow: auto;
    .ant-tree-list {
    }
    .ant-tree-treenode {
      width: 100%;
    }
    .ant-tree-indent-unit {
      width: 10px;
    }
    .ant-tree-node-content-wrapper {
      flex: auto;
      min-width: 0;
    }
    .function-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 5px;
      .name {
        flex: 1;
      }
      .tag {
        padding: 0 5px;
        line-height: 18px;
        font-size: 12px;
        border-radius: 9px;
        text-align: center;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.formula-functions {
  height: calc(100% - 30px);
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  .search-header {
    width: 100%;
    padding: 3px 8px 3px 30px;
    position: relative;
    border-bottom: 1px solid #e1e3e5;
    font-size: 14px;
    .iconfont.icon-sousuo {
      position: absolute;
      left: 8px;
    }

    > input {
      display: inline-block;
      width: calc(100% - 20px);
      border: none;
      outline: none;
    }

    .iconfont.icon-close {
      position: absolute;
      right: 7px;
      cursor: pointer;
      display: none;
    }
  }

  .function-list,
  .function-item {
    margin-bottom: 0;
    list-style: none;
  }
  .function-list {
    padding-bottom: 5px;
    flex: 1;
    width: 100%;
    overflow-y: auto;
    .title {
      font-size: 12px;
      height: 26px;
      line-height: 26px;
      user-select: none;
      cursor: pointer;
      > .iconfont {
        margin: 0 3px;
        font-size: 18px;
        position: relative;
        top: 2px;
      }
    }
    // .function-item {
    //   height: 32px;
    //   padding: 0 9px;
    //   font-size: 12px;
    //   line-height: 32px;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   cursor: pointer;
    //   &.target {
    //     background-color: #e6f6f4;
    //   }
    //   .name {
    //     flex: 1;
    //     overflow: hidden;
    //     white-space: nowrap;
    //     text-overflow: ellipsis;
    //   }
    //   .tag {
    //     padding: 0 10px;
    //     height: 18px;
    //     line-height: 18px;
    //     font-size: 12px;
    //     border-radius: 9px;
    //     text-align: center;
    //   }
    // }
  }
}
.overflow-hidden-one {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
