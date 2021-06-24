const _findKey = require('lodash.findkey')

/**
 * @typedef {{
 *  [orderId: string]: {
 *    amount: number
 *    receiveAmount: number
 *    price: number
 *    sellPrice: number
 *    minProfitUSDTPrice: number
 *    costUSDT: number
 *    status: 'buyLive' | 'buyFinished' | 'sellLive'
 *  }
 * }} Order
 */

/** @type Order */
const orders = {}

exports.orders = orders
exports.setOrders = (obj = {}) => {
  Object.keys(obj).forEach((k) => {
    orders[k] = { ...orders[k], ...obj[k] }
  })
}

exports.removeOrderByOrderId = (orderId) => {
  delete orders[orderId]
}

exports.findOrder = (predicate) => orders[_findKey(orders, predicate)]
