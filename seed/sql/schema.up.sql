CREATE SEQUENCE company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE invoice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE person_id_seq
   START WITH 1
   INCREMENT BY 1
   NO MINVALUE
   NO MAXVALUE
   CACHE 1;

CREATE TABLE "company" (
	"id"  INTEGER DEFAULT nextval('company_id_seq'::regclass) NOT NULL,
	"name" TEXT NOT NULL,
	"nip" bigint NOT NULL UNIQUE,
	"regon" bigint UNIQUE,
	"address_id" bigint,
	"google_company_id" TEXT UNIQUE,
	"bank_account" TEXT,
	CONSTRAINT company_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "address" (
	"id"  INTEGER DEFAULT nextval('address_id_seq'::regclass) NOT NULL,
	"street" TEXT NOT NULL,
	"build_nr" TEXT NOT NULL,
	"flat_nr" TEXT,
	"post_code" TEXT NOT NULL,
	"city" TEXT NOT NULL,
	CONSTRAINT address_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id"  bigint DEFAULT nextval('users_id_seq'::regclass) NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"company_id" bigint UNIQUE,
	CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "invoice" (
	"id"  bigint DEFAULT nextval('invoice_id_seq'::regclass) NOT NULL,
	"invoice_nr" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"create_date" DATE NOT NULL,
	"execution_end_date" DATE NOT NULL,
	"netto_value" DECIMAL(12,2) NOT NULL,
	"brutto_value" DECIMAL(12,2) NOT NULL,
	"status" TEXT NOT NULL,
	"url" TEXT NOT NULL,
	"company_dealer" bigint,
	"company_recipent" bigint,
	"person_dealer" bigint,
	"person_recipent" bigint,
	"google_year_folder_id" TEXT,
	"google_month_folder_id" TEXT,
	"description" TEXT,
	CONSTRAINT invoice_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "person" (
	"id"  bigint DEFAULT nextval('person_id_seq'::regclass) NOT NULL,
	"first_name" TEXT NOT NULL,
	"last_name" TEXT NOT NULL,
	"nip" bigint UNIQUE,
	"pesel" bigint UNIQUE,
	"address_id" bigint NOT NULL,
	CONSTRAINT person_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "product" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"netto_value" DECIMAL(12,2) NOT NULL,
	"vat" int NOT NULL,
	"brutto_value" DECIMAL(12,2) NOT NULL,
	"quantity" DECIMAL NOT NULL,
	"invoice_id" bigint,
	CONSTRAINT product_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "company" ADD CONSTRAINT "company_fk0" FOREIGN KEY ("address_id") REFERENCES "address"("id");


ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("company_id") REFERENCES "company"("id");

ALTER TABLE "invoice" ADD CONSTRAINT "invoice_fk0" FOREIGN KEY ("company_dealer") REFERENCES "company"("id");
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_fk1" FOREIGN KEY ("company_recipent") REFERENCES "company"("id");
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_fk2" FOREIGN KEY ("person_dealer") REFERENCES "person"("id");
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_fk3" FOREIGN KEY ("person_recipent") REFERENCES "person"("id");

ALTER TABLE "person" ADD CONSTRAINT "person_fk0" FOREIGN KEY ("address_id") REFERENCES "address"("id");

ALTER TABLE "product" ADD CONSTRAINT "product_fk0" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
