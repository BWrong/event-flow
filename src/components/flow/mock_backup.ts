export default [{
  "name": "buttonGroup_onClicklgkb01ol1mf2bg",
  "displayName": "ButtonGroup_lgkaolsn39g1mv - 点击按钮时",
  "content": {
    "id": "canvas-doc-lgkb01pj1181r7",
    "props": {
      "inputs": [{
        "name": "index",
        "variableType": "flow",
        "dataType": {
          "type": "Integer"
        }
      }, {
        "name": "content",
        "variableType": "flow",
        "dataType": {
          "type": "String"
        }
      }, {
        "name": "componentId",
        "variableType": "flow",
        "dataType": {
          "type": "String"
        }
      }]
    },
    "root": {
      "id": "canvas-node-lgkb01pk8e61r8",
      "type": "BwfFlowRoot",
      "props": {
        "collapsed": false,
        "disabled": false
      },
      "children": [{
        "id": "canvas-node-lgkb01pk2p21r9",
        "type": "BwfStartEvent",
        "props": {
          "name": "onClick 点击按钮时",
          "description": "",
          "actionDescription": "onClick 点击按钮时",
          "parameterList": [{
            "name": "index",
            "dataType": {
              "type": "Integer"
            },
            "variableName": "index",
            "description": "按钮数字索引"
          }, {
            "name": "content",
            "dataType": {
              "type": "String"
            },
            "variableName": "content",
            "description": "按钮内容"
          }, {
            "name": "componentId",
            "dataType": {
              "type": "String"
            },
            "variableName": "componentId",
            "description": "按钮唯一标识"
          }],
          "collapsed": false,
          "disabled": false
        }
      }, {
        "id": "canvas-node-m0p3uqa05vl1vs",
        "type": "BwfFunctionCall",
        "props": {
          "name": "调用后端服务",
          "inputFillRules": {
            "conditionType": "structured",
            "structured": [{
              "target": "input1",
              "targetType": "methodInput",
              "targetDescription": null,
              "targetRequired": false,
              "targetDataType": {
                "type": "Number",
                "_type": null,
                "_format": null,
                "reference": null,
                "embeddedModel": null,
                "itemTypes": null,
                "example": null,
                "defaultValue": null,
                "maxLength": null,
                "minLength": null,
                "enumValue": null,
                "pattern": null,
                "maximum": null,
                "minimum": null
              },
              "sourceType": "value",
              "source": "11"
            }]
          },
          "outputFillRules": {
            "conditionType": "structured",
            "structured": [{
              "source": "result",
              "sourceDataType": {
                "type": "StructureObject",
                "_type": null,
                "_format": null,
                "reference": {
                  "id": null,
                  "namespace": "http://www.102232029191.com/ykx-test-1/LIGHT-APP/app-1/structure-object",
                  "name": "TestList1"
                },
                "embeddedModel": null,
                "itemTypes": null,
                "example": null,
                "defaultValue": null,
                "maxLength": null,
                "minLength": null,
                "enumValue": null,
                "pattern": null,
                "maximum": null,
                "minimum": null
              },
              "sourceType": "outputParam",
              "target": "variable6",
              "targetType": "variable"
            }]
          },
          "collapsed": false,
          "disabled": false,
          "func": {
            "name": "servicem0m5nkoj4is5nv",
            "namespace": "http://www.102232029191.com/ykx-test-1/LIGHT-APP/app-1/function",
            "displayName": "test_while1",
            "inputs": [{
              "name": "input1",
              "displayName": "input1",
              "description": null,
              "typeInfo": {
                "type": "Number",
                "_type": null,
                "_format": null,
                "reference": null,
                "embeddedModel": null,
                "itemTypes": null,
                "example": null,
                "defaultValue": null,
                "maxLength": null,
                "minLength": null,
                "enumValue": null,
                "pattern": null,
                "maximum": null,
                "minimum": null
              },
              "required": false
            }],
            "outputs": [{
              "name": "result",
              "displayName": null,
              "description": null,
              "typeInfo": {
                "type": "StructureObject",
                "_type": null,
                "_format": null,
                "reference": {
                  "id": null,
                  "namespace": "http://www.102232029191.com/ykx-test-1/LIGHT-APP/app-1/structure-object",
                  "name": "TestList1"
                },
                "embeddedModel": null,
                "itemTypes": null,
                "example": null,
                "defaultValue": null,
                "maxLength": null,
                "minLength": null,
                "enumValue": null,
                "pattern": null,
                "maximum": null,
                "minimum": null
              }
            }]
          }
        }
      }, {
        "id": "canvas-node-lgkh22ui7sn1tb",
        "type": "BwfDataAssign",
        "props": {
          "name": "变量赋值",
          "collapsed": false,
          "disabled": false,
          "fillRules": {
            "conditionType": "structured",
            "structured": [{
              "id": "bwf-c-u-lgkh23o67rt1tc",
              "target": "index",
              "targetType": "variable",
              "source": "index",
              "sourceExtra": "",
              "sourceType": "variable",
              "targetDataType": {
                "type": "Integer"
              },
              "operator": "equals"
            }]
          }
        }
      }, {
        "id": "canvas-node-lgkb0zdj16h1s2",
        "type": "BwfBranch",
        "props": {
          "conditions": [{
            "id": "canvas-node-lgkb0zdi7l61rz",
            "name": "调用后端服务方法",
            "condition": {
              "conditionType": "expression",
              "expressionFull": "<div style=\"clear: both;\"><span class=\"e_formula_variable\" style=\"display: inline-block;line-height:28px;border-radius:4px;background-color: #F2F3F5;color: rgba(0,0,0,0.80);padding:0 8px;margin:0 5px;\" _data=\"{&quot;name&quot;:&quot;componentId&quot;}\" contenteditable=\"false\"><span>componentId</span></span><span class=\"e_formula_operator\" contenteditable=\"false\" style=\"padding: 0 5px\">==</span>\"1\"</div>",
              "expression": "componentId ==\"1\""
            }
          }, {
            "id": "canvas-node-lgkb0zdi2gu1s0",
            "name": "清空内容",
            "condition": {
              "conditionType": "expression",
              "expressionFull": "<div style=\"clear: both;\"><span class=\"e_formula_variable\" style=\"display: inline-block;line-height:28px;border-radius:4px;background-color: #F2F3F5;color: rgba(0,0,0,0.80);padding:0 8px;margin:0 5px;\" _data=\"{&quot;name&quot;:&quot;componentId&quot;}\" contenteditable=\"false\"><span>componentId</span></span>==\"2\"</div>",
              "expression": "componentId ==\"2\""
            }
          }, {
            "id": "canvas-node-lgkb0zdi49f1s1",
            "name": "默认条件",
            "isDefaultBranch": true
          }],
          "name": "分支",
          "matchStrategy": "matchFirst",
          "concurrentNumber": 3,
          "collapsed": false,
          "disabled": false
        },
        "children": [{
          "id": "canvas-node-lgkb1x8z4db1s9",
          "type": "BwfBranchRouter",
          "props": {
            "conditionId": "canvas-node-lgkb0zdi7l61rz",
            "collapsed": false,
            "disabled": false
          },
          "children": [{
            "id": "canvas-node-lgkb1zxq2ak1sf",
            "type": "BwfFunctionCall",
            "props": {
              "name": "调用后端服务",
              "inputFillRules": {
                "conditionType": "structured",
                "structured": []
              },
              "outputFillRules": {
                "conditionType": "structured",
                "structured": [{
                  "source": "result",
                  "sourceDataType": {
                    "type": "String",
                    "objectName": null,
                    "customObjectName": null,
                    "embeddedType": null,
                    "embeddedSampleData": null,
                    "itemTypes": null,
                    "codeInformation": null,
                    "collectable": false,
                    "primitive": true
                  },
                  "sourceType": "outputParam",
                  "target": "str",
                  "targetType": "variable"
                }]
              },
              "collapsed": false,
              "disabled": false,
              "func": {
                "name": "helloWorld",
                "namespace": "http://www.102232029191.com/ykx-test-1/LIGHT-APP/app-1/function",
                "displayName": "helloWorld",
                "inputs": [],
                "outputs": [{
                  "name": "result",
                  "displayName": null,
                  "description": null,
                  "typeInfo": {
                    "type": "String",
                    "objectName": null,
                    "customObjectName": null,
                    "embeddedType": null,
                    "embeddedSampleData": null,
                    "itemTypes": null,
                    "codeInformation": null,
                    "collectable": false,
                    "primitive": true
                  }
                }]
              }
            }
          }]
        }, {
          "id": "canvas-node-lgkb1x9a6fh1sa",
          "type": "BwfBranchRouter",
          "props": {
            "conditionId": "canvas-node-lgkb0zdi2gu1s0",
            "collapsed": false,
            "disabled": false
          },
          "children": [{
            "id": "canvas-node-lgkb27kf5sc1so",
            "type": "BwfDataAssign",
            "props": {
              "name": "变量赋值",
              "collapsed": false,
              "disabled": false,
              "fillRules": {
                "conditionType": "structured",
                "structured": [{
                  "id": "bwf-c-u-lgkb28hy7201sp",
                  "target": "str",
                  "targetType": "variable",
                  "source": "\"\"",
                  "sourceExtra": "<div style=\"clear: both;\">\"\"</div>",
                  "sourceType": "formula",
                  "targetDataType": {
                    "type": "String"
                  },
                  "operator": "equals"
                }]
              }
            }
          }]
        }, {
          "id": "canvas-node-lgkb1x9f1x51sb",
          "type": "BwfBranchRouter",
          "props": {
            "conditionId": "canvas-node-lgkb0zdi49f1s1",
            "collapsed": false,
            "disabled": false
          },
          "children": []
        }]
      }, {
        "id": "canvas-node-lgkb01pk4cs1ra",
        "type": "BwfEndEvent",
        "props": {
          "collapsed": false,
          "disabled": false
        }
      }]
    },
    "edges": []
  },
  "componentId": "node_lgkaoz5u5fd1mw"
}, {
  "name": "text_onClickm1egiuoz4o98db",
  "displayName": "Text_lgkaozqw5dd1n3 - 点击时",
  "content": {
    "id": "canvas-doc-m1egiuq23yz7m2",
    "props": {
      "inputs": []
    },
    "root": {
      "id": "canvas-node-m1egiuq34gd7m3",
      "type": "BwfFlowRoot",
      "props": {
        "collapsed": false,
        "disabled": false
      },
      "children": [{
        "id": "canvas-node-m1egiuq36977m4",
        "type": "BwfStartEvent",
        "props": {
          "name": "点击时",
          "description": "",
          "actionDescription": "点击时",
          "parameterList": [],
          "collapsed": false,
          "disabled": false
        }
      }, {
        "id": "canvas-node-m1egiwuy28c7md",
        "type": "BwfDataAssign",
        "props": {
          "name": "变量赋值",
          "fillRules": {
            "conditionType": "structured"
          },
          "collapsed": false,
          "disabled": false,
          "description": "111"
        }
      }, {
        "id": "canvas-node-m1egiuq34ep7m5",
        "type": "BwfEndEvent",
        "props": {
          "collapsed": false,
          "disabled": false
        }
      }]
    },
    "edges": []
  },
  "componentId": "node_lgkaoz5u5fd1mw"
}]
