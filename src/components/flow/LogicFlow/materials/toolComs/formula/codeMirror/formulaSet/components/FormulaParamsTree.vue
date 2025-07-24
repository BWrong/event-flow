<!--
 * @Author: ykx
 * @Date: 2023-06-21 17:13:53
 * @LastEditTime: 2023-07-06 20:14:26
 * @LastEditors: your name
 * @Description: 树形结构字段选择(采用a-tree替换)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\components\FormulaParamsTree.vue
-->
<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { computed, ref, inject } from 'vue';
  import { Tree, Input } from 'ant-design-vue'
  // import { getPageDetail } from '@/apis';
  import { useFindTreeVars } from '../../../../../resource/hooks';
  import { useTree } from '../../../hooks/useTree';
  import { designerStoreInjectKey } from '../../../../../../designer/injectKeys'
  import { IconFont } from '../../../../../resource/components'
   import { flatFlowTreeDataClosure, findFlowParentIds } from '../../../../../../common/flowTree';
  const props = withDefaults(defineProps<{}>(), {});
  const emits = defineEmits(['select']);
  /*******顶层传入的一些变量*******/
  const omitFieldNames = inject('omitFieldNames', undefined);
  const filterFieldTypes = inject('filterFieldTypes', ref());
  const allowParentSelect = inject('allowParentSelect', undefined);


  const designerStore = inject(designerStoreInjectKey, null)

  const options = computed(() => {
    return {
      filterFieldTypes: filterFieldTypes.value,
      allowParentSelect,
      omitFieldNames,
    };
  });
  const { resultTreeData } = useFindTreeVars(designerStore?.state?.editNode!, options);
  const { searchValue, filteredFields, expandedKeys, autoExpandParent, onExpand } = useTree(
    resultTreeData.value,
  );
  // 变量选择
  const handleSelectChange = (keys: string[], { node }: any) => {
    if (!node.isLeaf) { return }
    const allParentRows = findFlowParentIds(
      { key: node?.key },
      flatFlowTreeDataClosure(filteredFields.value, false, 'key'),
      'key',
      true,
    );
    if (allParentRows.length > 0) {
      emits('select', allParentRows.map((item: any) => item.name).join('.'));
    } else {
      emits('select', '');
    }
  };
</script>

<template>
  <div class="formula-params">
    <div class="search-header">
      <Input
        placeholder="搜索变量"
        allow-clear
        :bordered="false"
        v-model:value="searchValue"
      >
        <template #prefix>
          <IconFont type="icon-sousuo" />
        </template>
      </Input>
    </div>

    <Tree
      v-if="filteredFields.length > 0"
      class="params-list"
      :field-names="{ label: 'name', children: 'children', key: 'key' }"
      :tree-data="filteredFields"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
      @select="handleSelectChange"
    >
      <template #title="{ name, fieldType, sonModelName, isMultiple }">
        <!-- 字段渲染-->
        <div
          :title="name"
          class="field-item"
        >
          <span class="overflow-hidden-one">{{ name }}</span>
        </div>
      </template>
    </Tree>
    <p
      v-else
      style="margin-top: 20px; text-align: center"
    >
      暂无匹配变量
    </p>
  </div>
</template>

<style lang="less">
  .formula-params {
    .params-list {
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
