<script setup lang="ts">
import LogicFlowDesigner from '@/components/LogicFlow/designer/index.vue';
import { nodes as materials } from '@/components/LogicFlow/materials';
import { ref } from 'vue';
import type { Flow } from './components/LogicFlow/types.ts';
import mockData from './mock.ts';

const flowData = ref(mockData as Flow)
function onChange(data) {
  console.log(data)
}
const variables = ref([{
  name: 'page',
  variableType: 'page',
  dataType: {
    type: 'object',
    itemTypes: [],
  },
}, {
  name: 'stores',
  variableType: 'stores',
  dataType: {
    type: 'object',
    itemTypes: [],
  },
}])
</script>

<template>
  <div class="app">
    <LogicFlowDesigner v-model:data="flowData" :materials="materials" :variables="variables" @change="onChange">
    </LogicFlowDesigner>
  </div>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
}
</style>
