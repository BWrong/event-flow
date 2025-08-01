<!--
 * @Author: ykx
 * @Date: 2023-06-21 18:27:01
 * @LastEditTime: 2023-07-06 18:55:03
 * @LastEditors: your name
 * @Description: 公式主体带弹框(存入两个值)
 * @FilePath: \easycube-apps\packages\zeroCodeEditor\src\formulaEditor\Index.vue
-->
<script setup lang="ts">
import { Flex, message } from 'ant-design-vue';
import { cloneDeep, debounce } from 'lodash-es';
import { ref, watch } from 'vue';
import { FullModal, IconFont } from '../../../../resource/components';
import type {
  CodeMirrorValue,
  IFormulaFunctionListItem,
  Mark,
} from '../../types';
import FieldEditor from './FieldEditor.vue';
import FormulaDesc from './components/FormulaDesc.vue';
import FormulaFunctions from './components/FormulaFunctions.vue';
import FormulaParamsTree from './components/FormulaParamsTree.vue';
import QuickOperator from './components/QuickOperator.vue';
interface EditorInfo {
  valueName?: string;
  value: string;
  editorValue?: CodeMirrorValue;
  [props: string]: any;
}
const props = withDefaults(
  defineProps<{
    visible: boolean;
    value: EditorInfo;
    checkFormulaFun?: (params: any) => any; // 校验函数（这里需返回特定结构ajax）
  }>(),
  {
    visible: false,
    value: () => ({
      value: '',
      valueName: '',
      editorValue: { text: '', marks: [], cursor: { line: 0, ch: 0 } },
    }),
  },
);
const collapse = ref(true);
const fieldEditorRef = ref(); // 编辑器ref
// 完整属性
const editorInfo = ref<EditorInfo>({
  valueName: '',
  value: '',
  editorValue: { text: '', marks: [], cursor: { line: 0, ch: 0 } },
}); // 复制项
const validResult = ref({ flag: true, msg: '' }); // 校验结果
const emits = defineEmits(['update:visible', 'onOk']);
const targetFunction = ref<IFormulaFunctionListItem>({
  code: '',
  name: '',
  desc: '请从左侧面板选择字段名和函数，或输入函数<br/>公式编辑举例：<i>SUM</i>(<strong>语文成绩</strong>,<strong>数学成绩</strong>,<strong>英语成绩</strong>)返回三门课程的总分',
});
const selectFunction = ref<IFormulaFunctionListItem>({
  name: '',
  desc: '',
  code: '',
});
// 字段转换方法(这里不进行处理)
const markToStrFn = (item: Mark) => {
  return `#{${item.value}}`;
};

const onFieldSelect = (name: string) => {
  if (fieldEditorRef.value && typeof fieldEditorRef.value.onFieldSelect === 'function' && name) {
    fieldEditorRef.value.onFieldSelect({
      name: name,
      value: name,
    });
  }
};
const onOperatorSelect = (operator: string) => {
  if (fieldEditorRef.value) {
    // 直接插入文本,不需要mark标记
    fieldEditorRef.value.insertText(operator)
  }
}
const onFunSelect = (item: IFormulaFunctionListItem) => {
  if (fieldEditorRef.value && typeof fieldEditorRef.value.onFunSelect === 'function' && item) {
    fieldEditorRef.value.onFunSelect(item);
  }
};
const handleOk = () => {
  if (validResult.value.flag) {
    emits('onOk', editorInfo.value);
    emits('update:visible', false);
  } else {
    message.error('公式校验失败,请重新编辑');
  }
};

// 编辑器变化(这里走公式校验),这里value会添加${}包裹
const handleEditorChange = async (data: EditorInfo) => {
  // 值更新
  editorInfo.value = data;
  if (!data.value) {
    validResult.value.flag = true;
    validResult.value.msg = '';
    return;
  }
  if (props.checkFormulaFun) {
    try {
      const res = await props.checkFormulaFun('${' + data.value + '}');
      if (res && !res.data) {
        validResult.value.flag = true;
        validResult.value.msg = '';
      } else {
        validResult.value.flag = false;
        validResult.value.msg = res.data || '公式校验失败';
      }
    } catch (error) {
      validResult.value.flag = false;
      validResult.value.msg = (error as string) || '公式校验失败';
    }
  } else {
    // 值更新
    editorInfo.value = data;
  }
};
const bounceChange = debounce(handleEditorChange, 300);
watch(
  () => props.visible,
  async (val: boolean) => {
    if (val) {
      // 这里获取值（去除包裹的${}）;
      validResult.value.flag = true;
      validResult.value.msg = '';
      editorInfo.value = cloneDeep(props.value);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <FullModal :visible="visible" :width="800" :height="540" title="公式设置" tips="请在英文输入法模式下编辑公式" allow-full-screen
    @ok="handleOk" @update:visible="emits('update:visible', !visible)" @cancel="emits('update:visible', false)">
    <div class="formula-editor">
      <div class="editor">
        <Flex align="center" class=" px-2" style="background-color: #f3f8fb;height: 40px">
          <QuickOperator @operatorSelect="onOperatorSelect" />
        </Flex>

        <FieldEditor ref="fieldEditorRef" height="170px" :editor-value="editorInfo.editorValue"
          :mark-to-str-fn="markToStrFn" @update:value="bounceChange" />
      </div>

      <footer>
        <div :class="['params', !collapse && 'full-width']">
          <div class="title">
            可用变量
            <IconFont class="cursor-pointer" size="16px" :title="collapse ? '展开' : '收起'"
              :type="collapse ? 'icon-menu-unfold3' : 'icon-menu-fold'" @click="collapse = !collapse" />
          </div>
          <!-- 添加树形字段选择 -->
          <FormulaParamsTree @select="onFieldSelect" />
        </div>
        <div class="functions-wrapper">
          <div class="functions">
            <div class="title">函数</div>
            <div style="height: calc(100% - 30px)">
              <FormulaFunctions v-model:value="targetFunction" v-model:select-value="selectFunction"
                @update:select-value="onFunSelect" />
            </div>
          </div>
          <div class="desc">
            <FormulaDesc :data-source="targetFunction" />
          </div>
        </div>
      </footer>
    </div>
    <!-- footer左侧 -->
    <template #footer-left>
      <span v-if="!validResult.flag" class="valid-result text-error">
        {{ validResult.msg }}
      </span>
    </template>
  </FullModal>
</template>

<style scoped lang="less">
.formula-editor {
  width: 100%;
  height: 100%;
  min-height: 420px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-flow: column nowrap;

  .editor {
    flex: 1;
    width: 100%;
    border: 1px solid #e1e3e5;
    overflow: hidden;
    min-height: 220px;

    >main {
      // height: calc(100% - 36px);
      height: 130px;
      width: 100%;

      .code-mirror {
        height: 100%;
        width: 100%;
        font-size: 12px;
        color: #999;
        padding: 5px 8px;
        outline: none;
      }
    }
  }

  >footer {
    width: 100%;
    padding-top: 20px;
    position: relative;
    display: flex;
    flex-wrap: wrap;

    >.params {
      width: 230px;
      flex: 1;
      height: 250px;
      border: 1px solid #e1e3e5;
      transition: width 0.2s;
      margin-right: 10px;

      &.full-width {
        margin-right: 0;
        width: 100%;
        margin-bottom: 10px;
      }
    }

    >.functions-wrapper {
      height: 250px;
      flex: 3;
      display: flex;

      .functions,
      .desc {
        border: 1px solid #e1e3e5;
        height: 100%;
      }

      .functions {
        width: 190px;
        flex: 3;
      }

      .desc {
        margin-left: 10px;
        flex: 4;
      }
    }

    .title {
      font-size: 12px;
      color: #666;
      padding: 0 10px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      :deep(.anticon) {
        cursor: pointer;
      }
    }
  }
}

.valid-result {
  font-size: 12px;
  display: flex;
  align-items: center;
}
</style>
