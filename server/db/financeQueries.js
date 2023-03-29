const dbFinances = {

  dbPostFinance: (data) => {
    let query;
    if (data.transaction_type === 'bank') {
      query = `INSERT INTO finances (user_id, transaction_type, amount, net_deposits, avail_balance)
      VALUES (${data.user_id}, '${data.transaction_type}', ${data.amount},
      COALESCE((SELECT net_deposits FROM finances WHERE user_id = ${data.user_id} ORDER BY datetime DESC LIMIT 1), 0) + ${data.amount},
      COALESCE((SELECT avail_balance FROM finances WHERE user_id = ${data.user_id} ORDER BY datetime DESC LIMIT 1), 0) + ${data.amount});`;
    } else {
      query = `INSERT INTO finances (user_id, transaction_type, amount, net_deposits, avail_balance)
      VALUES (${data.user_id}, '${data.transaction_type}', ${data.amount},
      (SELECT net_deposits FROM finances WHERE user_id = ${data.user_id} ORDER BY datetime DESC LIMIT 1),
      COALESCE((SELECT avail_balance FROM finances WHERE user_id = ${data.user_id} ORDER BY datetime DESC LIMIT 1), 0) + ${data.amount});`;
    }
    return query;
  },
  dbGetFinances: (id) => {
    let query = `SELECT * FROM finances WHERE user_id = ${id}`
    return query;
  },
  dbGetBalance: (id) => {
    let query = `SELECT avail_balance FROM finances WHERE user_id = ${id} ORDER BY datetime DESC LIMIT 1;`
    return query;
  }
}


module.exports = dbFinances;