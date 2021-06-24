const { setProxy } = require('./utils/set-proxy')
setProxy()

const _get = require('lodash.get')
const mitt = require('mitt')
const {
  calcNextBuyPrice,
  calcNextSellPrice,
  toRound,
  calcPrecision,
} = require('./utils/calc')
const { okex5 } = require('./utils/okex5')
const { state, setState } = require('./store/state')
const { orders, setOrders } = require('./store/orders')
const userStrategy = require('../strategy.json')
const { applyPlugins } = require('./plugins')

async function main() {
  const emitter = mitt()
  const symbol = userStrategy.symbol + '/USDT'

  const ctx = {
    state,
    setState,
    orders,
    setOrders,
    emitter,
  }

  console.log(`正在获取交易所信息...\n`)
  const [markets, ticker] = await Promise.all([
    okex5.loadMarkets(),
    okex5.fetchTicker(symbol),
  ])
  const symbolMarket = markets[symbol]
  const basePrice = userStrategy.basePrice || _get(ticker, 'last')
  const pricePrecision = calcPrecision(symbolMarket.precision.price)
  const amountPrecision = calcPrecision(symbolMarket.precision.amount)

  setState({
    ...userStrategy,
    symbol,
    minTradeAmount: symbolMarket.limits.amount.min,
    nextBuyPrice: toRound(
      calcNextBuyPrice(basePrice, userStrategy.baseDecreaseRatio),
      pricePrecision
    ),
    nextSellPrice: toRound(
      calcNextSellPrice(basePrice, userStrategy.baseIncreaseRatio),
      pricePrecision
    ),
    currentStep: 0,
    pricePrecision,
    amountPrecision,
  })

  applyPlugins(ctx)
}

main()
