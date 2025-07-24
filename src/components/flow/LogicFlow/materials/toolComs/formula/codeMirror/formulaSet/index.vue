<!--
 * @Author: ykx
 * @Date: 2023-06-21 18:27:01
 * @LastEditTime: 2023-07-06 18:55:03
 * @LastEditors: your name
 * @Description: 公式主体带弹框(存入两个值)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\Index.vue
-->
<script setup lang="ts">
import { debounce } from 'lodash-es'
import { ref } from 'vue'
import FieldTreeSelect from '../../../fieldTreeSelect/index.vue'
import type { CodeMirrorValue, Mark, EditorInfo, IFormulaFunctionListItem } from '../../types'
import QuickOperator from './components/QuickOperator.vue'
import FieldEditor from './FieldEditor.vue'
import DropDownFormulaFunctions from './components/DropDownFormulaFunctions.vue'
import { Flex, Space, Form } from 'ant-design-vue'
const props = withDefaults(
  defineProps<{
    value: EditorInfo
    checkFormulaFun?: (params: any) => any // 校验函数（这里需返回特定结构ajax）
  }>(),
  {
    value: () => ({
      value: '',
      editorValue: { text: '', marks: [], cursor: { line: 0, ch: 0 } }
    })
  }
)
const fieldEditorRef = ref() // 编辑器ref
const validResult = ref({ flag: true, msg: '' }) // 校验结果
const formItemContext = Form.useInjectFormItemContext()
const emits = defineEmits(['update:value'])
const targetFunction = ref<IFormulaFunctionListItem>({
  code: '',
  name: '',
  desc: '请从左侧面板选择字段名和函数，或输入函数<br/>公式编辑举例：<i>SUM</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程的总分'
})
const selectFunction = ref<IFormulaFunctionListItem>({
  name: '',
  desc: '',
  code: ''
})
// 字段转换方法(这里不进行处理)
const markToStrFn = (item: Mark) => {
  return `#{${item.value}}`
}

const onFieldSelect = (fieldItem: { varFullName: string; row: any }) => {
  if (fieldEditorRef.value && typeof fieldEditorRef.value.onFieldSelect === 'function' && fieldItem) {
    // 这里追加额外字段，将变量的类型存入(用于出码)
    fieldEditorRef.value.onFieldSelect({
      name: fieldItem.varFullName,
      value: fieldItem.varFullName,
      extra: JSON.stringify({ variableType: fieldItem.row.variableType })
    })
  }
}


const onOperatorSelect = (operator: string) => {
  if (fieldEditorRef.value) {
    // 直接插入文本,不需要mark标记
    fieldEditorRef.value.insertText(operator)
  }
}
const onFunSelect = (item: IFormulaFunctionListItem) => {
  if (fieldEditorRef.value && typeof fieldEditorRef.value.onFunSelect === 'function' && item) {
    fieldEditorRef.value.onFunSelect(item)
  }
}

// 编辑器变化(这里走公式校验),这里value会添加${}包裹
const handleEditorChange = async (data: EditorInfo) => {
  if (!data.value) {
    validResult.value.flag = true
    validResult.value.msg = ''
    // 值更新
    emits('update:value', data)
    // 触发下校验更新
    formItemContext && formItemContext.onFieldChange()
    return
  }
  if (props.checkFormulaFun) {
    try {
      const res = await props.checkFormulaFun('${' + data.value + '}')
      if (res && !res.data) {
        validResult.value.flag = true
        validResult.value.msg = ''
      } else {
        validResult.value.flag = false
        validResult.value.msg = res.data || '公式校验失败'
      }
    } catch (error) {
      validResult.value.flag = false
      validResult.value.msg = (error as string) || '公式校验失败'
    }
  } else {
    // 值更新
    emits('update:value', data)
    // 触发下校验更新
    formItemContext && formItemContext.onFieldChange()
  }
}
const bounceChange = debounce(handleEditorChange, 300)
</script>

<template>
  <div class="formula-set-wrapper">
    <div class="px-3 py-3" style="background-color: #f2f3f5">
      <Flex class="mb-3">
        <Space>
          <FieldTreeSelect mode="button" button-text="插入变量" @update:value="onFieldSelect" />
          <DropDownFormulaFunctions
            v-model:value="targetFunction"
            v-model:select-value="selectFunction"
            @update:select-value="onFunSelect"
          />
        </Space>
      </Flex>
      <QuickOperator @operatorSelect="onOperatorSelect" />
    </div>
    <FieldEditor
      ref="fieldEditorRef"
      :editor-value="value.editorValue"
      :mark-to-str-fn="markToStrFn"
      @update:value="bounceChange"
    />
  </div>
</template>

<style scoped lang="less">
.formula-set-wrapper {
  border: 1px solid #bbc3cc;
  border-radius: 2px;
}
</style>
