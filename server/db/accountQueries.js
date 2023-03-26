const dbAccounts = {
  dbGetUserInfo: (user_id) => {
    var query = `SELECT id as user_id, firstname, lastname, username, email, profilepic_url, bank, account_number FROM users WHERE id = ${user_id}`;
    return query;
  },
  dbUpdateUser: (data) => {
    var query = `INSERT INTO transactions (user_id, type, stock_ticker, quantity, price, status)
      VALUES (${data.account}, '${data.orderType}', '${data.symbol}', ${data.amount}, '${data.price}', 'complete');`;
    return query;
  } //THIS IS ALSO IN LEADERBOARD QUERIES
}

module.exports = dbAccounts;

// CREATE TABLE IF NOT EXISTS users (
//   id SERIAL PRIMARY KEY NOT NULL,
//   username TEXT NOT NULL,
//   firstname TEXT NOT NULL,
//   lastname TEXT NOT NULL,
//   email TEXT NOT NULL,
//   profilepic_URL TEXT,
//   bank TEXT,
//   account_number numeric NOT NULL
// );
