const dbStockCrypto = {

  getAccountNumber: (userid) => {
    var queryString = `SELECT account_number FROM finances where user_id = ${userid}`
    return queryString
  }
}

module.exports = dbStockCrypto