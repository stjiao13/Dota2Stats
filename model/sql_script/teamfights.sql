DROP TABLE IF EXISTS teamfights
CREATE TABLE teamfights
(
  match_id serial NOT NULL,
  start_time int NOT NULL,
  end_time int NOT NULL,
  last_death_time int NOT NULL,
  death int NOT NULL,
  PRIMARY KEY (match_id,start_time),
  CONSTRAINT constraint_fk1 FOREIGN KEY (match_id) REFERENCES matches(match_id)
);
-- COPY persons(first_name,last_name) FROM '/demo/persons.csv' DELIMITER ',' CSV HEADER;