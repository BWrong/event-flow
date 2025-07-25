module.exports = [
  {
    props: {
      params: [],
      returns: {},
      eventName: 'onChange',
      eventLabel: '值被改变时触发',
      eventComponentId: '49225575',
      eventComponentType: 'input',
    },
    displayName: 'input_值被改变时触发_36562332',
    id: 'flow_36562332',
    children: [
      {
        id: 'node_36562332_43742274',
        type: 'FlowStartNode',
        name: 'onChange 值被改变时触发',
        description: '当 input 值被改变时触发',
        props: {
          inputs: [],
          actionDescription: 'onChange 值被改变时触发',
        },
      },
      {
        id: 'node_36562332_463e3555',
        type: 'FlowEndNode',
        name: '结束节点',
        description: '流程结束',
        props: {},
      },
    ],
    variables: [
      {
        name: 'var_1',
        dataType: {
          type: 'array',
          itemTypes: [
            {
              type: 'string',
              itemTypes: [],
            },
          ],
        },
        variableType: 'flow',
        description: '111',
        refs: [],
      },
    ],
  },
  {
    props: {
      params: [
        {
          name: 'event',
          type: 'Object',
          defaultValue: '',
          description: {
            zh_CN: '原生 event',
          },
        },
      ],
      returns: {},
      eventName: 'onBlur',
      eventLabel: '失去焦点时触发',
      eventComponentId: '49225575',
      eventComponentType: 'input',
    },
    displayName: 'input_失去焦点时触发_2e86949',
    id: 'flow_2e869499',
    children: [
      {
        id: 'node_2e869499_33645346',
        type: 'FlowStartNode',
        name: 'onBlur 失去焦点时触发',
        description: '当 input 失去焦点时触发',
        props: {
          inputs: [
            {
              name: 'event',
              dataType: {
                type: 'Object',
              },
              defaultValue: '',
              variableName: 'event',
              description: '原生 event',
            },
          ],
          actionDescription: 'onBlur 失去焦点时触发',
        },
      },
      {
        id: 'node_2e869499_533c9666',
        type: 'FlowAssignmentNode',
        name: '变量赋值',
        description: '',
        props: {
          inputs: [],
          outputs: [],
          valueText: '已设置3个赋值',
          fillRules: {
            conditionType: 'structured',
            structured: [
              {
                target: 'aaaa',
                source: '123',
                sourceType: 'value',
                operator: 'equals',
                targetType: 'variable',
                expression: '',
                expressionFull: '',
                targetDataType: {
                  type: 'string',
                },
                id: '52242255',
              },
              {
                target: 'flow_var_1',
                source: '456',
                sourceType: 'value',
                operator: 'equals',
                targetType: 'variable',
                expression: '',
                expressionFull: '',
                targetDataType: {
                  type: 'string',
                },
                id: '33436e5e',
              },
              {
                target: 'var1.age',
                source: 10,
                sourceType: 'value',
                operator: 'equals',
                targetType: 'variable',
                expression: '',
                expressionFull: '',
                targetDataType: {
                  type: 'number',
                  name: 'age',
                },
                id: '33552526',
              },
            ],
          },
        },
        children: [],
      },
      {
        id: 'node_2e869499_42462444',
        type: 'FlowBranchNode',
        name: '条件分支',
        description: '',
        props: {},
        children: [
          {
            id: 'branch_router_2738a356',
            type: 'FlowBranchRouter',
            name: '条件分支1',
            description: '',
            props: {
              conditionType: 'structured',
              nodeId: 'node_2e869499_42462444',
              structured: {
                combineType: 'and',
                combineTypeName: '且',
                criteriaList: [
                  {
                    combineType: 'or',
                    combineTypeName: '或',
                    id: 'bwf-c-u-a6262612',
                    criteriaList: [
                      {
                        id: 'bwf-c-u-16533662',
                        operator: 'equals',
                        targetType: 'value',
                        target: 'aaaa',
                        operatorName: '等于',
                        sourceType: 'value',
                        source: 'aa',
                        targetDataType: {
                          type: 'string',
                        },
                        targetVariableType: 'page',
                        sourceName: 'aa',
                        ruleText: 'aaaa等于aa',
                      },
                      {
                        id: 'bwf-c-u-46317422',
                        operator: 'equals',
                        targetType: 'value',
                        target: 'flow_var_1',
                        operatorName: '等于',
                        sourceType: 'value',
                        source: '测试1',
                        targetDataType: {
                          type: 'string',
                        },
                        targetVariableType: 'flow',
                        sourceName: '测试1',
                        ruleText: 'flow_var_1等于测试1',
                      },
                    ],
                    joinType: 'or',
                    joinTypeName: '或',
                  },
                  {
                    id: 'bwf-c-u-93426452',
                    operator: 'starts_with',
                    targetType: 'value',
                    target: 'bbb',
                    operatorName: '开头为',
                    sourceType: 'value',
                    source: 'bb',
                    targetDataType: {
                      type: 'string',
                    },
                    targetVariableType: 'page',
                    sourceName: 'bb',
                    ruleText: 'bbb开头为bb',
                  },
                  {
                    id: 'bwf-c-u-34b4a542',
                    operator: 'greater',
                    targetType: 'value',
                    target: 'var1.age',
                    operatorName: '大于',
                    sourceType: 'value',
                    source: 20,
                    targetDataType: {
                      type: 'number',
                      name: 'age',
                    },
                    sourceName: 20,
                    ruleText: 'var1.age大于20',
                  },
                ],
                id: '',
              },
              valueText: '((aaaa等于aa且flow_var_1等于测试1)且bbb开头为bb且var1.age大于20)',
            },
            children: [
              {
                id: 'node_2e869499_35e55232',
                type: 'FlowConsoleNode',
                name: '打印日志',
                description: '',
                props: {
                  content: {
                    expression: '你错了aaa你是真的错了',
                    expressionFull:
                      '{"text":"你错了aaa你是真的错了","marks":[{"from":{"line":0,"ch":11,"sticky":null},"to":{"line":0,"ch":12,"sticky":null}}],"cursor":{"line":0,"ch":12}}',
                  },
                  valueText: '已设置',
                  logType: 'error',
                },
                children: [],
              },
            ],
          },
          {
            id: 'branch_router_362f2633',
            type: 'FlowBranchRouter',
            name: '默认分支',
            description: '当其他条件不满足时执行该分支',
            props: {
              isDefaultBranch: true,
              nodeId: 'node_2e869499_42462444',
            },
            children: [],
          },
        ],
      },
      {
        id: 'node_2e869499_94612351',
        type: 'FlowEndNode',
        name: '结束节点',
        description: '流程结束',
        props: {},
      },
    ],
    variables: [
      {
        name: 'var1',
        variableType: 'page',
        dataType: {
          type: 'object',
          itemTypes: [
            {
              type: 'string',
              name: 'name',
            },
            {
              type: 'number',
              name: 'age',
            },
          ],
        },
      },
      {
        name: 'var2',
        variableType: 'page',
        dataType: {
          type: 'object',
          itemTypes: [
            {
              type: 'string',
              name: 'goodName',
            },
            {
              type: 'string',
              name: 'price',
            },
          ],
        },
      },
      {
        name: 'biaodashi',
        variableType: 'page',
        dataType: {
          type: 'string',
        },
      },
      {
        name: 'aaaa',
        variableType: 'page',
        dataType: {
          type: 'string',
        },
      },
      {
        name: 'foo',
        variableType: 'stores',
        dataType: {
          type: 'object',
          itemTypes: [
            {
              type: 'string',
              name: 'foo',
            },
          ],
        },
      },
      {
        name: 'foo_copy',
        variableType: 'stores',
        dataType: {
          type: 'object',
          itemTypes: [
            {
              type: 'string',
              name: 'foo',
            },
          ],
        },
      },
      {
        name: 'userInfo',
        variableType: 'stores',
        dataType: {
          type: 'object',
          itemTypes: [
            {
              type: 'string',
              name: 'name',
            },
          ],
        },
      },
      {
        name: 'flow_var_1',
        dataType: {
          type: 'string',
        },
        variableType: 'flow',
        description: '',
        refs: [],
      },
      {
        name: 'flow_var_2',
        dataType: {
          type: 'array',
          itemTypes: [
            {
              type: 'string',
              itemTypes: [],
            },
          ],
        },
        variableType: 'flow',
        description: '',
        refs: [],
      },
    ],
  },
]
