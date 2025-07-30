<!-- 新增输入框模式 -->
<!-- 实现v-model双向绑定，注意v-show下display值无法改变-->
<script lang="ts" setup>
import CodeMirror from 'codemirror'
import { sortBy } from 'lodash-es'
import { nextTick, onMounted, ref, watch } from 'vue'

import { CodeMirrorValue, Mark } from '../../types'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/material.css'

const props = withDefaults(
  defineProps<{
    readOnly?: 'nocursor' | boolean
    editorValue: CodeMirrorValue
    height?: string
    displayMode?: 'default' | 'input'

    markToStrFn?: Function // 字段转换规则
  }>(),
  {
    readOnly: false,
    height: '240px',
    displayMode: 'default',
    editorValue: () => ({ text: '', marks: [], cursor: { line: 0, ch: 0 } })
  }
)
const emits = defineEmits(['update:value'])
const renderElem = ref() // 渲染容器
const stopChangeFlag = ref(false) // 确保mark处理完毕后在进行更新
let CodeMirrorEditor: any = null
// 单个mark配置(dataSet作用?)
const setMark = (item: Mark) => {
  const { name, editorName, value, extra, from, to } = item
  const showName = editorName || name // 兼容显示
  const widget = document.createElement('span')
  widget.innerHTML = showName
  widget.className = 'my-snippet'
  widget.dataset.value = value
  widget.dataset.markType = 'field'
  widget.dataset.name = showName
  extra && (widget.dataset.extra = extra)
  // 在编辑器中查找代码片段，并添加样式
  CodeMirrorEditor.markText(from, to, {
    className: 'my-snippet',
    atomic: true,
    replacedWith: widget,
    attributes: extra
      ? {
        value,
        name: showName,
        markType: 'field',
        extra
      }
      : { value, name: showName, markType: 'field' },
    handleMouseEvents: true
  })
}
// 方法函数mark
const setFuncMark = (item: Mark, needSpan = false) => {
  const { name, funcType, from, to } = item
  if (needSpan) {
    const widget = document.createElement('span')
    widget.innerHTML = name
    widget.className = 'cm-keyword'
    widget.dataset.markType = 'func'
    widget.dataset.name = name
    widget.dataset.funcType = funcType
    CodeMirrorEditor.markText(from, to, {
      replacedWith: widget,
      className: 'cm-keyword',
      attributes: {
        funcType,
        name,
        markType: 'func'
      },
      handleMouseEvents: true
    })
  } else {
    CodeMirrorEditor.markText(from, to, {
      className: 'cm-bracket',
      attributes: {
        name,
        markType: 'func-bracket'
      },
      handleMouseEvents: true
    })
  }
}
const onFieldSelect = (item: any) => {
  const showName = item.editorName || item.name
  const cursor = CodeMirrorEditor.getCursor()
  const from = { line: cursor.line, ch: cursor.ch }
  const to = { line: cursor.line, ch: cursor.ch + showName.length }
  CodeMirrorEditor.replaceSelection(showName)
  setMark({
    ...item,
    from,
    to
  })
  CodeMirrorEditor.focus()
  emits('update:value', getCodeValue())
}
const onFunSelect = (item: any) => {
  const { name } = item
  const arrT = [name, '(', ')']
  for (let i = 0; i < arrT.length; i++) {
    const temp = arrT[i]
    const cursor = CodeMirrorEditor.getCursor()
    const from = { line: cursor.line, ch: cursor.ch }
    const to = { line: cursor.line, ch: cursor.ch + temp.length }
    CodeMirrorEditor.replaceSelection(temp)
    setFuncMark(
      {
        ...{ ...item, name: temp },
        from,
        to
      },
      i === 0
    )
  }
  // 这里后退一位
  CodeMirrorEditor.focus()
  const newCursor = CodeMirrorEditor.getCursor()
  CodeMirrorEditor.setCursor({ line: newCursor.line, ch: newCursor.ch - 1 })
  emits('update:value', getCodeValue({ line: newCursor.line, ch: newCursor.ch - 1 }))
}
watch(
  () => props.editorValue,
  async (val: any) => {
    if (!val) return // 无值则不进行更新
    await nextTick()
    updateCodeValue()
  },
  {
    immediate: true,
    deep: true
  }
)
watch(
  () => props.readOnly,
  (val: 'nocursor' | boolean) => {
    CodeMirrorEditor && (CodeMirrorEditor.options.readOnly = val)
  }
)
// 注：这里初始化加锁防止未设置完就更新
const updateCodeValue = () => {
  if (!CodeMirrorEditor) {
    return
  }
  // 这里添加比对防止重复触发（如：中文会重复更新，参考：http://ckang1229.gitee.io/vue-markdown-editor/zh/api.html#change 可以实现简易编辑器）
  if (props.editorValue.text === CodeMirrorEditor.getValue()) {
    return
  }
  stopChangeFlag.value = true
  CodeMirrorEditor.setValue('') // 先清空
  // const obj = { "text": "ABS(刚结课的sdf, 刚结课的sdf)", "marks": [{ "text": "刚结课的sdf", "entry": "223", "field": "widget_asdfasd11111111f", "from": { "line": 0, "ch": 4, "sticky": null }, "to": { "line": 0, "ch": 11, "sticky": null } }, { "text": "刚结课的sdf", "entry": "23", "field": "widget_asdfasdf", "from": { "line": 0, "ch": 13, "sticky": null }, "to": { "line": 0, "ch": 20, "sticky": null } }] }
  const obj = props.editorValue
  CodeMirrorEditor.replaceSelection(obj.text)
  if (obj.marks.length > 0) {
    for (let i = 0; i < obj.marks.length; i++) {
      let item = obj.marks[i]
      if (item.markType === 'field') {
        // 字段
        setMark(item)
      } else if (item.markType === 'func') {
        // 函数
        setFuncMark(item, true)
      } else if (item.markType === 'func-bracket') {
        // 函数括号
        setFuncMark(item, false)
      }
    }
  }
  // 光标位置更新
  CodeMirrorEditor.focus()
  CodeMirrorEditor.setCursor({ line: obj.cursor.line, ch: obj.cursor.ch })
  stopChangeFlag.value = false
}
onMounted(() => {
  // 这里不用id,可能一个界面存在多个，会冲突
  // let myTextarea: any = document.getElementById('code');
  CodeMirrorEditor = CodeMirror.fromTextArea(renderElem.value, {
    mode: 'markdown',
    lineWrapping: true,
    autofocus: true,
    readOnly: props.readOnly
  })
  // 当输入框内容发生变化
  CodeMirrorEditor.on('change', (cm: any) => {
    // 触发值更新
    if (!stopChangeFlag.value) {
      // 追加延时，防止mark多获取？？
      emits('update:value', getCodeValue())
    }
  })
  // 高度配置
  CodeMirrorEditor.setSize('auto', props.displayMode === 'input' ? 'auto' : props.height)
})
const getRealPos = (posInfo: { line: number; ch: number } = { line: 0, ch: 0 }) => {
  if (posInfo.line === 0) {
    return posInfo.ch
  }
  let lineCount = 0
  for (let i = 0; i < posInfo.line; i++) {
    lineCount += (CodeMirrorEditor.getLine(i)?.length ?? 0) + 1 // \n没算 tab是否需要兼容？？
  }
  return lineCount + posInfo.ch
}
// 节点 => 文字显示(直接取文字)
const transformMarks2NameStr = (valueObj: { text: string; marks: Record<string, any> }) => {
  let src = ''
  if (CodeMirrorEditor && valueObj) {
    // 计算最终接口数据
    const marks = valueObj.marks
    const textValue = valueObj.text
    const replacements = marks.map((mark: any) => {
      const { from, to } = mark
      // 兼容换行位置获取
      return {
        start: getRealPos(from),
        end: getRealPos(to),
        text: mark?.name ?? ''
      }
    })
    const parts = []
    let lastIndex = 0
    const newReplacements = sortBy(replacements, ['start']) // 按照起始值排序
    for (const replacement of newReplacements) {
      parts.push(textValue.slice(lastIndex, replacement.start))
      parts.push(replacement.text)
      lastIndex = replacement.end
    }
    parts.push(textValue.slice(lastIndex))
    src = parts.join('')
  }
  return src.trim() // 空格去除
}
// 节点 => 字符串
const transformMarks2Str = (valueObj: { text: string; marks: Record<string, any> }) => {
  let src = ''
  if (!props.markToStrFn) {
    console.error('请传入字段构建函数')
    return
  }
  if (CodeMirrorEditor && valueObj) {
    // 计算最终接口数据
    const marks = valueObj.marks
    const textValue = valueObj.text
    const replacements = marks.map((mark: any) => {
      const { from, to, markType, funcType, name } = mark
      let text = ''
      if (markType) {
        if (markType === 'field') {
          text = props.markToStrFn && props.markToStrFn(mark)
        } else if (markType === 'func') {
          text = funcType ? funcType + ':' + name : name
        } else if (markType === 'func-bracket') {
          text = name
        }
      } else {
        text = name
      }
      // 兼容换行位置获取
      // console.log(getRealPos(from));
      // console.log(getRealPos(to));
      return {
        start: getRealPos(from),
        end: getRealPos(to),
        text
      }
    })
    const parts = []
    let lastIndex = 0
    const tempReplacements = replacements.filter((item: any) => !!item.text) // 汉字会多一个mark??
    const newReplacements = sortBy(tempReplacements, ['start']) // 按照起始值排序
    for (const replacement of newReplacements) {
      parts.push(textValue.slice(lastIndex, replacement.start))
      parts.push(replacement.text)
      lastIndex = replacement.end
    }
    parts.push(textValue.slice(lastIndex))
    src = parts.join('')
  }
  return src
}
// 手动调用(这里直接返回拼接后的字符串),change会多一个mark??
const getCodeValue = (cursor?: CodeMirrorValue['cursor']) => {
  let lastCursor = cursor
  if (!cursor) {
    CodeMirrorEditor.focus()
    const tempCursor = CodeMirrorEditor.getCursor()
    lastCursor = {
      line: tempCursor.line,
      ch: tempCursor.ch
    }
  }
  const codeValue: CodeMirrorValue = {
    text: '',
    marks: [],
    cursor: lastCursor!
  }
  const value = CodeMirrorEditor.getValue()
  const marksAll = CodeMirrorEditor.getAllMarks()
  codeValue.text = value
  for (let i = 0; i < marksAll.length; i++) {
    const temp = marksAll[i]
    temp &&
      codeValue.marks.push({
        ...temp.attributes,
        ...temp.find()
      })
  }
  return {
    valueName: codeValue.text.trim(),
    value: transformMarks2Str(codeValue), // 替换后的字符串
    editorValue: codeValue // editor对象值配置
  }
}
defineExpose({
  onFieldSelect,
  onFunSelect
})
</script>

<template>
  <div :class="['code-mirror field-editor-wrapper', displayMode === 'default' && 'has-padding']">
    <textarea ref="renderElem" />
  </div>
</template>

<style lang="less" scoped>
.field-editor-wrapper {
  border: 1px solid #e1e3e5;
  color: #999;
  border-radius: 2px;

  &.has-padding {
    padding: 5px 8px;
  }

  outline: none;
}
</style>

<style>
.CodeMirror .my-snippet {
  /* color: rgba(17, 31, 44, 0.85);
  background: rgba(126, 134, 142, 0.2); */
  color: #0db3a6;
  background: #eaf7f6;
  display: inline-block;
  margin: 1px;
  padding: 0 5px;
  font-size: 14px;
  border-radius: 2px;
}
</style>
