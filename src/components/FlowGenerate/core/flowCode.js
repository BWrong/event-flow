const path = require("path");
const dayjs = require('dayjs');
class FlowCode {
  // 流程json配置
  eventFlows = null
  // 构建文件的版本
  version = '1.0.0'
  // 工作空间路径
  workSpacePath = path.join(process.cwd(), 'src', 'Generate');
  // 输出文件夹名称
  workOutputName = 'output'

  // 输出文件夹路径
  workOutputPath = path.join(this.workSpacePath, this.workOutputName)

  // 转换器
  transformMap = {}

  constructor(eventFlows) {
    if (!eventFlows) {
        throw new Error('error:缺少eventFlows配置')
    }
    if (eventFlows.length === 0) {
        throw new Error('error:eventFlows为空')
    }
    this.eventFlows = eventFlows
  }

  register(transformers) {
    transformers.forEach((transformer) => {
      const obj = transformer(this.workSpacePath, this.workOutputPath)
      this.transformMap[obj.name] = obj
    })
    return this
  }

//   unzip() {
//     execSync(`unzip ${this.originalZipFilePath} -d ${this.workDirPath}`)
//     return this
//   }

//   zip() {
//     execSync(`zip -r ${path.join(process.cwd(), 'history', `${this.workDirName}.zip`)} ${this.workDirPath}`)
//     return this
//   }

  transform(type) {
    if (type in this.transformMap) {
      // 先清除已有文件夹
      this.transformMap[type].clear();
      this.transformMap[type].transform(this.eventFlows)
    } else {
      throw new Error(`Invalid type: ${type}.`)
    }
    return this
  }

  print(name) {
    console.log(this[name])
    return this
  }

  log(...params) {
    console.log(...params)
    return this
  }
}

module.exports = {
  FlowCode
} 
