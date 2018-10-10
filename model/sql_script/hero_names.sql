DROP TABLE IF EXISTS hero_name 
CREATE TABLE hero_name 
(
  hero_id serial NOT NULL,
  localized_name character varying(50),
  PRIMARY KEY (hero_id)
);
