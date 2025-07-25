const constructModule = require('../../../helper/construct.js')
// 打印日志渲染

module.exports = (node) => {
  const { props } = node
  // TODO:公式的读取
  const expression = `'${props.content.expression}'`;
  const logType = props.logType;
  let nodeRenderStr = ''
  switch(logType) {
    case 'log':
      nodeRenderStr += `console.log(${expression});`
      break;
    case 'warn':
      nodeRenderStr += `console.warn(${expression});`
      break;
    case 'error':
      nodeRenderStr += `console.error(${expression});`
      break; 
  }

  return nodeRenderStr + '\n';
}
