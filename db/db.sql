CREATE TABLE "Customer" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50),
  "email" VARCHAR(50),
  "password" VARCHAR(50),
  "account_number" VARCHAR(50),
  "phone" VARCHAR(50),
  "address" VARCHAR(50),
  "created_at" DATE,
  "updated_at" DATE
);

CREATE TABLE "Partner" (
  "id" SERIAL,
  "code" VARCHAR(50) PRIMARY KEY,
  "created_at" DATE,
  "updated_at" DATE
);

CREATE TABLE "Employee" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50),
  "email" VARCHAR(50),
  "password" VARCHAR(50),
  "created_at" DATE,
  "updated_at" DATE
);

CREATE TABLE "Admin" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50),
  "email" VARCHAR(50),
  "password" VARCHAR(50),
  "created_at" DATE,
  "updated_at" DATE
);

CREATE TABLE "TransactionLog" (
  "id" SERIAL PRIMARY KEY,
  "transaction_type" INT,
  "transaction_method" INT,
  "is_actived" BOOLEAN,
  "is_notified" BOOLEAN,
  "sender_account_number" VARCHAR(50),
  "receiver_account_number" VARCHAR(50),
  "amount" DOUBLE,
  "message" VARCHAR(100),
  "parner_code" VARCHAR(100),
  "created_at" DATE,
  "updated_at" DATE
);

CREATE TABLE "TransactionType" (
  "id" SERIAL PRIMARY KEY,
  "type" VARCHAR(50)
);

ALTER TABLE "TransactionType" ADD FOREIGN KEY ("id") REFERENCES "TransactionLog" ("transaction_type");

ALTER TABLE "TransactionLog" ADD FOREIGN KEY ("parner_code") REFERENCES "Partner" ("code");
