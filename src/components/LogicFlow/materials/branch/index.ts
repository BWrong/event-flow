import { inject } from 'vue'
import Noder from './Noder.vue'
import Setter from './Setter.vue'
import {
  type FlowMaterial,
  type FlowNode,
  type ValidateType,
  type FlowBranchRouter,
  type Structured,
  type StructuredCondition,
  type FlowNodeProps
} from '../../types'
import Icon from './icon.svg'
import { createBranchNodeData } from './helper'
import { validateFieldSet } from '../../common/validate'
import { type IState } from '../../designer/useDesignerStore'
export { default as runner } from './Runner'
// 结构树平铺
const flattedConditions = (conditions: (Structured | StructuredCondition)[]) => {
  const result: StructuredCondition[] = []
  const generatorItem = (arr: (Structured | StructuredCondition)[]) => {
    arr.forEach((item: Structured | StructuredCondition) => {
      if ((item as Structured).criteriaList && (item as Structured).criteriaList.length > 0) {
        generatorItem((item as Structured).criteriaList)
      } else {
        result.push(item as StructuredCondition)
      }
    })
  }
  generatorItem(conditions)
  return result
}
export const FlowBranchNode: FlowMaterial<FlowNodeProps, FlowBranchRouter> = {
  name: '条件分支',
  type: 'FlowBranchNode',
  icon: Icon,
  noder: Noder,
  setter: Setter,
  group: '流程控制',
  config: {
    allowDelete: true,
    allowEdit: true,
    hideInAdd: false,
    isCustom: true
  },
  props: {},
  // 支持整体节点校验，和单个分支校验
  validator: (node: FlowNode<FlowNodeProps, FlowBranchRouter>, state?: IState) => {
    const validateBranchRouter = (branchRouter: FlowBranchRouter) => {
      let type: ValidateType = 'default';
      const  messages: string[] = []
      const branchProps = branchRouter.props
      if (branchProps.isDefaultBranch) {
        return { type, messages }
      }
      if (!branchRouter.name) {
        type = 'error'
        messages.push('节点名称是必填字段')
      }
      if (branchProps.conditionType === 'structured') {
        if (branchProps.structured && branchProps.structured.criteriaList.length > 0) {
          
          // 构建平铺结构
          const tempCriteriaList = flattedConditions(branchProps.structured.criteriaList)
          const fieldSetFlag = validateFieldSet(tempCriteriaList)
          if (!fieldSetFlag) {
            type = 'error'
            messages.push('请正确配置结构体条件')
          }
        } else {
          type = 'error'
          messages.push('结构体条件不能为空')
        }
      } else {
        if (!branchProps?.expression) {
          type = 'error'
          messages.push('请设置表达式')
        }
      }
      return { type, messages, id: branchRouter.id }
    }
    if (state) {
      const branchRouter = node.children.find((child) => state.setterProps.branchRouter.id === child.id)
      if (branchRouter) {
        return validateBranchRouter(branchRouter)
      } else {
        return { type: 'default', messages: [] }
      }
    } else {
      // 全量分支校验
      if (node.children.length > 0) {
        const children = []
        node.children.map((child) => {
          const result = validateBranchRouter(child)
          if (result.type !== 'default') {
            children.push(result)
          }
        })

        return { type: 'error', children }
      }
    }
  },
  // 这里会返回规则的拼接结构
  updateValueText: (node: FlowNode<FlowNodeProps, FlowBranchRouter>, state: IState) => {
    const branchRouterIndex = node.children.findIndex(
      (child: FlowBranchRouter) => state.setterProps.branchRouter.id === child.id
    )
    const branchRouter = node.children.find((child: FlowBranchRouter) => state.setterProps.branchRouter.id === child.id)
    let text = '请设置' + branchRouter.name
    if (branchRouter) {
      const branchProps = branchRouter.props
      const getExpressText = (arr: any, contactStr: string) => {
        let str = ''
        if (arr && arr.length > 0) {
          arr.forEach((item: any, index: number) => {
            item.ruleText && (str += item.ruleText)
            if (item.combineType && item.combineTypeName && item.criteriaList && item.criteriaList.length > 0) {
              str += '(' + getExpressText(item.criteriaList, item.combineTypeName) + ')'
            }
            index < arr.length - 1 && (str += contactStr)
          })
        }
        return str
      }
      text =
        branchProps.conditionType === 'structured'
          ? getExpressText([branchProps.structured], '')
          : branchProps.expressionFull?.text ?? ''
    }

    node.children[branchRouterIndex].props.valueText = text
  },
  onBeforeAdd(node) {
    return {
      ...node,
      children: [
        createBranchNodeData('条件分支1', {
          conditionType: 'structured',
          nodeId: node.id,
          structured: undefined
        }),
        createBranchNodeData(
          '默认分支',
          {
            isDefaultBranch: true,
            nodeId: node.id
          },
          '当其他条件不满足时执行该分支'
        )
      ]
    }
  },
  onAfterAdd(node, state) {
    state.setterProps = {
      hideBaseInfo: true,
      branchRouter: node.children[0]
    }
  }
}
