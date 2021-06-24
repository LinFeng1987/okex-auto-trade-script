require('dotenv').config()
const {
  getBuyOrderCreatedText,
  getBuyOrderFinishedText,
  getSellOrderCreatedText,
  getSellOrderFinishedText,
} = require('../message')
const { sendMessage, sendErrorMessage } = require('../message/telegram')

const token = process.env.telegram_bot_token
const chatId = process.env.telegram_bot_chat_id

exports.name = '通知到 Telegram'

exports.when = () => token && chatId

exports.apply = (ctx) => {
  const { emitter } = ctx

  emitter.on('buyOrderCreated', (buyOrder) => {
    sendMessage(getBuyOrderCreatedText(buyOrder))
  })
  emitter.on('buyOrderFinished', (buyOrder) => {
    sendMessage(getBuyOrderFinishedText(buyOrder))
  })
  emitter.on('buyOrderCreatedError', (error) => {
    sendOrderCreatedErrorMessage('买入', error)
  })

  emitter.on('sellOrderCreated', (sellOrder) => {
    sendMessage(getSellOrderCreatedText(sellOrder))
  })
  emitter.on('sellOrderFinished', (sellOrder) => {
    sendMessage(getSellOrderFinishedText(sellOrder))
  })
  emitter.on('sellOrderCreatedError', (error) => {
    sendOrderCreatedErrorMessage('卖出', error)
  })
}

function sendOrderCreatedErrorMessage(side, error) {
  if (error.name === 'InsufficientFunds') {
    sendMessage(
      `*⚠️ ${side}失败，余额不足*
\`${error}\``
    )
  } else {
    sendErrorMessage(
      `*❌ ${side}失败，错误*
\`${error}\``
    ).then(() => {
      process.exit(1)
    })
  }
}
