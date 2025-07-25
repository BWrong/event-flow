import Setter from './Setter.vue'
import { type FlowMaterial } from '../../types'
import Icon from './icon.svg'
export { default as runner } from './Runner'
export const FlowUpdateServiceNode: FlowMaterial = {
  name: '更新服务调用',
  type: 'FlowUpdateServiceNode',
  icon: Icon,
  setter: Setter,
  group: '调用',
  config: {},
  props: {}
}
