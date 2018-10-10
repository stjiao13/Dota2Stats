DROP TABLE IF EXISTS item_id
CREATE TABLE item_id
(
  id serial NOT NULL,
  item_name character varying(50),
  PRIMARY KEY (id)
);
-- COPY persons(first_name,last_name) FROM '/demo/persons.csv' DELIMITER ',' CSV HEADER;