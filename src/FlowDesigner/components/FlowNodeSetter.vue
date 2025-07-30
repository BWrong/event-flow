<template>
  <a-drawer v-model:open="open" :width="700" placement="right" @close="handleClose">
    <template #title>
      <AFlex align="center" gap="small">
        <FlowNodeIcon :icon="icon" :size="24" />
        节点配置
      </AFlex>
    </template>

    <AForm ref="formRef" class="flow-node-setter" :model="nodeData" layout="vertical">
      <div class="flow-node-setter-body">
        <template v-if="!state.setterProps.hideBaseInfo">
          <ARow :gutter="10">
            <ACol :span="12">
              <AFormItem class="normal-label" name="name" label="节点名称"
                :rules="[{ required: true, message: '节点名称是必填字段' }]">
                <AInput placeholder="请输入" v-model:value="nodeData.name"></AInput>
              </AFormItem>
            </ACol>
            <ACol :span="12">
              <AFormItem class="normal-label" name="id" label="编码">
                <AInput :value="nodeData.id" disabled></AInput>
              </AFormItem>
            </ACol>
          </ARow>
          <AFormItem class="normal-label" name="description" label="描述">
            <ATextarea placeholder="请输入节点描述" :maxlength="200" show-count v-model:value="nodeData.description">
            </ATextarea>
          </AFormItem>
          <ADivider class="small" />
        </template>
        <!-- 传入全量节点配置，分支节点更新需要用到 -->
        <div v-if="setterComponent">
          <component :is="setterComponent" v-model:node="nodeData" v-model:value="nodeData.props"
            :node-info="materialInfo" />
        </div>
      </div>
    </AForm>
    <template #footer>
      <AFlex class="flow-node-setter-footer" gap="middle">
        <AButton type="primary" @click="handleSave">保存</AButton>
        <AButton @click="handleClose">取消</AButton>
      </AFlex>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'

import {
  message,
  type FormInstance
} from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import type { FlowNode } from '../types'
import useDesignerStore from '../useDesignerStore'
import FlowNodeIcon from './FlowNodeIcon.vue'
const { state, setEditNode, callChangeHooks } = useDesignerStore()
const formRef = ref<FormInstance>()
const open = computed(() => !!state.editNode)
// 兼容单个分支节点选中
const nodeData = ref({} as FlowNode)
watch(open, (val) => {
  if (val) {
    nodeData.value = cloneDeep(state.editNode || ({} as FlowNode))
  }
})
const materialInfo = computed(() => state.materials[nodeData.value.type]!)
const setterComponent = computed(() => materialInfo.value?.setter ?? null)
const icon = computed(() => materialInfo.value?.icon as Component)

const handleSave = async () => {
  try {
    const res = await formRef.value?.validateFields()
    console.log(res);
    // 调用节点配置的校验方法
    if (materialInfo.value.validator && typeof materialInfo.value.validator === 'function') {
      const { type, messages } = materialInfo.value.validator(nodeData.value, state)
      if (type === 'error') {
        if (messages.length > 0) {
          message.error(messages[0])
          return
        }
      } else {
        // 提示文字修改
        if (materialInfo.value.generateDescription && typeof materialInfo.value.generateDescription === 'function') {
          nodeData.value.description = materialInfo.value.generateDescription(nodeData.value, state)
        }
      }
    }
    Object.assign(state.editNode as FlowNode, nodeData.value)
    callChangeHooks('update', nodeData.value)
    handleClose()
  } catch (err: any) {
    console.log(err);

    message.error(err.errorFields ? err.errorFields[0]?.errors[0] ?? '配置校验失败' : err)
  }
}
function handleClose() {
  formRef.value?.resetFields()
  setEditNode(null, undefined)
}

</script>

<style scoped lang="less">
.flow-node-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-node-setter {
  height: 100%;
  display: flex;
  flex-direction: column;

  .flow-node-setter-body {
    flex: 1;
  }
}
</style>
