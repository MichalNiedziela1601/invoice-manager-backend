CREATE TABLE contractor (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
shortcut varchar(20) NOT NULL UNIQUE,
nip integer NOT NULL UNIQUE,
regon integer NOT NULL UNIQUE,
correspond_street text NOT NULL,
correspond_building_number integer NOT NULL,
correspond_flat_number integer,
correspond_post_code varchar(6) NOT NULL,
correspond_city text NOT NULL,
correspond_email text UNIQUE,
invoice_street text NOT NULL,
invoice_building_number integer NOT NULL,
invoice_flat_number integer,
invoice_post_code varchar NOT NULL,
invoice_city text NOT NULL,
invoice_email text UNIQUE
);

CREATE TABLE invoice
 (
id SERIAL PRIMARY KEY,
contractor_buyer_id integer REFERENCES contractor(id) NOT NULL,
contractor_recipent_id integer REFERENCES contractor(id) NOT NULL,
type text NOT NULL,
invoice_number text NOT NULL,
create_data timestamp with time zone NOT NULL,
end_date timestamp with time zone NOT NULL,
netto_value real NOT NULL,
vat_value real NOT NULL,
brutto_value real NOT NULL
);
