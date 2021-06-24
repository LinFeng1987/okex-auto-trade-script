const {
  toRound,
  calcPrecision,
  calcFeeRatio,
  calcMinProfitUSDTPrice,
  toCeil,
  toPercentage,
} = require('../app/utils/calc')

console.log(calcPrecision(0.01)) // 2

console.log(toRound(calcFeeRatio(0.001, 0.000001), 4)) // 0.001
console.log(toRound(calcFeeRatio(0.001, 0.0000008), 4)) // 0.0008

console.log(toCeil(calcMinProfitUSDTPrice(0.001, 0.001, 1.94, 0.01, 0.001))) // 1953.91
console.log(toCeil(calcMinProfitUSDTPrice(0.002, 0.0008, 3.79, 0.01, 0.001))) // 1903.05
// 1858.21
console.log(toCeil(calcMinProfitUSDTPrice(0.003, 0.0008, 5.57, 0.01, 0.001))) // 1862.98

console.log(toCeil(5 / 4))
console.log(toPercentage(1))
