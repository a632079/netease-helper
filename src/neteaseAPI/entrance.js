const Base = require('./base')
const Add = require('./libs/add')
const Login = require('./libs/login')
const Personal = require('./libs/personal')
const Sign = require('./libs/sign')
const Weblog = require('./libs/weblog')

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
function applyMixins (derivedCtor, baseCtors) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
}
class API extends Base {}
applyMixins(API, [
  Add,
  Login,
  Personal,
  Sign,
  Weblog
])
module.exports = API
