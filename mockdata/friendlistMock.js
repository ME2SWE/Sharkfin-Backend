const fs = require("fs");
const { Parser } = require("json2csv");
const moment = require('moment');


generateFriendListMockData = () => {
  const data = [];
  // Loop through each time interval between start and end date
  for (var x = 0; x < 100 ; x++) {
    //ramdon number of friends
    var friendsNum = Math.floor(Math.random() * 30) + 1;
    const result = [];
    const usedNumbers = new Set();
    while (result.length < friendsNum && usedNumbers.size < 100) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      if (!usedNumbers.has(randomNumber)) {
        result.push(randomNumber);
        usedNumbers.add(randomNumber);
      }
    }
    console.log(result)
    for (var y = 0; y < friendsNum; y ++) {
      var friendsID = result[y]
      var statusArr = ['complete', 'pending']
      var index = Math.floor(Math.random() * 2);
      data.push({
        user_id: x+1,
        friend_id: friendsID,
        status_type: statusArr[index]
      });

    }
  }
  const fileName = 'friendlistMock.csv'
  const fields = ["user_id", "friend_id", "status_type"];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log(`Saved ${data.length} rows of mock data to ${fileName}`);
  });
}

generateFriendListMockData()