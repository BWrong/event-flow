<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue'
import { type RequestObjType } from '../types.d'
import HttpParams from './HttpParams/index.vue'
// import HttpResponse from './HttpResponse/index.vue'

const props = withDefaults(
  defineProps<{
    requestInfo: RequestObjType
  }>(),
  {}
)

// 请求对象
const RequestObj = ref<RequestObjType>({
  // apiId: '',
  url: '',
  method: 'GET',
  bodyDto: {
    body: {},
    bodyType: 'none'
  },
  headers: [],
  cookies: [],
  params: [],
  pathParam: [],
  authInfo: {
    type: 'No Auth', // 授权类型no_auth、api_key...
    setting: {}
  }
})
const loading = ref(false)
const Request_Method = [
  { value: 1, label: 'POST' },
  { value: 2, label: 'GET' },
  { value: 3, label: 'PUT' },
  { value: 4, label: 'DELETE' },
  { value: 5, label: 'OPTIONS' },
  { value: 6, label: 'HEAD' },
  { value: 7, label: 'PATCH' },
  { value: 8, label: 'TRACE' },
];
provide('RequestObj', RequestObj)

const onUrlChange = () => {
  let url: any = RequestObj.value.url; // paramsObj.value.apiOperationVo.operationUrl;
  const reg = /{([a-zA-Z0-9]+)}/g;
  if (url) {
    const varArr = [...url.matchAll(reg)].map((match) => match[1]);
    const arr = varArr.map((item: any) => {
      return {
        method: 'value',
        name: item,
        value: '',
      };
    });
    RequestObj.value.pathParam = arr;
  }
};
onMounted(() => {
  RequestObj.value = props.requestInfo;
})
</script>

<template>
  <div class="http-from">
    <div class="http-url">
      <AInputGroup
        compact
        style="display: flex;"
      >
        <ASelect
          v-model:value="RequestObj.method"
          :options="Request_Method"
        />
        <AInput
          v-model:value="RequestObj.url"
          class=""
          @change="onUrlChange"
        />
      </AInputGroup>
    </div>
    <section class="http-params">
      <HttpParams />
    </section>
    <ASpin v-if="loading" class="spin-loading" :spinning="loading" />
  </div>
</template>

<style scoped lang="less">
:deep(.ant-tabs-content) {
  height: 98%;
}
.http-from {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: #fff;
  position: relative;
}

.http-res {
  border-top: 1px solid var(--ant-colorBorder);
  min-height: 300px;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
}
.http-params {
  border-top: 1px solid var(--ant-colorBorder);
  padding: 0 1rem;
  // flex: 1;
  min-height: 410px;
}

.http-url {
  // position: sticky;
  position: relative;
  top: 0;
  z-index: 9;
  display: flex;
  padding: 8px 0;
  margin-bottom: 3px;
  // flex: 1;
}
.url-content {
  display: flex;
  align-items: center;
  height: 32px;
  background-color: var(--ant-colorBgLayout);
  border-color: var(--ant-colorBorder);
  border-radius: var(--ant-borderRadius);
  flex: 1;
}
.url-col-method {
  float: left;
  padding: 0 8px 0 12px;
  line-height: 32px;
  font-size: 12px;
  color: var(--ant-colorSuccess);
  display: inline-flex !important;
  align-items: center;
  height: 24px;
  margin-right: 4px;
  font-weight: 700;
}
.url-col-path {
  float: left;
  height: 32px;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  flex: 1 1;
  align-items: center;

  &:hover {
    color: var(--ant-colorLinkHover);
  }
}
.send-btn {
  min-width: 80px;
  margin-left: 10px;
}
.spin-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ant-colorFillSecondary);
}
</style>
