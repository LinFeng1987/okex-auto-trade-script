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
  const minProfitUSDTPrice = toCeil(
    calcMinProfitUSDTPrice(0.002, 0.001, 3.62, 0.1, 0.001)
  )
  t.is(minProfitUSDTPrice, 1863.73)
})

test('fee ratio', (t) => {
  // taker 0.1%
  t.is(toRound(calcFeeRatio(0.001, 0.000001), 4), 0.001)
  // maker 0.08%
  t.is(toRound(calcFeeRatio(0.001, 0.0000008), 4), 0.0008)
})
