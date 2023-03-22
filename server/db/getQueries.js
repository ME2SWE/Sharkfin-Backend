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
          SELECT * FROM portfoliodays WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
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
//SELECT json_build_object(t.symbol, json_build_object('time', json_agg(t.time), 'qty', json_agg(t.qty), 'avg_cost', json_agg(t.avg_cost), 'buy_pwr', json_agg(t.buy_pwr)))
  },

  getAllocation: (user_id) => {
    var query = `SELECT * FROM portfolioinstant WHERE user_id = ${user_id};`;
    return query;
  },

  getPositions: function (user_id) {
    var query = `SELECT * FROM portfolioinstant WHERE user_id = ${user_id};`;
    return query;
  }
};

module.exports = getQueries;


// with no_weekend as (
//   select * from portfoliomins where extract (isodow from time) between 1 and 5
// )
// select *
// from portfoliomins where time >= '2023-03-07' AND time <= '2023-03-09';

//INSERT INTO portfoliodays SELECT DISTINCT ON (symbol) user_id, symbol, time, qty, avg_cost, buy_pwr FROM portfoliomins ORDER BY symbol, time desc;