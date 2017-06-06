--addresses
INSERT INTO address (street, build_nr, flat_nr, post_code, city, country, country_code) VALUES
('polska',8,8,'33-100','tutaj','Poland','PL'),
('andrzje',9,6,'33-100','tutaj','Poland','PL');

--companies
INSERT INTO company (name, nip, regon, address_id,bank_accounts,shortcut) VALUES
  ( 'Kuba',1029384756, 243124,1,'{"0" : {"editMode": false, "account": "56657567567567", "name": "PLN", "bankName" : "BANK MILLENNIUM S.A.", "swift": "BIGBPLPW"}}','KUBA'),
  ('Firma Testowa',1029456789,null,null,'{"0" : {"editMode": false, "account": "908070", "name": "PLN", "bankName" : "BANK MILLENNIUM S.A.", "swift": "BIGBPLPW"}}','FIRMTEST');
