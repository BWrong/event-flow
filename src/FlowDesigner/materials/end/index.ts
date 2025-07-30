import { type FlowMaterial } from '../../types'
import Icon from './icon.svg?component'
export { default as runner } from './Runner'
export const FlowEndNode: FlowMaterial = {
  name: '结束节点',
  type: 'FlowEndNode',
  icon: Icon,
  group: '内置',
  config: {
    hideInAdd: true,
    allowDelete: false,
    allowEdit: false,
  },
  props: {},
}
