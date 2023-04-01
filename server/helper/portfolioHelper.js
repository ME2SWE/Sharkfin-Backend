require('dotenv').config();
const moment = require('moment');

module.exports = {
  getChartData : function(combinedData) {
    var alpacaData = combinedData.alpaca;
    var historyData = combinedData.history;
    var output = alpacaData;
   if (Object.keys(historyData).length === 0) {
    return {time: [], net: []};
   }
    var length = output.time.length;
    var result = new Array(length).fill(0);
    for (var key of Object.keys(historyData)) {
      for (var i = 0; i < length; i++) {
        output[key][i] = (alpacaData[key][i] - historyData[key]['avg_cost'][i]) * historyData[key]['qty'][i] + (historyData[key]['avg_cost'][i] * historyData[key]['qty'][i]);
        result[i] += output[key][i];
      }
    }
    for (var i = 0; i < output.time.length; i++) {
      result[i] += historyData[key]['buy_pwr'][i];
    }
    output.timeCount = length;
    output.net = result;
    output.net = output.net.filter(Number);
    return output;
  },

  getAllocationRatio : function (portfolioData) {
    var output = {};
    output.position = [];
    output.allocation = {};
    output.allocation.symbols = [];
    output.allocation.ratios = [];
    var totalNetWorth = 0;
    for (var i = 0; i < portfolioData.length; i++) {
      totalNetWorth += portfolioData[i].avg_cost * portfolioData[i].qty;
    }
    totalNetWorth += portfolioData[0].buy_pwr;
    var buy_pwr = portfolioData[0].buy_pwr;
    for (var j = 0; j < portfolioData.length; j++) {
      var position = {};
      output.allocation.symbols.push(portfolioData[j].symbol);
      var currTotal = parseFloat(portfolioData[j].avg_cost * portfolioData[j].qty);
      var currPer = parseFloat((currTotal/totalNetWorth * 100).toFixed(2));
      position.symbol = portfolioData[j].symbol;
      position.accountPer = parseFloat(currPer);
      position.qty = portfolioData[j].qty;
      position.avgCost = parseFloat(portfolioData[j].avg_cost.toFixed(2));
      output.position.push(position);
      output.allocation.ratios.push(currPer);
    }
    output.totalNetWorth = parseFloat(totalNetWorth.toFixed(2));
    output.allocation.symbols.push('CASH');
    output.allocation.ratios.push(parseFloat((buy_pwr/totalNetWorth * 100).toFixed(2)));
    return output;
  },

  insertPosition : function (alpacaData, cleanedData) {
    var alpacaHistory = alpacaData;
    var position = cleanedData.position;
    for (var i = 0; i < position.length; i++) {
      var symbol = position[i].symbol;
      var length = alpacaHistory[symbol].length;
      var symbolData = alpacaHistory[symbol][length - 1];
      var lastPrice = symbolData.c;
      position[i].lastPrice = lastPrice;
      position[i].gainLossPer = parseFloat((((lastPrice - position[i].avgCost) * position[i].qty) / (position[i].avgCost * position[i].qty) * 100).toFixed(2));
      var gainLossDol = parseFloat(((lastPrice - position[i].avgCost) * position[i].qty).toFixed(2));
      position[i].gainLossDol = gainLossDol;
      cleanedData.totalNetWorth+=gainLossDol;
    }
    cleanedData.totalNetWorth = parseFloat(cleanedData.totalNetWorth.toFixed(2));
    return position;
  },
};

