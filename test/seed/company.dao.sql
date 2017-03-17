--addresses
INSERT INTO address (street, build_nr, flat_nr, post_code, city) VALUES
('Spokojna',4,3,'33-100','Tarnów'),
('Krakowska',4,null,'33-120','City 1');

--companies
INSERT INTO company (name, nip,regon,address_id) VALUES
  ( 'ABC Company',12345,10,101),
  ( 'CDE Company',99999, null,null);
