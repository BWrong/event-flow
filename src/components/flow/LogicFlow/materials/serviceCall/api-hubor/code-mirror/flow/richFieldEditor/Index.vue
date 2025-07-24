<template>
  <div :class="['content-editor-wrapper']" :style="{ height: height }">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
    <Editor
      v-model="valueHtml"
      class="content-editor-body"
      :default-config="editorConfig"
      mode="simple"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
// @ts-ignore
import { Boot } from '@wangeditor/editor'
// @ts-ignore
import { type IToolbarConfig, DomEditor } from '@wangeditor/editor'
import { onBeforeUnmount, shallowRef } from 'vue'
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// @ts-ignore
import { fileUpload } from '@/api'
// @ts-ignore
import { getPreviewUrl } from '@/utils/getUrl'
import cubefieldModule, { type CubefieldElement } from './module/cubeField'
const props = withDefaults(
  defineProps<{
    toggle?: boolean // 是否支持编辑态
    value: string
    readOnly?: boolean
    height?: string
    placeholder?: string
  }>(),
  {
    value: '',
    toggle: true,
    readOnly: true,
    height: '300px',
    placeholder: '请输入内容...'
  }
)
type InsertFnType = (_url: string, _alt: string, _href: string) => void

// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(cubefieldModule)
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('')
const editorConfig = {
  placeholder: props.placeholder,
  MENU_CONF: {}
}
const emit = defineEmits(['update:value'])

// 这里暂时不处理图片删除了(这里采用自定义上传，后端为put，好像编辑器没提供修改)
;(editorConfig.MENU_CONF as any)['uploadImage'] = {
  // 判断本地调试直接使用83环境
  // server:
  //   (envMode === 'development' ? 'http://10.18.101.237:18083' + prefix : prefix) +
  //   '/attachment',
  // // form-data fieldName ，默认值 'wangeditor-uploaded-image'
  // fieldName: 'files',

  // // 单个文件的最大体积限制，默认为 2M
  // maxFileSize: 1 * 1024 * 1024, // 1M

  // // 最多可上传几个文件，默认为 100
  // maxNumberOfFiles: 10,

  // // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  // allowedFileTypes: ['image/*', 'png/*'],

  // // 将 meta 拼接到 url 参数中，默认 false
  // metaWithUrl: false,

  // // 自定义增加 http  header
  // headers: {
  //   Authorization: `Bearer ${getStore('access_token')}`,
  // },

  // // 超时时间，默认为 10 秒
  // timeout: 5 * 1000, // 5 秒
  // // 自定义插入图片
  // customInsert(res: any, insertFn: InsertFnType) {
  //   // res 即服务端的返回结果
  //   console.log(res);
  //   // 从 res 中找到 url alt href ，然后插入图片
  //   // insertFn(url);
  // },
  // 自定义上传
  async customUpload(file: File, insertFn: InsertFnType) {
    // TS 语法
    const formData = new FormData()
    formData.append('files', file)
    const res = await fileUpload(formData)
    if (res && res.success) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((item: any) => {
          const tempUrl = getPreviewUrl(item.id)
          insertFn(tempUrl, '', tempUrl)
        })
        setTimeout(() => {
          emit('update:value', editorRef.value.getHtml(), editorRef.value.getElemsByType('cubefield')) // 更新一下值(注：这里会返回两个值，一个是html,一个是插入的动态字段集合)
        })
      }
    }
  }
}
// 排除某些菜单
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'italic',
    'code',
    'codeBlock',
    'blockquote',
    'group-video',
    'bulletedList',
    'numberedList',
    'fullScreen',
    'divider'
  ]
}
const handleChange = (editor: any) => {
  const text = editor.getText()
  if (text) {
    emit('update:value', editor.getHtml(), editor.getElemsByType('cubefield'))
  } else {
    emit('update:value', '', [])
  }
}
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  valueHtml.value = props.value || ''
  setTimeout(() => {
    const toolbar = DomEditor.getToolbar(editor)
    toolbar.getConfig()
  })
}
// 对外暴露字段插入方法
const onFieldSelect = (item: any) => {
  const showName = item.valueName || item.name
  const editor = editorRef.value
  if (editor == null) return
  const cubefieldNode: CubefieldElement = {
    type: 'cubefield', // 类型
    value: showName, // 文本
    info: item, // 其他信息，自定义
    children: [{ text: '' }] // 必须有一个空 text 作为 children
  }

  editor.restoreSelection() // 恢复选区
  editor.insertNode(cubefieldNode) // 插入 节点
  // 触发一下值更新
  emit('update:value', editor.getHtml(), editor.getElemsByType('cubefield'))
}
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor === null) return
  editor.destroy()
})
// 监听是否只读
watch(
  () => props.readOnly,
  async (val: boolean) => {
    await nextTick()
    if (editorRef.value) {
      //   console.log(editorRef.value.getAllMenuKeys());
      val ? editorRef.value.disable() : editorRef.value.enable()
    }
  },
  {
    immediate: true
  }
)
defineExpose({
  onFieldSelect
})
</script>

<style scoped lang="less">
.content-editor-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  .content-editor-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
