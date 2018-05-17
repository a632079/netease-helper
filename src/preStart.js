const winston = require('winston')
const nconf = require('nconf')
const path = require('path')
const fs = require('fs')
// 注册 nconf 配置管理器
function registerConfigManager () {
  nconf
    .argv()
    .env()
    .file({
      file: path.join(__dirname, '../config.json')
    })
}

// 初始化 winston 日记管理器
function setupWinston (logFile) {
  fs.existsSync(logFile) || fs.writeFileSync(logFile, '')
  winston.remove(winston.transports.Console)
  winston.add(winston.transports.File, {
    filename: logFile,
    level: 'verbose',
    handleExceptions: true,
    maxsize: 5242880,
    maxFiles: 10
  })
  winston.add(winston.transports.Console, {
    colorize: true,
    timestamp: function () {
      var date = new Date()
      return date.toISOString() + ' [' + global.process.pid + ']'
    },
    level: 'verbose'
  })
}

module.exports = {
  preStart: (logFile) => {
    // 检测 Node.JS 版本
    if (parseInt(process.version.slice(1, process.version.length)) < 8) {
      winston.error(`本脚本使用了 ES2017 的 Async Function, 所以要求 Node.js 版本大于 8. 您目前安装的 Node.js 版本为: ${process.version}`)
      return process.exit(1)
    }
    registerConfigManager()
    setupWinston(logFile)
    winston.verbose('注册环境完成..')
  }
}
