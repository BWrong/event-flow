import { getMetaApi, META_SERVICE } from '@opentiny/tiny-engine-meta-register';

const tinyengineUrl = import.meta.env.VITE_API_PREFIX_TINYENGINE;
const prefix = `${tinyengineUrl}/api/v1/service/apihub`;
// 获取应用的服务列表
export const microInfoRecord = (params: any) =>
  getMetaApi(META_SERVICE.http).get(`/web/v1/micro/info/record`, { params });
// 获取api列表树
export const getApiGroupTree = (params: { serviceInfoId: string; groupType: string }) =>
  getMetaApi(META_SERVICE.http).get(`${prefix}/ApiGroup/tree`, {
    params,
  });

// 根据refId获取下级模型结构
export const getModelDetails = (id: string) => {
  return getMetaApi(META_SERVICE.http).get('/ApiDataModel/details/' + id);
};

// 获取页面列表
// TODO 接口替换
// export const fetchPageList = (appId) => http.get(`/app-center/api/pages/list/${appId}`)
export const fetchPageList = async (appId) => {
  const res = await getMetaApi(META_SERVICE.http).get(
    `${tinyengineUrl}/tinyengine/pagelayout/pageQuery?appId=${appId}&pageIndex=1&pageSize=1000`
  );
  // 过滤一下，只有 developType 为 1 的页面才是用低代码开发的
  return (
    res?.filter((item) => {
      return item.developType === 1;
    }) || []
  );
};
