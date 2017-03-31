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
(name, nip, regon,address_id) VALUES
  ( 'Firma 1',1234567890,6789567,1),
  ( 'Firma BUDEX',1224567890,6189567,2),
  ( 'FHU "MELEX"',4567123456,null,5),
  ( 'FHU "SPOŁEM"',2345678901,null,6),
  ( 'FHU "LEŚ"',3456789012,null,7),
  ( 'MotoZbyt',4567890123,null,8),
  ( 'RWD',5678901234,null,9),
  ( 'COMARCH',6789012345,null,10),
  ( 'Insoft',7890123456,null,11),
  ( 'Amiga',8901234567,null,12),
  ( 'Microsoft',9012345678,null,13),
  ( 'FHU "MET-TRANS"',5432109876,null,14);

INSERT INTO
  person
(first_name, last_name, nip, pesel,address_id) VALUES
  ( 'Jan','Kowalski',1234527890,84030434567,3),
  ( 'Marian','Zalewski',null,null,4);

INSERT INTO
  invoice
(invoice_nr, type, create_date, execution_end_date, netto_value, brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent ) VALUES
  ('FV/12/02/02','buy' , '2012-02-08', '2012-02-15', 230.45,345.89, 'unpaid', 'url1',1,2,null,null),
  ('FV/12/04/02' ,'sell' , '2012-04-08',  '2012-04-15', 330.45,475.89, 'paid', 'url2',2,1,null,null),
  ('FV/13/07/12' ,'sell', '2013-07-02',  '2013-07-15', 1230.45,1445.89, 'unpaid', 'url3',null,2,1,null),
  ('FV/10/02/22' ,'buy' ,  '2010-02-08',  '2010-02-25', 3230.45, 4145.89, 'paid', 'url4',1,2,null,null),
  ('FV/14/05/123' ,'sell' ,  '2014-05-18',  '2014-05-23', 2230.45,2845.89, 'paid', 'url5',null,null,2,1);

INSERT INTO
  users
(email, password,company_id ) VALUES
('biel@gmail.com','pass123456',null),
('kot@hungry.com', 'kot21kot12',null),
('admin@gmail.com','$2a$10$IyqupLdOhOdp/DhQHpJgBuMXNawbABO7BF/Emc2.DswWYwRR9gFfC',2);
