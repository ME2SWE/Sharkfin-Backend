const db = require('../database/dbIndex.js');
const dbTransactions = require('../database/transactionQueries.js');
require("dotenv").config();
// const router = require("express").Router();
// const controllers = require('./controllers.js');

// router.get('/pchart', controllers.getChart);
// router.get('/pallocation', controllers.getAllocationAndPosition);

// module.exports = router;

// const db = require('../database/dbIndex.js');

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

