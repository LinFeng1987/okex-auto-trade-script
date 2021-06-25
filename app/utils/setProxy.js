require('dotenv').config()
const kleur = require('kleur')

exports.setProxy = () => {
  if (process.env.http_proxy) {
    const proxy = require('node-global-proxy').default
    proxy.setConfig(process.env.http_proxy)
    console.info('Using proxy:', kleur.cyan(process.env.http_proxy))
    console.log()
    proxy.start()
  }
}
