INSERT INTO company (name, nip, regon, address_id,bank_accounts, shortcut) VALUES
  ( 'Kuba',1029384756, 243124,null,'{"0" : {"editMode": false, "account": "56657567567567", "name": "PLN", "bankName" : "BANK MILLENNIUM S.A.", "swift": "BIGBPLPW"}}','KUBA'),
  ('Firma Testowa',1029456789,null,null,'{"0" : {"editMode": false, "account": "56657567567567", "name": "PLN", "bankName" : "BANK MILLENNIUM S.A.", "swift": "BIGBPLPW"}}','FIRMTEST');

INSERT INTO
  users
(email, password,company_id ) VALUES
('test@gmail.com','$2a$10$8qQ.d6DUEQmfic9bbTbi/.2QOsKCvqq0c3r3YbFj56QFVdrTudyOC',1),
('user@gmail.com','$2a$10$XkJWMp.ukxhdJQ6vndWUJefZdkTrmy5DO1duPrvQ12MUpx5jv0Q/q',2);
