const dbStockCrypto = {

  getAvailBalance: (userid) => {
    var queryString = `SELECT avail_balance FROM finances WHERE user_id = ${userid};`
    return queryString
  },
  getHoldingAmount: (userid, symbol) => {
    var queryString = `
      SELECT qty FROM users AS u
      INNER JOIN accounts AS a
      on u.username = a.username
      INNER JOIN portfolioinstant AS pi
      on a.account = pi.account
      WHERE u.id = ${userid} AND pi.symbol = ${symbol};`
    return queryString
  }
}

module.exports = dbStockCrypto