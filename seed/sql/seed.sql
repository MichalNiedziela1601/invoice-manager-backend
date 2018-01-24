INSERT INTO address
(street, build_nr, flat_nr, post_code, city, country, country_code) VALUES
('Farfield Park','Unit 4, Enterprise Court',null,'S63 5DB','Rotherham','England','GB'),
('al. Tarnowskich','50C',null,'33-100','Tarnów','Poland','PL');


INSERT INTO
  company
(name, nip, regon,address_id, bank_accounts, shortcut) VALUES
  ( 'Labnoratory Academy Ltd',null,null,1,
  '{"0" : {"editMode": false, "account": "23 1050 1722 1000 0090 3063 6188", "name": "PLN", "bankName" : "ING BANK SLASKI SA", "swift" : "INGBPLPW"}, '
  '"1" : {"editMode": false, "account" : "98 1050 1722 1000 0090 3063 6196", "name" : "EUR","bankName" : "ING BANK SLASKI SA", "swift" : "INGBPLPW"},'
  '"2" : {"editMode": false, "account": "65 1050 1722 1000 0024 1486 8675", "name": "USD", "bankName" : "ING BANK SLASKI SA", "swift" : "INGBPLPW"}}'
   ,'LABNORATORY'),
  ( 'ITC BERNARD LABNO',9930390572,142583307,2,
  '{"0" : {"editMode": false, "account": "96 1160 2202 0000 0001 9118 3166", "name": "PLN", "bankName" : "BANK MILLENNIUM S.A.", "swift": "BIGBPLPW"},'
  '"1" : {"editMode": false, "account" : "37 1160 2202 0000 0003 2363 5788", "name": "EUR", "bankName" : "BANK MILLENNIUM S.A.", "swift": "BIGBPLPW"},'
  '"2" : {"editMode": false, "account" : "91 1160 2202 0000 0003 2626 6232", "name": "USD", "bankName" : "BANK MILLENNIUM S.A.", "swift": "BIGBPLPW"}}'
  , 'ITC');


INSERT INTO
  users
(email, password,company_id ) VALUES
('admin@gmail.com','$2a$10$IyqupLdOhOdp/DhQHpJgBuMXNawbABO7BF/Emc2.DswWYwRR9gFfC',2),
('user@gmail.com','$2a$10$Fg/NUjm6tF/XlWe7lFB7Vey6Eo78OgPbmevO.yqmujpLmXbJRZn8S',1);

