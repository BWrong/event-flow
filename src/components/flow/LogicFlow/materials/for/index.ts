import Noder from './Noder.vue'
import Setter from './Setter.vue'
import { type FlowMaterial, type FlowNode, type FlowNodeProps, type ValidateType, type FlowVariables, type VariableType } from '../../types'
import Icon from './icon.svg'
export { default as runner } from './Runner'

export interface FlowForNodeProps extends FlowNodeProps {
  loopCollection: {name: string, variableType: VariableType}
  loopEntry: string
  loopSubscript: string
  variableList: FlowVariables[] // 对外输出变量
}
export const FlowForNode: FlowMaterial<FlowForNodeProps, FlowNode> = {
  name: 'For循环',
  type: 'FlowForNode',
  icon: Icon,
  noder: Noder,
  setter: Setter,
  group: '流程控制',
  config: {
    allowDelete: true,
    allowEdit: true,
    nodeAutoWidth: true,
    allowCollapse: true,
    footerTips: '依次循环处理集合变量的每条记录'
  },
  props: {
    loopCollection: { name: '', variableType: 'flowTemp' },
    loopEntry: '',
    loopSubscript: '',
    variableList: []
  },
  validator: (node: FlowNode<FlowForNodeProps>) => {
    let type: ValidateType = 'default';
    const  messages: string[] = []
    if (!node.props.loopCollection?.name) {
      type = 'error'
      messages.push('集合变量是必填字段')
    }
    if (!node.props.loopEntry) {
      type = 'error'
      messages.push('条目变量是必填字段')
    }

    return { type, messages }
  },
  children: []
}
