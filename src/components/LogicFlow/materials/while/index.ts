import Noder from './Noder.vue'
import Setter from './Setter.vue'
import { type FlowMaterial } from '../../types'
import Icon from './icon.svg'
export { default as runner } from './Runner'
export const FlowWhileNode: FlowMaterial = {
  name: 'While循环',
  type: 'FlowWhileNode',
  icon: Icon,
  noder: Noder,
  setter: Setter,
  group: '流程控制',
  config: {
    nodeAutoWidth: true,
    allowCollapse: true,
    footerTips: '循环执行，直到条件不满足'
  },
  props: {},
  children: []
}
