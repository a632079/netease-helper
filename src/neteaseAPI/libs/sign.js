const Base = require('../base')
class Sign extends Base {
  /**
   * 网易云签到
   * @param {number} 签到种类。 0 为 Android, 1 为 Web
   * @returns {Promise<object>}
   */
  async sign (type = 0) {
    return this.requestWithSetCookie(
      'music.163.com',
      '/weapi/point/dailyTask',
      'POST',
      {
        'csrf_token': '',
        'type': type
      }
    )
  }
}

module.exports = Sign
