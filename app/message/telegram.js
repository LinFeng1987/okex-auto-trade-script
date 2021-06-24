require('dotenv').config()
const { default: axios } = require('axios')
const kleur = require('kleur')

const token = process.env.telegram_bot_token
const chatId = process.env.telegram_bot_chat_id

const url = `https://api.telegram.org/bot${token}`

exports.sendMessage = (text) => {
  if (!token || !chatId) {
    return new Promise()
  }
  return axios
    .post(`${url}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2',
    })
    .catch(console.error)
}

exports.sendErrorMessage = (text) => {
  console.log(kleur.red(text))
  return this.sendMessage(
    `程序已停止运行，原因如下:
${text}`
  )
}
