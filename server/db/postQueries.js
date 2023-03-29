const postQueries = {
  regPortfolioUpdate : function(time) {
    var query = `WITH recentfinance AS (
      SELECT DISTINCT ON (user_id) f.* FROM finances f ORDER BY user_id, datetime desc
      )
      INSERT INTO portfoliomins (time, user_id, symbol, type, qty, avg_cost, buy_pwr)
      SELECT '${time}', p.user_id, p.symbol, p.type, p.qty, p.avg_cost, f.avail_balance AS buy_pwr
      FROM portfolioinstant p
      LEFT JOIN recentfinance f ON f.user_id = p.user_id;`;
    return query;
  },

  regPortfolioUpdateDays : function() {
    var query = 'INSERT INTO portfoliodays SELECT DISTINCT ON (symbol) user_id, symbol, time, qty, avg_cost, buy_pwr FROM portfoliomins ORDER BY symbol, time desc;';
    return query;
  },

  regPortfolioUpdateWeeks : function() {
    var query = 'INSERT INTO portfolioweeks SELECT DISTINCT ON (symbol) user_id, symbol, time, qty, avg_cost, buy_pwr FROM portfoliodays ORDER BY symbol, time desc;';
    return query;
  },
};

module.exports = postQueries;