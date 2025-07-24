const { FlowCode } = require("./flowCode");
const schema = require("../mock");
const flowTransformer = require("../transformers/flow");



new FlowCode(schema)
  .register([flowTransformer])

  .log("流程出码开始...")
  .transform("flow")
  .log("流程出码结束！")

  .print("workDirPath");
