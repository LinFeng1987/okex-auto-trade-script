const Websocket = require('ws')
const _get = require('lodash.get')
const { sendErrorMessage } = require('../message')
const { createCounter } = require('../utils')
const { calcRatio } = require('../utils/calc')

exports.name = '订阅 OKEx 行情频道'

exports.apply = (ctx) => {
  const ws = new Websocket('wss://ws.okex.com:8443/ws/v5/public')

  const { state, setState, emitter } = ctx
  const instId = state.symbol.replace('/', '-')

  const subscribeArg = {
    op: 'subscribe',
    args: [
      {
        channel: 'tickers',
        instId,
      },
    ],
  }
  const unSubscribeArg = { ...subscribeArg, op: 'unsubscribe' }

  // 1分钟无响应退订，并触发退订信息重新订阅
  const reSubscribeCounter = createCounter(60, () => {
    ws.send(JSON.stringify(unSubscribeArg))
  })
  const wsPingPongCounter = createCounter(25, () => ws.send('ping'))

  ws.on('open', () => {
    ws.send(JSON.stringify(subscribeArg))
  })
  ws.on('message', (msg) => {
    if (msg === 'pong') {
      wsPingPongCounter.resetCount()
    } else {
      reSubscribeCounter.resetCount()
      const data = JSON.parse(msg)
      // 重新订阅
      if (data.event === 'unsubscribe') {
        ws.send(JSON.stringify(subscribeArg))
      }
      if (data.event === 'error') {
        sendErrorMessage(data).then(() => {
          process.exit(1)
        })
      }

      if (_get(data, 'arg.instId') === instId && data.data) {
        const obj = data.data[0]
        const sodUTC8 = Number(obj.sodUtc8)
        const price = Number(obj.last)

        setState({
          sodUTC8,
          high24h: Number(obj.high24h),
          low24h: Number(obj.low24h),
          price,
          fluctuationRatio: calcRatio(sodUTC8, price),
        })

        // core
        emitter.emit('ticker', obj)
      }
    }
  })
}
