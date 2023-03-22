const {Pool} = require('pg');
require('dotenv').config();

const db = new Pool({
  // user: 'postgres',
  // host: process.env.HOST,
  database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
});

db
  .connect()
  .then(() => {console.log('Connected')})
  .catch((err) => {throw err})

  module.exports = db;