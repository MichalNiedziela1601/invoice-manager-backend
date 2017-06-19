INSERT INTO address (street, build_nr, flat_nr, post_code, city,country, country_code) VALUES
('Spokojna',4,5,'33-100','Tarnów','Poland','PL'),
('Krakowska',4,null,'33-100','Tarnów','Poland','PL');

INSERT INTO
  person
(first_name, last_name, nip, address_id,shortcut) VALUES
  ( 'Jan','Kowalski',1234527890,1,'KOWALJAN_KRK'),
  ( 'Marian','Zalewski',null,2,'ZALEWMARIAN_CITY1');
