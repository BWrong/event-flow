const fs = require('fs')
const path = require('path')
const { resolve } = require('path')

// 清空文件夹或文件
function emptyFolder(folderPath, exclude = []) {
  // 判断文件是否存在
  try {
    fs.accessSync(folderPath, fs.constants.F_OK)
    const folderStat = fs.statSync(folderPath)
    // 判断是 文件夹 ｜ 文件
    if (folderStat.isDirectory()) {
      // 文件夹是否存在
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath)
        files.forEach((file) => {
          if (!exclude.includes(file)) {
            const filePath = path.join(folderPath, file)
            const fileStat = fs.statSync(filePath)

            if (fileStat.isDirectory()) {
              // 递归删除子文件夹
              emptyFolder(filePath)
            } else {
              // 删除文件
              fs.unlinkSync(filePath)
            }
          }
        })
        fs.rmdirSync(folderPath)
      }
    }
    // 文件
    else {
      fs.unlinkSync(folderPath)
    }
  } catch (err) {
    console.error('File does not exist')
  }
}

// 去掉无关代码
const deleteFiles = (delFileArr) => {
  delFileArr.forEach(async (filePath) => {
    if (Array.isArray(filePath)) {
      await emptyFolder(...filePath)
    } else {
      await emptyFolder(filePath)
    }
  })
}

// 创建文件夹
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

// 将一个文件夹中的内容复制到 某个文件夹下
function copyFolderSync(source, target) {
  // 确保目标文件夹存在
  if (!fs.existsSync(target)) {
    // fs.mkdirSync(target);
    mkdirsSync(target)
  }

  emptyFolder(target)

  // 读取源文件夹中的文件列表
  const files = fs.readdirSync(source)

  // 遍历文件列表并复制每个文件到目标文件夹
  files.forEach((file) => {
    // 排除名为 'node_modules' 的文件夹
    if (file !== 'node_modules' && file !== 'admin') {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)

      // 判断文件是文件夹还是文件
      if (fs.statSync(sourcePath).isDirectory()) {
        // 递归复制子文件夹
        copyFolderSync(sourcePath, targetPath)
      } else {
        // 复制文件
        fs.copyFileSync(sourcePath, targetPath)
      }
    }
  })
}

const writeFile = (path, content) => {
  fs.writeFile(path, content, 'utf8', (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log('文件修改成功')
  })
}

const resolvePath = (path) => {
  return resolve(__dirname, path)
}
function props2Attr(props) {
  if (typeof props === 'string') {
    return props
  }
  return Object.keys(props)
    .map((key) => {
      const value = props[key]
      if (typeof value === 'number' || typeof value === 'boolean') {
        return `:${key}='${value}'`
      } else if (typeof value === 'object') {
        return `:${key}='${JSON.stringify(value)}'`
      } else {
        return `${key}='${value}'`
      }
    })
    .join(' ')
}
module.exports = {
  emptyFolder,
  deleteFiles,
  mkdirsSync,
  copyFolderSync,
  writeFile,
  resolvePath,
  props2Attr
}
