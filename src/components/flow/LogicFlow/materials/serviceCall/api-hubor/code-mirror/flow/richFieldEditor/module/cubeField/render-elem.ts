/**
 * @description render elem
 * @author wangfupeng
 */

// @ts-ignore
import { h, VNode } from 'snabbdom'
// @ts-ignore
import { SlateElement } from '@wangeditor/editor'
import { CubefieldElement } from './custom-types'

function renderCubefield(elem: SlateElement): VNode {
  // 当前节点是否选中(暂时不需要判断)
  // const selected = DomEditor.isNodeSelected(editor, elem)
  const { info = {} } = elem as CubefieldElement

  // 构建 vnode
  const vnode = h(
    'span',
    {
      props: {
        contentEditable: false // 不可编辑
      },
      style: {
        marginLeft: '3px',
        marginRight: '3px',
        backgroundColor: '#eaf7f6',
        color: '#0db3a6',
        borderRadius: '2px',
        padding: '0 5px'
      }
    },
    `${info?.valueName}` // 如 `@张三`
  )
  return vnode
}

const conf = {
  type: 'cubefield', // 节点 type ，重要！！！
  renderElem: renderCubefield
}

export default conf
