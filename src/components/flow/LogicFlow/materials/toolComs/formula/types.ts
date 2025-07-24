/*
 * @Author: ykx
 * @Date: 2023-06-02 09:17:14
 * @LastEditTime: 2024-02-22 10:35:55
 * @LastEditors: Bwrong
 * @Description: 编辑器组件类型定义
 * @FilePath: \easycube-apps\packages\types\src\editor.ts
 */
export interface Pos {
  line: number
  ch: number
  sticky: any
}
// 公式编辑器部分类型定义
export interface Mark{
  name: string
  value: string
  className: string;
  editorName?: string
  markType: 'field' | 'func' | 'func-bracket';
  extra?: string
  from: Pos
  to: Pos
}
export interface CodeMirrorValue<T=Mark> {
  text?: string
  marks?: T[]
  cursor?: {line: number; ch: number} // 上一次光标位置
}
export interface EditorInfo {
  valueName?: string;
  value: string;
  editorValue?: CodeMirrorValue | null;
  [props: string]: any;
}
export interface FormulaCodeMirrorResult {
  codeMirrorValues: CodeMirrorValue | {}
  fieldName?: string
  retType?: string
  src: string
}
export interface API {
  getCodeValue: () => CodeMirrorValue;
}

// 左侧字段
export interface EditorField {
  value: string;
  name: string;
  fieldType?: 'text' | 'number' | 'date' | 'select' | 'selectMulti'
  children?: EditorField[]
  [prop: string]: any;
}
export interface FormulaRely {
  codeMirrorValues: CodeMirrorValue
  formula: {
    formula: string
    text: string
  }
  widgets: any[]
  type: 'formula'
}

// 流程公式字段类型

export interface IFormulaFunctionListItem {
  name: string
  code: string
  desc: string
}