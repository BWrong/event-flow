/**
 * @description mention module entry
 * @author wangfupeng
 */
// @ts-ignore
import { IModuleConf } from '@wangeditor/editor'
import withCubefield from './plugin'
import renderElemConf from './render-elem'
import elemToHtmlConf from './elem-to-html'
import parseHtmlConf from './parse-elem-html'

const module: Partial<IModuleConf> = {
  editorPlugin: withCubefield,
  renderElems: [renderElemConf],
  elemsToHtml: [elemToHtmlConf],
  parseElemsHtml: [parseHtmlConf]
}
export * from './custom-types'

export default module
