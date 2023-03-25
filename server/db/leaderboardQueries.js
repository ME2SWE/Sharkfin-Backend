const dbLeaderBoard = {

  dbGetFriendList: (user_id) => {
    var query = `SELECT friend_id FROM friendlist WHERE user_id = ${user_id} AND status = 'complete';`;
    return query;
  },
  dbGetFriendLeaderBoard: (user_arr) => {
    var query = `SELECT users.id, users.firstname, users.profilepic_URL, performance.performance_percentage
    FROM users
    JOIN performance ON users.id = performance.user_id
    WHERE users.id = ANY(array${user_arr})
    ORDER BY performance.performance_percentage DESC;
    `;
    return query;
  },
  dbGetUserDetail: (id) => {
    var query = `SELECT id,
    (SELECT performance_percentage FROM performance WHERE user_id = users.id) as performance_percentage,
    firstname,
    profilepic_URL
    FROM users
    WHERE id = ${id};`;
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
  },
  dbUpdateUserInfo: (id, firstName, lastName, userName, photoURL) => {
    var query = `UPDATE users
    SET username = ${userName},
        firstname = ${firstName},
        lastname = ${lastName},
        profilepic_URL = ${photoURL}
    WHERE id = ${id};`;
    return query;
  },
}

module.exports = dbLeaderBoard;
