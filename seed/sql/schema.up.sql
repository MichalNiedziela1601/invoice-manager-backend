CREATE TABLE "contractor_person" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "nip" BIGINT UNIQUE,
  "pesel" BIGINT UNIQUE
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL
);

CREATE TABLE "company" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "nip" BIGINT UNIQUE NOT NULL,
  "regon" BIGINT UNIQUE,
  "users" INTEGER
);

CREATE INDEX "idx_company__users" ON "company" ("users");

ALTER TABLE "company" ADD CONSTRAINT "fk_company__users" FOREIGN KEY ("users") REFERENCES "users" ("id");

CREATE TABLE "address" (
  "id" SERIAL PRIMARY KEY,
  "street" TEXT NOT NULL,
  "build_nr" INTEGER NOT NULL,
  "flat_nr" INTEGER,
  "post_code" VARCHAR(6) NOT NULL,
  "city" TEXT NOT NULL,
  "contractor_company" INTEGER,
  "contractor_person" INTEGER
);

CREATE INDEX "idx_address__contractor_company" ON "address" ("contractor_company");

CREATE INDEX "idx_address__contractor_person" ON "address" ("contractor_person");

ALTER TABLE "address" ADD CONSTRAINT "fk_address__contractor_company" FOREIGN KEY ("contractor_company") REFERENCES "company" ("id");

ALTER TABLE "address" ADD CONSTRAINT "fk_address__contractor_person" FOREIGN KEY ("contractor_person") REFERENCES "contractor_person" ("id");

CREATE TABLE "invoice" (
  "id" SERIAL PRIMARY KEY,
  "invoice_nr" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "create_date" DATE NOT NULL,
  "execution_end_date" DATE NOT NULL,
  "netto_value" DECIMAL(12, 2) NOT NULL,
  "brutto_value" DECIMAL(12, 2) NOT NULL,
  "status" TEXT NOT NULL,
  "url" TEXT UNIQUE NOT NULL,
  "company_dealer" INTEGER,
  "company_recipent" INTEGER,
  "person_dealer" INTEGER,
  "person_recipent" INTEGER
);

CREATE INDEX "idx_invoice__company_dealer" ON "invoice" ("company_dealer");

CREATE INDEX "idx_invoice__company_recipent" ON "invoice" ("company_recipent");

CREATE INDEX "idx_invoice__person_dealer" ON "invoice" ("person_dealer");

CREATE INDEX "idx_invoice__person_recipent" ON "invoice" ("person_recipent");

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__company_dealer" FOREIGN KEY ("company_dealer") REFERENCES "company" ("id");

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__company_recipent" FOREIGN KEY ("company_recipent") REFERENCES "company" ("id");

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__person_dealer" FOREIGN KEY ("person_dealer") REFERENCES "contractor_person" ("id");

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__person_recipent" FOREIGN KEY ("person_recipent") REFERENCES "contractor_person" ("id")
