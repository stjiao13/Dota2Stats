DROP TABLE IF EXISTS players

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
  PRIMARY KEY (match_id,player_slot),
  CONSTRAINT constraint_fk1 FOREIGN KEY (match_id) REFERENCES matches(match_id),
  CONSTRAINT constraint_fk2 FOREIGN KEY (hero_id) REFERENCES hero_name(hero_id),
  CONSTRAINT constraint_fk3 FOREIGN KEY (item_0) REFERENCES item_id(id),
  CONSTRAINT constraint_fk4 FOREIGN KEY (item_1) REFERENCES item_id(id),
  CONSTRAINT constraint_fk5 FOREIGN KEY (item_2) REFERENCES item_id(id),
  CONSTRAINT constraint_fk6 FOREIGN KEY (item_3) REFERENCES item_id(id),
  CONSTRAINT constraint_fk7 FOREIGN KEY (item_4) REFERENCES item_id(id),
  CONSTRAINT constraint_fk8 FOREIGN KEY (item_5) REFERENCES item_id(id),
);