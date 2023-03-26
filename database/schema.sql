-- How to seed this file:
-- 1) Install PostgreSQL onto your computer as well as psql command line tool
-- 2) Run 'createdb sharkfin' in the terminal
-- 3) Run 'psql sharkfin' to enter into postgres CLI tool
-- 4) Run '\i ./database/schema.sql'

-- to check if your tables are created properly you can run '\dt' to view all the tables

-- \c sharkfin

CREATE EXTENSION IF NOT EXISTS timescaledb;

SET TIME ZONE UTC;

CREATE TABLE IF NOT EXISTS accounts (
  account SERIAL PRIMARY KEY NOT NULL,
  username TEXT NOT NULL
);

-- COPY accounts (account, username)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/accountMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS buypwr (
  id SERIAL PRIMARY KEY NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

-- COPY buypwr (id, buy_pwr)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/buypwrMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfolioinstant (
  account INTEGER REFERENCES accounts(account),
  symbol TEXT,
  type TEXT,
  qty INTEGER,
  avg_cost DOUBLE PRECISION,
  buy_pwr INTEGER,
  CONSTRAINT fk_buypwr
    FOREIGN KEY(buy_pwr)
      REFERENCES buypwr(id)
);

-- COPY portfolioinstant(account, symbol, type, qty, avg_cost, buy_pwr)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/instantMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliomins (
  account INTEGER REFERENCES accounts(account),
  symbol TEXT,
  type TEXT,
  time TIMESTAMPTZ,
  qty INTEGER,
  avg_cost DOUBLE PRECISION,
  buy_pwr DOUBLE PRECISION
);

-- COPY portfoliomins (account, symbol, type, time, qty, avg_cost, buy_pwr)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/minutesMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliodays (
  account INTEGER REFERENCES accounts(account),
  symbol TEXT,
  type TEXT,
  time DATE,
  qty INTEGER,
  avg_cost DOUBLE PRECISION,
  buy_pwr DOUBLE PRECISION
);

-- COPY portfoliodays (account, symbol, type, time, qty, avg_cost, buy_pwr)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/daysMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfolioweeks (
  account INTEGER REFERENCES accounts(account),
  symbol TEXT,
  type TEXT,
  time DATE,
  qty INTEGER,
  avg_cost DOUBLE PRECISION,
  buy_pwr DOUBLE PRECISION
);

-- COPY portfolioweeks (account, symbol, type, time, qty, avg_cost, buy_pwr)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/weeksMock.csv' DELIMITER ',' CSV HEADER;


CREATE TYPE trade_type AS ENUM ('buy', 'sell');
CREATE TYPE status_type AS ENUM ('complete', 'pending');
CREATE TYPE trans_type AS ENUM ('bank', 'trade');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  username TEXT NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT,
  email TEXT NOT NULL,
  profilepic_URL TEXT,
  bank TEXT,
  account_number numeric
);

-- EXAMPLE INSERT STATEMENT: INSERT INTO users (username, firstname, lastname, email, profilepic_URL) VALUES ('testuser', 'Jac', 'Cho', 'jc@gmail.com', 'www.photoURL.com');


CREATE TABLE IF NOT EXISTS friendlist (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  friend_id integer REFERENCES users(id),
  status status_type
);

-- EXAMPLE INSERT STATEMENT: INSERT INTO friendlist (user_id, friend_id, status) VALUES (1, 2, 'pending');

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  type trade_type,
  datetime TEXT NOT NULL,
  stock_ticker TEXT NOT NULL,
  quantity integer NOT NULL,
  price TEXT NOT NULL,
  status status_type
);

-- EXAMPLE INSERT STATEMENT: INSERT INTO transactions (user_id, type, stock_ticker, quantity, price, status) VALUES (1, 'buy', 'GOOG', 5, '52.11', 'complete');

CREATE TABLE IF NOT EXISTS finances (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  transaction_type trans_type,
  amount numeric NOT NULL,
  net_deposits numeric NOT NULL,
  avail_balance numeric,
  datetime TIMESTAMP DEFAULT NOW()
);

-- EXAMPLE INSERT STATEMENT: INSERT INTO finances (user_id, transaction_type, amount, avail_balance) VALUES (1, 'bank', 1000, COALESCE((SELECT avail_balance FROM finances WHERE id = (SELECT MAX(id) FROM finances)), 0) + 1000);

CREATE TABLE IF NOT EXISTS performance (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  performance_percentage numeric(4,1) NOT NULL
);

CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY NOT NULL,
  sent_from integer REFERENCES users(id),
  sent_to integer REFERENCES users(id),
  message TEXT NOT NULL,
  datetime TEXT NOT NULL
);

CREATE INDEX idx_friendlist_user_id ON friendlist(user_id);
CREATE INDEX idx_friendlist_friend_id ON friendlist(friend_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_finances_user_id ON finances(user_id);
CREATE INDEX idx_performance_user_id ON performance(user_id);
CREATE INDEX idx_account_symbol_instant ON portfolioinstant (account, symbol);
CREATE INDEX idx_portmins_symbol_time ON portfoliomins (account, symbol, time DESC);
CREATE INDEX idx_portdays_symbol_time ON portfoliodays (account, symbol, time DESC);
CREATE INDEX idx_portweeks_symbol_time ON portfolioweeks (account, symbol, time DESC);
CREATE INDEX idx_chats_sent_from ON chats(sent_from);
CREATE INDEX idx_chats_sent_to ON chats(sent_to);
