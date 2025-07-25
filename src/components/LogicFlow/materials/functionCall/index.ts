import { type FlowMaterial } from '../../types';
import Icon from './icon.svg';
import Setter from './Setter.vue';

export { default as runner } from './Runner';
export const FlowFunctionCallNode: FlowMaterial = {
  name: 'JS函数调用',
  type: 'FlowFunctionCallNode',
  icon: Icon,
  setter: Setter,
  group: '调用',
  config: {},
  props: {
    inputs: [],
    outputs: [],
    functionName: '',
    functionParams: [],
  },
};
