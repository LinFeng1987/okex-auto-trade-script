const {
  toCeil,
  calcNextBuyPrice,
  calcNextSellPrice,
  toDecimal,
} = require('../utils/calc')

exports.name = (ctx) => {
  return (ctx.state.dynamicNextPrice ? '根据趋势动态' : '') + '调整下次触发价格'
}

exports.apply = (ctx) => {
  const { emitter } = ctx

  emitter.on('buyOrderCreated', (buyOrder) => {
    adjustNextPrice(ctx, buyOrder.buyPrice)
  })
  emitter.on('sellOrderCreated', (sellOrder) => {
    adjustNextPrice(ctx, sellOrder.sellPrice)
  })
}

function adjustNextPrice(ctx, price) {
  const { state, setState } = ctx

  let decreaseRatio = state.baseDecreaseRatio
  let increaseRatio = state.baseIncreaseRatio

  // 允许动态调整下次买入卖出价格
  if (state.dynamicNextPrice) {
    // 超出允许涨跌比率
    if (Math.abs(state.fluctuationRatio) > state.allow24hFluctuation) {
      // 涨
      if (state.fluctuationRatio > 0) {
        decreaseRatio =
          state.baseDecreaseRatio + toDecimal(state.currentStep / 4)
        increaseRatio = state.baseIncreaseRatio + state.currentStep
      }
      // 跌
      else {
        decreaseRatio = state.baseDecreaseRatio + state.currentStep
        increaseRatio =
          state.baseIncreaseRatio + toDecimal(state.currentStep / 4)
      }
    }
    // 可接受涨跌比率内调整
    else {
      decreaseRatio = state.baseDecreaseRatio + toDecimal(state.currentStep / 4)
      increaseRatio = state.baseIncreaseRatio + toDecimal(state.currentStep / 4)
    }
  }

  setState({
    decreaseRatio,
    increaseRatio,
    nextBuyPrice: toCeil(
      calcNextBuyPrice(price, decreaseRatio),
      state.pricePrecision
    ),
    nextSellPrice: toCeil(
      calcNextSellPrice(price, increaseRatio),
      state.pricePrecision
    ),
  })
}
