import { CloseCircleOutlined, WarningOutlined } from '@ant-design/icons-vue'
export const logTypeOptions = [
  { label: '错误', value: 'error', icon: CloseCircleOutlined, iconColor: '#ff4d4f' },
  { label: '警告', value: 'warning', icon: WarningOutlined, iconColor: '#faad14' },
  { label: '日志', value: 'log', icon: WarningOutlined, iconColor: '#1677ff' },
] as const

export type ILogType = (typeof logTypeOptions)[number]['value']
