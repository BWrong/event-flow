import { type FlowMaterial } from '../../types'
import Icon from './icon.svg?component'
import Setter from './Setter.vue'
export { default as runner } from './Runner'
export const FlowServiceCallNode: FlowMaterial = {
  name: '服务调用',
  type: 'FlowServiceCallNode',
  icon: Icon,
  setter: Setter,
  group: '操作',
  config: {},
  props: {
    // apiId: '183847327482727',
    url: '',
    method: 'GET',
    bodyDto: {
      body: {},
      bodyType: 'none',
    },
    headers: [],
    cookies: [],
    params: [],
    pathParam: [],
    authInfo: {
      type: 'No Auth', // 授权类型no_auth、api_key...
      setting: {},
    },
  },
}
