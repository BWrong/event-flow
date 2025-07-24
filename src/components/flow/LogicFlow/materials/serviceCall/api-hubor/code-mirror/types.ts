import { type FieldType } from '../types.d'

export interface Map_Field {
  name: string // 新字段id(创建)
  oriName: string // 名称
  retType?: string // 新字段类型
  src: any // 公式表达式 或 字段信息
  title: string //
  type: string
  codeMirrorValues?: any // 公式计算配置
}

export interface Stage_Map {
  id: string
  input: string[]
  title: string
  type: string
  fields: Map_Field[]
}

export interface IFormulaFunctionListItem {
  name: string
  code: string
  desc?: string
  type?: string
}

export interface IParamsListItem {
  name: string
  code: string
  type: string
  entry: string
  field: string
  parentId?: string // 子表单 id
}

export interface Stage_Field {
  form: string
  joinFieldType: string
  name: string // 字段名称，对应fieldTag
  text: string
  type: string
  value?: string
  label?: string
  parentId?: string // 子表单 id
  curFromType?: string
}

// 点击节点展示详情时获取节点字段信息
export interface Stage_Fields {
  fields: Stage_Field[]
  name: string
  nodeId?: string // 横向连接使用
}

// 流程公式字段类型

export interface FlowFormulaFunctionListItem {
  name: string
  value: string
  desc?: string
  type?: string
  funcType?: string
  valueType: FieldType
}
