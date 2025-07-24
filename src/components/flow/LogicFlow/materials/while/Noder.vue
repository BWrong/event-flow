<template>
  <div>
    <FlowNodeHandler @add="onAddNode" />
    <!-- 调用基础渲染 -->
    <FlowNodeChildren :nodes="data?.children" />
  </div>
</template>

<script setup lang="ts">
import FlowNodeHandler from '../../designer/FlowNodeHandler.vue';
import { designerStoreInjectKey } from '../../designer/injectKeys';
import { FlowMaterial, FlowMaterialConfig, FlowNode, FlowNodeProps } from '../../types';
import { inject } from 'vue';
import FlowNodeChildren from '../../designer/FlowNodeChildren.vue';

const props = withDefaults(
  defineProps<{
    data: FlowNode<FlowNodeProps,FlowNode>;
    config: FlowMaterialConfig,
    index: number;
  }>(),
  {
    data: null,
    parentData: null,
    index: 0,
  },
);
const designerStore = inject(designerStoreInjectKey);
function onAddNode(material: FlowMaterial) {
  const node = designerStore.addNode(material, 0, props.data.children)
  designerStore.setEditNode(node)
}
</script>

<style scoped lang="less">

</style>
