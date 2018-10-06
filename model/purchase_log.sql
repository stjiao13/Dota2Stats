CREATE TABLE purchase_log
(
  item_id serial NOT NULL,
  time int NOT NULL,
  player_slot int NOT NULL,
  match_id serial NOT NULL,
  PRIMARY KEY (match_id,player_slot,time,item_id)
);