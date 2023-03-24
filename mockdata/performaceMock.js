const fs = require("fs");
const { Parser } = require("json2csv");
const moment = require('moment');


generatePerforanceMockData = () => {
  var data = []
  for (var x = 0; x < 10 ; x++) {
    var performance = parseFloat((Math.random() * (30.0 - 50.0) + 50.0).toFixed(1))
    data.push({
      user_id: x+1,
      performance_percentage: performance,
    });
}
  for (var x = 10; x < 100 ; x++) {
      var performance = parseFloat((Math.random() * (-50.0 - 30.0) + 30.0).toFixed(1))
      data.push({
        user_id: x+1,
        performance_percentage: performance,
      });
  }
  const fileName = 'performanceMock.csv'
  const fields = ["user_id", "performance_percentage"];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log(`Saved ${data.length} rows of mock data to ${fileName}`);
  });
}

generatePerforanceMockData()