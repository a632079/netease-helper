const Base = require('../base')

class Add extends Base {
  /**
   * 添加歌曲到歌单
   * @param {number} playlistId 歌单 ID
   * @param {string|number|Array<number>} songIds 音乐 ID
   */
  async addSongs (playlistId, songIds) {
    if (typeof songIds === 'string' || typeof songIds === 'number') {
      // 如果是 string or Number
      songIds = [parseInt(songIds)]
    }
    const requestData = {
      csrf_token: '',
      op: 'add',
      pid: playlistId,
      tracks: songIds.toString(),
      trackIds: JSON.stringify(songIds)
    }
    return this.requestWithSetCookie(
      'music.163.com',
      '/weapi/playlist/manipulate/tracks',
      'POST',
      requestData
    )
  }

  /**
   * 删除歌单内的歌曲
   * @param {number} playlistId 歌单 ID
   * @param {string|number|Array<number>} songIds 音乐 ID
   */
  async deleteSongs (playlistId, songIds) {
    if (typeof songIds === 'string' || typeof songIds === 'number') {
      // 如果是 string or Number
      songIds = [parseInt(songIds)]
    }
    const requestData = {
      csrf_token: '',
      op: 'del',
      pid: playlistId,
      tracks: songIds.toString(),
      trackIds: JSON.stringify(songIds)
    }
    return this.requestWithSetCookie(
      'music.163.com',
      '/weapi/playlist/manipulate/tracks',
      'POST',
      requestData
    )
  }
}

module.exports = Add
