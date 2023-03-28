const getQueries = {
  getPortfolioHistory: (user_id, timeframe, timeWindow, todayDate) => {
    if (timeWindow === '1D') {
      var query = `
      WITH no_agg AS (
        WITH no_weekd AS (
          SELECT * FROM portfoliomins WHERE user_id = ${user_id}
        )
        SELECT * FROM no_weekd WHERE time >= '${todayDate} 13:30:00+00' AND time < '${todayDate} 19:59:59+00'
        )
      SELECT t.symbol, array_agg(t.time) as time, array_agg(t.qty) as qty, array_agg(t.avg_cost) as avg_cost, array_agg(buy_pwr) as buy_pwr
      FROM no_agg t
      GROUP BY t.symbol;
      `;
      return query;
    } else if (timeWindow === '5Y') {
      var query = `
      WITH no_agg AS (
        WITH no_weekd AS (
          SELECT * FROM portfolioweeks WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
        )
        SELECT * FROM no_weekd WHERE time > NOW() - INTERVAL '${timeframe}'
        )
      SELECT t.symbol, array_agg(t.time) as time, array_agg(t.qty) as qty, array_agg(t.avg_cost) as avg_cost, array_agg(buy_pwr) as buy_pwr
      FROM no_agg t
      GROUP BY t.symbol;
      `;
      return query;
    } else {
      var query = `
      WITH no_agg AS (
        WITH no_weekd AS (
          SELECT * FROM portfoliodays WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
        )
        SELECT * FROM no_weekd WHERE time > NOW() - INTERVAL '${timeframe}'
        )
      SELECT t.symbol, array_agg(t.time) as time, array_agg(t.qty) as qty, array_agg(t.avg_cost) as avg_cost, array_agg(buy_pwr) as buy_pwr
      FROM no_agg t
      GROUP BY t.symbol;
      `;
      return query;
    }
  },

  getAlloPosQuery: (user_id) => {
    var query = `SELECT
    p.user_id, p.symbol, p.qty, p.avg_cost, f.avail_balance AS buy_pwr
    FROM portfolioinstant p
    LEFT JOIN finances f ON f.user_id = p.user_id
    WHERE p.user_id = ${user_id} AND f.id = (select max(id) from finances);`;
    return query;
  },

  getUsers: function (user_id) {
    var query = `SELECT * FROM users WHERE id = ${user_id};`;
    return query;
  }
};

module.exports = getQueries;

// SELECT
// i.user_id, i.symbol, i.type, i.qty, i.avg_cost, f.avail_balance AS buy_pwr FROM portfolioinstant i
// LEFT JOIN finances f ON f.user_id = i.user_id
// WHERE i.user_id = 1 AND id = (select max(id) from finances);

