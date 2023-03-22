const dbFinances = {

 // assuming your data from axios will look something like this:

  // data = {
//   user_id: 1,
//   transaction_type: 'bank',
//   amount: 1000.00,
// }
  dbPostFinance: (data) => {
    let query;
    if (data.transaction_type === 'bank') {
      query = `INSERT INTO finances (user_id, transaction_type, amount, net_deposits, avail_balance)
      VALUES (${data.user_id}, '${data.transaction_type}', ${data.amount},
      COALESCE((SELECT net_deposits FROM finances WHERE id = (SELECT MAX(id) FROM finances ) AND user_id = ${data.user_id}), 0) + ${data.amount},
      COALESCE((SELECT avail_balance FROM finances WHERE id = (SELECT MAX(id) FROM finances ) AND user_id = ${data.user_id}), 0) + ${data.amount});`;
    } else {
      query = `INSERT INTO finances (user_id, transaction_type, amount, net_deposits, avail_balance)
      VALUES (${data.user_id}, '${data.transaction_type}', ${data.amount},
      (SELECT net_deposits FROM finances WHERE id = (SELECT MAX(id) FROM finances ) AND user_id = ${data.user_id}),
      COALESCE((SELECT avail_balance FROM finances WHERE id = (SELECT MAX(id) FROM finances ) AND user_id = ${data.user_id}), 0) + ${data.amount});`;
    }
    return query;
  }
}

//I used this query to test negative amounts too and it worked

// INSERT INTO finances (user_id, transaction_type, amount, net_deposits, avail_balance)
//       VALUES (1, 'trade', -1000,
//       (SELECT net_deposits FROM finances WHERE id = (SELECT MAX(id) FROM finances ) AND user_id = 1),
//       COALESCE((SELECT avail_balance FROM finances WHERE id = (SELECT MAX(id) FROM finances) AND user_id = 1), 0) + -1000);


module.exports = dbFinances;