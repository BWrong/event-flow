<!--
 * @Author: ykx
 * @Date: 2023-06-13 19:55:28
 * @LastEditTime: 2023-07-05 19:24:25
 * @LastEditors: your name
 * @Description: 代码查看器
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\CodePreview.vue
-->
<script lang="ts" setup>
import { message } from 'ant-design-vue'
import CodeMirror from 'codemirror'
import { computed, onMounted, ref, watch } from 'vue'

import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
// import IconFont from '../OperateHttp/iconFont/index.vue'

const props = withDefaults(
  defineProps<{
    code: string
    codeMirrorConfig?: any
  }>(),
  {
    code: '',
    codeMirrorConfig: () => ({
      readOnly: true
    })
  }
)
const isInit = ref(false)
const codeRef = ref()
let CodeMirrorEditor: any = null
const emits = defineEmits(['update:code'])
// 这里遇到无法解析则返回默认值
const realCode = computed(() => {
  try {
    return props.code ? JSON.stringify(JSON.parse(props.code), null, '\t') : ''
  } catch (error) {
    return props.code
  }
})
const formatJson = () => {
  try {
    const newCode = props.code ? JSON.stringify(JSON.parse(props.code), null, '\t') : ''
    CodeMirrorEditor && CodeMirrorEditor.setValue(newCode)
  } catch (error) {
    message.warning('json格式错误')
  }
}
watch(
  () => props.code,
  () => {
    // 得加延时？？否则弹框第一次无法显示
    setTimeout(() => {
      if (CodeMirrorEditor) {
        if (props.code === CodeMirrorEditor.getValue()) {
          return
        }
        isInit.value = true
        CodeMirrorEditor.setValue(realCode.value)
        isInit.value = false
      }
    })
  },
  {
    immediate: true
  }
)
// 追加json展开收起
onMounted(() => {
  // 触发了多次？？
  let myTextarea: any = codeRef.value
  if (!myTextarea) {
    return
  }
  CodeMirrorEditor = CodeMirror.fromTextArea(myTextarea, {
    mode: 'application/json',
    lineWrapping: true, // 超过宽度换行显示
    theme: 'dracula',
    extraKeys: {
      'Ctrl-Q': function (cm: any) {
        cm.foldCode(cm.getCursor())
      }
    },
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    foldOptions: {
      widget: (from, to) => {
        let count = 0

        // Get open / close token
        let startToken = '{'
        let endToken = '}'
        const prevLine = CodeMirrorEditor.getLine(from.line)
        if (prevLine.lastIndexOf('[') > prevLine.lastIndexOf('{')) {
          startToken = '['
          endToken = ']'
        }

        // Get json content
        const internal = CodeMirrorEditor.getRange(from, to)
        const toParse = startToken + internal + endToken
        // Get key count
        try {
          const parsed = JSON.parse(toParse)
          count = Object.keys(parsed).length
        } catch (e) {
          console.error(e)
        }

        return count ? `\u21A4${count}\u21A6` : '\u2194'
      }
    },
    ...props.codeMirrorConfig
  })
  // 高度配置
  CodeMirrorEditor.setSize('100%', '100%')
  CodeMirrorEditor.on('change', (cm: any) => {
    // 触发值更新
    !isInit.value && emits('update:code', cm.getValue())
  })
})
</script>

<template>
  <div class="code-mirror code-preview-wrapper">
    <textarea ref="codeRef"></textarea>
    <!-- <IconFont
      v-if="!codeMirrorConfig.readOnly"
      class="format-icon"
      title="json格式化"
      size="18px"
      type="icon-json-parse"
      @click="formatJson"
    />

    <IconFont v-copy="realCode" class="copy-icon" title="复制内容" size="20px" type="icon-file-copy" /> -->
  </div>
</template>

<style lang="less">
.code-preview-wrapper {
  position: relative;
  border: 1px solid #e1e3e5;
  color: #999;
  padding: 5px 8px;
  outline: none;
  border-radius: 2px;
  .copy-icon {
    position: absolute;
    right: 15px;
    top: 20px;
    opacity: 0.5;
    color: #c6bfbf;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
  .format-icon {
    position: absolute;
    right: 45px;
    top: 21px;
    opacity: 0.5;
    color: #c6bfbf;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
