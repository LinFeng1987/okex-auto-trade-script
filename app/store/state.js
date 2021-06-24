const state = {
  /**
   * 开盘价
   * @private
   */
  sodUTC8: 0,
  /**
   * 24 小时最高价
   * @private
   */
  high24h: 0,
  /**
   * 24 小时最低价
   * @private
   */
  low24h: 0,
  /**
   * 币种，大写字母
   * @example `BTC` | `ETH`
   * @requires
   */
  symbol: '',
  /**
   * 基准价格，为 0 则获取当前交易价
   * @example 2000
   * @requires
   */
  basePrice: 0,
  /**
   * 最新成交价
   * @private
   */
  price: 0,
  /**
   * 最小盈利 USDT 数量，购买数量不是最低交易要求即可避免
   * @experiment 实验性功能
   */
  minProfitUSDT: 0.1,
  /**
   * 最小交易数量
   * @private
   */
  minTradeAmount: 0,
  /**
   * 根据当前买入阶级选择买入数量
   * @example `[0.01, 0.02, 0.03]` 如果当前买入阶级为 0 则买入 0.01 个，1 则买入 0.02 个，2 或以上则买入 0.03 个
   * @requires
   */
  amounts: [],
  /**
   * 开盘以来涨跌比率
   * @example `0.01` 表示为 `1%`, `-0.01` 表示为 `-1%`
   * @private
   */
  fluctuationRatio: 0,
  /**
   * 允许 24 小时内涨跌比率，以开盘价计算
   * @description 与 `fluctuationRatio` 不同，这里不允许负数
   * @example `0.01` 表示为 `1%`
   */
  allow24hFluctuationRatio: 0,
  /**
   * 基准跌幅 用于计算下次买入价格
   * @example `0.02` 表示为 `2%`
   */
  baseDecreaseRatio: 0.02,
  /**
   * @private
   */
  decreaseRatio: 0,
  /**
   * 基准涨幅 用于计算下次卖出价格
   * @example `0.02` 表示为 `2%`
   */
  baseIncreaseRatio: 0.02,
  /**
   * @private
   */
  increaseRatio: 0,
  /**
   * 下次买入价格
   * @private
   */
  nextBuyPrice: 0,
  /**
   * 下次卖出价格
   * @private
   */
  nextSellPrice: 0,
  /**
   * 动态调整下次买入卖出价格
   */
  dynamicNextPrice: true,
  /**
   * 当前买入阶级
   * @private
   */
  currentStep: 0,
  /**
   * 允许最大买入阶级
   * @description 数值越大就越追跌
   * @requires
   */
  maxStep: 0,
  /**
   * 交易价格精度
   * @description `ETH/USDT` 为 2，则价格四舍五入至 2 位小数，`2201.46` `BTC/USDT` 为 1，则 `33412.8`
   * @private
   */
  pricePrecision: 1,
  /**
   * 交易数量精度
   * @private
   */
  amountPrecision: 1,
  /**
   * 安全出售数量
   * @description `true` 为仅卖出上次实际到账数量(即扣除手续费后剩余数量) `false` 为始终根据阶级卖出数量
   */
  safeSellAmount: false,
}

exports.state = state
exports.setState = (obj = {}) => {
  Object.keys(obj).forEach((k) => (state[k] = obj[k]))
}

exports.getBuyAmountByCurrentStep = (currentStep) => {
  let i = currentStep
  if (currentStep >= state.amounts.length) {
    i = state.amounts.length - 1
  }

  return state.amounts[i]
}

exports.getSellAmountByCurrentStep = (currentStep) => {
  return state.amounts[currentStep - 1] || 0
}
