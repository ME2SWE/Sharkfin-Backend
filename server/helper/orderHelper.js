module.exports = {
  dataType: async (orderObj) => {

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

  }
}

/**
 {
  orderIn: 'shares',
  amount: '1',
  orderType: 'buy',
  account: 5,
  symbol: 'MSFT',
  company: 'Microsoft Corporation',
  price: 283.95,
  datetime: 'Thu, 30 Mar 2023 21:45:29 GMT',
  equity: { buyingPower: '-283.95', holding: '1.00' },
  newRemaining: { buyPower: 716.05, holding: '1001' }
}
 */