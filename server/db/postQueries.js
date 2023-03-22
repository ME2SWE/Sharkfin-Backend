const postQueries = {
  regPortfolioUpdate : function(time) {
    var query = `INSERT INTO portfoliomins (time, user_id, symbol, qty, avg_cost, buy_pwr)
    SELECT '${time}', i.user_id, i.symbol, i.qty, i.avg_cost, i.buy_pwr FROM portfolioinstant i;`;
    return query;
  },

  regPortfolioUpdateDays : function() {
    var query = 'INSERT INTO portfoliodays SELECT DISTINCT ON (symbol) user_id, symbol, time, qty, avg_cost, buy_pwr FROM portfoliomins ORDER BY symbol, time desc;';
    return query;
  },

  regPortfolioUpdateWeeks : function() {
    var query = 'INSERT INTO portfolioweeks SELECT DISTINCT ON (symbol) user_id, symbol, time, qty, avg_cost, buy_pwr FROM portfoliodays ORDER BY symbol, time desc;';
    return query;
  }
};

module.exports = postQueries;