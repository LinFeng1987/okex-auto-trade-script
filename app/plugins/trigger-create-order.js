const { createColdDown } = require('../utils')
const { createBuyOrder, createSellOrder } = require('../utils/okex5')

exports.name = '触发创建订单'

exports.apply = (ctx) => {
  const { emitter, state } = ctx

  // 冷却计时器
  // 下单 API 请求 60s/2次
  const coldDown = createColdDown(33)

  emitter.on('ticker', (obj) => {
    if (coldDown.checkIsInColdDown()) return

    const { nextBuyPrice, nextSellPrice } = state
    // 使用触发价格，不使用 `state.price`
    const price = Number(obj.last)

    // 触发买入
    if (price <= nextBuyPrice) {
      createBuyOrder(ctx, price)
    }

    // 触发卖出
    if (price >= nextSellPrice) {
      createSellOrder(ctx, price)
    }
  })

  // 进入冷却
  emitter.on('requestedOrder', coldDown.activeColdDown)
}
