const { operatorMap } = require('./resolveDs.js')

module.exports = {
  // 指定标记开头插入
  insertAtStartOfSection: (originalString, insertString, startMarker) => {
    const regex = new RegExp(`\\/\\*\\*\\*\\*${startMarker}\\*\\*\\*\\*\\/`, 'g')
    return originalString.replace(regex, `/****${startMarker}****/\n${insertString}`)
  },
  // 指定标记结尾前插入
  insertAtEndOfSection: (originalString, insertString, endMarker) => {
    const regex = new RegExp(`\\/\\*\\*\\*\\*${endMarker}\\*\\*\\*\\*\\/`, 'g')
    return originalString.replace(regex, `${insertString}\n/****${endMarker}****/\n`)
  },
  removeMarkers: (originalString, startMarker, endMarker) => {
    const regex = new RegExp(
      `\\/\\*\\*\\*\\*${startMarker}\\*\\*\\*\\*\\/.*?\\/\\*\\*\\*\\*${endMarker}\\*\\*\\*\\*\\/`,
      'gs',
    ) // 匹配整个标记段落
    return originalString.replace(regex, '')
  },
  flattenTree: (tree, options = { childrenKey: 'children' }) => {
    const result = []

    function traverse(node) {
      result.push(node)
      if (node[options.childrenKey]) {
        node[options.childrenKey].forEach((child) => traverse(child))
      }
    }

    tree.forEach((rootNode) => traverse(rootNode))

    return result
  },
  // 变量显示判断
  getVariableStr(item) {
    return item.variableType === 'flow' ? item.name : `context.${item.name}`
  },
  // TODO:公式字符串获取
  getFormulaStr: (express, expressionFull) => {
    const expressConfig = JSON.parse(expressionFull)
    if (expressConfig?.marks && expressConfig.marks.length > 0) {
      // 变量替换
      return express.replace(/#{(\w+)}/g, (match, key) => {
        const target = expressConfig.marks.find((mark) => mark.value === match)
        if (target) {
          const { value, extra } = target
          const extraObj = JSON.parse(extra)
          return this.getVariableStr({
            variableType: extraObj.variableType,
            name: value,
          })
        }
      })
    } else {
      return `'${express}'`
    }
  },

  // 一些变量的通用方法

  /**
 * 根据valueItem的sourceType属性返回对应的字符串值
 * 区分 值，变量，公式

 * @param {Object} valueItem - 包含sourceType和source属性的对象
 * @returns {string} - 返回直接值或变量引用的字符串表示
 */
  getValueStr(valueItem) {
    if (!valueItem) {
      return ''
    }
    if (valueItem.sourceType === 'value') {
      try {
        return JSON.parse(valueItem.source)
      } catch (error) {
        return typeof valueItem.source === 'string' ? `'${valueItem.source}'` : valueItem.source
      }
    } else if (valueItem.sourceType === 'variable') {
      return this.getVariableStr({
        variableType: valueItem.sourceVariableType,
        name: valueItem.source,
      })
    } else {
      return getFormulaStr(valueItem.source)
    }
  },
  getRuleText: function (condItem) {
    const targetStr = this.getVariableStr({
      variableType: condItem.targetVariableType,
      name: condItem.target,
    })
    const sourcStr = this.getValueStr(condItem)
    if (condItem.targetDataType === 'date') {
      if (typeof operatorMap.date[condItem.operator] === 'function') {
        return operatorMap.date[condItem.operator](targetStr, sourcStr)
      } else {
        return `${targetStr}${operatorMap.date[condItem.operator]}${sourcStr}`
      }
    } else {
      if (typeof operatorMap.base[condItem.operator] === 'function') {
        return operatorMap.base[condItem.operator](targetStr, sourcStr)
      } else {
        return `${targetStr}${operatorMap.base[condItem.operator]}${sourcStr}`
      }
    }
  },
  getAssignItem: function (condItem) {
    const targetStr = this.getVariableStr({
      variableType: condItem.targetVariableType,
      name: condItem.target,
    })
    const sourcStr = this.getValueStr(condItem)
    // 赋值操作不用判断连接符
    return `${targetStr}=${sourcStr}`
  },
}
