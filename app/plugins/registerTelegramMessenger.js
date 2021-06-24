require('dotenv').config()
const { default: axios } = require('axios')
const kleur = require('kleur')

const token = process.env.telegram_bot_token
const chat_id = process.env.telegram_bot_chat_id
const url = `https://api.telegram.org/bot${token}`

exports.name = '注册 Telegram 通知'

exports.when = () => token && chat_id

exports.apply = (ctx) => {
  const { emitter } = ctx
  emitter.emit('collectMessenger', { sendMessage })
}

function sendMessage(text) {
  return axios
    .post(`${url}/sendMessage`, {
      chat_id,
      text,
      parse_mode: 'MarkdownV2',
    })
    .catch(console.error)
}