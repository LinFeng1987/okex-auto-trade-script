const readline = require('readline')
const kleur = require('kleur')
const {
  getBuyAmountByCurrentStep,
  getSellAmountByCurrentStep,
} = require('../store/state')
const { toFixed, toPercentage } = require('../utils/calc')

exports.name = '打印交易信息面板'

exports.apply = (ctx) => {
  const { emitter } = ctx

  emitter.on('printLog', () => log(ctx))
  emitter.on('ticker', () => log(ctx))
}

function log({ state }) {
  const isDown = state.fluctuationRatio < 0

  const nextBuyAmount = getBuyAmountByCurrentStep(state.currentStep)
  const nextSellAmount = getSellAmountByCurrentStep(state.currentStep)

  // prettier-ignore
  const string = `${kleur.cyan('OKEx')} 自动交易中...
运行时长 ${kleur.cyan(state.runningTime)}

${kleur.green(state.symbol)}
最近成交价: ${kleur[state.price < state.sodUTC8 ? 'red' : 'green'](state.price)}
UTC8 开盘价: ${kleur.cyan(state.sodUTC8)}\t\t涨跌%: ${kleur[isDown ? 'red' : 'green']((isDown ? '' : '+') + toPercentage(state.fluctuationRatio) + '%')}
24 小时最高价: ${kleur.cyan(state.high24h)}\t\t24 小时最低价: ${kleur.cyan(state.low24h)}

------------------------------

当前买入阶级: ${kleur.cyan(state.currentStep)}\t\t\t允许最大买入阶级: ${kleur.cyan(state.maxStep)}
${
  nextBuyAmount
    ? `下次触发买入价格: ${kleur.green(toFixed(state.nextBuyPrice))}\t买入数量: ${kleur.green(nextBuyAmount)}`
    : kleur.bold('已达到最大买入阶级，暂停买入')
}
${
  nextSellAmount
    ? `下次触发卖出价格: ${kleur.red(toFixed(state.nextSellPrice))}\t卖出数量: ${kleur.green(nextSellAmount)}`
    : kleur.bold('买入阶级为0，不卖出')
}

------------------------------
`

  clearConsole()
  console.log(string)
}

function clearConsole() {
  const repeatCount = process.stdout.rows - 2
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}
