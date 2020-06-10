-- -----------------------------------------------------
-- Schema oquiz
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table "levels"
-- -----------------------------------------------------
DROP TABLE IF EXISTS "levels" ;

CREATE TABLE IF NOT EXISTS "levels" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(32) NOT NULL,
  "status" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  PRIMARY KEY ("id"));


-- -----------------------------------------------------
-- Table "answers"
-- -----------------------------------------------------
DROP TABLE IF EXISTS "answers" ;

CREATE TABLE IF NOT EXISTS "answers" (
  "id" SERIAL NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "status" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  "questions_id" INT NOT NULL,
  PRIMARY KEY ("id"));


-- -----------------------------------------------------
-- Table "app_users"
-- -----------------------------------------------------
DROP TABLE IF EXISTS "app_users" ;

CREATE TABLE IF NOT EXISTS "app_users" (
  "id" SERIAL NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(60) NOT NULL,
  "firstname" VARCHAR(64) NULL,
  "lastname" VARCHAR(64) NULL,
  "status" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  PRIMARY KEY ("id"));


-- -----------------------------------------------------
-- Table "quizzes"
-- -----------------------------------------------------
DROP TABLE IF EXISTS "quizzes" ;

CREATE TABLE IF NOT EXISTS "quizzes" (
  "id" SERIAL NOT NULL,
  "title" VARCHAR(64) NOT NULL,
  "description" VARCHAR(255) NULL,
  "status" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  "app_users_id" INT NOT NULL,
  PRIMARY KEY ("id"));


-- -----------------------------------------------------
-- Table "questions"
-- -----------------------------------------------------
DROP TABLE IF EXISTS "questions" ;

CREATE TABLE IF NOT EXISTS "questions" (
  "id" SERIAL NOT NULL,
  "question" VARCHAR(255) NOT NULL,
  "anecdote" TEXT NULL,
  "wiki" VARCHAR(64) NULL,
  "status" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  "levels_id" INT NOT NULL,
  "answers_id" INT NOT NULL, /* COMMENT 'Id de la bonne réponse',*/
  "quizzes_id" INT NOT NULL,
  PRIMARY KEY ("id"));


-- -----------------------------------------------------
-- Table "tags"
-- -----------------------------------------------------
DROP TABLE IF EXISTS "tags" ;

CREATE TABLE IF NOT EXISTS "tags" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(64) NOT NULL,
  "status" INT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NULL,
  PRIMARY KEY ("id"));


-- -----------------------------------------------------
-- Table "quizzes_has_tags"
-- -----------------------------------------------------
DROP TABLE IF EXISTS "quizzes_has_tags" ;

CREATE TABLE IF NOT EXISTS "quizzes_has_tags" (
  "quizzes_id" INT NOT NULL,
  "tags_id" INT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("quizzes_id", "tags_id"));