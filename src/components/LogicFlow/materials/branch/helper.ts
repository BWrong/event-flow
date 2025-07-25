import { type FlowBranchRouter } from "../../types";
import { guid } from "../../../LogicFlow/common/helper";

export function createBranchNodeData(name='条件分支',props = {} as FlowBranchRouter['props'],description = ''): FlowBranchRouter {
  return {
    id: 'branch_router_' + guid(),
    type: 'FlowBranchRouter',
    name,
    description,
    props,
    children: []
  }
}
