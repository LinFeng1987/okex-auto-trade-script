require('dotenv').config()

exports.setProxy = () => {
  if (process.env.http_proxy) {
    const proxy = require('node-global-proxy').default
    proxy.setConfig(process.env.http_proxy)
    proxy.start()
  }
}
