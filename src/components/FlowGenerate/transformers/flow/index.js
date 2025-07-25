const path = require('path')
const fs = require('fs')
const utils = require('../../utils/index.js')
const prettier = require('prettier')
const { datasource2Json } = require('../../helper/resolveDs.js')
// 这里不要解构导出
const constructModule = require('../../helper/construct.js')
const assignmentTpl = require('./template/assignment.js')
const consoleTpl = require('./template/console.js')
// 导入公式方法
const evalutorFuncs = require('../../utils/evalutor.js')
const getCondition = (branchProps) => {
  if (branchProps.isDefaultBranch) {
    return ''
  }
  const getStructedExpress = (arr, contactStr) => {
    let str = ''
    if (arr && arr.length > 0) {
      arr.forEach((item, index) => {
        item.target && (str += constructModule.getRuleText(item))
        if (item.combineType && item.criteriaList && item.criteriaList.length > 0) {
          str += '(' + getStructedExpress(item.criteriaList, item.combineType) + ')'
        }
        index < arr.length - 1 && (str += contactStr === 'and' ? '&&' : '||')
      })
    }
    return str
  }
  // console.log(branchProps.conditionType)
  if (branchProps.conditionType === 'structured') {
    return getStructedExpress([branchProps.structured], '')
  } else {
    return constructModule.getFormulaStr(branchProps.expression, branchProps.expressionFull)
  }
}
module.exports = (workSpacePath, outputPrefix) => ({
  name: 'flow',
  injects: {
    import: {
      signsInit: ['/****inject imports start****/', '/****inject imports end****/\n'],
      signStart: 'inject imports start',
      signEnd: 'inject imports end',
      modules: [],
    },
    localVariables: {
      signsInit: [
        '/****inject local variables start****/',
        '/****inject local variables end****/\n',
      ],
      signStart: 'inject local variables start',
      signEnd: 'inject local variables end',
      modules: [],
    },
  },
  // 注册顶部导入模块(防止重复注入)
  registImportModule: (module) => {
    const hanRegistedKeys = this.injects.import.modules.map((item) => item.key)
    if (module && module.key && hanRegistedKeys.indexOf(module.key) === -1) {
      this.injects.import.modules.push(module)
    }
  },
  clear: () => utils.emptyFolder(outputPrefix),
  // 同步生成公式函数
  syncGenerateEvalutor: () => {
    // 清除已有文件
    utils.emptyFolder(path.join(workSpacePath, 'output/utils/evalutor.js'))
    // 创建文件夹
    utils.mkdirsSync(path.join(workSpacePath, 'output/utils'))
    // 写入方法文件  utils/evalutor.js -> output/utils/evalutor.js
    const evalutorStr = fs.readFileSync(path.join(workSpacePath, 'utils/evalutor.js'), 'utf8')
    //1.将顶部的const xx = require()替换为 import xx from 。 2. 将底部的 module.exports = 替换为 export
    const require2IptRegex = /const\s+([\w\$\d_]+)\s*=\s*require\(['"]([^'"]+)['"]\);/g
    const newContent = evalutorStr.replace(require2IptRegex, (match, p1, p2) => {
      return `import ${p1} from '${p2}';`
    })
    fs.writeFileSync(
      path.join(workSpacePath, 'output/utils/evalutor.js'),
      newContent.replace('module.exports = ', 'export '),
      {
        encoding: 'utf-8',
      },
    )
  },
  /**
   * 初始化所有局部变量
   * 主要用于动态生成流程执行时所需的变量定义代码
   *
   * @param {Object} schema - 流程的 schema 对象，包含了流程的各种配置信息
   */
  initAllVariables(schema, funcStr) {
    let varObjectStr = ''
    if (schema.variables && schema.variables.length > 0) {
      schema.variables
        .filter((item) => item.variableType === 'flow')
        .forEach((item) => {
          console.log(datasource2Json(item), '构建值')
          varObjectStr += `const ${item.name} = ${datasource2Json(item)};\n`
        })
    }
    console.log(varObjectStr)
    // 查找开始节点获取输入变量
    // const startNode = schema.children.find((node) => node.type === 'FlowStartNode')
    // const { props } = startNode
    // // 构建局部变量
    // if (props.inputs && props.inputs.length > 0) {
    //   props.inputs.forEach((input) => {
    //     varObjectStr += `const ${input.name} = context.${input.name},\n`
    //   })
    // }

    // 插入语句

    return constructModule.insertAtStartOfSection(
      funcStr,
      varObjectStr,
      this.injects.localVariables.signStart,
    )
  },
  generateNode(nodes) {
    let nodeRenderStr = ''
    nodes.forEach((node) => {
      if (node.type === 'FlowAssignmentNode') {
        nodeRenderStr += assignmentTpl(node)
      } else if (node.type === 'FlowConsoleNode') {
        nodeRenderStr += consoleTpl(node)
      } else if (node.type === 'FlowBranchNode') {
        const { children } = node
        children.forEach((branch, index) => {
          const { props } = branch
          // 查找是否包含日期字段，有则引入dayjs
          if (props.conditionType === 'structured') {
            const flattedCons = constructModule.flattenTree([props.structured], {
              childrenKey: 'criteriaList',
            })
            if (
              flattedCons.length > 0 &&
              flattedCons.some((item) => item.targetDataType === 'date')
            ) {
              this.registImportModule({ key: 'dayjs', content: `import dayjs from 'dayjs'` })
            }
          }
          const cond = getCondition(props)
          // 构建单个条件
          nodeRenderStr += `${index === 0 ? 'if' : props.isDefaultBranch ? 'else' : 'else if'}${
            props.isDefaultBranch ? '' : `(${cond})`
          } {`
          nodeRenderStr += this.generateNode(branch.children) // 再次调用单层渲染
          nodeRenderStr += '}\n'
        })
      } else if (node.type === 'FlowEndNode') {
        nodeRenderStr += '}\n'
      }
    })

    return nodeRenderStr
  },
  transform(eventFlows) {
    try {
      // console.log(fs.existsSync(outputPrefix))
      fs.mkdirSync(outputPrefix, { recursive: true })
      eventFlows.forEach(async (schema) => {
        const { id, children: nodes } = schema
        // TODO:构建顶部导入部分
        let funcStr = ''
        // console.log(nodes)
        if (nodes && nodes.length > 0) {
          // 初始化顶部导入标记
          funcStr += this.injects.import.signsInit.join('\n')

          funcStr += `export function ${id}(context){\n`
          // 初始化局部变量
          // 构建标记
          funcStr += this.injects.localVariables.signsInit.join('\n')
          // 目前变量是初始指定的，不用考虑内部节点再新增变量，所以这里直接初始化
          funcStr = this.initAllVariables(schema, funcStr)
          // 构建单层渲染
          funcStr += this.generateNode(nodes)

          // 构建顶部导入
          if (this.injects.import.modules.length > 0) {
            this.injects.import.modules.forEach((module) => {
              funcStr = constructModule.insertAtStartOfSection(
                funcStr,
                module.content,
                this.injects.import.signStart,
              )
            })
          }
          // 公式方法导入（目前是传入的全量，如何按需？）
          let imtEvalutorStr = 'import {'
          Object.keys(evalutorFuncs).forEach((funcName) => {
            imtEvalutorStr += `${funcName},`
          })
          imtEvalutorStr += '} from "./utils/evalutor"'

          funcStr = constructModule.insertAtEndOfSection(
            funcStr,
            imtEvalutorStr,
            this.injects.import.signEnd,
          )

          // 同步生成evalutor.js
          this.syncGenerateEvalutor()

          const formattedJsContent = await prettier.format(funcStr, { semi: true, parser: 'babel' })
          fs.writeFileSync(`${outputPrefix}/${id}.js`, formattedJsContent, {
            encoding: 'utf-8',
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
})
