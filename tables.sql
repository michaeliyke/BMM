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
	`email` VARCHAR(255) DEFAULT NULL,
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
	`name` VARCHAR(255) NOT NULL,
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
	`name` VARCHAR(255) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Drop table
DROP TABLE IF EXISTS bookmark_category;
-- The bookmark_category junction table
CREATE TABLE IF NOT EXISTS bookmark_category (
	bookmark_id VARCHAR(60) NOT NULL,
	category_id VARCHAR(60) NOT NULL,
	PRIMARY KEY (bookmark_id, category_id),
	FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id),
	FOREIGN KEY (category_id) REFERENCES categories(id)
);
-- Drop table
DROP TABLE IF EXISTS bookmark_tag;
-- The bookmark_tag junction table
CREATE TABLE IF NOT EXISTS bookmark_tag (
	bookmark_id VARCHAR(60) NOT NULL,
	tag_id VARCHAR(60) NOT NULL,
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
