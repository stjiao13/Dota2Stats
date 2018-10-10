DROP TABLE IF EXISTS comments
CREATE TABLE comments
(
  id serial NOT NULL,
  match_id serial NOT NULL,
  content text,
  author character varying(50),
  PRIMARY KEY (id),
  CONSTRAINT constraint_fk1 FOREIGN KEY (match_id) REFERENCES matches(match_id)
)