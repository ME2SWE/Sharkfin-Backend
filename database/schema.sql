-- run 'createdb sharkfin' before anything in the terminal

-- run \i ./database/schema.sql

\c sharkfin
CREATE EXTENSION IF NOT EXISTS timescaledb;

SET TIME ZONE UTC;

CREATE TABLE IF NOT EXISTS users (
  ID SERIAL PRIMARY KEY NOT NULL,
  USERNAME TEXT NOT NULL
);

COPY users (id, username)
FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/mockuser.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfolioinstant (
  user_id INTEGER REFERENCES USERS(ID),
  symbol TEXT NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

COPY portfolioinstant (user_id, symbol, qty, avg_cost, buy_pwr)
FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/currentmock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliomins (
  user_id INTEGER REFERENCES USERS(ID),
  symbol TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

COPY portfoliomins (user_id, symbol, time, qty, avg_cost, buy_pwr)
FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/minutesMock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfoliodays (
  user_id INTEGER REFERENCES USERS(ID),
  symbol TEXT NOT NULL,
  time DATE NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

COPY portfoliodays (user_id, symbol, time, qty, avg_cost, buy_pwr)
FROM '/Users/hyoon/Workspace/rpp2207/BOC/Sharkfin-Backend/daysmock.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS portfolioweeks (
  user_id INTEGER REFERENCES USERS(ID),
  symbol TEXT NOT NULL,
  time DATE NOT NULL,
  qty INTEGER NOT NULL,
  avg_cost DOUBLE PRECISION NOT NULL,
  buy_pwr DOUBLE PRECISION NOT NULL
);

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

CREATE INDEX idx_user_symbol_instant ON portfolioinstant (user_id, symbol);
CREATE INDEX idx_user_symbol_time ON portfoliomins (user_id, symbol, time DESC);
CREATE INDEX idx_user_symbol_time ON portfoliodays (user_id, symbol, time DESC);
CREATE INDEX idx_user_symbol_time ON portfolioweeks (user_id, symbol, time DESC);

\timing