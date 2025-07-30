/**
 * @description elem to html
 * @author wangfupeng
 */
// @ts-ignore
import { SlateElement } from '@wangeditor/editor'
import { CubefieldElement } from './custom-types'

// 生成 html 的函数
function cubefieldToHtml(elem: SlateElement): string {
  const { info = {} } = elem as CubefieldElement
  // const infoStr = encodeURIComponent(JSON.stringify(info));
  const infoStr = JSON.stringify(info)
  const valueStr = '#{' + (info?.fieldId ?? '') + '}' // 生成函数用于后端进行替换(这里不取内容的value),这里dataInfo使用'',否则会造成回显获取问题
  return `<span data-w-e-type="cubefield" data-w-e-is-void data-w-e-is-inline data-info='${infoStr}'>${valueStr}</span>`
}

// 配置
const conf = {
  type: 'cubefield', // 节点 type ，重要！！！
  elemToHtml: cubefieldToHtml
}

export default conf
