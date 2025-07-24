import Setter from './Setter.vue'
import { type FlowMaterial, type FlowNode } from '../../types'
import Icon from './icon.svg'
export { default as runner } from './Runner'

export const FlowGetStorageNode: FlowMaterial = {
  name: '获取缓存',
  type: 'FlowGetStorageNode',
  icon: Icon,
  setter: Setter,
  validator: function (node: FlowNode<any>) {
    const storageData = node.props.storageData
    const duplicates = [];

    storageData.forEach(item => {
      const { variable, storageKey } = item

      if (!variable.variableValue) {
        duplicates.push(item)
      }
      
      const _method = storageKey.method
      if (_method === 'expression') {
        if (!storageKey.content.expression) {
          duplicates.push(item)
        }
      } else if (_method === 'variable') {
        if (!storageKey.variableValue) {
          duplicates.push(item)
        }
      } else if (_method === 'value') {
        if (!storageKey.value) {
          duplicates.push(item)
        }
      }
    })
    // console.log('duplicates', duplicates)
    // 只做是否为空校验
    return { type: duplicates.length ? 'error' : 'default', messages: [duplicates.length ? '输入框不能为空' : ''] }
  },
  group: '调用',
  config: {},
  props: {
    storageData: [],
  }
}
