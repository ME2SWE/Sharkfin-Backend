const dbLeaderBoard = {

  dbGetFriendList: (user_id) => {
    var query = `SELECT friend_id FROM friendlist WHERE user_id = ${user_id} AND status = 'complete';`;
    return query;
  },
  dbGetFriendLeaderBoard: (user_id) => {
    var query = `SELECT users.id, performance.performance_percentage, users.firstname, users.profilepic_URL
    FROM users
    JOIN performance ON users.id = performance.user_id
    WHERE users.id = ${user_id};`;
    return query;
  },
  dbGetGlobalLeaderBoard: () => {
    var query = `SELECT users.id, users.firstname, users.profilepic_URL, performance.performance_percentage
    FROM users
    INNER JOIN performance ON users.id = performance.user_id
    ORDER BY performance.performance_percentage DESC
    LIMIT 100;`;
    return query;
  },
  dbPostPerformance: (id, percentage) => {
    var query = `UPDATE performance
    SET performance_percentage = ${percentage}
    WHERE user_id = ${id};`;
    return query;
  },
  dbPostPicURL: (id, url) => {
    var query = `UPDATE users
    SET profilepic_URL = '${url}'
    WHERE id = ${id};`;
    return query;
  }
}

module.exports = dbLeaderBoard;
