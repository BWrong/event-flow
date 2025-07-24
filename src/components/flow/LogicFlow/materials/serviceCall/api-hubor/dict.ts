export const OPERATION_TYPE = {
  1: 'POST',
  2: 'GET',
  3: 'PUT',
  4: 'DELETE',
  5: 'OPTIONS',
  6: 'HEAD',
  7: 'PATCH',
  8: 'TRACE'
}

export const Auth_Type = [
  { value: 'no_auth', label: 'No Auth' },
  { value: 'api_key', label: 'API Key' },
  { value: 'bearer_token', label: 'Bearer Token' }
]

export const COMMON_CONDITION = [
  { label: '为空', value: 'not_empty' },
  { label: '不为空', value: 'empty' }
]

export const fieldTypeMap = {
  text: {
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
    valueTypes: ['string', 'number', 'integer', 'date']
  },
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
    valueTypes: ['string', 'number', 'integer', 'date']
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
      { label: '大于等于', value: 'less_equals' },
      ...COMMON_CONDITION
    ],
    valueTypes: ['number', 'string', 'integer']
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
    valueTypes: ['number', 'string', 'integer']
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
    valueTypes: ['date']
  },
  boolean: {
    text: 'boolean',
    backgroundColor: 'rgba(20,133,246,.15)',
    color: '#1485f6',
    condition: [
      { label: '等于', value: 'equals' },
      { label: '不等于', value: 'not_equals' }
    ],
    valueTypes: ['boolean']
  },
  array: {
    text: 'array',
    backgroundColor: 'rgba(20,133,246,.15)',
    color: '#1485f6',
    valueTypes: ['array']
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
    valueTypes: ['object']
  },
  structureObject: {
    text: 'structureObject',
    color: '#1485f6',
    backgroundColor: 'rgba(20,133,246,.15)',
    valueTypes: ['structureObject']
  },
  null: {
    text: 'null',
    backgroundColor: '#fff4f2',
    color: '#ff7357'
  }
}
