// 接口在线调试
export const apiHubRequestTest = async (params: any) => {
  return {
    data: {
      resBody: {
        code: 200,
        data: params,
        message: null,
        success: true
      }
    }
  }
}
