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
  updatePortfolioinstant: () => {

  }
}

module.exports = dbStockCrypto