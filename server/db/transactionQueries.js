const dbTransactions = {
  dbGetTransactions: (user_id) => {
    var query = `SELECT stock_ticker, type, datetime, quantity, price, status FROM transactions WHERE user_id = ${user_id}`;
    return query;
  },
  dbPostTransaction: (data) => {
    var query = `INSERT INTO transactions (user_id, type, stock_ticker, quantity, price, status)
      VALUES (${data.account}, '${data.orderType}', '${data.symbol}', ${data.amount}, '${data.price}', 'complete');`;
    return query;
  }
}

module.exports = dbTransactions;
