import type { FlowMaterial, FlowNode, FlowNodeProps, ValidateType } from '../../types'
import Icon from './icon.svg'
import Setter from './Setter.vue'

import type { ILogType } from '../../designer/resource/dicts/index.ts'
export { default as runner } from './Runner'

// 打印日志
export interface FlowConsoleNodeProps extends FlowNodeProps {
  logType?: ILogType
  content: {
    expression: string
    expressionFull: any
  }
}
export const FlowConsoleNode: FlowMaterial<FlowConsoleNodeProps> = {
  name: '打印日志',
  type: 'FlowConsoleNode',
  icon: Icon,
  setter: Setter,
  group: '语句',
  config: {
    allowDelete: true,
    allowEdit: true,
  },
  props: {
    logType: undefined,
    content: {
      expression: '',
      expressionFull: '',
    },
  },
  validator: (node: FlowNode<FlowConsoleNodeProps>) => {
    let type: ValidateType = 'default',
      messages: string[] = []
    // 服务调用
    const logMeta = node.props
    if (!node.name) {
      type = 'error'
      messages.push('节点名称是必填字段')
    }
    if (!logMeta.logType) {
      type = 'error'
      messages.push('日志种类未设置')
    }
    if (!logMeta?.content?.expression) {
      type = 'error'
      messages.push('消息内容未设置')
    }
    return { type, messages }
  },
  updateValueText: (node: FlowNode<FlowConsoleNodeProps>) => {
    const logMeta = node.props
    let text = '请设置' + node.name
    if (logMeta.content.expression) {
      text = '已设置'
    }
    node.props.valueText = text
  },
}
