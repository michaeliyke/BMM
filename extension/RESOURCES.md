# Important Resources

## React Icons Library

- [React Icons](https://react-icons.github.io/react-icons/)

## Issue 1: CategoryBookmarks.getAll() returns too many CategoryBookmark objects

- **Description**: The `CategoryBookmarks.getAll(query)` method potentially returns all `CategoryBookmark` objects in the database, not just the ones associated with the current given query.

- **Status**: FIXED
- **Priority**: High

## Issue 2: Reloading page creates more category bookmarks

- **Description**: Reloading the page creates more category bookmarks in the database.
- **Details**: CategoryBookmarks and its index, CategoryTags and its index, BookmarkTags, all get corruped on reload.
- **Status**: FIXED
- **Priority**: High

## Issue 3: Deleting a bookmarks causes stale data

- **Description**: Deleting a bookmark causes stale data in the database.
- **Status**: DEBUGGING
- **Priority**: High
