interface Pos {
  line: number
  ch: number
  sticky: any
}

// 公式编辑器部分类型定义
export interface Mark {
  name: string
  value: string
  editorName?: string
  markType: 'field' | 'func' | 'func-bracket'
  funcType?: string
  extra?: string
  from: Pos
  to: Pos
}
export interface CodeMirrorValue {
  text?: string
  marks?: Mark[]
  cursor?: { line: number; ch: number } // 上一次光标位置
}

export interface EditorField {
  value: string
  name: string
  fieldType?: 'text' | 'number' | 'date' | 'select' | 'selectMulti'
  children?: EditorField[]
  [prop: string]: any
}
