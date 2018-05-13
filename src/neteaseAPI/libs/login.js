// 导入包
const Base = require('../base')
const { createHash } = require('crypto')

// 暂不支持 Email 登录， 仅支持手机登入
class Login extends Base {
  async cellphoneLogin (phone, password) {
    const md5sum = createHash('md5')
    md5sum.update(password)
    return this.requestWithSetCookie(
      'music.163.com',
      '/weapi/login/cellphone',
      'POST',
      {
        phone,
        password: md5sum.digest('hex'),
        rememberLogin: 'true'
      }
    )
  }
  /**
   * 刷新登录，刷新内部存储的 cookie 信息
   * @returns {Promise<any>}
   */
  async refreshLogin () {
    return this.requestWithSetCookie(
      'music.163.com',
      '/weapi/login/token/refresh',
      'POST',
      {
        csrf_token: ''
      }
    )
  }
}

module.exports = Login
