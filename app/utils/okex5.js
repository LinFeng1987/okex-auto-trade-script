require('dotenv').config()
const ccxt = require('ccxt')
const { findOrder } = require('../store/orders')
const {
  getSellAmountByCurrentStep,
  getBuyAmountByCurrentStep,
} = require('../store/state')
const { toCeil } = require('./calc')

let buyOrdering = false
let sellOrdering = false

exports.okex5 = new ccxt.okex5({
  apiKey: process.env.apiKey,
  secret: process.env.secretKey,
  password: process.env.passphrase,
})

exports.createBuyOrder = (ctx = {}, buyPrice) => {
  const { emitter } = ctx
  const { currentStep, maxStep, symbol } = ctx.state

  if (buyOrdering || currentStep >= maxStep) return

  buyOrdering = true

  // 根据买入阶级获取买入数量
  const buyAmount = getBuyAmountByCurrentStep(currentStep)

  return this.okex5
    .createLimitBuyOrder(symbol, buyAmount, buyPrice)
    .then((res) => {
      const costUSDT = toCeil(buyPrice * buyAmount)
      const orderId = res.id

      ctx.setOrders({
        [orderId]: {
          amount: buyAmount,
          price: buyPrice,
          costUSDT,
          status: 'buyLive',
        },
      })
      ctx.setState({
        currentStep: currentStep + 1,
      })

      emitter.emit('buyOrderCreated', {
        symbol,
        orderId,
        buyPrice,
        buyAmount,
        costUSDT,
      })

      return res
    })
    .catch((error) => {
      emitter.emit('buyOrderCreatedError', error)
    })
    .finally(() => {
      emitter.emit('requestedOrder')
      buyOrdering = false
    })
}

exports.createSellOrder = (ctx = {}, sellPrice) => {
  const { emitter } = ctx
  const { currentStep, symbol, minTradeAmount, safeSellAmount } = ctx.state

  if (sellOrdering || currentStep <= 0) return

  sellOrdering = true

  let sellAmount = getSellAmountByCurrentStep(currentStep)
  const order = findOrder({ amount: sellAmount, status: 'buyFinished' })
  // 安全出售数量
  if (safeSellAmount) {
    // 找出相符订单记录扣除手续费实际获得的数量 `receiveAmount`
    sellAmount = order.receiveAmount
  }

  /**
   * 最小交易数量，如果小于交易商设定则设定为交易商要求最小交易数量
   * 如 ETH 最小交易数量为 0.001 ，创建卖出单数量为 0.0009992 ，则会变为 0.001
   */
  if (sellAmount < minTradeAmount) {
    sellAmount = minTradeAmount
  }

  return this.okex5
    .createLimitSellOrder(symbol, sellAmount, sellPrice)
    .then((res) => {
      const orderId = res.id

      ctx.setState({
        currentStep: currentStep - 1,
      })

      emitter.emit('sellOrderCreated', {
        symbol,
        orderId,
        sellPrice,
        sellAmount,
      })

      return res
    })
    .catch((error) => {
      emitter.emit('sellOrderCreatedError', error)
    })
    .finally(() => {
      emitter.emit('requestedOrder')
      sellOrdering = false
    })
}
