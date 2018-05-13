/**
 * 存储于用户相关的数据
 */

class User {
  constructor (store) {
    this.info = store.data && store.data.account ? store.data : this.info
    this.cookie = store.cookie ? store.cookie : this.cookie
  }

  get id () {
    return this.info.profile.userId
  }

  get nickname () {
    return this.info.profile.nickname
  }

  get avatarUrl () {
    return this.info.profile.avatarUrl
  }

  get signature () {
    return this.info.profile.signature
  }

  toJSON () {
    return {
      cookie: this.cookie,
      data: this.info
    }
  }
}

module.exports = User
