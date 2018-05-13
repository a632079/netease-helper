const Base = require('../base')
class Weblog extends Base {
  /**
   * 发送日记
   * @param {object} params 用于合并的参数
   */
  async sendLog (params) {
    const data = {
      'csrf_token': ''
    }
    Object.assign(data, params)
    return this.requestWithSetCookie(
      'music.163.com',
      '/weapi/feedback/weblog',
      'POST',
      data
    )
  }
  /**
   * 发送歌曲播放记录
   * @param {number} songId 歌曲 Id
   * @param {number} timeTick 当前播放时间
   */
  async sendPlaySongRecord (songId, timeTick = 61) {
    const data = {
      'logs': [{
        'action': 'play',
        'json': {
          'end': 'ui',
          'id': songId,
          'time': timeTick,
          'type': 'song'
        }
      }],
      'csrf_token': ''
    }
    return this.requestWithSetCookie(
      'music.163.com',
      '/weapi/feedback/weblog',
      'POST',
      data
    )
  }
}
module.exports = Weblog
