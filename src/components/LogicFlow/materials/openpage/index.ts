import { type FlowMaterial } from '../../types'
import Icon from './icon.svg?component'
import Setter from './Setter.vue'
export { default as runner } from './Runner'

export const FlowOpenPageNode: FlowMaterial = {
  name: '打开页面',
  type: 'FlowOpenPageNode',
  icon: Icon,
  setter: Setter,
  group: '操作',
  config: {},
  props: {
    pageType: '1', // 打开页面类型 1: 内部页面 2: 返回上一页 3: 其它链接
    targetPageAddress: '', // 内部页面：（打开目标页面）
    openMode: '', // 打开方式(仅PC端)：_blank、_self
    pageUrlMethod: '', // 页面链接(URL) expression, variable、value
    // 页面链接(URL) 表达式
    content: {
      expression: '',
      expressionFull: null,
    },
    pageUrlVariable: '', // 页面链接(URL) 变量
    pageUrlVariableType: '', // 页面链接(URL) 变量类型
    pageUrlValue: '', // 页面链接(URL) 值
  },
}
