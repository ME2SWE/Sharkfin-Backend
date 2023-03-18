require('dotenv').config();
const express = require('express');
const route = require('./routes.js');
// const db = require('../db/dbIndex.js');

const app = express();
app.use(express.json());

//Transaction Log
app.get('/transactions', route.getTransactions);


app.listen(8080);
console.log('Listening at http://localhost:8080');