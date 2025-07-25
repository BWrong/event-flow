<script lang="ts" setup>
/* eslint-disable */
import { ref, computed } from 'vue'
// import AddBaseParams from '../../components/AddBaseParams.vue';
// import MonacoEditor from '@/components/monacoEditor/index.vue';
import EmptyRes from './EmptyResponse.vue'
import { CodePreview } from '../../code-mirror/index'
import { TabPane, Tabs } from 'ant-design-vue'

const props = withDefaults(
  defineProps<{
    responseInfo: any
  }>(),
  {}
)

// const bodyType = ref('json');
const activeKey = ref('Body')

const bodyInfo = computed(() => {
  if (props.responseInfo.resBody) {
    return JSON.stringify(props.responseInfo.resBody, null, 2)
  } else if (!props.responseInfo.data || !props.responseInfo.success) {
    return JSON.stringify(props.responseInfo, null, 2)
  }
})
</script>

<template>
  <div class="res-title">返回响应</div>
  <EmptyRes v-if="!props.responseInfo" />
  <Tabs v-else v-model:activeKey="activeKey" style="height: calc(100% - 36px)">
    <TabPane v-if="bodyInfo" key="Body" tab="Body">
      <!-- <MonacoEditor
        v-if="bodyInfo"
        :value="bodyInfo"
        :data="bodyType"
        :minHeight="'100%'"
      ></MonacoEditor> -->

      <CodePreview
        v-if="bodyInfo"
        v-model:code="bodyInfo"
        style="height: 300px"
        :code-mirror-config="{
          lineNumbers: true,
          theme: 'default'
        }"
      />
    </TabPane>
    <!-- <ATabPane
      v-if="responseInfo.resHeaders"
      key="Headers"
      tab="Headers"
    >
      <div style="height: 100%; overflow: auto">
        <MonacoEditor
          :value="JSON.stringify(responseInfo.resHeaders, null, 2)"
          :data="bodyType"
          :minHeight="'100%'"
        ></MonacoEditor>
      </div>
    </ATabPane> -->
    <!-- <ATabPane
      key="Cookies"
      tab="Cookies"
    >
      <AddBaseParams
        v-model:value="result.cookies"
        :show-button="true"
        title="Cookies"
      ></AddBaseParams>
    </ATabPane>
    <ATabPane
      key="console"
      tab="控制台"
    >
      <ATextarea v-model:value="result.console" />
    </ATabPane> -->
  </Tabs>
</template>

<style scoped lang="less">
.res-title {
  font-size: 14px;
  line-height: 36px;
  font-weight: 600;
}
</style>
