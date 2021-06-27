const test = require('ava')

const {
  toRound,
  calcPrecision,
  calcFeeRatio,
  calcMinProfitUSDTPrice,
  toCeil,
} = require('../app/utils/calc')

test('get decimal precision', (t) => {
  t.is(calcPrecision(0.01), 2)
  t.is(calcPrecision(0.001), 3)
})

test('calc min profit USDT price', (t) => {
  // ETH taker
  // 买入 0.002，手续费率 0.1%，花费 3.62 USDT，最小盈利 0.1 USDT，币种最少买入数量
  t.is(toCeil(calcMinProfitUSDTPrice(0.002, 0.001, 3.62, 0.1, 0.001)), 1863.73)
  // 同上，最小盈利变为 1 USDT
  t.is(toCeil(calcMinProfitUSDTPrice(0.002, 0.001, 3.62, 1, 0.001)), 2314.63)
})

test('fee ratio', (t) => {
  // taker 0.1%
  t.is(toRound(calcFeeRatio(0.001, 0.000001), 4), 0.001)
  // maker 0.08%
  t.is(toRound(calcFeeRatio(0.001, 0.0000008), 4), 0.0008)
})
