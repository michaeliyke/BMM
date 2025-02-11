# Known Issues

## Issue 0: Bookmark Deleting deletes arbitrary references

- **Description**: Deleting a bookmark deletes unconcerned references to categories and potentially tags  in the database causing data corruption.
- **Status**: FIXED
- **Priority**: High

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
- **Status**: FIXED
- **Priority**: High

## Issue 4: Proposed visual changes

- **Description**: Replace the word Description with Bookmark title in the view. Remove the title from header and give the actual URL a little glory there. The description will be tinier as well as the actions.
- **Status**: PROPOSAL
- **Priority**: Low

## Issue 5: Tag creation in Bookmark view not updating the view

- **Description**: Creating a tag in the Bookmark view does not update the view.
- **Status**: IN-PROGRESS
- **Priority** High
