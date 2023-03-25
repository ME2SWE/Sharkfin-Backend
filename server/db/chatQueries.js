const dbChats = {
  dbGetChatLog: (user_id) => {
    var query = `SELECT sent_from, sent_to, message, datetime FROM chats WHERE sent_from = ${user_id} OR sent_to = ${user_id} ORDER BY datetime ASC`;
    return query;
  },
  dbPostChat: (data) => {
    var query = `INSERT INTO chats (sent_from, sent_to, message, datetime)
      VALUES (${data.sent_from}, ${data.sent_to}, '${data.message}', '${data.datetime}');`;
    return query;
  },
  dbGetChatFriends: (user_id) => {
    var query = `SELECT friendlist.friend_id, users.username, users.firstname, users.lastname, users.profilepic_URL
    FROM friendlist
    JOIN users ON friendlist.friend_id = users.id
    WHERE friendlist.user_id = ${user_id}
    AND friendlist.status = 'complete';`;
    return query;
  }
}

module.exports = dbChats;