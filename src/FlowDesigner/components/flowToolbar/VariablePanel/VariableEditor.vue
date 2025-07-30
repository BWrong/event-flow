<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { cloneDeep } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { StructureTypeSelect } from '../../../toolComs'
import type { FlowVariables } from '../../../types'
import useDesignerStore from '../../../useDesignerStore'
const { data, type } = defineProps<{
  data?: FlowVariables,
  type: 'add' | 'edit'
}>()
const visible = defineModel<boolean>('visible', { default: false })

const checkname = async (_rule: Rule, value: any) => {
  const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
  if (!value) {
    return Promise.reject('变量名称不能为空')
  } else if (!regex.test(value)) {
    return Promise.reject('大小写字母、数字、下划线， 首位支持"$"，不支持数字')
  } else {
    return Promise.resolve()
  }
}
const flowStore = useDesignerStore()

const formState = ref<FlowVariables>({
  name: '',
  variableType: 'flow',
  dataType: { type: 'string' },
  description: ''
})
const formRef = ref()
// const labelCol = computed(() => {
//   return { span: 4 };
// });
// const wrapperCol = computed(() => {
//   return { span: 20 };
// });
const confirmLoading = ref(false)
const rules: Record<string, Rule[]> = {
  name: [
    { validator: checkname, required: true, trigger: 'blur' },
    { max: 40, message: '最大长度为40', trigger: 'blur' }
  ],
  dataType: [{ required: true, message: '请选择变量类型', trigger: 'change' }]
}
// 这里构造一下
const handletypeInfoChange = (val: any) => {
  formState.value.dataType = val
}
// 这里不走接口，直接修改json
const handleOk = () => {
  formRef.value.validate().then(() => {
    const newRow = cloneDeep(formState.value)
    const flag = data ? flowStore.modifyVariable(newRow) : flowStore.addVariable(newRow)
    if (flag) {
      handleCancel()
    }
  })
}
const tempFlowVars = computed(() => {
  return flowStore.state.flowData!.variables
    ? flowStore.state.flowData!.variables.filter((item: FlowVariables) => item.variableType === 'flow')
    : []
})
const handleCancel = () => {
  formRef.value.resetFields()
  visible.value = false
}
watch(
  () => visible.value,
  async (val: boolean) => {
    if (val) {
      if (type === 'add') {
        // 新增操作，默认给个名字(这里从临时变量顺序排)
        formState.value = {
          name: `var_${tempFlowVars.value.length + 1}`,
          dataType: { type: 'string' },
          variableType: 'flow',
          description: ''
        }
      } else {
        //查询变量信息
        formState.value = cloneDeep(data)
      }
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <a-modal :open="visible" :mask-closable="false" destroy-on-close :title="type === 'add' ? '新增变量' : '编辑变量'"
    :confirm-loading="confirmLoading" :width="600" ok-text="确定" cancel-text="取消" @ok="handleOk" @cancel="handleCancel">
    <AForm style="overflow-x: hidden" ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-row :gutter="20">
        <a-col :span="12">
          <AFormItem label="变量名称" name="name">
            <AInput :disabled="type === 'edit'" v-model:value="formState.name" placeholder="请输入" />
          </AFormItem>
        </a-col>
        <a-col :span="12">
          <AFormItem label="变量类型" name="dataType">
            <StructureTypeSelect :value="formState.dataType" placeholder="请选择" @update:value="handletypeInfoChange" />
          </AFormItem>
        </a-col>
      </a-row>
      <AFormItem label="描述" name="description">
        <ATextarea v-model:value="formState.description" placeholder="请输入" />
      </AFormItem>
    </AForm>
  </a-modal>
</template>

<style lang="less" scoped></style>
