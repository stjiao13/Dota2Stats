DROP TABLE IF EXISTS matches
CREATE TABLE matches
(
  match_id serial NOT NULL,
  start_time int NOT NULL,
  duration int NOT NULL,
  tower_status_radiant int NOT NULL,
  tower_status_dire int NOT NULL,
  barracks_status_dire int NOT NULL,
  barracks_status_radiant int NOT NULL,
  first_blood_time int NOT NULL,
  game_mode int NOT NULL,
  radiant_win character varying(50),
  PRIMARY KEY (match_id)
);
