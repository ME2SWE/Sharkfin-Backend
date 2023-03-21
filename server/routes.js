require("dotenv").config();
const router = require("express").Router();
const controllers = require('./controllers.js');

router.get('/pchart', controllers.getChart);
router.get('/pallocation', controllers.getAllocationAndPosition);

module.exports = router;