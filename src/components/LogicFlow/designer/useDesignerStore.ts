import { useThrottledRefHistory } from '@vueuse/core'
import { message } from 'ant-design-vue'
import { computed, markRaw, nextTick, reactive } from 'vue'
import { convertTreeToObject, guid } from '../common/helper'
import {
  type Flow,
  type FlowMaterial,
  type FlowMaterialMap,
  type FlowNode,
  type FlowSetterProps,
  type FlowVariables,
  type ValidateInfo,
} from '../types'
const zoomStep = 10
const zoomMax = 200
const zoomMin = 80
export interface IState {
  materials: FlowMaterialMap
  mode: 'edit' | 'preview'
  editNode: null | FlowNode
  setterProps: FlowSetterProps // 传递给setter组件的props
  theme: string
  flowData: Flow | null
  validateInfo: Record<string, ValidateInfo>
  zoom: number
  variables: FlowVariables[]
  // 创建变量弹框
  createVariable: boolean
  editVarRow: FlowVariables
}
// 创建一个响应式对象，用于存储流程数据
const state = reactive<IState>({
  materials: {},
  mode: 'edit',
  editNode: null,
  setterProps: {
    hideBaseInfo: false,
  },
  theme: '#0089FF',
  flowData: null,
  validateInfo: {},
  zoom: 100,
  variables: [],
  createVariable: false,
  editVarRow: null,
})
type ChangeType = 'add' | 'update' | 'delete' | 'undo' | 'redo'
type ChangeFunction = (_type: ChangeType, _node?: FlowNode, _flowData?: Flow) => void
let onChangeHooks: ChangeFunction[] = []
function onChange(hook: ChangeFunction) {
  onChangeHooks.push(hook)
}
function callChangeHooks(type: ChangeType, node?: FlowNode) {
  onChangeHooks.forEach((hook) => {
    hook(type, node, state.flowData as Flow)
  })
  // TODO: 考虑仅针对修改的节点进行验证
  validate()
}
// 设置流程物料
function setMaterials(materials: FlowMaterialMap = {}) {
  state.materials = markRaw(materials)
}
// 设置流程数据
function setFlowData(flowData: Flow | null) {
  state.flowData = flowData
}
// 设置模式
function setMode(mode: 'edit' | 'preview') {
  state.mode = mode
}
// 设置主题
function setTheme(theme: string = '#0089FF') {
  state.theme = theme
}
// 设置setter组件的props
function setSetterProps(props?: IState['setterProps']) {
  state.setterProps = props || {
    hideBaseInfo: false,
  }
}

// 设置当前编辑的节点
function setEditNode(node: null | FlowNode = null, setterProps?: FlowSetterProps) {
  state.editNode = node
  setSetterProps(setterProps)
}
// 创建节点
function createNode(flowId: string, material: FlowMaterial): FlowNode {
  const id = guid()
  let node: FlowNode = {
    id: `node_${flowId}_${id}`,
    type: material.type,
    name: material.name,
    description: '',
    props: {
      ...material.props,
    },
    children: [...(material.children || [])],
  }
  if (material.onBeforeAdd) {
    node = material.onBeforeAdd(node, state)
  }
  return node
}
// 添加节点
function addNode(material: FlowMaterial, curIndex: number, parentList: FlowNode[]) {
  // 去掉flow_前缀
  const flowId = state.flowData!.id.replace('flow_', '')
  const node = createNode(flowId, material)
  parentList.splice(curIndex, 0, node)
  if (material.onAfterAdd) {
    nextTick(() => {
      material.onAfterAdd?.(node, state)
    })
  }
  callChangeHooks('add', node)
  return node
}
// 更新节点
function updateNode(node: FlowNode, curIndex: number, parentList: FlowNode[]) {
  parentList.splice(curIndex, 1, node)
  callChangeHooks('update', node)
}
// 移除节点
function removeNode(curIndex: number, parentList: FlowNode[]) {
  const [node] = parentList.splice(curIndex, 1)
  callChangeHooks('delete', node)
}
function getFlatFlowNodes() {
  return convertTreeToObject(state.flowData!.children) || {}
}
// 计算属性，用于获取流程数据
const flowData = computed({
  get() {
    return state.flowData
  },
  set(val) {
    setFlowData(val)
  },
})
// 使用useThrottledRefHistory，用于记录流程数据的历史
const historyRef = useThrottledRefHistory(flowData, {
  deep: true,
  throttle: 1000,
})
const history = {
  ...historyRef,
  redo() {
    historyRef.redo()
    callChangeHooks('redo')
  },
  undo() {
    historyRef.undo()
    callChangeHooks('undo')
  },
}
// 添加验证信息
function addValidateInfo(id: string, info: ValidateInfo) {
  state.validateInfo[id] = info
}
// 移除验证信息
function removeValidateInfo(id: string) {
  delete state.validateInfo[id]
}
// 清空验证信息
function clearValidateInfo() {
  state.validateInfo = {}
}
function validateNode(node: FlowNode) {
  const { id, type } = node
  const material = state.materials[type]
  // 如果是分支router节点，则跳过，因为使用父及分支节点进行验证
  if (type === 'FlowBranchRouter') {
    return
  }
  if (material && material.validator) {
    let validateInfo: ValidateInfo | null = null
    try {
      validateInfo = material.validator(node)
    } catch (error) {
      console.error(`${node.name}验证出错，请检查其validator配置`, error)
    }
    if (validateInfo?.type !== 'default') {
      addValidateInfo(id, validateInfo as ValidateInfo)
    } else {
      removeValidateInfo(id)
    }
  } else {
    removeValidateInfo(id)
  }
}
function validate() {
  clearValidateInfo()
  const nodeMap = getFlatFlowNodes()
  const nodes = Object.values(nodeMap)
  nodes.forEach((node) => validateNode(node))
  return state.validateInfo
}
// 切换流程时使用
function changeFlow(data: Flow) {
  setEditNode()
  setSetterProps()
  clearValidateInfo()
  historyRef?.pause()
  setFlowData(data)
  historyRef.resume()
  nextTick(() => {
    historyRef.clear()
    validate()
  })
}
// 一些变量操作
function setVariables(variables: FlowVariables[]) {
  state.variables = variables
}
// 删除变量
const delVariable = (name: string) => {
  const variableList = state.flowData?.variables
  if (variableList && Array.isArray(variableList)) {
    const targetIndex = variableList.findIndex((item: FlowVariables) => item.name === name)
    variableList.splice(targetIndex, 1)
  }
}
// 新增变量
const addVariable = (row: FlowVariables) => {
  const variableList = state.flowData?.variables
  if (variableList && Array.isArray(variableList)) {
    const variableNames = variableList.map((item: FlowVariables) => item.name)
    if (variableNames.includes(row.name)) {
      message.warn('该变量名称已经存在，请重新输入')
      return false
    }
    variableList.push({ ...row, refs: [] })
    return true
  } else {
    return false
  }
}
// 修改变量(引用值同步)
const modifyVariable = (row: FlowVariables) => {
  const variableList = state.flowData?.variables
  if (variableList && Array.isArray(variableList)) {
    try {
      const targetIndex = variableList.findIndex((item: FlowVariables) => item.name === row.name)
      variableList.splice(targetIndex, 1, row)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    return false
  }
}
// 销毁
function destroy() {
  historyRef.dispose()
  setMaterials()
  setEditNode()
  setSetterProps()
  onChangeHooks = []
  clearValidateInfo()
  setFlowData(null)
}
function zoomIn() {
  if (state.zoom < zoomMax) {
    state.zoom += zoomStep
  }
}
function zoomOut() {
  if (state.zoom > zoomMin) {
    state.zoom -= zoomStep
  }
}
function zoomReset() {
  state.zoom = 100
}
export interface FunctionParam {
  defaultValue: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'undefined'
  description: string
}
export interface EventFlowProps {
  params: FunctionParam[]
  return: Record<string, string>
  eventName: string
  eventLabel: string
  eventComponentType: string
  eventComponentId: string
}
export type EventFlow = Flow<EventFlowProps>
function createStartNode(flowId: string, props: EventFlowProps): FlowNode {
  const id = guid()
  const originName = `${props.eventName} ${props.eventLabel}`
  const params = props.params || []
  return {
    id: `node_${flowId}_${id}`,
    type: 'FlowStartNode',
    name: originName,
    description: `当 ${props.eventComponentType} ${props.eventLabel}`,
    props: {
      inputs: params.map((item: any) => {
        return {
          name: item.name,
          dataType: { type: item.type },
          defaultValue: item.defaultValue,
          variableName: item.name,
          description: item.description,
        }
      }),
      actionDescription: originName,
    },
  }
}
function createEndNode(flowId: string): FlowNode {
  const id = guid()
  return {
    id: `node_${flowId}_${id}`,
    type: 'FlowEndNode',
    name: '结束节点',
    description: '流程结束',
    props: {},
  }
}
function ganerInitFlowChildren(flowId: string, props: EventFlowProps) {
  return [createStartNode(flowId, props), createEndNode(flowId)]
}
export default function () {
  return {
    history,
    state,
    setMaterials,
    setFlowData,
    setMode,
    setTheme,
    setEditNode,
    setSetterProps,
    addNode,
    updateNode,
    removeNode,
    addValidateInfo,
    removeValidateInfo,
    clearValidateInfo,
    validate,
    validateNode,
    destroy,
    changeFlow,
    zoomIn,
    zoomOut,
    zoomReset,
    onChange,
    callChangeHooks,
    getFlatFlowNodes,
    setVariables,
    delVariable,
    addVariable,
    modifyVariable,
    ganerInitFlowChildren,
    createStartNode,
    createEndNode,
  }
}
