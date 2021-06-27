require('dotenv').config()
const { default: axios } = require('axios')
const crypto = require('crypto')

const token = process.env.dingtalk_bot_access_token
const secret = process.env.dingtalk_bot_secret
const url = `https://oapi.dingtalk.com/robot/send`

exports.name = '注册 钉钉 通知'

exports.when = () => token && secret

exports.apply = (ctx) => {
  ctx.emitter.emit('collectMessenger', { sendMessage })
}

function sendMessage(text) {
  const timestamp = Date.now()
  const stringToSign = `${timestamp}\n${secret}`
  const stringHmac = crypto
    .createHmac('sha256', secret)
    .update(stringToSign)
    .digest()
    .toString('base64')
  const sign = encodeURI(stringHmac)

  return axios
    .post(
      url,
      {
        msgtype: 'markdown',
        markdown: {
          title: 'OKEx 交易',
          text,
        },
      },
      {
        params: {
          access_token: token,
          timestamp,
          sign,
        },
      }
    )
    .catch(console.error)
}
