import { validateFieldSet } from '../../common/validate'
import type {
  FlowMaterial,
  FlowNode,
  FlowNodeProps,
  StructuredCondition,
  StructuredInfo,
  ValidateType,
} from '../../types'
import Icon from './icon.svg?component'
import Setter from './Setter.vue'
export { default as runner } from './Runner'
// 变量赋值
export interface FlowAssignmentNodeProps extends FlowNodeProps {
  fillRules: StructuredInfo<StructuredCondition[]>
}
export const FlowAssignmentNode: FlowMaterial<FlowAssignmentNodeProps> = {
  name: '变量赋值',
  type: 'FlowAssignmentNode',
  icon: Icon,
  group: '语句',
  setter: Setter,
  validator: (node: FlowNode<FlowAssignmentNodeProps>) => {
    let type: ValidateType = 'default'
    const messages: string[] = []
    // 服务调用
    const assignMeta = node.props
    if (!node.name) {
      type = 'error'
      messages.push('节点名称是必填字段')
    }
    // 允许不设置赋值
    if (assignMeta.fillRules.structured?.length > 0) {
      const fieldSetFlag = validateFieldSet(assignMeta.fillRules.structured || [])
      if (!fieldSetFlag) {
        type = 'error'
        messages.push('存在未设置完整的赋值')
      }
    }
    return { type, messages }
  },
  description: (node: FlowNode<FlowAssignmentNodeProps>) => {
    const assignMeta = node.props
    const structured = assignMeta?.fillRules?.structured ?? []
    let text = node?.placeholderText ?? '请设置' + node.name
    if (validateFieldSet(structured)) {
      text = `已设置${structured?.length}个赋值`
    }
    node.props.valueText = text
  },
  props: {
    inputs: [],
    outputs: [],
    valueText: '',
    fillRules: {
      conditionType: 'structured',
      structured: [],
    },
  },
  config: {
    allowEdit: true,
    allowDelete: true,
  },
}
