const dbChats = {
  dbGetChatLog: (user_id) => {
    var query = `SELECT sent_from, sent_to, message, datetime FROM chats WHERE sent_from = ${user_id} OR sent_to = ${user_id} ORDER BY datetime DESC`;
    return query;
  },
  dbPostChat: (data) => {
    var query = `INSERT INTO chats (sent_from, sent_to, message)
      VALUES (${data.sent_from}, ${data.sent_to}, '${data.message}');`;
    return query;
  }
}

module.exports = dbChats;