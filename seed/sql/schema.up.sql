CREATE TABLE "address" (
  "id" SERIAL PRIMARY KEY,
  "street" TEXT NOT NULL,
  "build_nr" INTEGER NOT NULL,
  "flat_nr" INTEGER,
  "post_code" VARCHAR(6) NOT NULL,
  "city" TEXT NOT NULL
);

CREATE TABLE "contractor_company" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "nip" BIGINT UNIQUE NOT NULL,
  "regon" BIGINT UNIQUE,
  "email" TEXT NOT NULL,
  "address" INTEGER NOT NULL
);

CREATE INDEX "idx_contractor_company__address" ON "contractor_company" ("address");

ALTER TABLE "contractor_company" ADD CONSTRAINT "fk_contractor_company__address" FOREIGN KEY ("address") REFERENCES "address" ("id");

CREATE TABLE "contractor_person" (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "nip" BIGINT UNIQUE,
  "pesel" BIGINT UNIQUE,
  "email" TEXT UNIQUE,
  "address" INTEGER NOT NULL
);

CREATE INDEX "idx_contractor_person__address" ON "contractor_person" ("address");

ALTER TABLE "contractor_person" ADD CONSTRAINT "fk_contractor_person__address" FOREIGN KEY ("address") REFERENCES "address" ("id");

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

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__company_dealer" FOREIGN KEY ("company_dealer") REFERENCES "contractor_company" ("id");

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__company_recipent" FOREIGN KEY ("company_recipent") REFERENCES "contractor_company" ("id");

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__person_dealer" FOREIGN KEY ("person_dealer") REFERENCES "contractor_person" ("id");

ALTER TABLE "invoice" ADD CONSTRAINT "fk_invoice__person_recipent" FOREIGN KEY ("person_recipent") REFERENCES "contractor_person" ("id")
