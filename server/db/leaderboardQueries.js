const dbLeaderBoard = {

  dbGetFriendList: (user_id) => {
    var query = `SELECT friend_id FROM friendlist WHERE user_id = ${user_id} AND status = 'complete';`;
    return query;
  },
  dbGetFriendLeaderBoard: (user_id_arr) => {
    var query = `SELECT u.user_id, p.performance_percentage, u.firstname, u.profilepic_URL
    FROM users u
    INNER JOIN performance p ON u.user_id = p.user_id
    WHERE u.user_id IN ${user_id_arr}
    ORDER BY p.performance_percentage DESC
    LIMIT 100;`;
    return query;
  },
  dbGetGlobalLeaderBoard: () => {
    var query = `SELECT users.user_id, users.firstname, users.profilepic_URL, performance.performance_percentage
    FROM users
    INNER JOIN performance ON users.user_id = performance.user_id
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
}

module.exports = dbLeaderBoard;
