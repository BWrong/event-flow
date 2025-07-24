<script lang="ts" setup>
/* eslint-disable */
import AddBaseParams from './AddBaseParams.vue'
import { inject, type Ref } from 'vue'
// import { type RequestObjType } from '../../types.d'
import { CodePreview } from '../../code-mirror'
import { Tabs, TabPane } from 'ant-design-vue'

const RequestObj = inject('RequestObj')! as Ref
</script>

<template>
  <Tabs v-model:activeKey="RequestObj.bodyDto.bodyType" type="card" style="height: 100%">
    <TabPane key="none" tab="none">
      <div class="no-body">该请求没有 Body 体</div>
    </TabPane>
    <TabPane key="multipart/form-data" tab="form-data">
      <AddBaseParams
        v-model:value="RequestObj.bodyDto.body['multipart/form-data']"
        :show-button="true"
        title="参数"
      ></AddBaseParams>
    </TabPane>
    <TabPane key="application/x-www-form-urlencoded" tab="x-www-form-urlencoded">
      <AddBaseParams
        v-model:value="RequestObj.bodyDto.body['application/x-www-form-urlencoded']"
        :show-button="true"
        title="参数"
      ></AddBaseParams>
    </TabPane>
    <TabPane key="application/json" tab="json" style="padding-bottom: 10px">
      <CodePreview
        v-model:code="RequestObj.bodyDto.body['application/json']"
        style="height: 250px"
        :code-mirror-config="{
          lineNumbers: true,
          readOnly: false,
          theme: 'default'
        }"
      />
    </TabPane>
    <!-- <ATabPane
      key="binary"
      tab="binary"
    >
      <AUpload
        v-model:file-list="RequestObj.bodyDto.body['binary']"
        :max-count="1"
        :before-upload="beforeUpload"
        class="upload-file"
      >
        <AButton size="large">
          <UploadOutlined></UploadOutlined>
          Upload
        </AButton>
      </AUpload>
    </ATabPane> -->
  </Tabs>
</template>

<style scoped lang="less">
.no-body {
  padding: 30px;
  text-align: center;
  border: 1px solid var(--ant-colorTextQuaternary);
  color: var(--ant-colorTextQuaternary);
}
.upload-file {
  margin-top: 20px;
}
</style>
