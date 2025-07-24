<script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { IDataType } from '../../../types';
  import { getModelDetails } from '../../../apis/apihub';
  import { analysisRes } from '../../../common/resolveDs';
  import { cloneDeep } from 'lodash-es';
  import { DownOutlined } from '@ant-design/icons-vue';
  import type { TreeProps } from 'ant-design-vue';
  const props = withDefaults(
    defineProps<{
      title: string;
      visible: boolean;
      value: IDataType;
    }>(),
    {
      visible: false,
      title: '',
    },
  );

  const treeData = ref<any[]>([]);

  const emits = defineEmits(['update:visible']);
  const onLoadData: TreeProps['loadData'] = (treeNode) => {
    return new Promise<void>(async (resolve) => {
      if (treeNode.dataRef.itemTypes) {
        resolve();
        return;
      }
      // 下级请求
      if (treeNode.dataRef?.dataType?.reference?.id) {
        const res = await getModelDetails(treeNode.dataRef.dataType.reference?.id);
        if (res.success && res?.data) {
          treeNode.dataRef.itemTypes = analysisRes(
            res.data.data?.dataModelDetailsTreeVo?.children ?? [],
          );
          treeData.value = [...treeData.value];
          resolve();
        }
      } else {
        resolve();
      }
    });
  };
  watch(
    () => props.visible,
    async (val: boolean) => {
      if (val) {
        const tempVal = cloneDeep(props.value);
        if (tempVal?.reference?.id) {
          treeData.value = [
            // 构造第一层
            { name: tempVal.reference.name, id: tempVal.reference.id, dataType: tempVal },
          ]; // 包装为一个数组
        } else {
          treeData.value = [tempVal]; // 包装为一个数组
        }
      }
    },
    {
      immediate: true,
    },
  );
</script>

<template>
  <SFullModal
    :visible="visible"
    :width="730"
    :height="450"
    :title="title"
    closable
    @update:visible="(val: boolean) => emits('update:visible', val)"
    :footer="false"
  >
    <AFlex
      :gap="20"
      class="header rounded-2px bg-[var(--ant-colorBgLayout)] px-4 py-3 mb-4 pl-8"
    >
      <span style="flex: 0 0 150px">参数名称</span>
      <span style="flex: 0 0 150px">类型</span>
      <span style="flex: 1 1 0%">描述</span>
    </AFlex>
    <ATree
      default-expand-all
      :tree-data="treeData"
      :selectable="false"
      blockNode
      :field-names="{ key: 'id', title: 'name', children: 'itemTypes' }"
      :load-data="onLoadData"
      class="type-check-tree"
    >
      <template #switcherIcon="{ switcherCls }"><down-outlined :class="switcherCls" /></template>
      <template #title="{ name, reference, description, type, dataType }">
        <AFlex
          :gap="20"
          align="center"
        >
          <span style="flex: 0 0 150px">{{ reference?.name ?? name }}</span>
          <span style="flex: 0 0 150px">{{ dataType?.type ?? type }}</span>
          <span style="flex: 0 0 220px">{{ description || '--' }}</span>
        </AFlex>
      </template>
    </ATree>
  </SFullModal>
</template>

<style scoped lang="less"></style>
