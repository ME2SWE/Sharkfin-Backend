require('dotenv').config();
const express = require('express');
const path = require('path');
const port = process.env.PORT;
const postQueries = require('./db/postQueries.js');
const pool = require('./db');
const portfolioHelper = require('./helper/portfolioHelper.js');
const moment = require('moment');
const controllers = require('./controllers.js');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

// Transaction Log
app.get('/transactions', controllers.getTransactions);
app.post('/transactions', controllers.postTransaction);

//Chat Log
app.get('/chat', controllers.getChatLog);
app.post('/chat', controllers.postChat);
app.get('/chat/friends', controllers.getChatFriends);

//Portfolio
app.get('/pchart', controllers.getChart);
app.get('/pallocation', controllers.getAllocationAndPosition);

//Finances
app.post('/finances', controllers.postFinances);

//Leader board
app.get('/friendleaderboard', controllers.getFriendBoard);
app.get('/globalleaderboard', controllers.getGlobalBoard);
app.post('/updatePerformance', controllers.updatePerformance);


// setInterval(async function() {
//   var date = moment();
//   var mins = date.minutes();
//   var hashHrs = {
//     '06': 1,
//     '07': 1,
//     '08': 1,
//     '09': 1,
//     '10': 1,
//     '11': 1,
//     '12': 1
//   }
//   var hashMin = {
//     '00' : 1,
//     '10' : 1,
//     '20' : 1,
//     '30' : 1,
//     '40' : 1,
//     '50' : 1,
//   };
//   if (mins in hash) {
//     console.log('updating...');
//     await pool.query(postQueries.regPortfolioUpdate(date.format().slice(0, 19).replace('T', ' ')))
//     .then((result) => {
//       console.log('10 Mins Update Complete');
//     })
//     .catch((err) => {
//       console.log(err);
//     })
//   } else {
//     console.log('waiting for trigger...');
//   }
// }, 60000);



//Create user
app.post('/addUser', controllers.addUser);

//Get user by email
app.get('/getUserByEmail', controllers.getUserByEmail);


app.listen(8080);
console.log('Listening at http://localhost:8080');
