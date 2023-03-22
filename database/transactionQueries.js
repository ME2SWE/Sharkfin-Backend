const dbTransactions = {
  dbGetTransactions: (user_id) => {
    var query = `SELECT stock_ticker, type, datetime, quantity, price, status FROM transactions WHERE user_id = ${user_id}`;
    return query;
  },
  dbPostTransaction: (data) => {
    var query = `INSERT INTO transactions (user_id, type, stock_ticker, quantity, price, status)
      VALUES (${data.user_id}, '${data.transaction_type}', '${data.stock}', ${data.quantity}, '${data.price}', '${data.status}');`;
    return query;
  }
}

module.exports = dbTransactions;