require('dotenv').config();
const express = require('express');
const route = require('./routes.js');
const db = require('../database/dbIndex.js');

const app = express();
app.use(express.json());

//Transaction Log
app.get('/transactions', route.getTransactions);
app.post('/transactions', route.postTransaction);


app.listen(8080);
console.log('Listening at http://localhost:8080');