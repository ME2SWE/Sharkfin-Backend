const dbStockCrypto = {

  // getAvailBalance: (userid) => {
  //   var queryString = `SELECT avail_balance FROM finances WHERE user_id = ${userid};`
  //   return queryString
  // },
  getHoldingAmount: (userid, symbol) => {
    console.log(userid, symbol)
    var queryString = `
      SELECT qty FROM portfolioinstant WHERE user_id = ${userid} AND symbol = '${symbol}';`
    return queryString
  },
  updatePortfolioinstant: (orderObj) => {
    var user_id = orderObj.account
    var symbol = orderObj.symbol
    // var type = orderObj.purchaseType
    var qty = orderObj.newRemaining.holding
    var avg_cost = orderObj.price
    var queryString = `UPDATE portfolioinstant SET qty = ${qty}, avg_cost = ${avg_cost} WHERE user_id = ${user_id} AND symbol = '${symbol}';`
    return queryString
  }
}

module.exports = dbStockCrypto