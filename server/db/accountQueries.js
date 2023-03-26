const dbAccounts = {
  dbGetUserInfo: (user_id) => {
    var query = `SELECT id as user_id, firstname, lastname, username, email, profilepic_url, bank, account_number FROM users WHERE id = ${user_id}`;
    return query;
  },
  dbUpdateUserInfo: (id, userInfo) => {
    var query = `UPDATE users
    SET username = '${userInfo.username}',
        firstname = '${userInfo.firstname}',
        lastname = '${userInfo.lastname}',
        profilepic_url = '${userInfo.profilepic_url}',
        bank = ${userInfo.bank},
        account_number = ${userInfo.account_number}
    WHERE id = ${id};`;
    return query;
  },
}

module.exports = dbAccounts;

// CREATE TABLE IF NOT EXISTS users (
//   id SERIAL PRIMARY KEY NOT NULL,
//   username TEXT NOT NULL,
//   firstname TEXT NOT NULL,
//   lastname TEXT NOT NULL,
//   email TEXT NOT NULL,
//   profilepic_URL TEXT,
//   bank TEXT,
//   account_number numeric NOT NULL
// );

// UPDATE users
//     SET username = 'Jacinthe Chong',
//         firstname = 'Raghav',
//         lastname = 'Chong',
//         profilepic_url = 'https://lh3.googleusercontent.com/a/AGNmyxYifgwQMYO5XzQGcZaWpFoZRvAOBybaRzGaWvq9Bw=s96-c',
//         bank = null,
//         account_number = null
//     WHERE id = 1;