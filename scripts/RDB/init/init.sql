CREATE USER db_admin WITH PASSWORD '1234';

CREATE DATABASE pickone OWNER db_admin;

\c pickone db_admin

CREATE TABLE accounts
(
  id      uuid    NOT NULL,
  user_id varchar NOT NULL,
  pw      varchar NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE board_options
(
  idx       int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  board_idx int      NOT NULL,
  order     smallint NOT NULL DEFAULT 1,
  contents  varchar  NOT NULL,
  count     int      NOT NULL DEFAULT 0,
  PRIMARY KEY (idx)
);

COMMENT ON COLUMN board_options.order IS '1 -> 2 -> 3';

CREATE TABLE board_snapshots
(
  id         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  board_idx  int                      NOT NULL,
  title      varchar                  NOT NULL,
  contents   varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE boards
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  author_id  uuid                     NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE comment_snapshots
(
  id          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  comment_idx int                      NOT NULL,
  contents    varchar                  NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE comments
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  board_idx  int                      NOT NULL,
  author_id  uuid                     NOT NULL,
  option_idx int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE users
(
  id         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  nickname   varchar                  NOT NULL,
  birth      date                     NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (id)
);

CREATE TABLE votes
(
  id         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
  user_id    uuid                     NOT NULL,
  option_idx int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE INDEX comment_snapshots_latest_idx
    ON comment_snapshots (comment_idx, created_at DESC);

CREATE INDEX board_snapshots_latest_idx
    ON board_snapshots (board_idx, created_at DESC);

ALTER TABLE board_options
  ADD CONSTRAINT FK_boards_TO_board_options
    FOREIGN KEY (board_idx)
    REFERENCES boards (idx);

ALTER TABLE boards
  ADD CONSTRAINT FK_users_TO_boards
    FOREIGN KEY (author_id)
    REFERENCES users (id);

ALTER TABLE board_snapshots
  ADD CONSTRAINT FK_boards_TO_board_snapshots
    FOREIGN KEY (board_idx)
    REFERENCES boards (idx);

ALTER TABLE votes
  ADD CONSTRAINT FK_users_TO_votes
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE votes
  ADD CONSTRAINT FK_board_options_TO_votes
    FOREIGN KEY (option_idx)
    REFERENCES board_options (idx);

ALTER TABLE accounts
  ADD CONSTRAINT FK_users_TO_accounts
    FOREIGN KEY (id)
    REFERENCES users (id);

ALTER TABLE comments
  ADD CONSTRAINT FK_boards_TO_comments
    FOREIGN KEY (board_idx)
    REFERENCES boards (idx);

ALTER TABLE comments
  ADD CONSTRAINT FK_users_TO_comments
    FOREIGN KEY (author_id)
    REFERENCES users (id);

ALTER TABLE comment_snapshots
  ADD CONSTRAINT FK_comments_TO_comment_snapshots
    FOREIGN KEY (comment_idx)
    REFERENCES comments (idx);

ALTER TABLE comments
  ADD CONSTRAINT FK_board_options_TO_comments
    FOREIGN KEY (option_idx)
    REFERENCES board_options (idx);