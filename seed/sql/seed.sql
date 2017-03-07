INSERT INTO
  contractor
(name, shortcut,nip,regon, correspond_street,correspond_building_number,correspond_flat_number,correspond_post_code,
correspond_city,correspond_email,invoice_street,invoice_building_number,invoice_flat_number,invoice_post_code,invoice_city,
invoice_email) VALUES
  ( 'Firma 1','Firma1',1234567890,6789567,'Firmowa',7,null,'33-100','Tarnów','firma1@mail.com','Baza',5,4,'33-101','Ładna','firma1@mail.com'),
  ( 'Firma BUDEX','BUDEX',1224567890,6189567,'Główna',11,4,'33-100','Tarnów','firma2@mail.com','Główna',11,4,'33-100','Tarnów','firma2@mail.com');

INSERT INTO
  invoice
(contractor_buyer_id, contractor_recipent_id, type, invoice_number, create_data, end_date, netto_value, vat_value,  brutto_value ) VALUES
  (1 , 2, 'Zakup','FV/12/02/02', timestamp '1999-01-08 04:05:06', timestamp '1999-01-08 04:05:06', 1000, 230, 1230),
    (2 , 1, 'Zakup','FV/03/452', timestamp '1999-01-08 04:05:06', timestamp '1999-01-08 04:05:06', 100, 23, 123),
      (1, 2, 'Sprzedaz','FV/120/03', timestamp '1999-01-08 04:05:06', timestamp '1999-01-08 04:05:06', 500, 115, 615)