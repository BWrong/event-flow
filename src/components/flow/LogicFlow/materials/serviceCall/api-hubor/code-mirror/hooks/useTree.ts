/*
 * @Author: ykx
 * @Date: 2023-07-04 09:38:18
 * @LastEditTime: 2023-07-06 20:02:12
 * @LastEditors: your name
 * @Description: 树部分公共hook(公共搜索)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\hooks\useTree.ts
 */
import { cloneDeep } from 'lodash-es'
import { computed, type Ref, ref, unref, watch } from 'vue'

import { flatFlowTreeDataClosure } from './flowTree'

export const useTree = (outData: any[] | Ref<any[]>) => {
  const treeData = computed(() => {
    return cloneDeep(unref(outData))
  })
  const expandedKeys = ref<(string | number)[]>([])
  const copyExpandedKeys = ref<(string | number)[]>([]) // 用于筛选过滤
  const searchValue = ref<string>('')
  const autoExpandParent = ref<boolean>(true)

  const dataList = computed(() => {
    return flatFlowTreeDataClosure(treeData.value, false, 'value') || []
  })
  // 需要过滤的数据（expandkeys + 命中的keys）
  const filterKeys = computed(() => {
    const equalKeys = dataList.value
      .filter((item: any) => item.name.includes(searchValue.value))
      .map((item: any) => item.value)
    return [...new Set([...equalKeys, ...copyExpandedKeys.value])]
  })
  // 搜索过滤
  const filteredFields = computed(() => {
    const generateList = (data: any) => {
      const result: any[] = []
      data.forEach((item: any) => {
        if (filterKeys.value.includes(item.value)) {
          if (item.children && item.children.length > 0) {
            const tempList = generateList(item.children)
            if (tempList.length > 0) {
              item.children = tempList
            }
          }
          result.push(item)
        }
      })
      return result
    }
    if (searchValue.value === '') {
      return treeData.value
    } else {
      return generateList(cloneDeep(treeData.value))
    }
  })
  const onExpand = (keys: string[]) => {
    expandedKeys.value = keys
    autoExpandParent.value = false
  }
  watch(searchValue, (value) => {
    if (!value) {
      expandedKeys.value = []
      autoExpandParent.value = true
      return
    }
    const expanded = dataList.value
      .map((item: any) => {
        if (item.name.indexOf(value) > -1) {
          return item.parentKey
        }
        return null
      })
      .filter((item: any, i: number, self: any) => item && self.indexOf(item) === i)
    expandedKeys.value = expanded
    copyExpandedKeys.value = [...expanded]
    searchValue.value = value
    autoExpandParent.value = true
  })

  return {
    searchValue,
    filteredFields,
    expandedKeys,
    autoExpandParent,
    onExpand
  }
}
