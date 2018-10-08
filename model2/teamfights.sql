CREATE TABLE teamfights
(
  match_id serial NOT NULL,
  start_time int NOT NULL,
  end_time int NOT NULL,
  last_death_time int NOT NULL,
  death int NOT NULL,
  PRIMARY KEY (match_id,start_time)
);
-- COPY persons(first_name,last_name) FROM '/demo/persons.csv' DELIMITER ',' CSV HEADER;