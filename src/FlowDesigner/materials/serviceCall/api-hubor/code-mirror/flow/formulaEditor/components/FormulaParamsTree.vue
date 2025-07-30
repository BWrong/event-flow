<!--
 * @Author: ykx
 * @Date: 2023-06-21 17:13:53
 * @LastEditTime: 2023-07-06 20:14:26
 * @LastEditors: your name
 * @Description: 树形结构字段选择(采用a-tree替换)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\components\FormulaParamsTree.vue
-->
<script lang="ts" setup>
import { fieldTypeMap } from '../../../../dict'

import { useTree } from '../../../hooks/useTree'
import { Input, Tree } from 'ant-design-vue'
import IconFont from '../../../../IconFont/index.vue'

type FieldTypeKey = keyof typeof fieldTypeMap
const props = withDefaults(
  defineProps<{
    mainFields: any[]
    handleAdvanceFields?: Function
  }>(),
  {}
)
const emits = defineEmits(['select'])
// const filledSubFieldsTreeData = ref<any[]>([]);
// const promiseItem: any[] = [];
// const subFieldItem: any[] = [];
// 已废弃，会初始化生成子表和关联记录的子字段（仅支持一层）
// const initSubFields = () => {
//   const treeData = cloneDeep(props.mainFields);
//   const fillSubFields = (data: any) => {
//     data.forEach((item: any) => {
//       if (item.props?.sonModelName) {
//         // 含有子项（发起界面详情请求）
//         if (!props.handleAdvanceFields) {
//           console.error('缺少高级字段处理方法');
//         } else {
//           const modalNameArr = item.props.sonModelName.split('_');
//           const pageId = modalNameArr[modalNameArr.length - 1];
//           if (pageId) {
//             promiseItem.push(getPageDetail(pageId));
//             subFieldItem.push(item);
//             // 处理为需要的结构
//             // if (res && res.success) {
//             //   item.children = props.handleAdvanceFields(
//             //     res.data.pageContent,
//             //     item
//             //   );
//             //   // fillSubFields(item.children) 这里暂时不处理递归
//             // }
//           }
//         }
//       } else {
//         item.children && item.children.length > 0 && fillSubFields(item.children);
//       }
//     });
//   };

//   fillSubFields(treeData);
//   if (promiseItem.length > 0) {
//     Promise.all(promiseItem).then((result: any[]) => {
//       if (result && result.length > 0) {
//         result.forEach((res, index) => {
//           if (res && res.success && subFieldItem[index]) {
//             if (props.handleAdvanceFields) {
//               subFieldItem[index].children = props.handleAdvanceFields(
//                 res.data.pageContent,
//                 subFieldItem[index] as any,
//               );
//             }
//           }
//         });
//         filledSubFieldsTreeData.value = treeData;
//       }
//     });
//   } else {
//     filledSubFieldsTreeData.value = treeData;
//   }
// };
// 针对所有的高级字段，初始化所有的子字段集（采用promiseAll判断请求完成）,已废弃（目前针对关联记录，子表仅处理了一层，不会存放过多数据）
// initSubFields();

const { searchValue, filteredFields, expandedKeys, autoExpandParent, onExpand } = useTree(props.mainFields)
const handleSelectChange = (keys: string[], { selectedNodes }: any) => {
  if (selectedNodes.length === 0 || selectedNodes[0]?.children) {
    return
  }
  emits('select', selectedNodes[0])
}
</script>

<template>
  <div class="formula-params">
    <Input class="search-header" placeholder="搜索字段" allow-clear :bordered="false" v-model:value="searchValue">
      <template #prefix>
        <IconFont type="sousuo" />
      </template>
    </Input>
    <Tree
      v-if="filteredFields.length > 0"
      class="params-list"
      :field-names="{ label: 'name', key: 'value' }"
      :tree-data="filteredFields"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
      @select="handleSelectChange"
    >
      <template #title="{ name, fieldType, sonModelName, isMultiple }">
        <!-- 字段渲染-->
        <div v-if="fieldType" class="field-item" :title="name">
          <span class="name overflow-hidden-one">{{ name }}</span>
          <span
            class="tag"
            :style="{
              color: fieldTypeMap[fieldType as FieldTypeKey]?.color,
              backgroundColor: fieldTypeMap[fieldType as FieldTypeKey]?.backgroundColor,
            }"
          >
            {{
              isMultiple || sonModelName
                ? '数组<' + fieldTypeMap[fieldType as FieldTypeKey]?.text + '>'
                : fieldTypeMap[fieldType as FieldTypeKey]?.text
            }}
          </span>
        </div>

        <div v-else :title="name" class="overflow-hidden-one field-item">
          <span>{{ name }}</span>
          <span
            v-if="isMultiple"
            class="tag"
            :style="{
              backgroundColor: 'rgba(20,133,246,.15)',
              color: '#1485f6'
            }"
          >
            多条
          </span>
        </div>
      </template>
    </Tree>
    <p v-else style="margin-top: 20px; text-align: center">暂无匹配字段</p>
  </div>
</template>

<style lang="less">
.overflow-hidden-one {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.formula-params {
  .params-list {
    padding-bottom: 5px;
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
    .field-item {
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
.formula-params {
  height: calc(100% - 30px);
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  .search-header {
    border-bottom: 1px solid #e1e3e5;
  }

  .searcing {
    text-align: center;
    padding: 5px 0;
    color: #666;
  }

  // .params-list,
  // .params-item {
  //   margin-bottom: 0;
  //   list-style: none;
  //   .name {
  //     width: 110px;
  //     display: inline-block;
  //     overflow: hidden;
  //     white-space: nowrap;
  //     text-overflow: ellipsis;
  //   }
  // }
}
</style>
