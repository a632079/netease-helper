const axios = require('axios')
const qs = require('querystring')
const querystring = qs
const _ = require('lodash')
const Cookie = require('cookie')
const Encrypt = require('./crypto')

function randomUserAgent () {
  const userAgentList = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
    'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
  ]
  /* tslint:enable:max-line-length */
  const num = Math.floor(Math.random() * userAgentList.length)
  return userAgentList[num]
}

async function createWebAPIRequest (
  host,
  path,
  method,
  data,
  cookie
) {
  // 解决方法参考 https://github.com/Binaryify/NeteaseCloudMusicApi/pull/244/commits/0d2b2fb60336c8f2727a4bee3280a5e8d691837e
  let csrfToken = ''
  for (let single of cookie) {
    if (single.match(/_csrf=[^(;|$)]+;/g)) {
      // 存在 csrf_token 的值
      csrfToken = single.match(/_csrf=[^(;|$)]+/g)[0].slice(6)
    }
  }
  // console.log(csrfToken)
  data.csrf_token = csrfToken
  const cryptoreq = Encrypt(data)
  const options = {
    method,
    data: querystring.stringify({
      encSecKey: cryptoreq.encSecKey,
      params: cryptoreq.params
    }),
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie,
      'Host': 'music.163.com',
      'Referer': 'http://music.163.com',
      'User-Agent': randomUserAgent()
    },
    url: `http://${host}${path}`
  }

  const resp = await axios.request(options)

  if (!resp.data) {
    const err = resp.data ? new Error(resp.data.msg) : new Error('Request failed.')
    err.response = err
    throw err
  }
  let cookies = resp.headers['set-cookie']
  if (Array.isArray(cookie)) {
    cookie = cookie
      .map(x => x.replace(/.music.163.com/g, ''))
      .sort((a, b) => a.length - b.length)
    // 去除空值
    const cookieToRemove = []
    for (let i = 0; i < cookie.length; i++) {
      const current = cookie[i]
      // 首先， 解析数组并且抹除 Cookie 附加的内容
      const cookieObj = Cookie.parse(current)
      delete cookieObj.Expires
      delete cookieObj.Path
      delete cookieObj.Domain

      // 抹除完之后应该就一个参数了， 迭代只执行一次
      // console.log(cookieObj)
      await _.map(cookieObj, value => {
        if (!value) {
          // 为空， 加入删除数组
          cookieToRemove.push(current)
        }
      })
    }
    // 移除参数
    _.pull(cookie, cookieToRemove)
  }
  return {
    cookie: cookies,
    data: resp.data
  }
}

async function createRequest (path, method, data) {
  const options = {
    method,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'appver=1.5.2',
      'Referer': 'http://music.163.com',
      'Host': 'music.163.com',
      'User-Agent': randomUserAgent()
    },
    url: `http://music.163.com${path}`
  }

  if (method.toLowerCase() === 'post') {
    options.data = data
  }

  const resp = await axios.request(options)
  return resp.data
}

module.exports = {
  createRequest,
  createWebAPIRequest
}
