import type { FlowMaterial, FlowNode, FlowNodeProps, ValidateType } from '../../types'
import Icon from './icon.svg?component'
import Setter from './Setter.vue'

export { default as runner } from './Runner'

// 打印日志
export interface FlowConsoleNodeProps extends FlowNodeProps {
  logType?: string
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
    logType: 'log',
    content: {
      expression: '',
      expressionFull: '',
    },
  },
  validator: (node: FlowNode<FlowConsoleNodeProps>) => {
    const type: ValidateType = 'default'
    const messages: string[] = []
    // // 服务调用
    // const logMeta = node.props
    // if (!logMeta.logType) {
    //   type = 'error'
    //   messages.push('日志种类未设置')
    // }
    // if (!logMeta?.content?.expression) {
    //   type = 'error'
    //   messages.push('消息内容未设置')
    // }
    return { type, messages }
  },
  generateDescription: (node: FlowNode<FlowConsoleNodeProps>) => {
    const logMeta = node.props
    let text = '请设置' + node.name
    if (logMeta.content.expression) {
      text = `已设置[${logMeta.logType}]`
    }
    node.props.valueText = text
  },
}
