const Pool = require('pg').Pool;
require('dotenv').config();


const pool = new Pool({
  host: process.env.DB_HOST, // local
  port: process.env.LOCAL_PG_PORT, // local
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 1000,  // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500 // close (and replace) a connection after it has been used 7500 times
})


pool.connect(async (err, client, release) => {
  if (err) {
    return console.error(process.env.DB_USERNAME, 'Error acquiring client', err.stack)
  }
  await client.query(`SELECT usename,pid FROM pg_stat_activity where usename = '${process.env.DB_USERNAME}'`, (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(`Connected to DB ${pool.options.database} as ${pool.options.user} on ${pool.options.host}:${pool.options.port}.`)
  })
})


module.exports = pool;