const { orders, setOrders, findOrderX } = require('../app/store/orders')
const {
  toRound,
  calcMinProfitUSDTPrice,
  calcFeeRatio,
} = require('../app/utils/calc')

const ctx = { orders, setOrders }

const orderId = '327049644647804928'
const deductedFee = '-0.0000008'
// const deductedFee = '-0.000001'
const minProfitUSDT = 0.01

setOrders({
  [orderId]: {
    amount: 0.001,
    price: 2167.02,
    costUSDT: toRound(2.16702),
  },
})

const feeRatio = toRound(
  calcFeeRatio(orders[orderId].amount, Math.abs(Number(deductedFee))),
  4
)

setOrders({
  [orderId]: {
    receiveAmount: orders[orderId].amount - Math.abs(Number(deductedFee)),
    feeRatio,
    minProfitUSDTPrice: toRound(
      calcMinProfitUSDTPrice(
        orders[orderId].price,
        orders[orderId].amount,
        feeRatio,
        minProfitUSDT
      )
    ),
  },
})

console.log(orders[orderId])
console.log(ctx.orders)
