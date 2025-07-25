export default {
  props: {
    name: '流程1',
    id: 'flow_3435c12e',
    params: [
      {
        name: 'param1',
        defaultValue: '1',
        type: 'string',
        description: '参数1',
      },
    ],
    returns: {
      return1: '返回1',
      return2: '返回2',
    },
    meta: {},
  },
  children: [
    {
      id: 'node_3435c12e_46627145',
      type: 'FlowStartNode',
      name: '开始节点',
      description: '流程开始',
      props: {
        inputs: [],
      },
    },
    {
      id: 'node_3435c12e_66312333',
      type: 'FlowBranchNode',
      name: '条件分支',
      description: '',
      props: {},
      children: [
        {
          id: 'branch_router_2d153366',
          type: 'FlowBranchRouter',
          name: '条件分支1',
          description: '',
          props: {
            conditionType: 'structured',
            nodeId: 'node_3435c12e_66312333',
            structured: {
              combineType: 'and',
              combineTypeName: '且',
              criteriaList: [
                {
                  id: 'bwf-c-u-3351f455',
                  operator: 'empty',
                  targetType: 'value',
                  targetVariableType: 'stores',
                  target: 'eeee',
                  operatorName: '为空',
                  sourceType: 'value',
                  sourceVariableType: 'flow',
                  targetDataType: {
                    type: 'object',
                    itemTypes: [
                      {
                        type: 'string',
                        name: 'name',
                      },
                    ],
                  },
                  sourceName: '',
                  ruleText: 'eeee为空',
                },
              ],
              id: '',
            },
            valueText: '(eeee为空)',
          },
          children: [
            {
              id: 'node_3435c12e_41264224',
              type: 'FlowConsoleNode',
              name: '打印日志',
              description: '',
              props: {
                logType: 'warning',
                content: {
                  expression: '"eeee的值是空的"',
                  expressionFull: {
                    text: '"eeee的值是空的"',
                    marks: [
                      {
                        className: 'CodeMirror-composing',
                        from: {
                          line: 0,
                          ch: 9,
                        },
                        to: {
                          line: 0,
                          ch: 10,
                        },
                      },
                    ],
                    cursor: {
                      line: 0,
                      ch: 10,
                    },
                  },
                },
                valueText: '已设置',
              },
              children: [],
            },
          ],
        },
        {
          id: 'branch_router_32336263',
          type: 'FlowBranchRouter',
          name: '默认分支',
          description: '当其他条件不满足时执行该分支',
          props: {
            isDefaultBranch: true,
            nodeId: 'node_3435c12e_66312333',
          },
          children: [],
        },
      ],
    },
    {
      id: 'node_3435c12e_1536226a',
      type: 'FlowConsoleNode',
      name: '打印日志',
      description: '',
      props: {
        logType: 'warning',
        content: {
          expression: '"测试变量eeee.name的值是:"+#{eeee.name}',
          expressionFull: {
            text: '"测试变量eeee.name的值是:"+eeee.name',
            marks: [
              {
                className: 'my-snippet',
                value: 'eeee.name',
                name: 'eeee.name',
                markType: 'field',
                extra: '{"variableType":"stores"}',
                from: {
                  line: 0,
                  ch: 20,
                  sticky: null,
                },
                to: {
                  line: 0,
                  ch: 29,
                  sticky: null,
                },
              },
            ],
            cursor: {
              line: 0,
              ch: 20,
            },
          },
        },
        valueText: '已设置',
      },
      children: [],
    },
    {
      id: 'node_3435c12e_3616ec65',
      type: 'FlowEndNode',
      name: '结束节点',
      description: '流程结束',
      props: {},
    },
  ],
  variables: [
    {
      name: 'globalVar1',
      variableType: 'global',
      dataType: {
        type: 'object',
        itemTypes: [{ type: 'string', name: 'name' }],
      },
      defaultValue: {
        name: 'var1',
      },
      description: '全局变量1',
    },
    {
      name: 'inputVar2',
      variableType: 'input',
      dataType: {
        type: 'object',
        itemTypes: [{ type: 'string', name: 'name' }],
      },
      defaultValue: {
        name: 'var2',
      },
      description: '入参变量2',
    },
    {
      name: 'flowVar1',
      variableType: 'flow',
      dataType: {
        type: 'object',
        itemTypes: [{ type: 'string', name: 'name' }],
      },
    },
  ],
}
