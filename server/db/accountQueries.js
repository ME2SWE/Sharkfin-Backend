const dbAccounts = {
  dbGetUserInfo: (user_id) => {
    var query = `SELECT id as user_id, firstname, lastname, username, email, profilepic_url, bank, account_number FROM users WHERE id = ${user_id}`;
    return query;
  },
  dbUpdateUserInfo: (id, userInfo) => {
    var query;
    if (!userInfo.bank) {
      query = `UPDATE users
      SET username = '${userInfo.username}',
      firstname = '${userInfo.firstname}',
      lastname = '${userInfo.lastname}',
      profilepic_url = '${userInfo.profilepic_url}',
      bank = ${userInfo.bank},
      account_number = ${userInfo.account_number}
      WHERE id = ${id};`;
    } else {
      query = `UPDATE users
      SET username = '${userInfo.username}',
      firstname = '${userInfo.firstname}',
      lastname = '${userInfo.lastname}',
      profilepic_url = '${userInfo.profilepic_url}',
      bank = '${userInfo.bank}',
      account_number = ${userInfo.account_number}
      WHERE id = ${id};`
    }
    return query;
  },
  dbUpdateBankInfo: (id, bankInfo) => {
    var query = `UPDATE users
    SET bank = '${bankInfo.bank}',
        account_number = ${bankInfo.account_number}
    WHERE id = ${id};`;
    return query;
  },
}

module.exports = dbAccounts;
