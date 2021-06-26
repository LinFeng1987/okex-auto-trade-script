require('dotenv').config()
const Websocket = require('ws')
const _get = require('lodash.get')
const { hmac } = require('ccxt/js/base/functions')
const { createCounter } = require('../utils')
const {
  toRound,
  calcFeeRatio,
  toCeil,
  calcMinProfitUSDTPrice,
} = require('../utils/calc')
const { removeOrderByOrderId } = require('../store/orders')
const { websocketErrorMessageMap } = require('../misc/websocketErrorMessageMap')

exports.name = '订阅 OKEx 订单频道'

exports.apply = (ctx) => subscribePrivate(ctx)

function subscribePrivate(ctx) {
  const timestamp = Date.now() / 1000
  const ws = new Websocket('wss://ws.okex.com:8443/ws/v5/private')

  const { state, orders, setOrders, emitter } = ctx
  const { symbol } = state
  const instId = symbol.replace('/', '-')

  const subscribeArg = {
    op: 'subscribe',
    args: [
      {
        channel: 'orders',
        instType: 'SPOT',
        instId,
      },
    ],
  }
  const unSubscribeArg = { ...subscribeArg, op: 'unsubscribe' }

  // 10分钟无响应退订，并触发退订信息重新订阅
  const reSubscribeCounter = createCounter(600, () => {
    ws.send(JSON.stringify(unSubscribeArg))
  })
  const wsPingPongCounter = createCounter(23, () => ws.send('ping'))

  ws.on('open', () => {
    ws.send(
      JSON.stringify({
        op: 'login',
        args: [
          {
            apiKey: process.env.apiKey,
            passphrase: process.env.passphrase,
            timestamp,
            sign: hmac(
              timestamp + 'GET' + '/users/self/verify',
              process.env.secretKey,
              'sha256',
              'base64'
            ),
          },
        ],
      })
    )

    ws.on('error', () => subscribePrivate(ctx))

    ws.on('message', (msg) => {
      if (msg === 'pong') {
        wsPingPongCounter.resetCount()
      } else {
        reSubscribeCounter.resetCount()
        const data = JSON.parse(msg)
        if (data.event === 'login' && data.code === '0') {
          ws.send(JSON.stringify(subscribeArg))
        } else {
          // 重新订阅
          if (data.event === 'unsubscribe') {
            ws.send(JSON.stringify(subscribeArg))
          }
          if (data.event === 'error') {
            emitter.emit(
              'sendErrorMessage',
              websocketErrorMessageMap[data.code]
            )
          }

          if (_get(data, 'arg.instId') === instId && data.data) {
            const obj = data.data[0]
            const orderId = obj.ordId

            console.log(obj)
            // 只处理由本程序产生的订单
            if (orders[orderId]) {
              if (obj.state === 'filled') {
                if (obj.side === 'buy') {
                  const fee = Math.abs(Number(obj.fee))
                  const receiveAmount = orders[orderId].amount - fee

                  // 保留 4 位小数 e.g. `0.0008 = 0.08%`
                  const feeRatio = toRound(
                    calcFeeRatio(orders[orderId].amount, fee),
                    4
                  )

                  setOrders({
                    [obj.ordId]: {
                      receiveAmount,
                      feeRatio,
                      minProfitUSDTPrice: toCeil(
                        calcMinProfitUSDTPrice(
                          orders[obj.ordId].amount,
                          feeRatio,
                          orders[obj.ordId].costUSDT,
                          state.minProfitUSDT,
                          state.minTradeAmount
                        ),
                        state.pricePrecision
                      ),
                      status: 'buyFinished',
                    },
                  })

                  emitter.emit('buyOrderFinished', {
                    symbol,
                    orderId,
                    buyPrice: orders[orderId].price,
                    buyAmount: orders[orderId].amount,
                    costUSDT: orders[orderId].costUSDT,
                    fee,
                    receiveAmount,
                  })
                }
                if (obj.side === 'sell') {
                  console.log('mark:sellOrderFinished')
                  emitter.emit('sellOrderFinished', {
                    symbol,
                    orderId,
                    sellPrice: obj.px,
                    sellAmount: obj.sz,
                    profitUSDT:
                      Number(obj.px) * Number(obj.sz) -
                      orders[orderId].costUSDT,
                  })
                  removeOrderByOrderId(orderId)
                }
              }
            }
          }
        }
      }
    })
  })
}
