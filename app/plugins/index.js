const kleur = require('kleur')
const okexSubscribePublic = require('./okexSubscribePublic')
const okexSubscribePrivate = require('./okexSubscribePrivate')
const adjustNextPrice = require('./adjustNextPrice')
const printLog = require('./printLog')
const triggerOrder = require('./triggerCreateOrder')
const messenger = require('./messenger')
const registerTelegramMessenger = require('./registerTelegramMessenger')

const plugins = [
  okexSubscribePublic,
  okexSubscribePrivate,
  adjustNextPrice,
  printLog,
  triggerOrder,
  // 通知
  messenger,
  registerTelegramMessenger,
]

exports.applyPlugins = (ctx) => {
  plugins.forEach((plugin) => {
    if (plugin.when && !plugin.when(ctx)) return

    if (plugin.name) {
      let name = plugin.name
      if (typeof plugin.name === 'function') {
        name = plugin.name(ctx)
      }
      console.info('Apply plugin:', kleur.cyan(name))
    }

    if (plugin.apply) {
      plugin.apply(ctx)
    }
  })
  console.info()
}
