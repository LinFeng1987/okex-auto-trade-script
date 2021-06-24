const kleur = require('kleur')
const okexSubscribePublic = require('./okex-subscribe-public')
const okexSubscribePrivate = require('./okex-subscribe-private')
const adjustNextPrice = require('./adjust-next-price')
const printLog = require('./print-log')
const triggerOrder = require('./trigger-create-order')
const messenger = require('./messenger')
const registerTelegramMessenger = require('./register-telegram-messenger')

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
      console.log('Apply plugin:', kleur.cyan(name))
    }

    if (plugin.apply) {
      plugin.apply(ctx)
    }
  })
}
