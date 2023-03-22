const fs = require("fs");
const { Parser } = require("json2csv");
const moment = require('moment');
function generateMockData() {
  // const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // now - 7 days
  const startDate = moment().subtract(7, 'days').format();
  // const endDate = new Date(); // End date
  const endDate = moment();
  const intervalMinutes = 10; // 10mins interval
  const symbols = ["AAPL", "GOOGL"];
  const userIDs = [0001];
  const data = [];
  var count = 0;
  // Loop through each time interval between start and end date
  for (let currentTime = moment(startDate); currentTime <= endDate; currentTime.minutes(currentTime.minutes() + intervalMinutes)) {
    // Check if current time is within the specified window
    if (currentTime.hours() >= 6 && currentTime.hours() < 13) { // 420 minutes is 7 hours (PST timezone offset)
      // generate a data point for each symbol and user ID
      symbols.forEach(symbol => {
        userIDs.forEach(userID => {
          // Generate random values for each column
          const time = currentTime.format().slice(0, 19).replace('T', ' ').toString(); // remove milliseconds
          const qty = Math.floor(Math.random() * 100) + 1; // generate a random 1 and 100
          const avg_cost = Math.floor(Math.random() * 1000) / 100; // generate a random average cost between 0 and 10.00
          const buy_pwr = Number(parseFloat(qty * avg_cost).toFixed(2)); // calculate the buying power and set to two decimals
          if (count > 3) {
            data.push({
              user_id: userID,
              symbol: symbol,
              time: time,
              qty: qty,
              avg_cost: avg_cost,
              buy_pwr: buy_pwr
            });
          }
          count++;
        });
      });
    }
  }
  const fileName = 'minutesMock.csv'
  const fields = ["user_id", "symbol", "time", "qty", "avg_cost", "buy_pwr"];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log(`Saved ${data.length} rows of mock data to ${fileName}`);
  });
  // return data;
}

generateMockData()