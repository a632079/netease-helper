// 导入包
const User = require('./user')
const winston = require('winston')
const { createWebAPIRequest } = require('./utils/requests')

class base {
  get cookie () {
    return this.user && this.user.cookie ? this.user.cookie : []
  }

  get isLogin () {
    return !!this.user && Array.isArray(this.user.cookie) && this.user.cookie.length > 1
  }

  /**
   * 从存储当中恢复用户
   * @param {object} store 用户的信息，用于恢复使用
   */
  load (store) {
    this.user = new User(store)
  }

  async checkLogin () {
    if (!this.isLogin) {
      throw new Error('Need Login!')
    }
  }

  async request (host, path, method, payload = {
    csrf_token: ''
  }) {
    return (await createWebAPIRequest(host, path, method, payload, this.cookie)).data
  }

  async requestWithSetCookie (host, path, method, payload = {
    csrf_token: ''
  }) {
    const respData = await createWebAPIRequest(host, path, method, payload, this.cookie)
    if (respData.data.code === 301) {
      winston.verbose(this.cookie)
      winston.verbose(respData)
    }
    this.user = new User(respData)
    return respData.data
  }
}
module.exports = base
