<!--
 * @Author: ykx
 * @Date: 2023-06-13 16:46:23
 * @LastEditTime: 2023-06-14 16:25:55
 * @LastEditors: your name
 * @Description: apiHub选择（支持 结构体选择 & 发布组选择（目前仅支持单个组））
 * @FilePath: \easycube-apps\packages\autoFlowPages\src\autoFlowList\components\LogDetail.vue
-->
<script setup lang="ts">
// 无回显选中，有翻页的情况
import { FolderOpenOutlined, FolderOutlined } from '@ant-design/icons-vue'
import { message, type TreeProps } from 'ant-design-vue'
import { computed, inject, ref, watch } from 'vue'
import { FullModal } from '../../resource/components'
import { analysisRes } from '../../../common/resolveDs'
import { microInfoRecord, getModelDetails, getApiGroupTree } from '../../../apis/apihub'
import { useTable } from '../../resource/hooks'
import { getParentKey } from '../../../common/flowTree'

const props = withDefaults(
  defineProps<{
    value?: any
    visible: boolean
    title?: string
    releaseLoading?: boolean
    mode?: 'api' | 'group' // api-类型结构体 group-组选择
  }>(),
  {
    title: 'ApiHub模型选择',
    mode: 'api',
    value: () => ({}),
    releaseLoading: false,
    visible: false
  }
)
const isFirstFetch = ref(true)
const appCode = inject('appCode', ref(''))
const emits = defineEmits(['update:value', 'update:visible'])
const serveId = ref('') // 当前选中的服务
const searchParams = ref({
  appName: ''
})
const apiSearchParams = ref({
  appName: ''
})
// 接口树
const expandedKeys = ref<(string | number)[]>([])
const searchValue = ref<string>('')
const autoExpandParent = ref<boolean>(true)
const treeData = ref<TreeProps['treeData']>([])
// 过滤组结构
const filterGroup = (tree: any[]) => {
  const generatorItem = (data: any[]) => {
    const result: any[] = []
    data.forEach((item: any) => {
      if (item.type === 1) {
        const tempItem = { ...item }
        if (item.children && item.children.length > 0) {
          tempItem.children = generatorItem(item.children)
        }
        result.push(tempItem)
      }
    })
    return result
  }
  return generatorItem(tree)
}
// 平铺树结构
const dataList = computed(() => {
  const result: any[] = []
  const generateList = (data: TreeProps['treeData'] = []) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const key = node.id
      result.push({ key, title: node.name })
      if (node.children) {
        generateList(node.children)
      }
    }
  }
  generateList(treeData.value)
  return result
})
// 连接列表
const options = computed(() => {
  return {
    afterFetch: (data: any[]) => {
      //获取发布后的服务
      return data.filter((item: any) => {
        return item.state === 1
      })
    },
    extraParams: {
      ...searchParams.value,
      appCode: appCode.value
    },
    // 完成后的回调
    fetchCallback: (data: any) => {
      // 默认请求第一个
      if (data.length > 0 && isFirstFetch.value) {
        serveId.value = data[0]?.serviceManageId
        handleApiList()
      }
    }
  }
})
// 服务列表

const {
  dataSource: connList,
  loading: connListloading,
  pagination,
  getList: handleGetConnList,
  handleTableChange
} = useTable(microInfoRecord, options)

// 获取接口树
const handleApiList = async () => {
  const res = await getApiGroupTree({
    serviceInfoId: serveId.value!,
    groupType: '2'
  })
  if (res.success) {
    // 判断如果是目录选择，则保留第一层
    treeData.value = props.mode === 'api' ? res?.data?.data?.children : filterGroup([res?.data?.data])
  }
}
const handleChange = (record: any) => {
  serveId.value = record.serviceManageId
  handleApiList()
}
// 接口选择(这里添加判断,如果接口是调用的ref则返回引用,否则返回处理后的数据)
const onTreeSelect = async (keys: string[], e: any) => {
  const apiId = keys[0]
  if (props.mode === 'api') {
    if (e.node.type === 1) {
      // 选择的目录
      return
    }

    const [err, res] = await to(getModelDetails(apiId))
    if (err) return
    if (!res?.data?.data?.responseVos) {
      message.warning('此接口无响应体，请选择其他接口')
      return
    }
    const { responseVos } = res.data.data
    const sucRes = responseVos.find((item: any) => item.responseCode === '200') || {}
    // 这里对响应结构进行判断（如果第一层是ref,则存成structureObject， 否则存入普通类型）
    let tempDataType: Record<string, any> = {}
    if (sucRes?.responseDetailsTreeVo?.refModelId) {
      tempDataType = {
        type: 'structureObject',
        reference: {
          id: sucRes?.responseDetailsTreeVo?.refModelId,
          name: sucRes?.responseDetailsTreeVo?.refModelKey
        } // 存入引用
      }
    } else {
      // 这里进行解构解析，转换为后端要的格式(注：这里仅对单层children进行解析)
      const responseStructureList = analysisRes([sucRes?.responseDetailsTreeVo])
      tempDataType = responseStructureList?.[0]
    }
    emits('update:value', tempDataType)
    emits('update:visible', false)
  } else if (props.mode === 'group') {
    // 返回两个值
    emits('update:value', {
      serviceInfoId: serveId.value,
      apiGroupId: e.node.id
    })
  }
}
// 分页变化
const onConnPageChange = (page: number, pageSize: number) => {
  handleTableChange({ pageSize, currentPage: page })
}
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys
  autoExpandParent.value = false
}
watch(
  () => props.visible,
  (val: boolean) => {
    if (val) {
      handleGetConnList()
    }
  }
)
// watch(
//   () => props.value,
//   (val: any) => {
//     if (val) {
//       selectInfo.value = cloneDeep(val);
//     }
//   },
// );
// 监听树搜索
watch(searchValue, (value) => {
  const expanded = dataList.value
    .map((item: TreeProps['treeData'][number]) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData.value)
      }
      return null
    })
    .filter((item, i, self) => item && self.indexOf(item) === i)
  expandedKeys.value = expanded
  searchValue.value = value
  autoExpandParent.value = true
})
</script>

<template>
  <div class="api-select-wrapper">
    <FullModal
      :visible="visible"
      :width="800"
      :title="title"
      allow-full-screen
      closable
      height="500px"
      class="api-select-modal"
      :footer="false"
      @update:visible="(val: boolean) => emits('update:visible', val)"
    >
      <div class="api-connect-body no-valid-style">
        <div class="left-connect-list">
          <AInputSearch
            v-model:value="searchParams.appName"
            class="search mb-4"
            placeholder="搜索服务"
            allow-clear
            @on-search="handleGetConnList"
            @change="handleGetConnList"
          />
          <ASpin :spinning="connListloading">
            <ul v-if="connList && connList.length > 0">
              <li
                v-for="item in connList"
                :key="item.serviceManageId"
                :class="['conn-item', item.serviceManageId === serveId && 'selected']"
                @click="handleChange(item)"
              >
                <p class="overflow-hidden-one" style="font-weight: 600" :title="item.serviceName">
                  {{ item.serviceName }}
                </p>
                <!-- 空串不能?. -->
                <p class="desc">{{ item.description || '--' }}</p>
                <!-- <p class="time">
                  <clock-circle-outlined />
                  {{ item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
                </p> -->
              </li>
            </ul>
            <SEmpty v-else description="暂无已发布的服务" />
          </ASpin>
          <APagination
            class="mini-end"
            size="small"
            :total="pagination.total"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            @change="onConnPageChange"
          />
        </div>
        <ADivider type="vertical" style="height: auto; bottom: 0; margin: 0 10px" />
        <!-- 换成tree -->
        <div class="info-wrapper">
          <ASpin :spinning="releaseLoading" tip="发布中...">
            <div class="search-wrapper">
              <AInputSearch
                v-model:value="searchValue"
                style="margin-bottom: 8px"
                :placeholder="mode === 'group' ? '搜索组名' : '搜索接口名'"
              />
            </div>
            <ADirectoryTree
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :tree-data="treeData"
              show-icon
              :height="430"
              :field-names="{ title: 'name', key: 'id' }"
              @expand="onExpand"
              @select="onTreeSelect"
            >
              <template #icon="{ expanded, isLeaf, name }">
                <template v-if="name != '接口' && name != '数据模型'">
                  <template v-if="expanded && !isLeaf">
                    <span :class="'text-[var(--ant-colorPrimary)]'">
                      <FolderOpenOutlined />
                    </span>
                  </template>
                  <template v-else-if="!isLeaf && !expanded">
                    <span :class="'text-[var(--ant-colorPrimary)]'">
                      <FolderOutlined />
                    </span>
                  </template>
                </template>
              </template>
              <template #title="{ name, type, operationVo, modelVo }">
                <template v-if="true">
                  <span v-if="name.indexOf(searchValue) > -1">
                    {{ name.substring(0, name.indexOf(searchValue)) }}
                    <span style="color: #f50">{{ searchValue }}</span>
                    {{ name.substring(name.indexOf(searchValue) + searchValue.length) }}
                  </span>
                  <span v-else>{{ name }}</span>
                </template>

                <span class="m-l-16px text-12px color-[var(--ant-colorTextQuaternary)]">
                  {{ type === 2 ? operationVo.version : modelVo?.version }}
                </span>
              </template>
            </ADirectoryTree>
          </ASpin>
        </div>
      </div>
    </FullModal>
  </div>
</template>

<style lang="less">
.api-select-modal .ant-modal-body {
  padding-bottom: 0;
}
.mini-end.ant-pagination {
  flex: 0 0 30px;
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style scoped lang="less">
.api-select-wrapper {
  .trigger {
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    .not-value {
      color: #999;
    }
  }
  .selected-api {
    position: relative;
    .select-left {
      display: flex;
      .api-icon {
        flex: 0 0 50px;
        height: 50px;
        background: #dee5ec;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          color: #495963;
        }
      }
      .name-right {
        flex: 1;
        margin-left: 10px;
        .title {
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        }
        .desc {
          font-size: 12px;
          color: #999;
        }
      }
    }
    .change-trigger {
      position: absolute;
      right: 20px;
      transform: translateY(-50%);
      top: 50%;
    }
    &:hover {
      :deep(.change-trigger.anticon) {
        color: #597fb1 !important;
      }
    }
  }
}
.api-connect-body {
  display: flex;
  height: 100%;
  .left-connect-list {
    flex: 0 0 240px;
    height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    :deep(.search-input) {
      flex: 0 0 30px;
      margin-bottom: 10px;
    }
    :deep(.ant-spin-nested-loading) {
      flex: 1;
      overflow-y: auto;
      .ant-spin-container {
        height: 100%;
      }
    }

    li {
      padding: 5px 15px;
      padding-right: 20px;
      transition: all 0.2s;
      border-radius: 6px;
      cursor: pointer;
      position: relative;

      &:hover,
      &.selected {
        background-color: rgb(241, 242, 243);
      }
      .time,
      .desc {
        font-size: 12px;
        color: #666;
      }
    }
  }
  .info-wrapper {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    .search-wrapper {
      display: flex;
      justify-content: flex-end;
      flex: 0 0 30px;
      margin-bottom: 10px;
    }
    :deep(.ant-spin-nested-loading) {
      flex: 1;
      overflow-y: auto;
      .ant-spin-container {
        height: 100%;
      }
    }
  }
}

.api-item {
  display: flex;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 15px;
  border-radius: 5px;
  .api-icon {
    width: 50px;
    height: 50px;
    background: #dee5ec;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      color: #495963;
    }
  }
  &:hover,
  &.selected {
    background-color: #f1f2f387;
  }
  .name-right {
    margin-left: 10px;
    .title {
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }
    .desc {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
