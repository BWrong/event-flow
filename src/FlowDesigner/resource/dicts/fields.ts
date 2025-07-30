// 数据类型映射为字段类型
export const typeToFieldTypeMap: Record<string, string> = {
  '[object String]': 'text',
  '[object Boolean]': 'text', // 这里布尔也当成字符串处理
  '[object Number]': 'number',
  '[object Object]': 'object',
  '[object Array]': 'array'
}
export const COMMON_CONDITION = [
  { label: '为空', value: 'empty' },
  { label: '不为空', value: 'not_empty' }
]
// 映射关系(全量)   text-文字显示  backgroundColor - 背景  color -文字  condition-连接条件 dataCondition-链接条件（数据节点） allowTypes - 符合选择的值类型
export const fieldTypeMap = {
  string: {
    text: 'string',
    backgroundColor: 'rgba(20,133,246,.15)',
    color: '#1485f6',
    condition: [
      { label: '等于', value: 'equals' },
      { label: '不等于', value: 'not_equals' },
      { label: '开头为', value: 'starts_with' },
      { label: '结尾为', value: 'ends_With' },
      ...COMMON_CONDITION
    ],
    allowTypes: ['string', 'number', 'integer', 'date']
  },
  integer: {
    text: 'integer',
    backgroundColor: 'rgba(244,183,0,.15)',
    color: '#f4b700',
    condition: [
      { label: '等于', value: 'equals' },
      { label: '不等于', value: 'not_equals' },
      { label: '大于', value: 'greater' },
      { label: '大于等于', value: 'greater_equals' },
      { label: '小于', value: 'less' },
      { label: '小于等于', value: 'less_equals' },
      ...COMMON_CONDITION
    ],
    allowTypes: ['number', 'string', 'integer']
  },
  number: {
    text: 'number',
    backgroundColor: 'rgba(244,183,0,.15)',
    color: '#f4b700',
    condition: [
      { label: '等于', value: 'equals' },
      { label: '不等于', value: 'not_equals' },
      { label: '大于', value: 'greater' },
      { label: '大于等于', value: 'greater_equals' },
      { label: '小于', value: 'less' },
      { label: '大于等于', value: 'less_equals' },
      ...COMMON_CONDITION
    ],
    allowTypes: ['number', 'string', 'integer']
  },
  date: {
    text: 'date',
    backgroundColor: 'rgba(20,133,246,.15)',
    color: '#1485f6',
    condition: [
      { label: '等于', value: 'equals' },
      { label: '不等于', value: 'not_equals' },
      { label: '晚于', value: 'greater' },
      { label: '早于', value: 'less' },
      ...COMMON_CONDITION
    ],
    allowTypes: ['date']
  },
  boolean: {
    text: 'boolean',
    backgroundColor: 'rgba(20,133,246,.15)',
    color: '#1485f6',
    condition: [
      { label: '等于', value: 'equals' },
      { label: '不等于', value: 'not_equals' }
    ],
    allowTypes: ['boolean']
  },
  array: {
    text: 'array',
    backgroundColor: 'rgba(20,133,246,.15)',
    color: '#1485f6',
    allowTypes: ['array']
  },
  genericity: {
    text: 'genericity',
    backgroundColor: '#fff4f2',
    color: '#ff7357'
  },
  object: {
    text: 'object',
    color: '#1485f6',
    backgroundColor: 'rgba(20,133,246,.15)',
    allowTypes: ['object']
  },
  structureObject: {
    text: 'structureObject',
    color: '#1485f6',
    backgroundColor: 'rgba(20,133,246,.15)',
    allowTypes: ['structureObject']
  },
  null: {
    text: 'null',
    backgroundColor: '#fff4f2',
    color: '#ff7357'
  }
}
export type FieldType = keyof typeof fieldTypeMap
export type FieldTypeOption = { label: string; value: FieldType }
// 构建类型的选项集合，支持排除操作，（暂时屏蔽对象，对象数组类型）
export const getFieldTypeOptions = (omitTypes?: string[]): FieldTypeOption[] => {
  const fullTypeOptions = (Object.keys(fieldTypeMap) as any).map((key: FieldType) => {
    const target = fieldTypeMap[key]
    return {
      label: target?.text ?? '',
      value: key
      // disabled: ['object', 'null'].includes(key),
    }
  })
  // .filter((item: any) => !['object', 'null'].includes(item.value));
  return omitTypes && omitTypes.length > 0
    ? fullTypeOptions.filter((item: any) => {
        return !omitTypes?.includes(item.value)
      })
    : fullTypeOptions
}
// 不支持常量值设置的类型
export const notSupConstParamTypes: FieldType[] = ['array', 'structureObject', 'object']

// 值类型(先屏蔽表达式)
export const sourceTypeOptions = [
  {
    label: '值',
    value: 'value'
  },
  {
    label: '变量',
    value: 'variable'
  },
  {
    label: '表达式',
    value: 'formula'
  }
] as const
// 条件连接
export const combineTypeOptions = [
  {
    label: '且',
    value: 'and',
  },
  {
    label: '或',
    value: 'or',
  },
] as const;
// 字段类型(默认排除null)
export const fieldTypeOptions = getFieldTypeOptions(['null'])
export const fullFieldTypeOptions = getFieldTypeOptions()
// 值分类
export type ISourceType = typeof sourceTypeOptions[number]['value']

export type CombineTypeOption = (typeof combineTypeOptions)[number];
