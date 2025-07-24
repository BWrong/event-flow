<!--
 * @Author: ykx
 * @Date: 2023-05-01 10:49:24
 * @LastEditTime: 2023-06-22 18:15:37
 * @LastEditors: your name
 * @Description: 全局弹框
 * @FilePath: \easycube-apps\packages\components\src\globalComponents\FullModal.vue
-->
<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import { Modal, Button } from 'ant-design-vue'
  import IconFont from '../iconFont/index.vue'
  // eslint-disable-next-line no-undef
  defineOptions({
    name: 'SFullModal',
  });
  const props = withDefaults(
    defineProps<{
      visible: boolean;
      height?: number | string | 'auto';
      needConfirmClose?: boolean; // 追加是否需要二次确认关闭
      headerBorder?: boolean;
      footerBorder?: boolean;
      maxHeight?: string;
      minHeight?: string;
      overflowY?: string;
      width?: number | string;
      title?: string;
      tips?: string;
      allowFullScreen?: boolean;
      cancelText?: string;
      okText?: string;
      okProps?: any;
      closable?: boolean;
      footer?: boolean;
      confirmLoading?: boolean;
      showCancelBtn?: boolean;
      closeWhenOk?: boolean; // ok 事件触发时立刻关闭弹框
      maskClosable?: boolean;
      outFullScreen?: boolean; // 可能外部需要这个变量
    }>(),
    {
      title: '弹框标题',
      needConfirmClose: false,
      headerBorder: false,
      footerBorder: false,
      overflowY: 'auto',
      height: 'auto',
      maxHeight: '70vh',
      minHeight: '100px',
      width: 450,
      tips: '',
      cancelText: '取消',
      okText: '确定',
      footer: true,
      allowFullScreen: false,
      confirmLoading: false,
      closable: true,
      closeWhenOk: false,
      showCancelBtn: true,
      maskClosable: false,
      outFullScreen: false,
    },
  );

  const emits = defineEmits<{
    (e: 'update:visible', value: typeof props.visible): void;
    (e: 'update:outFullScreen', value: boolean): void;
    (e: 'ok'): void;
    (e: 'cancel'): void;
    (e: 'create'): void;
  }>();
  const toggleFullScreen = () => {
    isFullScreen.value = !isFullScreen.value;
    emits('update:outFullScreen', isFullScreen.value);
  };
  watch(
    () => props.visible,
    () => {
      if (!props.visible) {
        isFullScreen.value = false;
        emits('update:outFullScreen', false);
      }
    },
  );

  const isFullScreen = ref(false);
  const handleClose = () => {
    // 这里兼容两种都传入的操作
    if (props.needConfirmClose) {
      emits('cancel'); // 你可以自定定义关闭方法
    } else {
      emits('cancel');
      emits('update:visible', false);
    }
  };
  watch(
    () => props.outFullScreen,
    (val: boolean) => {
      isFullScreen.value = val;
    },
    {
      immediate: true,
    },
  );
</script>
<!-- overflowY高度一样也出现了滚动条？？ -->
<template>
  <Modal
    :wrap-class-name="`full-base-modal ${!!footer ? 'has-footer' : ''} ${
      allowFullScreen ? 'allow-full-screen' : ''
    }  ${footerBorder ? 'footer-border' : ''} ${
      headerBorder ? 'header-border' : ''
    } ${isFullScreen ? 'modal-fullscreen' : ''}`"
    :style="isFullScreen ? { top: 0, paddingBottom: 0 } : { top: '100px' }"
    :body-style="{
      minHeight,
      maxHeight: `${isFullScreen ? 'calc(100vh - 100px)' : maxHeight}`,
      height: `${isFullScreen ? 'auto' : typeof height === 'number' ? height + 'px' : height}`,
      overflowY: isFullScreen ? 'auto' : overflowY || 'auto',
    }"
    :open="props.visible"
    :keyboard="false"
    destroy-on-close
    :closable="closable"
    :width="width"
    :mask-closable="maskClosable"
    v-bind="!footer ? { footer: null, ...$attrs } : $attrs"
    @update:visible="emits('update:visible', !props.visible)"
  >
    <slot />
    <!-- 要添加stop -->
    <template #closeIcon>
      <icon-font
        v-if="allowFullScreen"
        :title="isFullScreen ? '退出全屏' : '全屏显示'"
        class="iconfont"
        size="22px"
        :type="isFullScreen ? 'icon-quxiaoquanping' : 'icon-quanping1'"
        @click.stop="toggleFullScreen"
      />
      <icon-font
        type="icon-close"
        size="22px"
        @click.stop="handleClose"
      />
    </template>

    <template
      #title
      v-if="title"
    >
      <slot name="title">
        <span style="position: relative; left: -5px">
          {{ title }}
        </span>
        <i
          v-if="tips"
          class="tips"
        >
          {{ tips }}
        </i>
      </slot>
    </template>
    <!-- 这里没提供footer插槽了，如需自定义底部，设置footer为false -->

    <template #footer>
      <div
        v-if="footer"
        :class="['footer-wrapper', $slots.footerLeft && 'has-left']"
      >
        <slot name="footer-left">
        </slot>
        <span>
          <!-- 支持右侧自定义按钮集合 -->
          <slot name="footer-right">
            <Button
              v-if="showCancelBtn"
              @click="handleClose"
            >
              {{ cancelText }}
            </Button>

            <Button
              :loading="confirmLoading"
              v-bind="okProps ? okProps : { type: 'primary' }"
              @click="
                () => {
                  emits('ok');
                  closeWhenOk && emits('update:visible', false);
                }
              "
            >
              {{ okText }}
            </Button>
          </slot>
        </span>
      </div>
    </template>
  </Modal>
</template>

<style lang="less">
  .full-base-modal {
    .ant-modal-header {
      .ant-modal-title {
        font-weight: bold;
        position: relative;
        width: auto;
        // display: inline-block;
        .tips {
          margin-left: 12px;
          position: relative;
          top: -1px;
          font-weight: normal;
          font-style: normal;
          font-size: 12px;
          color: #838892;
        }
      }
    }
    .ant-modal.has-footer .ant-modal-content {
      padding-bottom: 0;
    }
    .ant-modal-close {
      width: auto;
      &:hover {
        background-color: #fff;
      }
    }
    .ant-modal-close-x {
      text-align: right;
      // width: 200px;
      width: auto;

      .iconfont {
        padding: 3px;
        border-radius: 3px;
        font-size: 18px;
        color: #666;
        transition: all 0.3s ease;
        margin-right: 10px;
        &:hover {
          background-color: rgba(240, 241, 242);
          color: #333;
        }
      }
    }
    .ant-modal-body {
      // padding: 16px 16px 10px 16px;
      position: relative;
    }
    .ant-modal-footer {
      border-top: none;
      // padding: 10px 0;
      // padding-bottom:20px;
      .footer-wrapper {
        &.has-left {
          justify-content: space-between;
        }
        display: flex;
        width: 100%;
        justify-content: flex-end;
        align-items: flex-end;

        > span {
          &:first-of-type {
            width: auto;
          }
          &:last-of-type {
            flex: 1;
          }
          text-align: right;
          // .ant-btn {
          //   border: 1px solid @main-color;
          //   color: @main-color;
          //   &.ant-btn-primary {
          //     color: #fff;
          //     background-color: @main-color;
          //   }
          // }
        }
      }
    }
  }
  .allow-full-screen .ant-modal-header {
    padding-right: 80px;
  }
  .modal-fullscreen {
    .ant-modal {
      top: 0;
      width: calc(100vw - 32px) !important;
      height: calc(100vh - 32px) !important;
      margin-top: 16px;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .ant-modal-body {
      flex: 1;
    }
  }
</style>
