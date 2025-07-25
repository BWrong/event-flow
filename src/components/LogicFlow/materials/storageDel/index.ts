import Setter from './Setter.vue'
import { type FlowMaterial } from '../../types'
import Icon from './icon.svg'
export { default as runner } from './Runner'

export const FlowDeleteStorageNode: FlowMaterial = {
  name: '删除缓存',
  type: 'FlowDeleteStorageNode',
  icon: Icon,
  setter: Setter,
  group: '调用',
  config: {},
  props: {
    storageData: []
  }
}
