/*
 * @Author: ykx
 * @Date: 2023-04-29 15:44:47
 * @LastEditTime: 2023-06-15 11:37:45
 * @LastEditors: your name
 * @Description: useTable公共hook(这里option传入ref),支持翻页，搜索勾选;  useLoadMore(加载更多)
 * @FilePath: \easycube-apps\packages\hooks\src\useLoad.ts
 */
import { type Ref, type ComputedRef, ref, reactive, computed, unref } from 'vue';
import { uniqBy } from 'lodash-es';
type OptionsType = {
  extraParams?: Record<string, any>;
  rowKey?: string;
  beforeFetch?: () => void;
  afterFetch?: (data: any, res?: any) => any;
  fetchCallback?: (res: any) => any;
  handleMultiRes?: (res: any) => any;
  fullRowsAjax?: any;
  [props: string]: any;
};
const defaultOptions = {
  extraParams: {},
  needFullSelect: false,
  hasPagination: true,
};
// 默认最大50
export const defaultPageSizeOptions = ['10', '20', '50'];
// 表格通用
export const useTable = (
  ajaxFn: Function | Ref<Function>,
  extraOptions: Ref<OptionsType> | ComputedRef<OptionsType>,
) => {
  const loading = ref(false); // 通用请求loading
  const selectAllLoading = ref(false); // 全选请求loading
  const dataSource = ref<any[]>([]); // 选择请求返回数据
  // 整合默认配置和传入配置
  const options = computed(() => {
    return { ...defaultOptions, ...extraOptions.value };
  });
  // 唯一key
  const rowKey = computed(() => {
    return options.value.rowKey || 'id';
  });
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: defaultPageSizeOptions,
    showTotal: (total: number) => `共${total}条`,
  });
  // 获取应用下的用户
  const state = reactive<{
    curPageKeys: string[];
    selectedRowKeys: string[]; // 已选中keys -当前页
    selectedRows: Record<string, any>[]; // 已选中rows -当前页
    totalRows: any[]; // 全量条目
    hasSelectedRows: any[]; // 已选择的条目
  }>({
    curPageKeys: [],
    selectedRowKeys: [],
    selectedRows: [],
    totalRows: [],
    hasSelectedRows: [],
  });
  // 全选条目keys
  const totalKeys = computed(() => {
    return state.totalRows.map((item: any) => item[rowKey.value]) || [];
  });
  // 全选中选中条目(废弃,写的意义是什么？？)
  // const totalSelectedRows = computed(() => {
  //   // 获取全选中已选择的项
  //   return (
  //     state.hasSelectedRows.filter((item: any) => {
  //       return totalKeys.value.includes(item[rowKey.value]);
  //     }) || []
  //   );
  // });
  // 全选的状态项
  const totalCheckStatus = computed(() => {
    return {
      checkAll:
        state.hasSelectedRows.length > 0 &&
        state.hasSelectedRows.length === Number(state.totalRows.length),
      indeterminate:
        state.hasSelectedRows.length > 0 && state.hasSelectedRows.length < state.totalRows.length,
    };
  });
  // 处理回显操作
  const handleReChecked = () => {
    // 兼容外部处理
    if (options.value && options.value.handleMultiRes) {
      state.curPageKeys = options.value.handleMultiRes(dataSource.value);
    } else {
      state.curPageKeys = dataSource.value.map((item: any) => item[rowKey.value]);
    }
    // 兼容全选的情况
    state.selectedRows =
      state.hasSelectedRows.filter((item: any) => {
        return state.curPageKeys.includes(item[rowKey.value]);
      }) || [];
    state.selectedRowKeys = state.selectedRows.map((item: any) => item[rowKey.value]) || [];
  };
  // 全量数据请求
  const onCheckAllChange = async (e: any) => {
    if (e.target.checked) {
      state.hasSelectedRows = uniqBy([...state.hasSelectedRows, ...state.totalRows], rowKey.value);
    } else if (!e.target.checked) {
      state.hasSelectedRows = state.hasSelectedRows.filter((item: any) => {
        return !totalKeys.value.includes(item[rowKey.value]);
      });
    }
    handleReChecked();
  };
  // 获取全量条目
  async function getTotalRows() {
    if (options.value.fullRowsAjax) {
      selectAllLoading.value = true;
      const res = await options.value.fullRowsAjax({
        ...options.value.extraParams,
      });
      selectAllLoading.value = false;
      if (res && res.success) {
        state.totalRows = res.data || [];
        handleReChecked();
      }
    }
  }
  const handleResetChecked = () => {
    state.curPageKeys = [];
    state.selectedRowKeys = [];
    state.selectedRows = [];
    state.totalRows = [];
    state.hasSelectedRows = [];
  };
  // 通用请求 isSearch - 是否是搜索操作，（添加错误处理）
  async function getList(
    isSearch = true,
    listOptions: any = {
      needResetChecked: false,
      backLoad: false,
    },
  ) {
    const ajaxFnVal = unref(ajaxFn);
    loading.value = true;

    if (listOptions.needResetChecked) {
      // 重置勾选项
      handleResetChecked();
    }
    // 获取数据前的处理
    if (options.value.beforeFetch && typeof options.value.beforeFetch === 'function') {
      options.value.beforeFetch();
    }
    isSearch && (pagination.value.current = 1); // 重置页码
    try {
      const { data: res } = await ajaxFnVal(
        options.value.hasPagination
          ? {
              pageIndex: pagination.value.current,
              pageSize: pagination.value.pageSize,
              ...options.value.extraParams,
            }
          : options.value.extraParams,
      );
      if (res && res.success) {
        loading.value = false;
        // 防止删除 | 修改pageSize后 最后一页无数据的情况(提前一页请求，这里仅倒退一次)
        if (
          dataSource.value.length === 0 &&
          pagination.value.current !== 1 &&
          !listOptions.backLoad
        ) {
          pagination.value.current--;
          getList(isSearch, {
            backLoad: true,
          });
          return;
        }
        // 提交后的参数处理
        if (options.value.afterFetch && typeof options.value.afterFetch === 'function') {
          res.data = options.value.afterFetch(res.data);
        }
        dataSource.value = res.data;
        pagination.value.total = Number(res.totalCount);
        // 获取全量条目(翻页不需要重新请求)
        if (options.value.needFullSelect && isSearch) {
          getTotalRows();
        }
        // 回显选中
        handleReChecked();
        // 请求的回调
        if (options.value.fetchCallback && typeof options.value.fetchCallback === 'function') {
          options.value.fetchCallback(dataSource.value);
        }
      }
    } catch (error) {
      // 新增异常的时候清空数组
      dataSource.value = [];
      loading.value = false;
      console.error(error);
    }
  }
  // 单条 / 当前页全选
  const onSelectChange = (selectedRowKeys: string[], selectedRows: Record<string, string>[]) => {
    console.log(selectedRowKeys, selectedRows);
    state.selectedRowKeys = selectedRowKeys;
    state.selectedRows = selectedRows;
    // 先排除选中当前页
    // console.log(state.curPageKeys)
    const restCurRows = state.hasSelectedRows.filter((item: any) => {
      return !state.curPageKeys.includes(item[rowKey.value]);
    });
    // 组合勾选项
    state.hasSelectedRows = [...restCurRows, ...selectedRows];
  };
  const resetState = () => {
    state.selectedRowKeys = [];
    state.selectedRows = [];
  };
  const delItem = (id: string) => {
    const selectRowIndex = state.selectedRowKeys.indexOf(id);
    if (selectRowIndex !== -1) {
      state.selectedRowKeys.splice(selectRowIndex, 1);
    }
  };
  // 分页变化
  const handleTableChange = (pageSize: number, current: number) => {
    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    getList(false);
  };
  // 处理列宽度变化
  const handleResizeColumn = (w: string | number, col: any) => {
    col.width = w;
  };
  return {
    state,
    totalCheckStatus,
    loading,
    selectAllLoading,
    pagination,
    dataSource,
    getList,
    onSelectChange,
    handleTableChange,
    delItem,
    resetState,
    handleResizeColumn,
    onCheckAllChange,
  };
};
// 加载更多
const defaultLoadMoreOptions = {
  extraParams: {},
  hasPagination: true,
};
export const useLoadMore = (
  ajaxFn: Function | Ref<Function>,
  extraOptions: Ref<OptionsType> = ref({
    extraParams: {},
    hasPagination: true,
  }),
) => {
  const ajaxFnVal = unref(ajaxFn);
  // 整合默认配置和传入配置
  const options = computed(() => {
    return { ...defaultLoadMoreOptions, ...extraOptions.value };
  });
  const pageParams = reactive({
    page: 1,
    size: 10,
  });
  const loading = ref(false);
  const initLoading = ref(false);
  const noMore = ref(false);
  const list = ref<any[]>([]);
  // 添加错误拦截
  const handleInit = async () => {
    loading.value = true;
    try {
      const res = await ajaxFnVal({
        page: pageParams.page,
        size: pageParams.size,
        ...options.value.extraParams,
      });

      if (res && res.success) {
        loading.value = false;
        if (options.value.afterFetch && typeof options.value.afterFetch === 'function') {
          res.data = options.value.afterFetch(res.data, res);
        }
        // 兼容获取，后端格式不同
        const newData = list.value.concat(res.data?.records ?? res.data);
        list.value = newData;
        // 判断数据是否请求完
        if (res.data.pages <= pageParams.page) {
          noMore.value = true;
        } else {
          noMore.value = false;
        }
      } else {
        loading.value = false;
      }
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  };
  // 初始加载
  const initLoad = async (resetPage = true) => {
    if (resetPage) {
      pageParams.page = 1;
      list.value = [];
    }
    initLoading.value = true;
    await handleInit();
    initLoading.value = false;
  };
  // 加载更多
  const onLoadMore = async () => {
    loading.value = true;
    if (!noMore.value) {
      pageParams.page += 1;
      handleInit();
    }
  };
  return {
    noMore,
    loading,
    initLoading,
    initLoad,
    onLoadMore,
    list,
  };
};
