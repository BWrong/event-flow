<template>
  <!-- 错误信息面板 -->
  <div class="flow-error-panel" :class="{ show: visible }">
    <div class="flow-error-panel-body">
      <a-table :dataSource="errorTableData" :columns="errorTableColumns" size="small" bordered :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <a-tag color="error" v-if="record.type === 'error'">错误</a-tag>
            <a-tag color="warning" v-else>警告</a-tag>
          </template>
          <template v-if="column.dataIndex === 'position'">
            <a-tooltip title="点击定位到节点">
              <div style="color: #1777FF;cursor: pointer;" @click="handlePositionError(record.position)">
                <AimOutlined /> {{ record.position.name }} ({{ record.position.id }})
              </div>
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </div>
    <div class="flow-error-panel-footer" @click="closeErrPanel">
      <UpOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AimOutlined, UpOutlined } from '@ant-design/icons-vue';
import { Table as ATable } from 'ant-design-vue';

const props = defineProps<{
  list: any[]
}>()


const visible = defineModel<boolean>('visible', {
  default: false
})

const errorTableColumns = [
  {
    title: '位置',
    dataIndex: 'position',
    width: '400px'
  },
  {
    title: '错误类型',
    dataIndex: 'type',
    width: '100px',
    align: 'center'
  },
  {
    title: '详细信息',
    dataIndex: 'messages',
  }
]
function closeErrPanel() {
  visible.value = false
}
function handlePositionError(position: {
  name: string,
  id: string
}) {
  const nodeElement = document.getElementById(`${position.id}`)
  // 滚动到视图内
  nodeElement?.scrollIntoView({
    behavior: 'smooth', // 平滑滚动 (可选)
    block: 'center'      // 垂直方向对齐方式 ('start', 'center', 'end', or 'nearest')
  });
  nodeElement?.classList.add('node-flash');
  setTimeout(() => {
    nodeElement?.classList.remove('node-flash');
  }, 1500);
}
</script>

<style scoped lang="less">
.flow-error-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  max-height: 0;
  background: #fff;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  padding-bottom: 0;
  visibility: hidden;

  &.show {
    max-height: 300px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding-bottom: 20px;
    visibility: visible;
  }

  .flow-error-panel-body {
    padding: 5px;
    max-height: 270px;
    overflow-y: auto;
  }

  .flow-error-panel-footer {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 80px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #F2F2F3;
    border-radius: 4px 4px 0 0;
    transform: translateX(-50%);
    cursor: pointer;
  }
}
</style>
