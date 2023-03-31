require('dotenv').config();
const express = require('express');
const path = require('path');
const postQueries = require('./db/postQueries.js');
const pool = require('./db');
const portfolioHelper = require('./helper/portfolioHelper.js');
const moment = require('moment');
const controllers = require('./controllers.js');
const cors = require('cors');
const updateNetWorth = require('./helper/updateNetWorth.js');


const app = express();

app.use(express.json());
app.use(cors());

// Transaction Log
app.get('/transactions/:id', controllers.getTransactions);
app.post('/transactions', controllers.postTransaction);

//Chat Log
app.get('/chat', controllers.getChatLog);
app.post('/chat', controllers.postChat);
app.get('/chat/friends', controllers.getChatFriends);

//Portfolio
app.get('/pchart', controllers.getNetWorthData);
app.get('/pallocation', controllers.getAllocationAndPosition);

//Finances
app.get('/finances/:id', controllers.getFinances);
app.post('/finances', controllers.postFinances);
app.get('/finances/:id/balance', controllers.getBalance);
//app.get

//Leader board
app.get('/friendleaderboard', controllers.getFriendBoard);
app.get('/globalleaderboard', controllers.getGlobalBoard);
app.get('/getuserdetail', controllers.getUserDetail) //get users info along with performance info
app.post('/updateperformance', controllers.updatePerformance);

//Users
app.post('/addUser', controllers.addUser); //adds new user
app.get('/getUserByEmail', controllers.getUserByEmail); //get user by email if email already exists
app.post('/updatephoto', controllers.updatePicRUL); //updates users profile pic only
app.get(`/users/:id`, controllers.getUserInfo); //get user info that is in users table (include bank info)
app.post('/users/:id/update', controllers.updateUserDetails); //update all user info
app.post('/users/:id/update/bank', controllers.updateBankInfo); //update bank info only

//Friends
app.get('/getFriendRequestsByID', controllers.getFriendRequestsByID);
app.post('/updateFriendStatus', controllers.updateFriendStatus);
app.post('/addFriend', controllers.addFriend);
app.get('/getRecommendedFriends', controllers.getRecommendedFriends);

//Get buying power and holding from portfolioinstant
// app.get('/getAvailBalance', controllers.getAvailBalance)
app.get('/getHoldingAmount', controllers.getHoldingAmount)

//Update buying power and holding to portfolioinstant
//app.put('/updateAssetData', controllers.updateAssetData)

// //Post order data to transaction
// app.post('/postOrder', controllers.postOrder)

setInterval(async function() {
  var date = moment();
  var mins = date.minutes();
  var timestamp = date.format().slice(0, 19).replace('T', ' ');
  var hashMin = {
    '00' : 1,
    '10' : 1,
    '20' : 1,
    '30' : 1,
    '40' : 1,
    '50' : 1,
  };

  // if (mins in hashMin) {
    await pool.query('WITH user_ids AS (SELECT DISTINCT id FROM users) SELECT array_agg(u.id) AS user_ids FROM user_ids u;')
    .then((result) => {
      var userIDs = result.rows[0].user_ids;
      for (var i = 0; i < userIDs.length; i++) {
        var user_id = userIDs[i];
        updateNetWorth.updateNetWorth(user_id);
      }
      console.log('Net Worth 10 Minutes Updated');
    })
    .catch((err) => {
      console.log(err);
    })
  // } else {
  //   console.log('waiting for trigger...');
  // }
}, 10000); //updating networth every 10 seconds

app.listen(8080);
console.log('Listening at http://localhost:8080');
