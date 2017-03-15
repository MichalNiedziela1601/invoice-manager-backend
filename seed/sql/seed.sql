INSERT INTO address
(street, build_nr, flat_nr, post_code, city) VALUES
('Spokojna',4,3,'33-100','Tarnów'),
('Krakowska',4,null,'33-120','City 1'),
('Jana Pawła II',15,2,'33-234','Kraków'),
('Osiedlowa',21,null,'33-100','Tarnów');

INSERT INTO
  contractor_company
(name, shortcut,nip,regon, email,address) VALUES
  ( 'Firma 1',1234567890,6789567,'firma1@mail.com',1),
  ( 'Firma BUDEX',1224567890,6189567,'firma2@mail.com',2);

INSERT INTO
  contractor_person
(first_name, last_name, nip, pesel, email,address) VALUES
  ( 'Jan','Kowalski',1234527890,84030434567,'jan.kowalski@mail.com',3),
  ( 'Marian','Zalewski',null,null,'mzalewski@mail.com',4);

INSERT INTO
  invoice
(invoice_nr, type, create_date, execution_end_date, netto_value, brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent ) VALUES
  ('FV/12/02/02','Vat' , '2012-02-08', '2012-02-15', 230.45,345.89, 'unpaid', 'url1',1,2,null,null),
  ('FV/12/04/02' ,'Vat' , '2012-04-08',  '2012-04-15', 330.45,475.89, 'paid', 'url2',2,1,null,null),
  ('FV/13/07/12' ,'Korekta', '2013-07-02',  '2013-07-15', 1230.45,1445.89, 'unpaid', 'url3',null,2,1,null),
  ('FV/10/02/22' ,'Vat' ,  '2010-02-08',  '2010-02-25', 3230.45, 4145.89, 'paid', 'url4',1,2,null,null),
  ('FV/14/05/123' ,'Vat' ,  '2014-05-18',  '2014-05-23', 2230.45,2845.89, 'paid', 'url5',null,null,2,1);

