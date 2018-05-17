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

function randomHelloWord () {
  const sentences = [
    '我们一路奋战，不是为了改变世界，而是为了不让世界改变我们。',
    '多一分心力去注意别人，就少一分心力反省自己，你懂吗？',
    '老是低着头，幸福可是会离你而去的喔。',
    '能够实现愿望的樱花树啊，为什么不能满足这些孩子们如此真诚的要求呢？',
    '到底该怎么做，你才会重新喜欢我呢？'
  ]
  return sentences[Math.floor(Math.random() * sentences.length)]
}

function printCopyright () {
  const colors = require('colors/safe')
  const pkg = require('../package')
  const date = new Date()
  console.log(colors.bgBlue(colors.black(' ' + pkg.name + ' v' + pkg.version + ' © ' + date.getFullYear() + ' All Rights Reserved. ')) + '   ' + colors.bgRed(colors.black(' Contact at a632079@qq.com ')))
  console.log('')
  console.log(colors.bgCyan(colors.black(` ${randomHelloWord()} `)))
}

module.exports = {
  preStart: (logFile) => {
    printCopyright()

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
