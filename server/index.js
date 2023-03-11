require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT;
// const routes = require('./routes');

app.use(express.json());
app.listen(port, () => {
  console.log(`Back End Server listening on http://localhost:${port}`)
});