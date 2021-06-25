const kleur = require('kleur')

exports.name = '通知'

exports.apply = (ctx) => {
  const { emitter } = ctx
  const messengers = []

  emitter.on('collectMessenger', (messenger) => messengers.push(messenger))

  emitter.on('sendMessage', (text) => {
    Promise.all(messengers.map(({ sendMessage }) => sendMessage(text)))
  })

  emitter.on('sendErrorMessage', (text) => {
    console.error(kleur.bgRed(' ERROR '))
    console.error(text)
    Promise.all(
      messengers.map(({ sendMessage }) => {
        return sendMessage(`程序已停止运行，原因如下:\n\`${text}\``)
      })
    ).finally(() => {
      process.exit(1)
    })
  })

  emitter.on('buyOrderCreated', (buyOrder) => {
    emitter.emit(
      'sendMessage',
      `💵 买入*创建* \`${buyOrder.symbol}\`
订单 \`${buyOrder.orderId}\`
买入价 \`${buyOrder.buyPrice}\`
买入数量 \`${buyOrder.buyAmount}\`
买入花费 \`${buyOrder.costUSDT}\`
`
    )
  })
  emitter.on('buyOrderFinished', (buyOrder) => {
    emitter.emit(
      'sendMessage',
      `💵 买入*完成* \`${buyOrder.symbol}\`
订单 \`${buyOrder.orderId}\`
买入价 \`${buyOrder.buyPrice}\`
买入数量 \`${buyOrder.buyAmount}\`
买入花费 \`${buyOrder.costUSDT}\`
手续数量 \`${buyOrder.fee}\`
实得数量 \`${buyOrder.receiveAmount}\`
`
    )
  })
  emitter.on('buyOrderCreatedError', (error) => {
    sendOrderCreatedErrorMessage(ctx, '买入', error)
  })

  emitter.on('sellOrderCreated', (sellOrder) => {
    emitter.emit(
      'sendMessage',
      `💰 卖出*创建* \`${sellOrder.symbol}\`
订单 \`${sellOrder.orderId}\`
卖出价 \`${sellOrder.sellPrice}\`
卖出数量 \`${sellOrder.sellAmount}\`
`
    )
  })
  emitter.on('sellOrderFinished', (sellOrder) => {
    emitter.emit(
      'sendMessage',
      `💰 卖出*完成* \`${sellOrder.symbol}\`
订单 \`${sellOrder.orderId}\`
卖出价 \`${sellOrder.sellPrice}\`
卖出数量 \`${sellOrder.sellAmount}\`
盈利 USDT \`${sellOrder.profitUSDT}\`
`
    )
  })
  emitter.on('sellOrderCreatedError', (error) => {
    sendOrderCreatedErrorMessage(ctx, '卖出', error)
  })
}

function sendOrderCreatedErrorMessage({ emitter }, side, error) {
  if (error.name === 'InsufficientFunds') {
    emitter.emit(
      'sendMessage',
      `*⚠️ ${side}失败，余额不足*
\`${error}\``
    )
  } else {
    emitter.emit(
      'sendErrorMessage',
      `*❌ ${side}失败，错误*
\`${error}\``
    )
  }
}
