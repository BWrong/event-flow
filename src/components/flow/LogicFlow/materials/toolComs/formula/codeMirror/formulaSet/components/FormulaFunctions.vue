<!--
 * @Author: ykx
 * @Date: 2023-06-21 18:35:06
 * @LastEditTime: 2023-07-04 09:57:21
 * @LastEditors: your name
 * @Description: 函数表达式选择
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\components\FormulaFunctions.vue
-->
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { Input, Tree, Popover } from 'ant-design-vue'

  import { IconFont } from '../../../../../resource/components';

  import { funcList } from '../../../common/flowFuns';
  import { useTree } from '../../../hooks/useTree';
  import type { IFormulaFunctionListItem } from '../../../types';
  
  const props = defineProps<{
    value: IFormulaFunctionListItem;
    selectValue?: IFormulaFunctionListItem;
    showPopup?: boolean;
  }>();
  const emits = defineEmits(['update:value', 'update:selectValue']);

  const newFuncList = computed(() => {
    return funcList.map((item: any) => {
      if (item.children && item.children.length > 0) {
        item.children = item.children.map((lItem: IFormulaFunctionListItem) => {
          return { ...lItem };
        });
      }
      return item;
    });
  });
  const { searchValue, filteredFields, expandedKeys, autoExpandParent, onExpand } = useTree(
    newFuncList.value,
  );
  const handleEnter = (item: IFormulaFunctionListItem) => {
    emits('update:value', item);
  };
  const handleSelectChange = (keys: string[], { selectedNodes }: any) => {
    if (selectedNodes.length === 0 || selectedNodes[0]?.children) {
      return;
    }
    emits('update:selectValue', { ...selectedNodes[0] });
  };
</script>

<template>
  <div class="formula-functions">
    <div class="search-header">
      <Input
        placeholder="搜索函数"
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
      class="function-list"
      :field-names="{ label: 'name', key: 'code' }"
      :tree-data="filteredFields"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
      @select="handleSelectChange"
    >
      <template #title="item">
        <!-- 字段渲染-->
        <template v-if="!item.children">
          <Popover
            :title="item.name"
            placement="left"
            v-if="showPopup"
          >
            <template #content>
              <div class="formula-desc">
                <main v-html="item.desc" />
              </div>
            </template>
            <div
              class="function-item"
              :title="item.name"
            >
              <span
                class="name overflow-hidden-one"
                :title="item.name"
              >
                {{ item.name }}
              </span>
            </div>
          </Popover>
          <div
            v-else
            class="function-item"
            :title="item.name"
            @mouseenter="handleEnter(item)"
          >
            <span
              class="name overflow-hidden-one"
              :title="item.name"
            >
              {{ item.name }}
            </span>
          </div>
        </template>

        <div
          v-else
          :title="item.name"
          class="overflow-hidden-one"
        >
          {{ item.name }}
        </div>
      </template>
    </Tree>
    <p
      v-else
      style="margin-top: 20px; text-align: center"
    >
      暂无匹配的函数
    </p>
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
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    .search-header {
      width: 100%;
      position: relative;
      border-bottom: 1px solid #e1e3e5;
      font-size: 14px;
      .search-icon {
        position: absolute;
        left: 0px;
      }

      > input {
        display: inline-block;
        padding-left: 20px;
        padding-right: 20px;
        border: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
      }

      .close-icon {
        position: absolute;
        right: 0px;
        cursor: pointer;
      }
      .search-icon,
      .close-icon {
        top: 50%;
        transform: translateY(-50%);
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
  .formula-desc {
    font-size: 12px;
    color: #555;
    line-height: 26px;
    max-height: 300px;
    max-width: 300px;
    > header {
      height: 30px;
      border-bottom: 1px solid #e1e3e5;
      padding-left: 10px;
      line-height: 30px;
    }

    > main {
      padding: 5px 10px;
      > :deep(i) {
        font-style: normal;
        color: #761086;
      }
      > :deep(strong) {
        font-weight: normal;
        margin: 0 4px;
        padding: 2px 4px;
        color: #008dcd;
        background: #e9f3fe;
        border-radius: 3px;
      }
    }

    > footer {
      display: inline-block;
      margin: 15px 0 0 10px;
      > a {
        color: #248af9;
        text-decoration: underline;
      }
    }
  }
</style>
