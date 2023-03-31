const dbStockCrypto = {

  // getAvailBalance: (userid) => {
  //   var queryString = `SELECT avail_balance FROM finances WHERE user_id = ${userid};`
  //   return queryString
  // },
  getHoldingAmount: (userid, symbol) => {
    // console.log(userid, symbol)
    var queryString = `SELECT qty FROM portfolioinstant WHERE user_id = ${userid} AND symbol = '${symbol}';`
    return queryString
  },
  checkUserPortfolioInstant: (user_id, symbol) => {
    var queryString = `SELECT 1 FROM portfolioinstant WHERE user_id = ${user_id} AND symbol = '${symbol}';`
    //console.log(queryString)
    return queryString
  },
  insertPortfolioinstant: (orderObj) => {
    var queryString = `INSERT INTO portfolioinstant (user_id, symbol, type, qty, avg_cost) VALUES (${orderObj.account}, '${orderObj.symbol}','${orderObj.purchaseType}',${orderObj.newRemaining.holding},${orderObj.price});`
    //console.log(queryString)
    return queryString
  },
  updatePortfolioinstant: (orderObj) => {
    var user_id = parseInt(orderObj.account)
    var symbol = orderObj.symbol
    var type = orderObj.purchaseType
    var qty = orderObj.newRemaining.holding
    var avg_cost = orderObj.price
    var queryString = `UPDATE portfolioinstant SET qty = ${qty}, avg_cost = ${avg_cost} WHERE user_id = ${user_id} AND symbol = '${symbol}';`
    console.log(queryString)
    return queryString
  }
}

module.exports = dbStockCrypto