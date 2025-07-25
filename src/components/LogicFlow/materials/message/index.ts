import Setter from './Setter.vue'
import { type FlowMaterial } from '../../types'
import Icon from './icon.svg'
export { default as runner } from './Runner'
export const FlowMessageNode: FlowMaterial = {
  name: '页面消息',
  type: 'FlowMessageNode',
  icon: Icon,
  setter: Setter,
  group: '操作',
  config: {},
  props: {
    noticeType: '', // 通知类型：success、info、warning、error
    duration: 3,
    content: {
      expression: '',
      expressionFull: null
    }
  }
}
