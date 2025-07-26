import { type FlowMaterialMap } from '../types'
import { FlowAssignmentNode } from './assignment'
import { FlowBranchNode } from './branch'
import { FlowConsoleNode } from './console'
import { FlowEndNode } from './end'
import { FlowForNode } from './for'
import { FlowMessageNode } from './message'
import { FlowParallelBranchNode } from './parallelBranch'
import { FlowServiceCallNode } from './serviceCall'
import { FlowStartNode } from './start'

export const nodes: FlowMaterialMap = {
  FlowStartNode,
  FlowEndNode,
  FlowConsoleNode,
  FlowAssignmentNode,
  FlowBranchNode,
  FlowParallelBranchNode,
  FlowForNode,
  FlowMessageNode,
  FlowServiceCallNode,
}
