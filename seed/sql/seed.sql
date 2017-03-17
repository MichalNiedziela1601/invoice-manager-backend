INSERT INTO address
(street, build_nr, flat_nr, post_code, city) VALUES
('Spokojna',4,3,'33-100','Tarnów'),
('Krakowska',4,null,'33-120','City 1'),
('Jana Pawła II',15,2,'33-234','Kraków'),
('Osiedlowa',21,null,'33-100','Tarnów');

INSERT INTO
  company
(name, nip, regon,address_id) VALUES
  ( 'Firma 1',1234567890,6789567,100),
  ( 'Firma BUDEX',1224567890,6189567,101);

INSERT INTO
  person
(first_name, last_name, nip, pesel,address_id) VALUES
  ( 'Jan','Kowalski',1234527890,84030434567,100),
  ( 'Marian','Zalewski',null,null,103);

INSERT INTO
  invoice
(invoice_nr, type, create_date, execution_end_date, netto_value, brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent ) VALUES
  ('FV/12/02/02','Buy' , '2012-02-08', '2012-02-15', 230.45,345.89, 'unpaid', 'url1',100,101,null,null),
  ('FV/12/04/02' ,'Sale' , '2012-04-08',  '2012-04-15', 330.45,475.89, 'paid', 'url2',101,100,null,null),
  ('FV/13/07/12' ,'Sale', '2013-07-02',  '2013-07-15', 1230.45,1445.89, 'unpaid', 'url3',null,101,100,null),
  ('FV/10/02/22' ,'Buy' ,  '2010-02-08',  '2010-02-25', 3230.45, 4145.89, 'paid', 'url4',100,101,null,null),
  ('FV/14/05/123' ,'Sale' ,  '2014-05-18',  '2014-05-23', 2230.45,2845.89, 'paid', 'url5',null,null,101,100);

INSERT INTO
  users
(email, password ) VALUES
('biel@gmail.com','pass123456'),
('kot@hungry.com', 'kot21kot12');
