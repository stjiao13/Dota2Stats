CREATE TABLE comments
(
  id serial NOT NULL,
  match_id serial NOT NULL,
  content text,
  author character varying(50),
  PRIMARY KEY (id)
)