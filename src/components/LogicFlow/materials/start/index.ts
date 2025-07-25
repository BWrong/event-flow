import { type FlowMaterial } from '../../types'
import Icon from './icon.svg?component'
import Setter from './Setter.vue'
export { default as runner } from './Runner'
export const FlowStartNode: FlowMaterial = {
  name: '开始节点',
  type: 'FlowStartNode',
  group: '内置',
  icon: Icon,
  setter: Setter,
  config: {
    hideInAdd: true,
    allowDelete: false,
    allowEdit: true,
  },
  props: {},
}
