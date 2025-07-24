<template>
  <div class="open-page-config-wrapper">
    <!-- <AButton @click="onSave">save</AButton> -->
    <AFormItem
      label="打开页面类型"
    >
      <ARadioGroup
        v-model:value="formState.pageType"
        @change="onPageTypeChange"
      >
        <ARadio value="1">应用内页面</ARadio>
        <ARadio value="2">返回上一页面</ARadio>
        <ARadio value="3">其它链接</ARadio>
      </ARadioGroup>
    </AFormItem>
    <AFormItem
      v-if="formState.pageType == 1"
      label="打开目标页面"
    >
      <ASelect
        v-model:value="formState.targetPageAddress"
        :options="pageList"
        :fieldNames="{ label: 'description', value: 'route' }"
      />
    </AFormItem>
    <AFormItem
      v-if="formState.pageType == 3"
      label="页面链接(URL)"
    >
      <div style="display: flex;">
        <ASelect
          v-model:value="formState.pageUrlMethod"
          :options="pageUrlOption"
          style="width: 49%;margin-right: 20px;"
        />
        <!-- 表达式 -->
        <AButton
          v-if="formState.pageUrlMethod == 'expression'"
          :class="['flex', formState.content.expression ? 'primary' : '']"
          @click="visible = true"
        >
          {{ formState.content.expression ? '编辑表达式' : '设置表达式' }}
        </AButton>
        
        <!-- 变量 -->
        <FieldTreeSelect
          v-if="formState.pageUrlMethod == 'variable'"
          class="flex"
          :value="formState.pageUrlVariable"
          @update:value="onFieldSelect"
        />
        <!-- 值 -->
        <AInput
          v-if="formState.pageUrlMethod == '' || formState.pageUrlMethod == 'value'"
          class="flex"
          v-model:value="formState.pageUrlValue"
        />
      </div>
    </AFormItem>
    <AFormItem
      v-if="formState.pageType == 1 || formState.pageType == 3"
      label="打开方式(仅PC端)"
    >
      <ASelect
        v-model:value="formState.openMode"
        :options="openOption"
      />
    </AFormItem>
  </div>
  <AModal
    v-if="visible"
    v-model:open="visible"
    title="表达式"
    cancelText="取消"
    okText="确定"
    :onOk="handleOk"
    :onCancel="handleCancel"
  >
    <formula-set
      :value="{
        value: formState.content.expression,
        editorValue: formState.content.expressionFull
      }"
      @update:value="handleFormulaSetChange"
    />
  </AModal>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { cloneDeep } from 'lodash-es'
  import { FlowOpenPageNode } from './index';
  import { FormulaSet } from '../toolComs/formula';
  import FieldTreeSelect from '../toolComs/fieldTreeSelect/index.vue';
  import { fetchPageList } from '../../apis/apihub';

  const props = withDefaults(
    defineProps<{
      value: any
    }>(),
    {
      value: () => FlowOpenPageNode.props
    }
  )
  const formState = ref<any>(cloneDeep(FlowOpenPageNode.props))
  const visible = ref(false);
  // 内部页面列表
  const pageList = ref<any[]>([]);

  const pageUrlOption = [
    { label: '表达式', value: 'expression' },
    { label: '变量', value: 'variable' },
    { label: '值', value: 'value' },
  ]
  const openOption = [
    { label: '当前页面打开', value: '_self' },
    { label: '在新窗口打开', value: '_blank' }
  ]

  // const onSave = () => {
  //   console.log('formState==', formState.value)
  // }
  const onPageTypeChange = () => {
    formState.value.targetPageAddress = '';
    formState.value.openMode = '';
    formState.value.pageUrlMethod = '';
    formState.value.content.expression = '';
    formState.value.content.expressionFull = '';
    formState.value.pageUrlVariable = '';
    formState.value.pageUrlValue = '';
    // console.log('val--', e.target.value, formState.value)
  }
  const handleFormulaSetChange = (val: any) => {
    // console.log('handleFormulaSetChange==', val)
    // 这里对结构进行转换
    formState.value.content.expression = val.value;
    formState.value.content.expressionFull = val.editorValue;
  }
  const handleOk = () => {
    visible.value = false
  }
  const handleCancel = () => {
    visible.value = false
  }
  const onFieldSelect = (fieldItem: { varFullName: string; row: any }) => {
    // console.log('onFieldSelect==', fieldItem)
    formState.value.pageUrlVariable = fieldItem.varFullName;
    formState.value.pageUrlVariableType = fieldItem.row.variableType;
  }
  watch(
    () => props.value,
    (val: any) => {
      if (val) {
        formState.value = val // 这里没去除引用关系，内部可以双向绑定（绕过了检查）
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    let appId = '';
    localStorage.getItem('appId') && (appId = localStorage.getItem('appId') as string)
    if (!appId) {
      console.error('appId不存在')
      return
    }
    const res = await fetchPageList(appId)
    console.log('res==', res.length)
    if (res && res.length) {
      pageList.value = res;
    }
  })
</script>

<style scoped lang="less">
  .flex {
    flex: 1;
  }
  .primary {
    color: #0e86f7;
  }
</style>
