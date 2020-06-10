ALTER TABLE "app_users" ADD COLUMN "role" TEXT DEFAULT 'user';
-- et c'est tout !

-- Chuck Norris est un admin !
UPDATE "app_users" SET "role"='admin' WHERE "id"=3;
