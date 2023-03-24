-- How to seed this file:
-- 1) Install PostgreSQL onto your computer as well as psql command line tool
-- 2) Run 'createdb sharkfin' in the terminal
-- 3) Run 'psql sharkfin' to enter into postgres CLI tool
-- 4) Run '\i ./database/schema.sql'

-- to check if your tables are created properly you can run '\dt' to view all the tables

CREATE EXTENSION IF NOT EXISTS timescaledb;

SET TIME ZONE UTC;

CREATE TYPE trade_type AS ENUM ('buy', 'sell');
CREATE TYPE status_type AS ENUM ('complete', 'pending');
CREATE TYPE trans_type AS ENUM ('bank', 'trade');
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  username TEXT NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL,
  profilepic_URL TEXT  
);

-- EXAMPLE INSERT STATEMENT: INSERT INTO users (username, firstname, lastname, email, profilepic_URL) VALUES ('testuser', 'Jac', 'Cho', 'jc@gmail.com', 'www.photoURL.com');

-- COPY users (id, username)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/mockuser.csv' DELIMITER ',' CSV HEADER;


CREATE TABLE IF NOT EXISTS portfolioinstant (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

-- COPY portfolioinstant (user_id, symbol, qty, avg_cost, buy_pwr)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/currentmock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliomins (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

-- COPY portfoliomins (user_id, symbol, time, qty, avg_cost, buy_pwr)
-- FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/minutesMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliodays (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT NOT NULL,
  time DATE NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

COPY portfoliodays (user_id, symbol, time, qty, avg_cost, buy_pwr)
FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/daysMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfolioweeks (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT NOT NULL,
  time DATE NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

COPY portfolioweeks (user_id, symbol, time, qty, avg_cost, buy_pwr)
FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/weeksMock.csv' DELIMITER ',' CSV HEADER;

SELECT create_hypertable(
  'portfoliomins',
  'time',
  chunk_time_interval => INTERVAL '10 minutes'
);

SELECT create_hypertable(
  'portfoliodays',
  'time',
  chunk_time_interval => INTERVAL '1 day'
);

SELECT create_hypertable(
  'portfolioweeks',
  'time',
  chunk_time_interval => INTERVAL '7 days'
);

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
  datetime TIMESTAMP DEFAULT NOW(),
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
  bank TEXT,
  account_number numeric NOT NULL,
  datetime TIMESTAMP DEFAULT NOW()
);

-- EXAMPLE INSERT STATEMENT: INSERT INTO finances (user_id, transaction_type, amount, avail_balance) VALUES (1, 'bank', 1000, COALESCE((SELECT avail_balance FROM finances WHERE id = (SELECT MAX(id) FROM finances)), 0) + 1000);


CREATE TABLE IF NOT EXISTS performance (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  quarter_rank integer NOT NULL
);

CREATE INDEX idx_friendlist_user_id ON friendlist(user_id);
CREATE INDEX idx_friendlist_friend_id ON friendlist(friend_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_finances_user_id ON finances(user_id);
CREATE INDEX idx_performance_user_id ON performance(user_id);
CREATE INDEX idx_user_symbol_instant ON portfolioinstant (user_id, symbol);
CREATE INDEX idx_user_symbol_time ON portfoliomins (user_id, symbol, time DESC);
CREATE INDEX idx_user_symbol_time ON portfoliodays (user_id, symbol, time DESC);
CREATE INDEX idx_user_symbol_time ON portfolioweeks (user_id, symbol, time DESC);
