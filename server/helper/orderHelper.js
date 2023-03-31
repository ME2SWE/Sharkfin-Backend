module.exports = {
  dataType: async (orderObj) => {
    let amount = Number.parseFloat(orderObj.amount)
    if (!Number.isInteger(amount)) {
      let floatAmount = parseFloat(orderObj.amount)
      orderObj.amount = floatAmount

    } else {

      let wholeAmount = parseInt(orderObj.amount)
      orderObj.amount = wholeAmount
    }


    for (let key in orderObj.equity) {
      // find whole or float
      let num = Number.parseFloat(orderObj.equity[key])
      if (!Number.isInteger(num)) {
        let float = parseFloat(orderObj.equity[key])
        orderObj.equity[key] = float

      } else {

        let whole = parseInt(orderObj.equity[key])
        orderObj.equity[key] = whole
      }
    }

    for (let key in orderObj.newRemaining) {
      // find whole or float
      let num = Number.parseFloat(orderObj.newRemaining[key])
      if (!Number.isInteger(num)) {
        let float = parseFloat(orderObj.newRemaining[key])
        orderObj.newRemaining[key] = float

      } else {

        let whole = parseInt(orderObj.newRemaining[key])
        orderObj.newRemaining[key] = whole
      }

    }
    return orderObj

  },
  calculateAvgCost: (orderObj, currentAvgCost) => {
    console.log(orderObj, currentAvgCost)
    var totalCost = (orderObj.amount * orderObj.price) + (currentAvgCost.qty * currentAvgCost.avg_cost)
    console.log('totalcost', totalCost, 'cal ', `(${orderObj.amount} * ${orderObj.price}) + (${currentAvgCost.qty} * ${currentAvgCost.avg_cost})`)
    var newAvgCost = totalCost / orderObj.newRemaining.holding
    console.log('newAvgCost ', newAvgCost, 'cal ', `${totalCost} / ${orderObj.newRemaining.holding}`)
    orderObj.avg_cost = newAvgCost

    return orderObj

  }
}

/**
{
  orderIn: 'shares',
  amount: 2,
  orderType: 'buy',
  account: 5,
  purchaseType: 'stock',
  symbol: 'MSFT',
  company: 'Microsoft Corporation',
  price: 284.1,
  datetime: 'Fri, 31 Mar 2023 18:54:35 GMT',
  equity: { buyingPower: -568.2, holding: 2 },
  newRemaining: { buyPower: 7432.95, holding: 2 }
} { user_id: 5, symbol: 'MSFT', type: 'stock', qty: 1, avg_cost: 284.1 }
 */