<template>
  <div class="logic-flow-designer">
    <FlowToolbar v-if="showToolbar" />
    <div class="logic-flow-canvas">
      <FlowCanvas v-model:data="designerStore.state.flowData" :zoom="designerStore.state.zoom" />
    </div>
    <FlowNodeSetter />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, watch } from 'vue';
import type { Flow, FlowMaterialMap } from '../types';
import FlowCanvas from './FlowCanvas.vue';
import FlowNodeSetter from './flowNode/FlowNodeSetter.vue';
import FlowToolbar from './flowToolbar/index.vue';
import { designerStoreInjectKey, modeInjectKey, themeInjectKey } from './injectKeys';
import useDesignerStore from './useDesignerStore';
defineOptions({
  name: 'LogicFlowDesigner'
})
export interface Props {
  materials: FlowMaterialMap,
  data?: Flow,
  mode?: 'edit' | 'preview',
  showToolbar?: boolean,
  theme?: string
}
const props = withDefaults(defineProps<Props>(), {
  materials: () => ({}),
  mode: 'edit',
  showToolbar: true,
  theme: '#0089FF',
  variables: () => []
})
const emits = defineEmits(['change'])

const designerStore = useDesignerStore()
designerStore.setMaterials(props.materials)
designerStore.setMode(props.mode)
designerStore.setTheme(props.theme)
designerStore.onChange((type, data, flow) => {
  emits('change', { type, data, flow })
})

provide(themeInjectKey, computed(() => designerStore.state.theme))
provide(modeInjectKey, computed(() => designerStore.state.mode))
provide(designerStoreInjectKey, designerStore)
onBeforeUnmount(designerStore.destroy)
watch(() => props.data?.id, () => {
  designerStore.changeFlow(props.data as Flow)
}, {
  immediate: true
})


defineExpose({
  getData() {
    return designerStore.state.flowData
  },
  validate: designerStore.validate,
})

</script>

<style scoped lang="less">
@import '../styles/index.less';

.logic-flow-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
}



.logic-flow-canvas {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
