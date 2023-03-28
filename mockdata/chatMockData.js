const fs = require("fs");
const { Parser } = require("json2csv");
const moment = require('moment');


generateChatMockData = () => {
  const data = [];
  // Loop through each time interval between start and end date
  for (var x = 0; x < 100 ; x++) {
    var user = Math.floor(Math.random() * (100 - 0) + 0);
    var tradeTypeArr = ["buy", "sell"];
    var tradeIndex = Math.floor(Math.random() * 2);
    var stockArr = ['GOOG', 'TSLA', 'AAPL', 'WISH', 'PINS', 'NVO', 'ABT', 'MSFT', 'BAC', 'AMZN', 'INTC', 'SQ', 'AMD', 'NVDA', 'META', 'BTC-USD', 'ETH-USD', 'SHIB-USD'];
    var stockIndex = Math.floor(Math.random() * 18);
    var price = ((Math.random() * (50000 - 0) + 0) / 100).toFixed(2);
    var quantity = Math.floor(Math.random() * (500 - 0) + 0);
    var date = new Date();
      data.push({
        id: x+1,
        user_id: user,
        type: tradeTypeArr[tradeIndex],
        datetime: date.toUTCString(),
        stock_ticker: stockArr[stockIndex],
        quantity: quantity,
        price: price,
        status: 'complete'
      });
  }

  const fileName = 'transactionsMock.csv'
  const fields = ["id", "sent_from", "sent_to", "message", "datetime"];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log(`Saved ${data.length} rows of mock data to ${fileName}`);
  });
}

generateChatMockData()