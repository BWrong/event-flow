/*
 * @Author: ykx
 * @Date: 2023-06-16 16:20:05
 * @LastEditTime: 2023-06-19 18:54:32
 * @LastEditors: your name
 * @Description: 部分通用条件树方法
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\hooks\useCondionTree.ts
 */

import { computed, reactive, type Ref } from 'vue'
import { getFlowParentNode } from '../../../common/flowTree'
import { getEditorNodeId } from '../../../common/helper'
import type { Structured, StructuredCondition, ValidFailItemType } from '../../../types'
import type { CombineTypeOption } from '../../resource/dicts'

export const useCondionTree = (
  outOptions: Ref<{
    updateDataFn: Function
    updateValidFn?: Function
    // 单个条件新增
    perCondition: () => StructuredCondition
  }>,
) => {
  const options = computed(() => {
    return outOptions.value
  })

  // 存放状态
  const state = reactive<{
    // 校验失败的项（目前仅存入id）
    validFailItems: ValidFailItemType[]
    // 条件树数据源
    conditions: Structured
  }>({
    validFailItems: [],
    conditions: {
      id: getEditorNodeId('bwf-c-u-'),
      combineType: 'and',
      combineTypeName: '且',
      criteriaList: [],
    },
  })
  // 通用获取当前节点父节点
  const getPnodecriteriaList = (id?: string) => {
    let criteriaList = [],
      parentNode
    if (!id) {
      criteriaList = state.conditions.criteriaList
    } else {
      // 查找当前节点的父级criteriaList
      parentNode = getFlowParentNode(id, state.conditions?.criteriaList ?? [], 'id')
      if (Array.isArray(parentNode)) {
        criteriaList = parentNode
      } else {
        criteriaList = parentNode?.criteriaList ?? []
      }
    }
    // 获取传入节点的索引值
    const index =
      criteriaList &&
      criteriaList.length > 0 &&
      criteriaList.findIndex((item: StructuredCondition) => item.id === id)
    return {
      criteriaList,
      ruleIndex: index,
      parentNode: Array.isArray(parentNode) ? undefined : parentNode,
    }
  }
  // 监听连接器变化
  const handleChange = (val: CombineTypeOption['value'], option: CombineTypeOption) => {
    state.conditions.combineType = val
    state.conditions.combineTypeName = option.label
    options.value.updateDataFn(state.conditions)
  }
  // 单个条件属性更新(骗编辑器的)
  const updateRuleAttr = (key: keyof typeof state, val: string, payload: any) => {
    payload[key] = val
    options.value.updateDataFn(state.conditions)
  }
  // 单个条件更新
  const updateConditionRule = (index: number, id: string, payload: any) => {
    const { criteriaList } = getPnodecriteriaList(id)
    criteriaList[index] = payload
    options.value.updateDataFn(state.conditions)
  }

  // 通用新增节点操作
  const baseAddCondition = (index: number, id?: string, isBrother = true) => {
    // 首层
    if (!id) {
      state.conditions.criteriaList.push({ ...outOptions.value.perCondition() })
    } else {
      const { criteriaList } = getPnodecriteriaList(id)
      if (isBrother) {
        criteriaList.splice(index + 1, 0, { ...outOptions.value.perCondition() })
      } else {
        // 修改当前元素为根元素，当前项加入第一个子元素中(注：这里无法获取到下拉项，先不设置第一个)
        const newRootBranch = {
          combineType: 'and',
          combineTypeName: '且',
          id: getEditorNodeId('bwf-c-u-'),
          criteriaList: [criteriaList[index], { ...outOptions.value.perCondition() }],
        }
        // 元素替换
        criteriaList.splice(index, 1, newRootBranch)
      }
    }

    options.value.updateDataFn(state.conditions)
  }
  // 新增同级条件（这里默认添加leftValue, 操作的id,为第一个字段）
  const addConditionRule = (index: number, id?: string, isBrother = true) => {
    baseAddCondition(isBrother ? index + 1 : index, id, isBrother)
  }
  // 删除条件(兼容删除倒数第二项时替换节点)
  const delConditionRule = (index: number, id?: string) => {
    const { criteriaList: curcriteriaList, parentNode } = getPnodecriteriaList(id)
    if (!id) {
      // 首层
      curcriteriaList.splice(index, 1)
    } else {
      if (parentNode) {
        if (curcriteriaList.length === 2) {
          // 查找当前节点的-2层
          const temp = curcriteriaList.find((item: StructuredCondition) => item.id !== id) // 缓存未被删除的项
          const { criteriaList, ruleIndex } = getPnodecriteriaList(parentNode?.id)
          criteriaList.splice(ruleIndex, 1, temp) //替换为孙子项
        } else {
          curcriteriaList.splice(index, 1)
        }
      } else {
        // 为第一层数据
        curcriteriaList.splice(index, 1)
      }
    }
    options.value.updateDataFn(state.conditions)
  }
  const validFailItemsIds = computed(() => {
    return state.validFailItems.map((item: ValidFailItemType) => item.id)
  })
  // 校验添加
  const addErrorMsg = (row: ValidFailItemType) => {
    if (!validFailItemsIds.value.includes(row?.id)) {
      state.validFailItems.push(row)
      options.value.updateValidFn && options.value.updateValidFn(state.validFailItems)
    }
  }
  // 校验移除
  const removeErrorMsg = (row: ValidFailItemType) => {
    if (validFailItemsIds.value.includes(row?.id)) {
      const index = validFailItemsIds.value.indexOf(row?.id)
      state.validFailItems.splice(index, 1)
      options.value.updateValidFn && options.value.updateValidFn(state.validFailItems)
    }
  }

  const handleAdd = () => {
    baseAddCondition(0)
  }
  return {
    state,
    updateConditionRule,
    updateRuleAttr,
    handleChange,
    handleAdd,
    delConditionRule,
    addConditionRule,
    addErrorMsg,
    removeErrorMsg,
  }
}
