const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const log = require('./log');

const ejsCompile = (templatePath, data={}, options = {}) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, {data}, options, (err, str) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(str);
    })
  })
}

const writeFile = (path, content) => {
  if (fs.existsSync(path)) {
    log.error("the file already exists~")
    return;
  }
  return fs.promises.writeFile(path, content);
}

const mkdirSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    // 不存在,判断父亲文件夹是否存在？
    if (mkdirSync(path.dirname(dirname))) {
      // 存在父亲文件，就直接新建该文件
      fs.mkdirSync(dirname)
      return true
    }
  }
}

module.exports = {
  ejsCompile,
  writeFile,
  mkdirSync
}