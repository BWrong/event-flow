const constructModule = require('../../../helper/construct.js')
// 变量赋值渲染

module.exports = (node) => {
  const { props } = node
  const structured = props.fillRules.structured
  let nodeRenderStr = ''
  if (structured && structured.length > 0) {
    structured.forEach((item) => {
      nodeRenderStr += constructModule.getAssignItem(item) + '\n';
    })
  }

  return nodeRenderStr + '\n';
}
