INSERT INTO address
(street, build_nr, flat_nr, post_code, city) VALUES
('Spokojna',4,3,'33-100','Tarnów'),
('Krakowska',4,null,'33-120','City 1'),
('Jana Pawła II',15,2,'33-234','Kraków'),
('Osiedlowa',21,null,'33-100','Tarnów'),
('Krakowska','5a',4,'33-120','City 1'),
('Lwowska',40,2,'34-120','City 2'),
('Długa',14,null,'33-120','City 1'),
('Bohaterów',34,12,'33-125','City 3'),
('Krakowska',6,null,'33-340','City 5'),
('Słoneczna',22,null,'31-120','City 1'),
('Klikowska',14,null,'33-120','City 1'),
('Bema',37,null,'33-120','City 1'),
('Długa',39,null,'33-120','City 1'),
('Rolnicza',15,3,'33-120','City 1');

INSERT INTO
  company
(name, nip, regon,address_id, bank_account, swift, bank_name) VALUES
  ( 'Firma 1',1234567890,6789567,1,'15647685898580460345809120','INGBPLPW','Alior Bank - Oddział'),
  ( 'Firma BUDEX',1224567890,6189567,2,'98753091857947708385263947','INGBPLPW','Alior Bank - Oddział'),
  ( 'FHU "MELEX"',4567123456,null,5,'64478371424814467740695217','INGBPLPW','Alior Bank - Oddział'),
  ( 'FHU "SPOŁEM"',2345678901,null,6,'97063267383625340587221473','INGBPLPW','Alior Bank - Oddział'),
  ( 'FHU "LEŚ"',3456789012,null,7,'48267775933055254614440210','INGBPLPW','mBank - Oddział'),
  ( 'MotoZbyt',4567890123,null,8,'41700706833986492292424559','INGBPLPW','mBank - Oddział'),
  ( 'RWD',5678901234,null,9,'57453449672847994899683173','INGBPLPW','mBank - Oddział'),
  ( 'COMARCH',6789012345,null,10,'07873196443437446029217904','INGBPLPW','mBank - Oddział'),
  ( 'Insoft',7890123456,null,11,'39763604096188368847402158','INGBPLPW','mBank - Oddział'),
  ( 'Amiga',8901234567,null,12,'82878288125682842816258781','INGBPLPW','ING Bank - Oddział'),
  ( 'Microsoft',9012345678,null,13,'54386429351041128035060875','INGBPLPW','ING Bank - Oddział'),
  ( 'FHU "MET-TRANS"',5432109876,null,14,'22068903623586048228853407','INGBPLPW','ING Bank - Oddział');

INSERT INTO
  person
(first_name, last_name, nip, address_id) VALUES
  ( 'Jan','Kowalski',1234527890,3),
  ( 'Marian','Zalewski',null,4);

INSERT INTO
  invoice
(year,month,number,invoice_nr, type, create_date, execution_end_date, netto_value, brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent,
 payment_method, advance, products) VALUES
  (2012,2,2,'FV 2012/02/02','buy' , '2012-02-08', '2012-02-15', 230.45,283.45, 'unpaid', 'url1',1,2,null,null,'transfer', null,'{"0" : {"name": "service1", "amount": 1, "unit": "szt", "netto": 230.45, "vat": 23, "brutto": 283.45}}'),
  (2012,4,2,'FV 2012/04/02' ,'sell' , '2012-04-08',  '2012-04-15', 330.45,406.45, 'paid', 'url2',2,1,null,null,'transfer', 100.00,'{"0" : {"name": "service1", "amount": 1, "unit": "szt", "netto": 330.45, "vat": 23, "brutto": 406.45}}'),
  (2013,7,12,'FV 2013/07/12' ,'sell', '2013-07-02',  '2013-07-15', 1230.45,1328.89, 'unpaid', 'url3',null,2,1,null,'transfer',100.00,'{"0" : {"name": "service1", "amount": 1, "unit": "szt", "netto": 230.45, "vat": 8, "brutto": 1328.89}}'),
  (2010,2,22,'FV 2010/02/22' ,'buy' ,  '2010-02-08',  '2010-02-25', 3230.45, 3391.97, 'paid', 'url4',1,2,null,null,'cash',100.00,'{"0" : {"name": "service1", "amount": 1, "unit": "szt", "netto": 230.45, "vat": 5, "brutto": 3391.97}}'),
  (2014,5,123,'FV 2014/05/123' ,'sell' ,  '2014-05-18',  '2014-05-23', 2230.45,2230.45, 'paid', 'url5',null,null,2,1,'transfer',1000.00,'{"0" : {"name": "service1", "amount": 1, "unit": "szt", "netto": 2230.45, "vat": "N/A", "brutto": 2230.45}}');

INSERT INTO
  users
(email, password,company_id ) VALUES
('admin@gmail.com','$2a$10$IyqupLdOhOdp/DhQHpJgBuMXNawbABO7BF/Emc2.DswWYwRR9gFfC',2);
