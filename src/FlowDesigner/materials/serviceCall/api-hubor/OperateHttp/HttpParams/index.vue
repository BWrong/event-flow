<script lang="ts" setup>
/* eslint-disable */
import { ref, inject, onMounted, nextTick, type Ref } from 'vue'
import AddBaseParams from './AddBaseParams.vue'
import BodyReq from './BodyReq.vue'
// import { type RequestObjType } from '../../types.d'
import { Auth_Type } from '../../dict'
import { Tabs, TabPane, Select, Divider, Input, Textarea } from 'ant-design-vue'

const activeKey = ref('Body')
const RequestObj = inject('RequestObj')! as Ref;

const authTypeChange = (val: any) => {
  if (val === 'api_key') {
    RequestObj.value.authInfo.setting = {
      position: 'header',
      key: '',
      value: ''
    }
  } else if (val === 'bearer_token') {
    RequestObj.value.authInfo.setting = {
      token: ''
    }
  }
  // no_auth
  else {
    RequestObj.value.authInfo.setting = {}
  }
}
onMounted(() => {
  nextTick(() => {
    if (
      (RequestObj.value.params && RequestObj.value.params.length > 0) ||
      (RequestObj.value.pathParam && RequestObj.value.pathParam.length > 0)
    ) {
      activeKey.value = 'Params'
    } else {
      activeKey.value = 'Body'
    }
  })
})
</script>

<template>
  <Tabs v-model:activeKey="activeKey" style="height: 100%">
    <TabPane key="Params" tab="Params">
      <AddBaseParams v-model:value="RequestObj.params" :show-button="true" title="Query 参数"></AddBaseParams>

      <template v-if="RequestObj.pathParam && RequestObj.pathParam.length > 0">
        <h3>Path 参数</h3>
        <AddBaseParams v-model:value="RequestObj.pathParam" :show-button="false" title="Path 参数"></AddBaseParams>
      </template>
    </TabPane>
    <TabPane key="Body" tab="Body">
      <BodyReq />
    </TabPane>
    <TabPane key="Headers" tab="Headers">
      <AddBaseParams v-model:value="RequestObj.headers" :show-button="true" title="Headers"></AddBaseParams>
    </TabPane>
    <TabPane key="Cookies" tab="Cookies">
      <AddBaseParams v-model:value="RequestObj.cookies" :show-button="true" title="Cookies"></AddBaseParams>
    </TabPane>
    <TabPane key="Auth" tab="Auth">
      <div class="auto-title">类型</div>
      <Select
        v-model:value="RequestObj.authInfo.type"
        style="width: 300px"
        :options="Auth_Type"
        @change="authTypeChange"
      ></Select>
      <Divider style="margin: 12px 0" />

      <template v-if="RequestObj.authInfo.type === 'api_key'">
        <div class="auto-title">添加位置</div>
        <Select
          v-model:value="RequestObj.authInfo.setting.position"
          style="width: 300px"
          :options="[
            { label: 'Header', value: 'header' },
            { label: 'Query Params', value: 'query' }
          ]"
        ></Select>
        <div style="margin-top: 10px" class="auto-title">Key</div>
        <Input v-model:value="RequestObj.authInfo.setting.key" style="width: 300px" />

        <div style="margin-top: 10px" class="auto-title">Value</div>
        <Input v-model:value="RequestObj.authInfo.setting.value" style="width: 300px" />
      </template>
      <template v-else-if="RequestObj.authInfo.type === 'bearer_token'">
        <div class="auto-title">Token</div>
        <Textarea v-model:value="RequestObj.authInfo.setting.token" style="width: 300px" />
      </template>
    </TabPane>
  </Tabs>
</template>

<style scoped lang="less">
.auto-title {
  margin-bottom: 2px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}
</style>
