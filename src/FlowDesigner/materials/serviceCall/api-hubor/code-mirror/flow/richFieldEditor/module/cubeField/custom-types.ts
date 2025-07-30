
/**
 * @description mention element
 * @author wangfupeng
 */

type EmptyText = {
  text: ''
}
export type CubefieldElement = {
  type: 'cubefield'
  value: string
  info: any
  children: EmptyText[] // void 元素必须有一个空 text
}
