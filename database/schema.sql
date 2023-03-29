-- How to seed this file:
-- 1) Install PostgreSQL onto your computer as well as psql command line tool
-- 2) Run 'createdb sharkfin' in the terminal
-- 3) Run 'psql sharkfin' to enter into postgres CLI tool
-- 4) Run '\i ./database/schema.sql'

-- to check if your tables are created properly you can run '\dt' to view all the tables

-- \c sharkfin

CREATE EXTENSION IF NOT EXISTS timescaledb;

SET TIME ZONE UTC;

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

COPY users (id,username,firstname,lastname,email,profilepic_URL) FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/userMock.csv' DELIMITER ',' CSV HEADER;

-- EXAMPLE INSERT STATEMENT: INSERT INTO users (username, firstname, lastname, email, profilepic_URL) VALUES ('testuser', 'Jac', 'Cho', 'jc@gmail.com', 'www.photoURL.com');
-- INSERT INTO users (username, firstname, lastname, email, profilepic_URL) VALUES ('testuser', 'H', 'Y', 'howardhyoon@gmail.com', 'www.photoURL.com');
-- INSERT INTO users (username, firstname, lastname, email, profilepic_URL) VALUES ('testuser1', 'H1', 'Y1', 'testing@gmail.com', 'www.photoURL.com');

CREATE TABLE IF NOT EXISTS friendlist (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  friend_id integer REFERENCES users(id),
  status status_type
);

COPY friendlist (user_id,friend_id,status) FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/friendlistMock.csv' DELIMITER ',' CSV HEADER;

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
COPY transactions (id,user_id,type,datetime,stock_ticker,quantity,price,status) FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/transactionsMock.csv' DELIMITER '*' CSV HEADER;


-- EXAMPLE INSERT STATEMENT: INSERT INTO transactions (user_id, type, stock_ticker, quantity, price, status) VALUES (1, 'buy', 'GOOG', 5, '52.11', 'complete');

CREATE TABLE IF NOT EXISTS finances (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  transaction_type trans_type,
  amount DOUBLE PRECISION NOT NULL,
  net_deposits DOUBLE PRECISION NOT NULL,
  avail_balance DOUBLE PRECISION,
  datetime TIMESTAMP DEFAULT NOW()
);
COPY finances (user_id,transaction_type,amount,net_deposits,avail_balance,datetime) FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/financeMock.csv' DELIMITER ',' CSV HEADER;



-- EXAMPLE INSERT STATEMENT: INSERT INTO finances (user_id, transaction_type, amount, avail_balance) VALUES (1, 'bank', 1000, COALESCE((SELECT avail_balance FROM finances WHERE id = (SELECT MAX(id) FROM finances)), 0) + 1000);
insert into finances ("user_id","transaction_type","amount","net_deposits","avail_balance") values (1,'bank',0,1000,1000);
insert into finances ("user_id","transaction_type","amount","net_deposits","avail_balance") values (1,'bank',1000,2000,2000);
insert into finances ("user_id","transaction_type","amount","net_deposits","avail_balance") values (3,'bank',0,500,500);

CREATE TABLE IF NOT EXISTS performance (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users(id),
  performance_percentage numeric(4,1) NOT NULL
);

COPY performance (user_id,performance_percentage) FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/performanceMock.csv' DELIMITER ',' CSV HEADER;


CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY NOT NULL,
  sent_from integer REFERENCES users(id),
  sent_to integer REFERENCES users(id),
  message TEXT NOT NULL,
  datetime TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolioinstant (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT,
  type TEXT,
  qty FLOAT,
  avg_cost DOUBLE PRECISION
);

INSERT INTO (user_id, symbol, type, qty, avg_cost) values(5, 'MSFT', 'stock', 100, 1);
COPY portfolioinstant(user_id, symbol, type, qty, avg_cost)
FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/instantMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliomins (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT,
  type TEXT,
  time TIMESTAMPTZ,
  qty FLOAT,
  avg_cost DOUBLE PRECISION,
  buy_pwr DOUBLE PRECISION
);

COPY portfoliomins (user_id, symbol, type, time, qty, avg_cost, buy_pwr)
FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/minutesMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliodays (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT,
  type TEXT,
  time DATE,
  qty FLOAT,
  avg_cost DOUBLE PRECISION,
  buy_pwr DOUBLE PRECISION
);

COPY portfoliodays (user_id, symbol, type, time, qty, avg_cost, buy_pwr)
FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/daysMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfolioweeks (
  user_id INTEGER REFERENCES users(id),
  symbol TEXT,
  type TEXT,
  time DATE,
  qty FLOAT,
  avg_cost DOUBLE PRECISION,
  buy_pwr DOUBLE PRECISION
);

COPY portfolioweeks (user_id, symbol, type, time, qty, avg_cost, buy_pwr)
FROM '/Users/saikitJK/HackReactor/BOC/Sharkfin-Backend/weeksMock.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX idx_friendlist_user_id ON friendlist(user_id);
CREATE INDEX idx_friendlist_friend_id ON friendlist(friend_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_finances_user_id ON finances(user_id);
CREATE INDEX idx_performance_user_id ON performance(user_id);
CREATE INDEX idx_portinstant_symbol ON portfolioinstant (user_id, symbol);
CREATE INDEX idx_portmins_symbol_time ON portfoliomins (user_id, symbol, time DESC);
CREATE INDEX idx_portdays_symbol_time ON portfoliodays (user_id, symbol, time DESC);
CREATE INDEX idx_portweeks_symbol_time ON portfolioweeks (user_id, symbol, time DESC);
CREATE INDEX idx_chats_sent_from ON chats(sent_from);
CREATE INDEX idx_chats_sent_to ON chats(sent_to);


SELECT setval('users_id_seq', COALESCE((SELECT MAX(id)+1 FROM users), 1), false);