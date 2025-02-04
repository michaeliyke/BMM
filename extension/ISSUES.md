# Known Issues

## Issue 0: Bookmark Deleting deletes arbitrary references

- **Description**: Deleting a bookmark deletes unconcerned references to categories and potentially tags  in the database causing data corruption.
- **Status**: Needs debugging
- **Priority**: High

## Issue 1: CategoryBookmarks.getAll() returns too many CategoryBookmark objects

- **Description**: The `CategoryBookmarks.getAll(query)` method potentially returns all `CategoryBookmark` objects in the database, not just the ones associated with the current given query.

- **Status**: Needs debugging
- **Priority**: High

## Issue 2: Reloading page creates more category bookmarks

- **Description**: Reloading the page creates more category bookmarks in the database.
-- **Details**: CategoryBookmarks and its index, CategoryTags and its index, BookmarkTags, all get corruped on reload.
- **Status**: FIXED
- **Priority**: High
