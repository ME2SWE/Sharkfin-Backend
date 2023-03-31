require('dotenv').config();
const moment = require('moment');
const pool = require('./../db');
const axios = require('axios');
const portfolioHelper = require('./portfolioHelper.js');
const getQueries = require('./../db/getQueries.js');
const postQueries = require('./../db/postQueries.js');

module.exports = {
  updateNetWorth : async (user_id) => {
    var isDone = false;
    var net = 0;
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
          if (result.rows.length) {
            net = net + result.rows[0].avail_balance;
            pool.query(postQueries.regNetWorthUpdate(user_id, net));
            return;
          } else {
            pool.query(postQueries.regNetWorthUpdate(user_id, 0));
            return;
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
    }
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
        net += allocationData.totalNetWorth;
      })
      .then(() => {
        pool.query(postQueries.regNetWorthUpdate(user_id, net));
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  }
}