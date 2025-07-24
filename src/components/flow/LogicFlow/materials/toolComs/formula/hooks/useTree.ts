/*
 * @Author: ykx
 * @Date: 2023-07-04 09:38:18
 * @LastEditTime: 2023-07-06 20:02:12
 * @LastEditors: your name
 * @Description: 树部分公共hook(公共搜索)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\hooks\useTree.ts
 */
import { cloneDeep } from 'lodash-es';
import { computed, type Ref, ref, unref, watch } from 'vue';

import { flatFlowTreeDataClosure } from '../../../../common/flowTree';

export const useTree = (outData: any[] | Ref<any[]>) => {
  const treeData = computed(() => {
    return cloneDeep(unref(outData));
  });
  const expandedKeys = ref<(string | number)[]>([]);
  const copyExpandedKeys = ref<(string | number)[]>([]); // 用于筛选过滤
  const searchValue = ref<string>('');
  const autoExpandParent = ref<boolean>(true);

  const dataList = computed(() => {
    return flatFlowTreeDataClosure(treeData.value, false, 'value') || [];
  });
  // 需要过滤的数据（expandkeys + 命中的keys）
  const filterKeys = computed(() => {
    const equalKeys = dataList.value
      .filter((item: any) => item.name.includes(searchValue.value))
      .map((item: any) => item.value);
    return [...new Set([...equalKeys, ...copyExpandedKeys.value])];
  });
  const filteredFields = ref<any[]>([]);
  // 搜索过滤(计算属性会有问题？？)
  // const filteredFields = computed(() => {
  //   const generateList = (data: any) => {
  //     const result: any[] = [];
  //     data.forEach((item: any) => {
  //       if (filterKeys.value.includes(item.value)) {
  //         if (item.children && item.children.length > 0) {
  //           const tempList = generateList(item.children);
  //           if (tempList.length > 0) {
  //             item.children = tempList;
  //           }
  //         }
  //         result.push(item);
  //       }
  //     });
  //     return result;
  //   };
  //   if (searchValue.value === '') {
  //     return treeData.value;
  //   } else {
  //     return generateList(cloneDeep(treeData.value));
  //   }
  // });
  const onExpand = (keys: string[]) => {
    expandedKeys.value = keys;
    autoExpandParent.value = false;
  };
  watch(searchValue, (value) => {
    if (!value) {
      expandedKeys.value = [];
      autoExpandParent.value = false;
      filteredFields.value = treeData.value; // 直接恢复原始数据
      return;
    }

    // 搜索命中的节点和它们的父节点
    const hits = new Set<string>();
    const traverse = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.name.toLowerCase().includes(value.toLowerCase())) {
          hits.add(node.value);
          // 向上查找父节点
          let parent = node.parentKey;
          while (parent) {
            hits.add(parent);
            parent = dataList.value.find(item => item.value === parent)?.parentKey;
          }
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(treeData.value);

    // 更新展开的节点
    expandedKeys.value = Array.from(hits);
    autoExpandParent.value = true;

    // 过滤显示的节点
    const filterNodes = (nodes: any[]): any[] => {
      return nodes.map(node => {
        const newNode = { ...node };
        if (newNode.children) {
          const filtered = filterNodes(newNode.children);
          if (filtered.length || hits.has(newNode.value)) {
            newNode.children = filtered;
            return newNode;
          }
          return null;
        }
        return hits.has(newNode.value) ? newNode : null;
      }).filter(Boolean);
    };
    
    filteredFields.value = filterNodes(cloneDeep(treeData.value));
  });
  watch([filterKeys, searchValue], () => {
    const generateList = (data: any) => {
      const result: any[] = [];
      data.forEach((item: any) => {
        if (filterKeys.value.includes(item.value)) {
          if (item.children && item.children.length > 0) {
            const tempList = generateList(item.children);
            if (tempList.length > 0) {
              item.children = tempList;
            }
          }
          result.push(item);
        }
      });
      return result;
    };
    if (searchValue.value === '') {
      filteredFields.value =  treeData.value;
    } else {
      filteredFields.value = generateList(cloneDeep(treeData.value));
    }
  }, {
    immediate: true
  });

  return {
    searchValue,
    filteredFields,
    expandedKeys,
    autoExpandParent,
    onExpand,
  };
};
