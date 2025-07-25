/*
 * @Author: ykx
 * @Date: 2023-03-18 21:16:38
 * @LastEditTime: 2023-07-17 18:50:16
 * @LastEditors: youkaixing 15982819091@163.com
 * @Description: 统一变量选择输出（状态管理的变量（页面级别，应用级别），动作入参，循环容器父级变量， TODO:其余节点的变量（目前用的中间变量处理））
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\hooks\useFindTreeNode.ts
 */

import { cloneDeep } from 'lodash-es'
import { type ComputedRef, computed, inject, ref, unref } from 'vue'
import { findFlowParentIds, flatFlowTreeDataClosure } from '../../../common/flowTree'
import { guid } from '../../../common/helper'
import { type FlowForNodeProps } from '../../../materials/for'
import type { FlowNode, FlowVariables, IDataType, TreeVariableItem } from '../../../types'
import { designerStoreInjectKey } from '../../injectKeys'
import type { FieldType } from '../dicts'

// 不过滤字段的节点类型
// const passFieldNodeTypes = ['apiRequest'];
interface TreeNodeOption {
  filterFieldTypes?: FieldType[]
  omitFieldNames?: string[] // 需要过滤的变量名
  allowParentSelect?: boolean
  outerTreeData?: TreeVariableItem[]
}

export const useFindTreeVars = (curNode: FlowNode, extraOptions?: ComputedRef<TreeNodeOption>) => {
  const newOptions = computed(() => {
    const tempOptions = unref(extraOptions)
    return {
      ...tempOptions,
      filterFieldTypes: tempOptions?.filterFieldTypes ?? [],
      omitFieldNames: tempOptions?.omitFieldNames ?? [],
      allowParentSelect: tempOptions?.allowParentSelect ?? true,
    }
  }) // 请确保extraOptions为对象，普通数据类型会丢失引用
  let originOuterTreeData: TreeVariableItem[] = [] // 缓存一份初始外界值，用于重置
  if (newOptions.value.outerTreeData && newOptions.value.outerTreeData.length > 0) {
    originOuterTreeData = cloneDeep(newOptions.value.outerTreeData)
  }
  const designerStore = inject(designerStoreInjectKey, null)

  const varTreeData = ref<TreeVariableItem[]>([])
  // 兼容首层
  const lazyload = (menuInfo: any) => {
    // return (
    //   (menuInfo?.type === 'structureObject' && menuInfo?.reference) ||
    //   (menuInfo.dataType?.type === 'structureObject' && menuInfo?.dataType?.reference)
    // )
    return false
  }
  /**
   * 转换变量数据结构，以适应树形结构显示(包含转换：1.变量列表 2.出参)
   * @param data 树变量项的数组
   * @returns 转换后的树变量项数组
   */
  const transformVar = (data: TreeVariableItem[]): TreeVariableItem[] => {
    const generatorItem = (arr: IDataType[]) => {
      const tempArr: TreeVariableItem[] = []
      if (arr.length > 0) {
        arr.forEach((item: IDataType, index: number) => {
          // 追加指定父级变量
          const addParentItem = () => {
            if (newOptions.value.allowParentSelect && type === 'object') {
              // 这里对结构体项追加一项本身值，用于选择
              tempArr.push({
                type: 'object',
                name: item.name,
                isLeaf: true, // 追加是否是叶子节点，兼容tree使用
                origin: { ...item },
                key: 'var_item_' + guid(),
              })
            }
          }
          // 兼容首层的情况
          const itemTypes =
            item?.itemTypes || item?.typeInfo?.itemTypes || item?.dataType?.itemTypes
          const type = item?.type || item?.typeInfo || item?.dataType?.type
          const reference =
            item?.reference || item?.typeInfo?.reference || item?.dataType?.reference
          const newItem = cloneDeep(item) as TreeVariableItem
          newItem.key = 'var_item_' + guid() // 添加唯一键
          // console.log(newItem, itemTypes)

          if (itemTypes && itemTypes.length > 0) {
            // 添加一个children字段用于树显示
            const tempChildren = generatorItem(itemTypes)
            if (!['array'].includes(type) && tempChildren.length === 0) {
              // 数组不显示下级
              // 追加无选项菜单
              newItem.children = [
                {
                  type: 'empty',
                  name: '无选项',
                  isLeaf: true, // 追加是否是叶子节点，兼容tree使用
                  key: 'empty_item_' + guid(),
                },
              ]
            } else {
              newItem.children = tempChildren
            }
          }
          // 针对结构体引用类型进行设置
          // if (
          //   newOptions.value.allowParentSelect &&
          //   type === 'structureObject' &&
          //   reference &&
          //   reference?.id
          // ) {
          //   // 这里对结构体项追加一项本身值，用于选择
          //   tempArr.push({
          //     type: 'structureObject',
          //     name: item.name,
          //     isLeaf: true, // 追加是否是叶子节点，兼容tree使用
          //     origin: { ...item },
          //     key: 'var_item_' + guid(),
          //   });
          //   newItem.loading = false; // 加载中
          //   newItem.isLoaded = false; // 是否已经加载
          // }
          // origin-用于选择的时候返回的原始值
          if (item.name) {
            // 判断过滤变量
            if (
              newOptions?.value?.filterFieldTypes &&
              newOptions?.value?.filterFieldTypes.length > 0
            ) {
              if (newOptions.value.filterFieldTypes.includes(type) || type === 'object') {
                if (
                  newOptions.value.omitFieldNames.length === 0 ||
                  !newOptions.value.omitFieldNames.includes(item.name)
                ) {
                  addParentItem()
                  // 是否有指定排除变量
                  tempArr.push({ ...newItem, origin: { ...item }, isLeaf: !lazyload(item) })
                }
              }
            } else {
              if (
                newOptions.value.omitFieldNames.length === 0 ||
                !newOptions.value.omitFieldNames.includes(item.name)
              ) {
                addParentItem()
                // 是否有指定排除变量
                tempArr.push({ ...newItem, origin: { ...item }, isLeaf: !lazyload(item) })
              }
            }
          }
        })
      }
      return tempArr
    }
    return generatorItem(data as unknown[] as IDataType[])
  }
  // 父级变量（针对循环嵌套容器）
  const curToRootVarList = computed(() => {
    const curToRootNodesList = findFlowParentIds(
      curNode,
      flatFlowTreeDataClosure(designerStore.state.flowData.children),
      'id',
      true,
    )
    // 查找循环容器父节点
    if (curToRootNodesList.length > 0) {
      const loopNodes = curToRootNodesList.filter((item: FlowNode<FlowForNodeProps>) => {
        return ['FlowForNode'].includes(item.type) && item.id !== curNode.id // 排除自身
      })
      let tempVariableList: FlowVariables[] = []
      // 排除name不存在的变量
      if (loopNodes.length > 0) {
        loopNodes.forEach((item: FlowNode<FlowForNodeProps>) => {
          if (item.props.variableList && item.props.variableList.length > 0) {
            tempVariableList = tempVariableList.concat(
              item.props.variableList.filter((vItem: FlowVariables) => !!vItem.name),
            )
          }
        })
      }
      return tempVariableList
    }
    return []
  })
  // 组合变量(兼容外界传入结构体)
  const resultTreeData = computed<TreeVariableItem[]>(() => {
    if (newOptions.value.outerTreeData && newOptions.value.outerTreeData.length > 0) {
      return newOptions.value.outerTreeData
    }
    return [
      ...transformVar(cloneDeep(curToRootVarList.value) as TreeVariableItem[]),
      ...varTreeData.value,
    ]
  })
  // 平铺结构（整合下父容器的）
  const flattedVars = computed(() => {
    const result: any[] = []
    const generatorItem = (arr: any[]) => {
      if (arr.length > 0) {
        arr.forEach((item: any) => {
          result.push(item)
          if (item.children && item.children.length > 0) {
            generatorItem(item.children)
          }
        })
      }
    }
    generatorItem(resultTreeData.value)
    return result
  })
  const resetVars = () => {
    if (originOuterTreeData.length > 0) {
      varTreeData.value = transformVar(cloneDeep(originOuterTreeData))
    } else {
      // console.log(designerStore?.state.storesVariables)
      varTreeData.value = transformVar(
        cloneDeep([
          ...designerStore?.state.storesVariables,
          ...(designerStore?.state?.flowData?.variables ?? []),
        ] as unknown[] as TreeVariableItem[]),
      )
    }
  }

  // resetVars()
  // 一些子项通用操作
  const getIconByType = (menuInfo: any) => {
    const type = menuInfo?.type || menuInfo?.dataType?.type
    if (['object', 'structureObject'].includes(type)) {
      return 'icon-var-structure-object'
    } else if (type === 'array') {
      return 'icon-var-array'
    } else {
      return 'icon-var-prop'
    }
  }

  // hover懒加载(直接修改了computed，会不会出现什么问题??)
  const handleMouseenter = async (item: any) => {
    if (!lazyload(item)) {
      return
    }
    // if (item.isLoaded) {
    //   return;
    // }
    // // 加载子集
    // item.loading = true;
    // // 兼容获取下引用id
    // const [err, res] = await to(
    //   getModelDetails(item?.reference?.id || item?.dataType?.reference?.id),
    // );
    // item.loading = false;
    // item.isLoaded = true;
    // if (!err && res?.data?.data) {
    //   const tempChildren = analysisRes(res.data.data?.dataModelDetailsTreeVo?.children ?? []);
    //   console.log(tempChildren);
    //   item.children = transformVar(tempChildren); //结构转换下
    // }
  }
  // tree懒加载(直接修改了computed，会不会出现什么问题??)
  // const onLoadData: TreeProps['loadData'] = (treeNode) => {
  //   return new Promise<void>(async (resolve) => {
  //     if (treeNode.dataRef.children) {
  //       resolve();
  //       return;
  //     }
  //     // 下级请求
  //     if (treeNode.dataRef?.item?.reference?.id || treeNode.dataRef?.dataType?.reference?.id) {
  //       const [err, res] = await to(getModelDetails(treeNode.dataRef.dataType.reference?.id));
  //       if (!err && res?.data?.data) {
  //         const tempChildren = analysisRes(res.data.data?.dataModelDetailsTreeVo?.children ?? []);
  //         console.log(transformVar(tempChildren));
  //         treeNode.dataRef.children = transformVar(tempChildren); //结构转换下
  //         // treeData.value = [...treeData.value];
  //         resolve();
  //       }
  //     } else {
  //       resolve();
  //     }
  //   });
  // };
  return {
    resultTreeData,
    varTreeData,
    resetVars,
    flattedVars,
    handleMouseenter,
    getIconByType,
    lazyload,
    transformVar,
    // onLoadData,
  }
}
