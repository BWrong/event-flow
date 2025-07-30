<script setup lang="ts">
import LogicFlowDesigner from '@/FlowDesigner/index.vue';
import { nodes as materials } from '@/FlowDesigner/materials/index.ts';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import type { Flow } from './FlowDesigner/types.ts';
import mockData from './mock.ts';

const flowData = ref(mockData as Flow)
const cacheFlowData = localStorage.getItem('flowData')
if (cacheFlowData) {
  flowData.value = JSON.parse(cacheFlowData)
}
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
const handleSave = () => {
  localStorage.setItem('flowData', JSON.stringify(flowData.value))
  message.success('保存成功')
}
</script>

<template>
  <div class="app">
    <LogicFlowDesigner v-model:data="flowData" :materials="materials" :variables="variables" @change="onChange">
    </LogicFlowDesigner>
    <a-button @click="handleSave" type="primary" class="save-btn">保存</a-button>
  </div>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.save-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
