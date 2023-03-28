const pool = require('./db');
const axios = require('axios');
const portfolioHelper = require('./helper/portfolioHelper.js');
const getQueries = require('./db/getQueries.js');
const dbTransactions = require('./db/transactionQueries.js');
const dbChats = require('./db/chatQueries.js');
const dbFinances = require('./db/financeQueries.js');
const dbLeaderBoard = require('./db/leaderboardQueries.js')
const moment = require('moment');
require('dotenv').config();

module.exports = {
  //Portfolio routes
  getChart : async (req, res) => {
    var accountNum = req.query.accountNum;
    var timeWindow = req.query.timeWindow;
    var isDone = false;
    const today = moment().day();
    const todayDate = moment().format().slice(0,10);
    if (today === 6) {
      var currentDate = moment().subtract(1,'days');
    } else if (today === 0) {
      var currentDate = moment().subtract(2,'days');
    } else {
      var currentDate = moment().subtract(15,'minutes');
    }
    if (currentDate.hours() > 13 && currentDate.minutes() > 0) {
      var currentDateFormated = currentDate.format().slice(0, 10) + 'T19:59:59Z';
    } else {
      var currentDateFormated = currentDate.format();
    }
    if (!accountNum) {
      res.status(400);
    }
    var symbols = [];
    const symbolQuery =  `SELECT ARRAY (
      SELECT DISTINCT symbol
      FROM portfoliomins
      WHERE account = ${accountNum} AND type = 'stock')
      AS stocks,
      ARRAY (
        SELECT DISTINCT symbol
        FROM portfoliomins
        WHERE account = ${accountNum} AND type = 'crypto')
         AS cryptos;`;
    await pool.query(symbolQuery)
    .then((result) => {
      if (result.rows[0].stocks.length === 0 && result.rows[0].cryptos.length === 0) {
        res.send({});
        isDone = true;
        return;
      }
      stockSymbols = result.rows[0].stocks;
      cryptoSymbols = result.rows[0].cryptos;
    })
    .catch((err) => {
      console.log(err);
    });
    if (isDone) {
      return;
    };
    var timeObj = portfolioHelper.handleTimeFrame(timeWindow);
    var historyData = {};
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
          'timeframe': timeObj.timeFrame, //10Mins, 1Day, 1Week
          'start': timeObj.startTime, //UTC Market Opening Hour (UTC)
          'end': `${currentDateFormated}` //UTC Market Closing Hour, 15 minutes gap
        }
      };
      await axios.get(alpacaStockMultiBarsURL, alpacaConfigs)
        .then((result) => {
          historyData = result.data.bars;
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
          'timeframe': timeObj.timeFrame, //10Mins, 1Day, 1Week
          'start': timeObj.startTime, //UTC Market Opening Hour (UTC)
          'end': `${currentDateFormated}` //UTC Market Closing Hour, 15 minutes gap
        }
      };
      await axios.get(alpacaCryptoMultiBarsURL, alpacaConfigs)
        .then((result) => {
          var weekendExcluded = portfolioHelper.excludeWeekend(result.data.bars);
          console.log(weekendExcluded);
          historyData = {...historyData, ...weekendExcluded};
        })
        .catch((err) => {
          console.log(err);
        })
    };
    var cleanAlpacaData = portfolioHelper.cleanAlpacaData(timeWindow, historyData);
    var portfolioHistory;
    await pool.query(getQueries.getPortfolioHistory(accountNum, timeObj.sqlTF, timeWindow, todayDate))
      .then((result) => {
        portfolioHistory = result.rows;
      })
      .catch((err) => {
        console.log(err);
      });
    var cleanedPsqlData = portfolioHelper.cleanPsqlData(portfolioHistory);
    var output = {};
    output.alpaca = cleanAlpacaData;
    output.history = cleanedPsqlData;
    var result = portfolioHelper.getChartData(output);
    res.send(result);
  },

  getAllocationAndPosition : async (req, res) => {
    var accountNum = req.query.accountNum;
    var isDone = false;
    const today = moment().day();
    const todayDate = moment().format().slice(0,10);
    if (today === 6) {
      var startDate = moment().subtract(1,'days');
    } else if (today === 0) {
      var startDate = moment().subtract(2,'days');
    } else {
      var startDate = moment().subtract(15,'minutes');
    }
    if (startDate.hours() > 13 && startDate.minutes() > 0) {
      var startDateFormated = startDate.format().slice(0, 10) + 'T19:59:59Z';
    } else {
      var startDateFormated = startDate.format();
    }
    if (!accountNum) {
      res.status(400);
    }
    var startDataCrypto = moment.utc().subtract(21,'minutes').format();
    var endDate = moment.utc().subtract(15,'minutes').format();
    var alpacaMultiBarsURL = process.env.ALPACA_STOCK_URL;
    const symbolQuery =  `SELECT ARRAY (
      SELECT DISTINCT symbol
      FROM portfolioinstant
      WHERE account = ${accountNum} AND type = 'stock')
      AS stocks,
      ARRAY (
        SELECT DISTINCT symbol
        FROM portfolioinstant
        WHERE account = ${accountNum} AND type = 'crypto')
         AS cryptos;`;
    await pool.query(symbolQuery)
    .then((result) => {
      if (result.rows[0].stocks.length === 0 && result.rows[0].cryptos.length === 0) {
        res.send({});
        isDone = true;
        return;
      }
      stockSymbols = result.rows[0].stocks;
      cryptoSymbols = result.rows[0].cryptos;
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
          'end': endDate //UTC Market Closing Hour, 15 minutes gap
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
          'start': startDataCrypto, //UTC Market Opening Hour (UTC)
          'end': endDate //UTC Market Closing Hour, 15 minutes gap
        }
      };
      await axios.get(alpacaCryptoMultiBarsURL, alpacaConfigs)
        .then((result) => {
          alpacaResults = {...alpacaResults, ...result.data.bars};
        })
        .catch((err) => {
          console.log(err);
        })
    };
    var alloPosQuery = getQueries.getAlloPosQuery(accountNum);
    await pool.query(alloPosQuery)
    .then((result) => {
      var incomingData = result.rows;
      var allocationData = portfolioHelper.getAllocationRatio(incomingData);
      console.log(allocationData);
      var positionData = portfolioHelper.insertPosition(alpacaResults, allocationData);
      res.status(200).send(allocationData);
    })
    .catch((err) => {
      console.log(err);
    });

  },
  //Transaction Routes
  getTransactions: (req, res) => {
    pool.query(dbTransactions.dbGetTransactions(1))
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
  postFinances: (req, res) => {
    //TO-DO: call dbFinances.dbPostFinances
  },

  getFinances: (req, res) => {
    console.log(req.query, '=====req.query');
    const text = `SELECT * FROM finances WHERE user_id = $1`;
    const values = [req.query.user_id];
    pool.query(text, values)
    .then(result => {
      res.send(result);
    })
    .catch(e => console.error(e.stack))
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
  updateUserDetails: async (req, res) => {
    var id = req.body.id
    var firstName = req.body.firstname
    var lastName = req.body.lastname
    var userName = req.body.username
    var photoURL = req.body.photourl
    await pool.query(dbLeaderBoard.dbUpdateUserInfo(id, firstName, lastName, userName, photoURL))
    .then((result) => {
      console.log(result);
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    })
  },


  // Login
  getUserByEmail: (req, res) => {
    console.log(req.query, '=====getUserByEmail req.query');
    const text = `SELECT * FROM users WHERE email = $1`;
    const values = [req.query.email];

    pool.query(text, values)
    .then(result => {
      res.send(result);
    })
    .catch(e => console.error(e.stack))
  },

  getUserInfo: (req, res) => {
    console.log(req.query, '=====req.query');
    if (req.query) {
      const mockResponse = {
        rows: [
          {
            id: 1,
            username: 'john_doe',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            profilepic_url: 'https://example.com/images/john_doe_profile_pic.jpg',
          },
        ],
        rowCount: 1,
      };
    //DATA TO TEST:
    // const text = `SELECT * FROM users WHERE id = $1`;
    // const values = [req.query.user_id];
    // pool.query(text, values)
      res.send(mockResponse);
    }
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
    .catch(e => {res.send(e); console.error(e.stack)})
  },

   updateUser: (req, res) => {
    const userInfo = req.body.data;
    const query = `
      UPDATE users
      SET username = $1, firstname = $2, lastname = $3, email = $4, profilepic_URL = $5
      WHERE id = $6;
    `;

    const values = [
      userInfo.username,
      userInfo.firstname,
      userInfo.lastname,
      userInfo.email,
      userInfo.profilePic,
      userInfo.id,
    ];

    try {
      pool.query(query, values)
      .then(result => {
        console.log('update user succeeds')
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
    WHERE f.user_id = $1 AND f.status = 'pending';`

    const values = [req.query.user_id];

    pool.query(text, values)
    .then(result => {
      res.send(result);
    })
    .catch(e => console.error(e.stack))
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
    .catch(e => console.error(e.stack))
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
    .catch(e => console.error(e.stack))
  },

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
    .catch(e => console.error(e.stack))
  }

}