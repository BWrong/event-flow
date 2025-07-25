
// 不同类型参数的默认值
const defaultValues = {
  string: '""',
  number: 'undefined',
  integer: 'undefined',
  boolean: 'false',
  null: 'null',
  object: '{}',
  array: '[]'
}

module.exports = {
 
  operatorMap: {
    base: {
      equals: '===',
      not_equals: '!==',
      starts_with: (target, source) => `${target}.startsWith(${source})`,
      ends_With: (target, source) => `${target}.endWith(${source})`,
      greater: '>',
      greater_equals: '>=',
      less: '<',
      less_equals: '<=',
      // TODO:区分不同的类型的空，非空
      empty: (target, source) => `utils.isEmpty(${source})`,
      not_empty: (target, source) => `utils.isNotEmpty(${source})`
    },
    date: {
      equals: (target, source) => `dayjs(${target}).isSame(${source}, 'day')`,
      not_equals: (target, source) => `!dayjs(${target}).isSame(${source}, 'day')`,
      greater: (target, source) => `dayjs(${target}).isAfter(${source}, 'day')`,
      greater_equals: (target, source) => `dayjs(${target}).isSameOrAfter(${source}, 'day')`,
      less: (target, source) => `dayjs(${target}).isBefore(${source}, 'day')`,
      less_equals: (target, source) => `dayjs(${target}).isSameOrBefore(${source}, 'day')`
    },
    array: {
      contains: (target, source) => `${source}.includes(${target})`
    }
  },

  // 数据源树结构转换为json
  datasource2Json: (treeData) => {
    // 单个类型判断处理（string,number,boolean,null,array,object）
    const getPerTypeItem = (target) => {
      const children = target.itemTypes || target.dataType?.itemTypes
      const type = target.type || target.dataType?.type || target.targetDataType?.type
      let temp = target.source || defaultValues[type]
      if ('object' === type && children.length > 0) {
        temp = {}
        children.forEach((item) => {
          temp[item.target] = getPerTypeItem(item)
        })
      }
      return typeof temp === 'object' ? JSON.stringify(temp) : temp;
    }
    return getPerTypeItem(treeData)
  }
}
