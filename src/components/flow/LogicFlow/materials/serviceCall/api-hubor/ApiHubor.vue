<script lang="ts" setup>
import OperateHttp from './OperateHttp/index.vue'

const importTreeInfo = {
  apiOperationVo: {
    id: '1823991584517058561',
    operationUrl: '/say-hello',
    operationType: 2
  },
  paths: [],
  params: [],
  headers: [],
  cookies: [],
  body: {
    bodyType: '',
    lstFormData: [],
    lstXWwwFormUrlencoded: []
  },
  authInfo: {
    type: 'No Auth',
    setting: {}
  }
}
</script>

<template>
  <div class="api-hubor">
    <OperateHttp :importTreeInfo="importTreeInfo" />
  </div>
</template>

<style lang="less" scoped>
.api-hubor {
  width: 100%;
}
</style>
