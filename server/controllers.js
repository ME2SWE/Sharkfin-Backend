const pool = require('./db');
const axios = require('axios');
const portfolioHelper = require('./helper/portfolioHelper.js');
const getQueries = require('./db/getQueries.js');
const dbTransactions = require('./db/transactionQueries.js');
const dbChats = require('./db/chatQueries.js');
const dbFinances = require('./db/financeQueries.js');
const dbAccounts = require('./db/accountQueries.js');
const dbLeaderBoard = require('./db/leaderboardQueries.js')
const dbStockCrypto = require('./db/stockCryptoQueries.js')
const moment = require('moment');
require('dotenv').config();

module.exports = {
  getNetWorthData: async (req, res) => {
    var user_id = req.query.user_id;
    var timeWindow = req.query.timeWindow;
    const today = moment();
    const todayDate = today.format().slice(0, 10);
    if (!user_id) {
      res.status(400);
    }
    await pool.query(getQueries.getNetWorth(user_id, timeWindow, todayDate))
      .then((result) => {
        netWorth = result.rows[0];
        res.send(netWorth);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getAllocationAndPosition : async (req, res) => {
    var user_id = req.query.user_id;
    var isDone = false;
    const today = moment().day();
    const todayDate = moment().format().slice(0,10);
    var stockSymbols = [];
    var cryptoSymbols = [];
    if (today === 6) {
      var endDate = moment().subtract(1, 'days');
    } else if (today === 0) {
      var endDate = moment().subtract(2, 'days');
    } else {
      var endDate = moment().subtract(15, 'minutes');
    }
    if (endDate.hours() > 13 && endDate.minutes() > 0) { //
      var startDateFormated = endDate.format().slice(0,10) + 'T13:30:00Z';
      var endDateFormated = endDate.format().slice(0, 10) + 'T19:59:59Z';
    } else {
      var startDateFormated = endDate.subtract(5, 'minutes').utc().format();
      var endDateFormated = endDate.utc().format();
    }
    if (!user_id) {
      res.status(400);
    }
    user_id = parseInt(user_id);
    if (user_id === 0) {
      res.send({totalNetWorth: 0, position: [], allocation : {symbols: [], ratios: []}});
      return;
    }
    var alpacaMultiBarsURL = process.env.ALPACA_STOCK_URL;
    const symbolQuery = `SELECT ARRAY (
      SELECT DISTINCT symbol
      FROM portfolioinstant
      WHERE user_id = ${user_id} AND type = 'stock')
      AS stocks,
      ARRAY (
        SELECT DISTINCT symbol
        FROM portfolioinstant
        WHERE user_id = ${user_id} AND type = 'crypto')
         AS cryptos;`;
    await pool.query(symbolQuery)
    .then((result) => {
      if (result.rows[0].stocks.length === 0 && result.rows[0].cryptos.length === 0) { //no stock nor crypto
        pool.query(getQueries.getAvailBalance(user_id))
        .then((result) => {
          if (result.rows.length === 0) {
            res.send({totalNetWorth: 0, position: [], allocation : {symbols: [], ratios: []}});
          } else {
            res.send({totalNetWorth: result.rows[0].avail_balance, position: [], allocation : {symbols: ['CASH'], ratios: [100]}});
          }
        })
        .catch((err) => {
          console.log(err);
        })
        isDone = true;
        return;
      } else {
        stockSymbols = result.rows[0].stocks;
        cryptoSymbols = result.rows[0].cryptos;
      }
    })
    .catch((err) => {
      console.log(err);
    });
    if (isDone) {
      return;
    };
    var alpacaResults;
    var incomingData;
    var allocationData;
    var positionData;
    if (stockSymbols.length !== 0) {
      //Get Stock History from Alpaca
      var alpacaStockMultiBarsURL = process.env.ALPACA_STOCK_URL;
      var alpacaConfigs = {
        headers: {
          "Apca-Api-Key-Id": process.env.ALPACA_KEY,
          "Apca-Api-Secret-Key": process.env.ALPACA_SECRET
        },
        params: {
          'symbols': stockSymbols.toString(),
          'timeframe': '5Min', //10Mins, 1Day, 1Week
          'start': startDateFormated, //UTC Market Opening Hour (UTC)
          'end': endDateFormated //UTC Market Closing Hour, 15 minutes gap
        }
      };
      await axios.get(alpacaStockMultiBarsURL, alpacaConfigs)
        .then((result) => {
          alpacaResults = result.data.bars;
        })
        .catch((err) => {
          console.log(err);
        })
    };
    if (cryptoSymbols.length !== 0) {
      var alpacaCryptoMultiBarsURL = process.env.ALPACA_CRYPTO_URL;
      var alpacaConfigs = {
        headers: {
          "Apca-Api-Key-Id": process.env.ALPACA_KEY,
          "Apca-Api-Secret-Key": process.env.ALPACA_SECRET
        },
        params: {
          'symbols': cryptoSymbols.toString(),
          'timeframe': '5Min',
          'start': startDateFormated, //UTC Market Opening Hour (UTC)
          'end': endDateFormated //UTC Market Closing Hour, 15 minutes gap
        }
      };
      await axios.get(alpacaCryptoMultiBarsURL, alpacaConfigs)
        .then((result) => {
          alpacaResults = { ...alpacaResults, ...result.data.bars };
        })
        .catch((err) => {
          console.log(err);
        })
    };
    var alloPosQuery = getQueries.getAlloPosQuery(user_id);
    await pool.query(alloPosQuery)
      .then((result) => {
        var incomingData = result.rows;
        var allocationData = portfolioHelper.getAllocationRatio(incomingData);
        var positionData = portfolioHelper.insertPosition(alpacaResults, allocationData);
        res.status(200).send(allocationData);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  //Transaction Routes
  getTransactions: (req, res) => {
    pool.query(dbTransactions.dbGetTransactions(req.params.id))
      .then((result) => {
        res.send(result.rows);
      })
      .catch((err) => {
        res.send(err);
      })
  },
  postTransaction: (req, res) => {
    // console.log(req);
    // console.log(req.body);
    pool.query(dbTransactions.dbPostTransaction(req.body))
      .then((result) => {
        console.log(result);
        res.end();
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  },

  //Chat Routes
  getChatLog: (req, res) => {
    pool.query(dbChats.dbGetChatLog(1))
      .then((result) => {
        console.log(result);
        res.send(result.rows);
      })
  },
  postChat: (req, res) => {
    pool.query(dbChats.dbPostChat(req.body))
      .then((result) => {
        console.log(result);
        res.end();
      })
  },
  getChatFriends: (req, res) => {
    pool.query(dbChats.dbGetChatFriends(1))
      .then((result) => {
        console.log(result);
        res.send(result.rows);
      })
  },

  //Finances Routes
  postFinances: (req, res) => {
    //TO-DO: call dbFinances.dbPostFinances
    pool.query(dbFinances.dbPostFinance(req.body))
    .then((result) => {
      console.log(result);
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    })
  },

  getFinances: (req, res) => {
    pool.query(dbFinances.dbGetFinances(req.params.id))
    .then(result => {
      res.send(result.rows);
    })
    .catch(e => console.error(e.stack))
  },

  getBalance: (req, res) => {
    pool.query(dbFinances.dbGetBalance(req.params.id))
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log(err);
    })
  },

  //LeaderBoard routes
  getFriendBoard: async (req, res) => {
    var id = req.query.id
    // console.log(id)
    await pool.query(dbLeaderBoard.dbGetFriendList(id))
      .then((results) => {
        var arr = results.rows
        var friendIdArr = []
        for (var x = 0; x < arr.length; x++) {
          friendIdArr.push(arr[x].friend_id)
        }
        friendIdArr.push(Number(id))
        return friendIdArr;
      })
      .then(async (user_arr) => {
        const arr = JSON.stringify(user_arr)
        const result = await pool.query(dbLeaderBoard.dbGetFriendLeaderBoard(arr))
        res.status(200).send(result.rows);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  },

  getGlobalBoard: async (req, res) => {
    await pool.query(dbLeaderBoard.dbGetGlobalLeaderBoard())
      .then((result) => {
        res.status(200).send(result.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  updatePerformance: async (req, res) => {
    await pool.query(dbLeaderBoard.dbPostPerformance(req.body.id, req.body.percentage))
      .then((result) => {
        console.log(result);
        res.end();
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  },

  getUserDetail: async (req, res) => {
    await pool.query(dbLeaderBoard.dbGetUserDetail(req.query.id))
    .then((result) => {
      console.log(result);
      res.status(200).send(result.rows[0])
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    })
  },

  updatePicRUL: async (req, res) => {
    await pool.query(dbLeaderBoard.dbPostPicURL(req.body.id, req.body.url))
      .then((result) => {
        console.log(result);
        res.end();
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  },

  // Login & Accounts
  getUserByEmail: (req, res) => {
    console.log(req.query, '=====getUserByEmail req.query');
    const text = `SELECT * FROM users WHERE email = $1`;
    const values = [req.query.email];

    pool.query(text, values)
      .then(result => {
        res.send(result);
      })
      .catch(e => {
        console.error(e.stack);
        res.send(e);
      })
  },

  getUserInfo: (req, res) => {
    pool.query(dbAccounts.dbGetUserInfo(req.params.id))
      .then((result) => {
        res.send(result.rows);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      })
  },
  updateUserDetails: (req, res) => {
    pool.query(dbAccounts.dbUpdateUserInfo(req.params.id, req.body))
      .then((result) => {
        res.send('updated!');
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  },
  updateBankInfo: (req, res) => {
    pool.query(dbAccounts.dbUpdateBankInfo(req.params.id, req.body))
      .then((result) => {
        res.send('updated!');
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  },

  // login
  addUser: (req, res) => {
    console.log('======addUser req.data', req);
    const text = `
      INSERT INTO users (username, firstname, lastname, email, profilepic_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [req.body.data.username, req.body.data.firstname, req.body.data.lastname, req.body.data.email, req.body.data.picture];

    pool.query(text, values)
      .then(result => {
        console.log('addUser succeeds')
        res.send(result);
      })
      .catch(e => {
        console.error(e.stack);
        res.send(e);
      })
  },

  updateUserInfo: (req, res) => {
    const userInfo = req.body.data;
    const query = `
      UPDATE users
      SET
        username = COALESCE($1, username),
        firstname = COALESCE($2, firstname),
        lastname = COALESCE($3, lastname),
        profilepic_URL = COALESCE($4, profilepic_URL),
        bank = COALESCE($5, bank),
        accountNumber = COALESCE($6, accountNumber),
      WHERE id = $7;
    `;
    const values = [
      userInfo.username,
      userInfo.firstname,
      userInfo.lastname,
      userInfo.profilePic,
      userInfo.bank,
      userInfo.accountNumber,
      userInfo.id,
    ];

    try {
      pool.query(query, values)
        .then(result => {
          console.log('update user succeeds');
          res.send(result);
        })
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },


  // friendslist
  getFriendRequestsByID: (req, res) => {
    console.log(req.query, '=====getFriendRequestsByID req.query');

    const text = `SELECT f.id, u.username, u.profilepic_URL
    FROM friendlist f
    JOIN users u ON u.id = f.friend_id
    WHERE f.user_id = $1 AND f.status = 'pending' LIMIT 7`

    const values = [req.query.user_id];

    pool.query(text, values)
      .then(result => {
        res.send(result);
      })
      .catch(e => {
        console.error(e.stack);
        res.send(e);
      })
  },

  // friendslist
  updateFriendStatus: (req, res) => {
    console.log(req.query, '=====updateFriendStatus req.query');
    const text = `UPDATE friendlist
    SET status = 'complete'
    WHERE id = $1
    RETURNING *`;
    const values = [req.body.data.id];

    pool.query(text, values)
      .then(result => {
        res.send(result);
      })
      .catch(e => {
        console.error(e.stack);
        res.send(e);
      })
  },

  // friendslist
  addFriend: (req, res) => {
    console.log('======addFriend req.data', req);
    const text = `
      INSERT INTO friendlist (user_id, friend_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [req.body.data.user_id, req.body.data.friend_id, 'pending'];

    pool.query(text, values)
      .then(result => {
        res.send(result);
      })
      .catch(e => {
        console.error(e.stack);
        res.send(e);
      })
  },

  // friendslist
  getRecommendedFriends: (req, res) => {
    console.log(req.query, '=====getRecommendedFriends req.query');
    const text = `SELECT *
    FROM users
    WHERE id NOT IN (
      SELECT CASE
               WHEN user_id = $1 THEN friend_id
               ELSE user_id
             END
      FROM friendlist
      WHERE user_id = $1 OR friend_id = $1
    ) AND id <> $1
    ORDER BY random()
    LIMIT 7`;
    const values = [req.query.id];

    pool.query(text, values)
      .then(result => {
        res.send(result);
      })
      .catch(e => {
        console.error(e.stack);
        res.send(e);
      })
  },

  getAvailBalance: (req, res) => {
    // console.log(req.query.userid)
    var userid = req.query.userid
    pool.query(dbStockCrypto.getAvailBalance(userid))
      .then((result) => {
        //console.log(result.rows)
        res.send(result.rows);
      })
      .catch((err) => {
        res.send(err);
      })
  },
  getHoldingAmount: (req, res) => {
    console.log(req.query)
    var userid = req.query.userid
    var symbol = req.query.symbol
    pool.query(dbStockCrypto.getHoldingAmount(userid, symbol))
      .then((result) => {
        console.log(result.rows)
        res.send(result.rows);
      })
      .catch((err) => {
        res.send(err);
      })
  }

}