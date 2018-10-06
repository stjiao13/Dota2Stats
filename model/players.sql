CREATE TABLE players
(
  match_id serial NOT NULL,
  account_id serial NOT NULL,
  hero_id serial NOT NULL,
  player_slot int NOT NULL,
  gold int NOT NULL,
  gold_spent int NOT NULL,
  gold_per_min int NOT NULL,
  xp_per_min int NOT NULL,
  kills int NOT NULL,
  deaths int NOT NULL,
  assists int NOT NULL,
  denies int NOT NULL,
  last_hits int NOT NULL,
  stuns real NOT NULL,
  hero_damage int NOT NULL,
  hero_healing int NOT NULL,
  tower_damage int NOT NULL,
  item_0 int NOT NULL,
  item_1 int NOT NULL,
  item_2 int NOT NULL,
  item_3 int NOT NULL,
  item_4 int NOT NULL,
  item_5 int NOT NULL,
  level int NOT NULL,
  PRIMARY KEY (match_id,player_slot)
);
-- COPY persons(first_name,last_name) FROM '/demo/persons.csv' DELIMITER ',' CSV HEADER;