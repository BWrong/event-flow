<script setup lang="ts">
import { message, RadioButton, RadioGroup } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'
import {
  datasource2Json,
  dataTransform2Str,
  json2Datasource,
  removeSpacesInJson,
  strTransform2Data
} from '../../../common/resolveDs'
import { FullModal } from '../../resource/components'
import { CodePreview } from '../../resource/components/code-mirror'
import type { FieldType } from '../../resource/dicts'
import TreeSet from './treeSet/index.vue'

const props = withDefaults(
  defineProps<{
    visible: boolean
    value: string
    fieldType?: FieldType
  }>(),
  {
    visible: false,
    value: ''
  }
)

const setWay = ref<'tree' | 'json'>('tree')
const formState = reactive({
  tree: [],
  json: ''
})
const emits = defineEmits(['update:visible', 'onOk'])
const parseErrorMsg = ref('')
const handleSetWayChange = (e: any) => {
  // 如果是 json =>  tree  进行json校验，不符合规则则不切换
  if (e.target.value === 'tree') {
    if (parseErrorMsg.value) {
      message.warning('json格式错误，请重新输入!')
      return
    }
    formState.tree = json2Datasource(strTransform2Data(formState.json))
  } else {
    formState.json = dataTransform2Str(datasource2Json(formState.tree?.[0]))
  }
  setWay.value = e.target.value
}
// 提交
const onHandler = () => {
  if (parseErrorMsg.value) {
    message.warning('json格式错误，请重新输入!')
    return
  }
  if (setWay.value === 'tree') {
    formState.json = dataTransform2Str(datasource2Json(formState.tree?.[0]))
  }
  // 这里仅返回json串(去掉空格)
  emits('onOk', removeSpacesInJson(formState.json))
  emits('update:visible', false)
}
watch(
  () => props.visible,
  (val: boolean) => {
    if (val) {
      // 这里将入参解析一个树结构
      if (props.value) {
        formState.json = props.value
        formState.tree = json2Datasource(strTransform2Data(props.value))
      } else {
        // 如果含有值类型，则初始化一个默认值(目前只处理数组和对象)
        if (props.fieldType) {
          const val = props.fieldType === 'array' ? '[]' : '{}'
          formState.json = val
          formState.tree = json2Datasource(strTransform2Data(val))
        }
      }
      parseErrorMsg.value = ''
    }
  },
  {
    immediate: true
  }
)
// 监听json配置，转为树结构
watch(
  () => formState.json,
  (val: string) => {
    if (val) {
      try {
        JSON.parse(formState.json)

        parseErrorMsg.value = ''
      } catch (error) {
        // 判断如果是普通字符串则不提示错误
        // 这里仅判断是否含有 {} [],不严谨，如果直接是{ ] :的字符串则会出问题
        if (!/[{\[\]:]/.test(val)) {
          // 普通字符串
          parseErrorMsg.value = ''
        } else {
          parseErrorMsg.value = 'json格式错误：' + error
        }
      }
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <FullModal :visible="visible" :width="730" :height="450" title="编辑JSON数据" closable
    @update:visible="emits('update:visible', !visible)" @cancel="emits('update:visible', false)" @ok="onHandler">
    <RadioGroup :value="setWay" button-style="solid" class="mb-4" @change="handleSetWayChange">
      <RadioButton value="tree">树</RadioButton>
      <RadioButton value="json">代码</RadioButton>
    </RadioGroup>
    <TreeSet v-if="setWay === 'tree'" v-model:value="formState.tree" />
    <CodePreview v-if="setWay === 'json'" v-model:code="formState.json" style="height: 350px" :code-mirror-config="{
      lineNumbers: true,
      readOnly: false,
      theme: 'default'
    }" />
    <template v-if="true" #footer-left>
      <p class="validate-error-text">
        {{ parseErrorMsg }}
      </p>
    </template>
  </FullModal>
</template>

<style scoped lang="less">
.validate-error-text {
  width: 70%;
  color: var(--ant-colorError);
}
</style>
