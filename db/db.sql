CREATE TABLE "customer" (
  "id" SERIAL PRIMARY KEY,
  "fullname" VARCHAR(512),
  "username" VARCHAR(512),
  "email" VARCHAR(512),
  "password" VARCHAR(512),
  "status" INTEGER default 1,
  "account_number" VARCHAR(50),
  "account_balance" FLOAT,
  "phone" VARCHAR(50),
  "address" VARCHAR(50),
  "list_contact" JSONB[] default [],
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
CREATE INDEX ON "customer" ("id");


CREATE TABLE "partner" (
  "id" SERIAL,
  "code" VARCHAR(100) PRIMARY KEY,
  "name" VARCHAR(512),
  "password" VARCHAR(128),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
CREATE INDEX ON "partner" ("id");


CREATE TABLE "employee" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(512),
  "email" VARCHAR(512),
  "password" VARCHAR(512),
  "status" INTEGER default 1,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
CREATE INDEX ON "employee" ("id");


CREATE TABLE "admin" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(512),
  "email" VARCHAR(512),
  "password" VARCHAR(512),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
CREATE INDEX ON "admin" ("id");

CREATE TABLE "transaction_log" (
  "id" SERIAL PRIMARY KEY,
  "transaction_type" INT,
  "transaction_method" INT,
  "is_actived" INT,
  "is_notified" INT,
  "sender_account_number" VARCHAR(50),
  "receiver_account_number" VARCHAR(50),
  "amount" FLOAT,
  "message" VARCHAR(100),
  "parner_code" VARCHAR(100),
  "progress_status" INT,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
CREATE INDEX ON "transaction_log" ("id");

CREATE TABLE "debit" (
  "id" SERIAL PRIMARY KEY,
  "creator_customer_id" INT,
  "reminder_id" INT,
  "is_actived" INT,
  "is_notified" INT,
  "amount" FLOAT,
  "message" TEXT,
  "payment_status" INT,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
CREATE INDEX ON "transaction_log" ("id");

CREATE TABLE "transaction_type" (
  "id" SERIAL PRIMARY KEY,
  "type" VARCHAR(50)
);

ALTER TABLE "transaction_log" ADD FOREIGN KEY ("transaction_type") REFERENCES "transaction_type" ("id");

ALTER TABLE "transaction_log" ADD FOREIGN KEY ("parner_code") REFERENCES "partner" ("code");

ALTER TABLE "debit" ADD FOREIGN KEY ("creator_customer_id") REFERENCES "customer" ("id");

ALTER TABLE "debit" ADD FOREIGN KEY ("reminder_id") REFERENCES "customer" ("id");

