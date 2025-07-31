<template>
  <div class="flow-node-children">
    <FlowNodeItem v-for="(item, index) in nodes" :key="item.id" :data="item" :parentList="nodes" :index="index" />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { parentNodesInjectKey } from '../injectKeys';
import type { FlowNode } from '../types';
import FlowNodeItem from './FlowNodeItem.vue';
defineOptions({
  name: 'FlowNodeChildren',
})
const props = defineProps<{
  nodes: FlowNode[]
}>()
provide(parentNodesInjectKey, computed(() => props.nodes || []))
</script>

<style scoped lang="less">
.flow-node-children {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
  pointer-events: none;
}
</style>
