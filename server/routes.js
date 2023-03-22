// const db = require('../database/dbIndex.js');

module.exports = {
  getTransactions: (req, res) => {
  //TO-DO: db function
  },

  //Lenord
  getTopRank: (req, res) => {
    SELECT performance.user_id, performance.quarter_rank, users.profilepic_URL
    FROM performance
    INNER JOIN users ON performance.user_id = users.id
    ORDER BY performance.quarter_rank DESC
    LIMIT 100;
  },

  updateRank: (req, res) => {
    UPDATE performance
    SET quarter_rank = new_rank
    WHERE user_id = user_id;
  },

  getProfileURL: (req, res) => {
    SELECT profilepic_URL
    FROM users
    WHERE id = user_id;
  }
}