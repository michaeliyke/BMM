-- Drop database
DROP DATABASE IF EXISTS BMM_db;
-- Create the BMM database
CREATE DATABASE IF NOT EXISTS BMM_db;
-- Create tables
USE BMM_db;
-- Drop table
DROP TABLE IF EXISTS users;
-- The users table
CREATE TABLE IF NOT EXISTS users (
	`id` VARCHAR(60) NOT NULL PRIMARY KEY,
	`username` VARCHAR(255) DEFAULT NULL,
	`password` VARCHAR(255) DEFAULT NULL,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`first_name` VARCHAR(255) DEFAULT NULL,
	`last_name` VARCHAR(255) DEFAULT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Drop table
DROP TABLE IF EXISTS bookmarks;
-- The bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
	`id` VARCHAR(60) NOT NULL PRIMARY KEY,
	`title` VARCHAR(255) DEFAULT NULL,
	`url` VARCHAR(1024) NOT NULL,
	`description` VARCHAR(1024) DEFAULT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Drop table
DROP TABLE IF EXISTS categories;
-- The categories table
CREATE TABLE IF NOT EXISTS categories (
	`id` VARCHAR(60) NOT NULL PRIMARY KEY,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`user_id` VARCHAR(60) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
-- Drop table
DROP TABLE IF EXISTS tags;
-- The tags table
CREATE TABLE IF NOT EXISTS tags (
	`id` VARCHAR(60) NOT NULL PRIMARY KEY,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Drop table
DROP TABLE IF EXISTS category_tag;
-- The category_tag junction table
CREATE TABLE IF NOT EXISTS category_tag (
	id VARCHAR(60) DEFAULT NULL,
	category_id VARCHAR(60),
	tag_id VARCHAR(60),
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (category_id, tag_id),
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (tag_id) REFERENCES tags(id)
);
-- Drop table
DROP TABLE IF EXISTS category_bookmark;
-- The category_tag junction table
CREATE TABLE IF NOT EXISTS category_bookmark (
	id VARCHAR(60) DEFAULT NULL,
	category_id VARCHAR(60),
	bookmark_id VARCHAR(60),
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (category_id, bookmark_id),
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id)
);
-- Drop table
DROP TABLE IF EXISTS bookmark_tag;
-- The bookmark_tag junction table
CREATE TABLE IF NOT EXISTS bookmark_tag (
	id VARCHAR(60) DEFAULT NULL,
	bookmark_id VARCHAR(60),
	tag_id VARCHAR(60),
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (bookmark_id, tag_id),
	FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id),
	FOREIGN KEY (tag_id) REFERENCES tags(id)
);
-- Create a db user for the application to use
CREATE USER IF NOT EXISTS 'BMM_db_user' @'localhost';
SET PASSWORD FOR 'BMM_db_user' @'localhost' = 'BMM_db_user_password';
-- Grant all privileges on the example_db database to the test user
GRANT SELECT,
	INSERT,
	UPDATE,
	DELETE ON BMM_db.* TO 'BMM_db_user' @'localhost';
GRANT SELECT ON performance_schema.* to 'BMM_db_user' @'localhost';
-- Flush privileges to ensure that they are reloaded by the server
FLUSH PRIVILEGES;
-------------------------------------------------------------------------------------------------
-- ALTER TABLE category_tag
-- id VARCHAR(60) DEFAULT NULL,
-- ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
--
-- ALTER TABLE category_bookmark
-- id VARCHAR(60) DEFAULT NULL,
-- ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
-- ALTER TABLE bookmark_tag
-- id VARCHAR(60) DEFAULT NULL,
-- ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
---------------------------------------------------------------------------------------------
