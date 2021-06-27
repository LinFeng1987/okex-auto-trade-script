exports.calcNextBuyPrice = (price, decreaseRatio) => {
  return price - price * decreaseRatio
}
exports.calcNextSellPrice = (price, increaseRatio) => {
  return price + price * increaseRatio
}

exports.calcRatio = (sod, price) => {
  return (price - sod) / sod
}

exports.toRound = (decimal, len = 2) => {
  const l = Math.pow(10, len)
  return Math.round(decimal * l) / l
}

exports.toPercentage = (decimal) => {
  return Math.round(decimal * 10000) / 100
}

exports.toFixed = (decimal, len = 2) => {
  return Number(this.toRound(decimal, len)).toFixed(len)
}

exports.toCeil = (decimal, len = 2) => {
  const l = Math.pow(10, len)
  return Math.ceil(decimal * l) / l
}

exports.toDecimal = (naturalNumber) => naturalNumber / 100

/**
 * 非通用
 */
exports.calcMinProfitUSDTPrice = (
  amount,
  feeRatio,
  costUSDT,
  minProfitUSDT,
  minTradeAmount
) => {
  const earnUSDT = costUSDT + minProfitUSDT
  const receiveAmount = amount - amount * feeRatio
  let actualSellAmount = receiveAmount - receiveAmount * feeRatio
  if (actualSellAmount < minTradeAmount) {
    actualSellAmount = minTradeAmount
  }
  return earnUSDT / actualSellAmount
}

exports.calcFeeRatio = (amount, deductedAmount) => {
  return deductedAmount / amount
}

exports.calcPrecision = (price) => {
  let precision = 0

  while (price < 1) {
    price *= 10
    precision++
  }

  return precision
}
