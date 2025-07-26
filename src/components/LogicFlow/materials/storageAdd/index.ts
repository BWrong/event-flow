import { type FlowMaterial, type FlowNode } from '../../types'
import Icon from './icon.svg?component'
import Setter from './Setter.vue'
export { default as runner } from './Runner'

export const FlowAddStorageNode: FlowMaterial = {
  name: '新增缓存',
  type: 'FlowAddStorageNode',
  icon: Icon,
  setter: Setter,
  validator: function (node: FlowNode<any>) {
    const storageData = node.props.storageData
    // const keys = storageData.map(item => item.localKey)
    // const seen = new Set();
    const duplicates = []

    // keys.forEach((key, index) => {
    //   if (seen.has(key)) {
    //     storageData[index].status = 'error'
    //     duplicates.push(key);
    //   } else {
    //     seen.add(key);
    //     storageData[index].status = ''
    //   }
    // });
    // return { type: duplicates.length ? 'error' : 'default', messages: [duplicates.length ? '键有重复，请重新输入' : ''] }

    storageData.forEach((item) => {
      const _value = item.localKey
      const _method = _value.method
      if (_method === 'expression') {
        if (!_value.content.expression) {
          duplicates.push(item)
        }
      } else if (_method === 'variable') {
        if (!_value.variableValue) {
          duplicates.push(item)
        }
      } else if (_method === 'value') {
        if (!_value.value) {
          duplicates.push(item)
        }
      }
    })
    // console.log('duplicates', duplicates)
    // 只做是否为空校验
    return {
      type: duplicates.length ? 'error' : 'default',
      messages: [duplicates.length ? 'key不能为空' : ''],
    }
  },
  group: '调用',
  config: {},
  props: {
    storageData: [],
  },
}
