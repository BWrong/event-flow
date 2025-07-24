<template>
  <!-- 含有子项，这里仅处理结构体 -->
  <a-sub-menu
    :key="menuInfo.key"
    :title="menuInfo.name"
    v-if="menuInfo.children && menuInfo.children.length > 0"
  >
    <template
      v-for="item in menuInfo.children"
      :key="item.name"
    >
      <sider-item :menuInfo="item"></sider-item>
    </template>
  </a-sub-menu>
  <a-menu-item
    :title="menuInfo.name"
    :key="menuInfo.key"
    @mouseenter="handleMouseenter(menuInfo)"
    v-else
  >
    <a-flex
      justify="space-between"
      gap="small"
      align="center"
    >
      <span class="overflow-hidden-one">{{ menuInfo.name }}</span>
      <template v-if="lazyload(menuInfo)">
        <RightOutlined class="text-[#666] relative text-[12px] top-[1px]" />
      </template>
    </a-flex>
  </a-menu-item>
</template>
<script lang="ts" setup>
  import { inject, ref } from 'vue';
  import { RightOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { guid } from '../../../common/helper';
  // eslint-disable-next-line no-undef
  defineOptions({
    name: 'SubMenu',
  });
 
  const props = withDefaults(
    defineProps<{
      menuInfo: any;
    }>(),
    {},
  );
  const lazyload = (menuInfo: any) => {
    return menuInfo.type === 'array';
  };
  // 判断不同类型递归
  const handleMouseenter = (item: any) => {
    if (!lazyload(item)) {
      return;
    }
    // TODO:支持object,和apihub
    const loopChildren = [
      { name: 'string', type: 'string', key: 'type_' + guid() },
      { name: 'integer', type: 'integer', key: 'type_' + guid() },
      { name: 'number', type: 'number', key: 'type_' + guid() },
      { name: 'date', type: 'date', key: 'type_' + guid() },
      { name: 'boolean', type: 'boolean', key: 'type_' + guid() },
      { name: 'array', type: 'array', key: 'type_' + guid() },
      // { name: 'object', type: 'object', key: 'type_' + guid() },
      // { name: 'apihub', type: 'apihub', key: 'type_' + guid() },
    ];
    item.children = loopChildren;
  };
</script>
