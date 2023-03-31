const fs = require("fs");
const { Parser } = require("json2csv");
const moment = require('moment');
function generateMockData() {
  // const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // now - 7 days
  const startDate = moment().subtract(8, 'days').format();
  // const endDate = new Date(); // End date
  const endDate = moment();
  const intervalMinutes = 10; // 10mins interval
    const userIDs = [1,2];
  const data = [];
  var count = 0;
  // Loop through each time interval between start and end date
  for (let currentTime = moment(startDate); currentTime <= endDate; currentTime.minutes(currentTime.minutes() + intervalMinutes)) {
    // Check if current time is within the specified window
    if (currentTime.hours() >= 6 && currentTime.hours() < 13) { // 420 minutes is 7 hours (PST timezone offset)
      // generate a data point for each symbol and user ID
      userIDs.forEach(userID => {
        // Generate random values for each column
        const time = moment(currentTime).format().slice(0, 19).replace('T', ' ').toString(); // remove milliseconds
        const net = Math.floor(Math.random() * 10000) + 1; // generate a random 1 and 10000
        if (count > 3) {
          data.push({
            user_id: userID,
            time: time,
            net: net
          });
        }
        count++;
       });
    };
  }
  const fileName = 'netMinutesMock.csv'
  const fields = ["user_id", "time", "net"];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log(`Saved ${data.length} rows of mock data to ${fileName}`);
  });
  // return data;
}

generateMockData()