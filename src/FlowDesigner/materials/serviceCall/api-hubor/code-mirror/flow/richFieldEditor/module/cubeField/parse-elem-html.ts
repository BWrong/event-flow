/**
 * @description parse elem html
 * @author wangfupeng
 */

// @ts-ignore
import { SlateElement } from '@wangeditor/editor'
import { CubefieldElement } from './custom-types'

function parseHtml(elem: globalThis.Element): SlateElement {
  // elem HTML 结构 <span data-w-e-type="mention" data-w-e-is-void data-w-e-is-inline data-value="张三" data-info="xxx">@张三</span>

  // const value = elem.getAttribute('data-value') || ''
  const rawInfo = decodeURIComponent(elem.getAttribute('data-info') || '')
  let info: any
  try {
    info = JSON.parse(rawInfo)
  } catch (ex) {
    info = rawInfo
  }

  return {
    type: 'cubefield',
    value: info?.fieldId ?? '', // 这里返回的是行内信息的fieldId
    info,
    children: [{ text: '' }] // void node 必须有一个空白 text
  } as CubefieldElement
}

const parseHtmlConf = {
  selector: 'span[data-w-e-type="cubefield"]',
  parseElemHtml: parseHtml
}

export default parseHtmlConf
