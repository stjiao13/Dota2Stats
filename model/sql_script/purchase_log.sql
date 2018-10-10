DROP TABLE IF EXISTS purchase_log
CREATE TABLE purchase_log
(
  item_id serial NOT NULL,
  time int NOT NULL,
  player_slot int NOT NULL,
  match_id serial NOT NULL,
  PRIMARY KEY (match_id,player_slot,time,item_id),
  CONSTRAINT constraint_fk1 FOREIGN KEY (match_id) REFERENCES matches(match_id),
  CONSTRAINT constraint_fk2 FOREIGN KEY (item_id) REFERENCES item_id(id),
  CONSTRAINT constraint_fk3 FOREIGN KEY (match_id,player_slot) REFERENCES players(match_id,player_slot);

);