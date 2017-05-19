--addresses
INSERT INTO address (street, build_nr, flat_nr, post_code, city) VALUES
('Spokojna',4,3,'33-100','Tarnów'),
('Krakowska',4,null,'33-120','City 1');

--companies
INSERT INTO company (name, nip,regon,address_id, shortcut) VALUES
  ( 'ABC Company',12345,10,2,'ABC'),
  ( 'CDE Company',99999, null,null, 'CDE');

--people
INSERT INTO
  person
(first_name, last_name, nip,address_id,shortcut) VALUES
  ( 'Jan','Kowalski',1234527890,1,'KOWALJAN'),
  ( 'Marian','Zalewski',null,2,'ZALEWMARIAN');

--invoices
INSERT INTO invoice (year,month,number,invoice_nr, type, create_date, execution_end_date, netto_value, brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent, payment_method ) VALUES
  (2012,2,2,'FV 2012/02/02','buy' , '2012-02-08', '2012-02-15', 230.45,345.89, 'unpaid', 'url1',1,2,null,null,'bank transfer'),
  (2012,4,2,'FV 2012/04/02' ,'sell' , '2012-04-08',  '2012-04-15', 330.45,475.89, 'paid', 'url2',2,1,null,null,'bank transfer'),
  (2014,5,123,'FV 2014/05/123' ,'sell' ,  '2014-05-18',  '2014-05-23', 2230.45,2845.89, 'paid', 'url5',null,null,2,1,'bank transfer');


