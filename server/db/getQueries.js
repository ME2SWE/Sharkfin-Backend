const getQueries = {
  getNetWorth: (user_id, timeWindow, todayDate) => {
    if (timeWindow === '1D') {
      // var query = `WITH no_array AS (
      //   WITH markethr AS (
      //     WITH match_id AS (
      //       SELECT * FROM networth WHERE user_id = ${user_id}
      //     )
      //     SELECT * FROM match_id WHERE time >= '${todayDate} 13:30:00+00' AND time < '${todayDate} 19:59:59+00'
      //     )
      //   SELECT time_bucket('5 minutes', time) AS time, LAST(net, time) AS net FROM markethr GROUP BY time ORDER BY time
      //   )
      //   SELECT array_agg(n.time) AS time, array_agg(n.net) AS net
      //   FROM no_array n
      //   ;`;
      // var query = `WITH no_array AS (
      //   WITH markethr AS (
      //     WITH match_id AS (
      //       SELECT * FROM networth WHERE user_id = ${user_id}
      //     )
      //     SELECT * FROM match_id WHERE time >= now() - interval '1 day'
      //     )
      //   SELECT time_bucket('10 minutes', time) AS time, LAST(net, time) AS net FROM markethr GROUP BY time ORDER BY time
      //   )
      //   SELECT array_agg(n.time) AS time, array_agg(n.net) AS net
      //   FROM no_array n
      //   ;`;
      var query = `WITH no_array AS (
        WITH daily AS (
          SELECT * FROM networth WHERE user_id = ${user_id} AND time >= now() - interval '1 day'
          )
          SELECT time_bucket('5 minutes', time) AS interval, LAST(net, time) AS net FROM daily GROUP BY interval ORDER BY interval ASC
        )
        SELECT array_agg(n.interval) AS time, array_agg(n.net) AS net
        FROM no_array n;`;
      return query;
    } else if (timeWindow === '1W') {
      var query = `WITH no_array AS (
        WITH no_weekd AS (
          SELECT * FROM networth WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
        )
        SELECT time_bucket('1 hour',time) AS interval, LAST(net, time)
        FROM no_weekd WHERE time >= now() - interval '7.9 days'
        GROUP BY interval ORDER BY interval ASC
        )
        SELECT array_agg(n.interval) as time, array_agg(n.last) as net
        FROM no_array n
        ;`;
      return query;
    } else if (timeWindow === '1M') {
      var query = `WITH no_array AS (
        WITH no_weekd AS (
          SELECT * FROM networth WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
        )
        SELECT time_bucket('1 day',time) AS interval, LAST(net, time)
        FROM no_weekd WHERE time >= now() - interval '1 month'
        GROUP BY interval ORDER BY interval ASC
        )
        SELECT array_agg(n.interval) AS time, array_agg(n.last) AS net
        FROM no_array n
        ;`;
      return query;
    } else if (timeWindow === '3M') {
      var query = `WITH no_array AS (
        WITH no_weekd AS (
          SELECT * FROM networth WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
        )
        SELECT time_bucket('1 day',time) AS interval, LAST(net, time)
        FROM no_weekd WHERE time >= now() - interval '3 months'
        GROUP BY interval ORDER BY interval ASC
        )
        SELECT array_agg(n.interval) AS time, array_agg(n.last) AS net
        FROM no_array n
        ;`;
      return query;
    } else if (timeWindow === '1Y') {
      var query = `WITH no_array AS  (
        WITH no_weekd AS (
          SELECT * FROM networth WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
        )
        SELECT time_bucket('1 day',time) AS interval, LAST(net, time)
        FROM no_weekd WHERE time >= now() - interval '1 year'
        GROUP BY interval ORDER BY interval ASC
        )
        SELECT array_agg(n.interval) AS time, array_agg(n.last) AS net
        FROM no_array n
        ;`;
      return query;
    } else {
      var query = `WITH no_array AS (
        WITH no_weekd AS (
          SELECT * FROM networth WHERE user_id = ${user_id} AND EXTRACT (isodow FROM time) BETWEEN 1 AND 5
        )
        SELECT time_bucket('1 week',time) AS interval, LAST(net, time)
        FROM no_weekd WHERE time >= now() - interval '5 years'
        GROUP BY interval ORDER BY interval ASC
        )
        SELECT array_agg(n.interval) AS time, array_agg(n.last) AS net
        FROM no_array n
        ;`;
      return query;
    }
  },

  getAvailBalance: (user_id) => {
    var query = `SELECT DISTINCT ON (user_id) f.avail_balance FROM finances f WHERE user_id = ${user_id} ORDER BY user_id, datetime desc;`;
    return query;
  },

  getAlloPosQuery: (user_id) => {
    var query = `WITH recentfinance AS (
      SELECT DISTINCT ON (user_id) f.* FROM finances f ORDER BY user_id, datetime desc
      )
      SELECT p.user_id, p.type, p.symbol, p.qty, p.avg_cost, f.avail_balance AS buy_pwr
      FROM portfolioinstant p
      LEFT JOIN recentfinance f ON f.user_id = p.user_id
      WHERE p.user_id = ${user_id};`;
    return query;
  },

  getOldestTS: (user_id) => {
    var query = `SELECT time From portfoliomins WHERE user_id = ${user_id} ORDER BY time ASC;`;
    return query;
  },

  getUsers: function (user_id) {
    var query = `SELECT * FROM users WHERE id = ${user_id};`;
    return query;
  }
};

module.exports = getQueries;


