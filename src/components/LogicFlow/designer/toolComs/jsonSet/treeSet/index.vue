<!--
 * @Author: ykx
 * @Date: 2023-05-06 16:58:28
 * @LastEditTime: 2023-07-18 15:33:56
 * @LastEditors: youkaixing 15982819091@163.com
 * @Description: json参数设置
 * @FilePath: \easycube-apps\packages\zeroFlowDesign\src\configComs\toolComs\fieldsSet\Index.vue
-->
<script setup lang="ts">
import { Tree } from 'ant-design-vue';
import { getFlowParentNode, } from '../../../../common/flowTree';
import { guid } from '../../../../common/helper';
import { defaultValues } from '../../../../common/resolveDs';
import type { ReqParam } from '../../../../types';
import FieldSetItem from './FieldSetItem.vue';

const props = withDefaults(
  defineProps<{
    canAdd?: boolean;
    value: ReqParam[];
  }>(),
  {
    value: () => [],
    canAdd: true,
  },
);
const emit = defineEmits(['update:value']);
const perRow = (option: any): ReqParam => {
  return {
    id: 'param_' + guid(),
    targetType: 'value',
    target: option.outKey || '',
    targetDataType: { type: 'string' },
    sourceType: 'value', // 默认值类型
    pType: option?.pType, // 存一个上级类型
    source: defaultValues['string'],
  };
};
const getChildrenByKey = (key: string) => {
  let children: ReqParam[] = [];
  // 查找当前节点的父级children
  const parentNode = getFlowParentNode(key, props.value);
  if (Array.isArray(parentNode)) {
    children = parentNode;
  } else {
    children = parentNode?.children ?? [];
  }
  return children;
};
// 修改单项
const updateRow = (key: string, val: any) => {
  const children = getChildrenByKey(key);
  if (children && children.length > 0) {
    const index = children.findIndex((item: ReqParam) => item.id === key);
    children.splice(index, 1, val);
  }
};
// 新增操作， 区分首层和子层
const handleAdd = (type: 'brother' | 'child', row: ReqParam) => {
  const key = row.id;
  if (!row.children) {
    row.children = [];
  }
  if (key) {
    if (type === 'brother') {
      const pRow = getFlowParentNode(key, props.value);
      pRow.children.push(
        perRow({
          outKey: 'array' === pRow.targetDataType?.type ? `item ${pRow?.children?.length}` : '',
          pType: pRow.targetDataType?.type,
        }),
      );
    } else {
      row.children.push(
        perRow({
          outKey: 'array' === row.targetDataType?.type ? `item ${row?.children?.length}` : '',
          pType: row.targetDataType?.type,
        }),
      );
    }
  }
};

const handleDel = (key: string) => {
  const children = getChildrenByKey(key);
  if (children && children.length > 0) {
    const index = children.findIndex((item: ReqParam) => item.id === key);
    children.splice(index, 1);
  }
};
</script>

<template>
  <div class="field-set-wrapper">
    <!-- 增加高度，采用虚拟滚动，先给个定高 -->
    <Tree default-expand-all :tree-data="value" :selectable="false" :height="370" :field-names="{ key: 'id' }"
      class="json-set-tree">
      <template #title="row">
        <FieldSetItem :row="row" :row-list="value" @update:value="(val: any) => updateRow(row.id, val)"
          @on-delete="handleDel(row.id)" @on-add="handleAdd" />
      </template>
    </Tree>
    <!-- <div class="footer">
      <span
        class="fade-item-bg-wrapper no-width no-bg"
        style="margin-right: 5px"
        @click="handleAdd('brother')"
      >
        <icon-font type="icon-plus" />
        新增参数
      </span>
    </div> -->
  </div>
</template>

<style scoped lang="less">
.field-set-wrapper {
  :deep(.ant-tree) {
    overflow-x: auto;
  }
}

.footer {
  margin-top: 10px;
  display: flex;

  &>span {
    color: var(--ant-colorPrimary);
  }
}

:deep(.json-set-tree) {
  .ant-tree-treenode {
    padding-bottom: 8px;
  }
}
</style>
