/*
 * @Author: ykx
 * @Date: 2023-05-19 09:45:26
 * @LastEditTime: 2023-11-29 10:10:43
 * @LastEditors: Bwrong
 * @Description:
 * @FilePath: \easycube-apps\packages\utils\src\flowTree.ts
 */

import { cloneDeep } from 'lodash-es';

type TreeItem<T> = {
  id: string;
  children?: T[];
  branches?: T[];
  parentKey?: string;
  [prop: string]: any;
};
/**
 * @description: 平铺节点树
 * @param {T} data 数据节点
 * @param {*} keepRefence - 是否需要保持引用(某些场景需要用到)
 */
export function flatFlowTreeDataClosure<T extends TreeItem<T>>(
  data: T[],
  keepRefence = false,
  idKey = 'id',
) {
  const treeData = keepRefence ? data : cloneDeep(data);
  const flattenData: T[] = [];
  function flattenTree(data: T[], parentKey: string) {
    data.forEach((ele: T) => {
      const { children, branches } = ele;
      const id = ele[idKey];
      if (keepRefence) {
        ele.parentKey = parentKey;
        flattenData.push(ele);
      } else {
        flattenData.push({
          parentKey,
          ...ele,
        });
      }
      const tempChildren = branches || children;
      if (tempChildren) {
        flattenTree(tempChildren, id);
      }
    });
  }
  flattenTree(treeData, '');
  return flattenData;
}
// 3.给个节点0-0-1-0，找到ta所有的父级id
export function findFlowParentIds<T extends TreeItem<T>>(
  item: T,
  flattenTree: T[],
  idKey = 'id',
  needRow = false,
) {
  const parentArr: string[] = []; // 存储所有的父级元素id(包含自身)
  function find(id: string, flattenTree: any) {
    flattenTree.forEach((ele: any) => {
      if (ele[idKey] === id) {
        parentArr.unshift(needRow ? ele : ele[idKey]);
        find(ele.parentKey, flattenTree);
      }
    });
  }
  find(item[idKey], flattenTree);
  return parentArr;
}
/*
 *@functionName: 查找当前key 在树中的最近父节点
 *@params1: ${String} 唯一键
 *@params2: ${Array} 完整树结构
 *@returns ${String} 父节点key名(array兼容多种情况， string为单个项)
 */
export const getFlowParentNode = (
  key: string,
  tree: any[],
  idKey = 'id',
  childrenKey: string[] | string = ['children', 'branches'],
) => {
  const recurveParent = (key: string, tree: any[]) => {
    let parentNode: any;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      let children = null;
      if (Array.isArray(childrenKey) && childrenKey.length > 0) {
        for (let j = 0; j < childrenKey.length; j++) {
          if (node[childrenKey[j]]) {
            children = node[childrenKey[j]];
          }
        }
      } else {
        children = node[childrenKey as string];
      }
      if (children && children.length > 0) {
        if (children.some((item: any) => item[idKey] === key)) {
          parentNode = node;
        } else if (recurveParent(key, children)) {
          parentNode = recurveParent(key, children);
        }
      }
    }
    return parentNode;
  };
  console.log(recurveParent(key, tree));
  return recurveParent(key, tree) || tree;
};
/*
 *@functionName: 根据指定节点key获取指定节点全量数据
 *@params1: ${String} 唯一键
 *@params2: ${Array} 完整树结构
 */
export const getFlowNode = (key: string, tree: any[], idKey = 'id') => {
  let result: any;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node[idKey] === key) {
      result = node;
    } else {
      if (node.children && getFlowNode(key, node.children)) {
        result = getFlowNode(key, node.children);
      }
    }
  }
  return result;
};
