exports.name = 'ping'

exports.apply = (ctx) => {
  setInterval(() => {
    ctx.emitter.emit('ping')
  }, 1000)
}
