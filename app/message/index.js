const kleur = require('kleur')
const telegram = require('./telegram')

exports.sendMessage = (text) => {
  return telegram.sendMessage(text)
}

exports.sendErrorMessage = (text) => {
  console.log(kleur.red(text))
  return this.sendMessage(
    `程序已停止运行，原因如下:
${text}`
  )
}

exports.getBuyOrderCreatedText = (buyOrder) => {
  return `💵 买入*创建* \`${buyOrder.symbol}\`
订单 \`${buyOrder.orderId}\`
买入价 \`${buyOrder.buyPrice}\`
买入数量 \`${buyOrder.buyAmount}\`
买入花费 \`${buyOrder.costUSDT}\`
`
}

exports.getBuyOrderFinishedText = (buyOrder) => {
  return `💵 买入*完成* \`${buyOrder.symbol}\`
订单 \`${buyOrder.ordId}\`
买入价 \`${buyOrder.price}\`
买入数量 \`${buyOrder.amount}\`
买入花费 \`${buyOrder.costUSDT}\`
手续数量 \`${buyOrder.fee}\`
实得数量 \`${buyOrder.receiveAmount}\`
`
}

exports.getSellOrderCreatedText = (sellOrder) => {
  return `💰 卖出*创建* \`${sellOrder.symbol}\`
订单 \`${sellOrder.orderId}\`
卖出价 \`${sellOrder.sellPrice}\`
卖出数量 \`${sellOrder.sellAmount}\`
`
}

exports.getSellOrderFinishedText = (sellOrder) => {
  return `💰 卖出*完成* \`${sellOrder.symbol}\`
订单 \`${sellOrder.orderId}\`
卖出价 \`${sellOrder.sellPrice}\`
卖出数量 \`${sellOrder.sellAmount}\`
盈利 USDT \`${sellOrder.profitUSDT}\`
`
}
