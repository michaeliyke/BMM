-- The Bookmark tableCREATE TABLE Bookmarks (
bookmark_id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
url VARCHAR(2048),
description TEXT,
-- Other bookmark specific fields
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
-- The tags table
CREATE TABLE Tags (
	tag_id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL UNIQUE
);
-- The categories table
CREATE TABLE Categories (
	category_id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL UNIQUE
);
-- The Bookkmark_tags junction table
CREATE TABLE BookmarksTags (
	bookmark_id INT NOT NULL,
	tag_id INT NOT NULL,
	PRIMARY KEY (bookmark_id, tag_id),
	CONSTRAINT fk_bookmark FOREIGN KEY (bookmark_id) REFERENCES Bookmarks(bookmark_id),
	CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);
-- The Bookmarks_categories junction table
CREATE TABLE BookmarksCategories (
	bookmark_id INT NOT NULL,
	category_id INT NOT NULL,
	PRIMARY KEY (bookmark_id, category_id),
	CONSTRAINT fk_bookmark_cat FOREIGN KEY (bookmark_id) REFERENCES Bookmarks(bookmark_id),
	CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);
- -
