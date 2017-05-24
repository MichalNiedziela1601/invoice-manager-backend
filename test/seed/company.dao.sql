--addresses
INSERT INTO address (street, build_nr, flat_nr, post_code, city) VALUES
('polska',8,8,'33-100','tutaj'),
('andrzje',9,6,'33-100','tutaj');

--companies
INSERT INTO company (name, nip, regon, address_id,bank_account, bank_name) VALUES
  ( 'Kuba',1029384756, 243124,1,'22068903623586048228853407','Alior Bank'),
  ('Firma Testowa',1029456789,null,null,'22068903623586048228853408','ING');
