const db = require('../database/dbIndex.js');
const dbTransactions = require('../database/transactionQueries.js');

module.exports = {
  getTransactions: (req, res) => {
    db.query(dbTransactions.dbGetTransactions(1))
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      res.send(err);
    })
  },
  postTransaction: (req, res) => {
    console.log(req.body);
    db.query(dbTransactions.dbPostTransaction(req.body))
    .then((result) => {
      res.end();
    })
    .catch((err) => {
      res.send(err);
    })
  }
}