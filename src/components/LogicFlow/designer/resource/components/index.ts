// 一些公共组件
import type { Component, App } from 'vue';
import DragList from './dragList/index.vue';
import ValidItem from './validItem/index.vue';
import QuestionTip from './questionTip/index.vue';
import FullModal from './fullModal/index.vue';
import IconFont from './iconFont/index.vue';
// 导入 部分表单配置组件
import FormComponents, { InputSearch } from './form';

const components: Component[] = [
  DragList,
  FullModal,
  ValidItem,
  QuestionTip,
  IconFont,
  ...FormComponents,
];

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name as string, component as any);
  });
};

export default {
  install,
};
export {
  DragList,
  FullModal,
  ValidItem,
  QuestionTip,
  InputSearch,
  IconFont
}
