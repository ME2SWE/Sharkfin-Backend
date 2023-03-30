const dbTransactions = {
  dbGetTransactions: (user_id) => {
    var query = `SELECT stock_ticker AS stock, type AS transactionType, datetime, quantity, price, status FROM transactions WHERE user_id = ${user_id} ORDER BY datetime DESC`;
    return query;
  },
  dbPostTransaction: (data) => {
    var query = `INSERT INTO transactions (user_id, type, datetime, stock_ticker, quantity, price, status)
      VALUES (${data.account}, '${data.orderType}', '${data.datetime}','${data.symbol}', ${data.amount}, '${data.price}', 'complete');`;
    return query;
  }
}

module.exports = dbTransactions;
