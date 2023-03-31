const postQueries = {
  regNetWorthUpdate : function (user_id, net) {
    var query = `INSERT INTO networth (user_id, net, time) VALUES (${user_id}, ${net}, NOW());`
    return query;
  }
};

module.exports = postQueries;