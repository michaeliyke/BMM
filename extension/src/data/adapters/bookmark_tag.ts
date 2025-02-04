import { lockManager } from "../../utils/locker";
import {
    IBookmark,
    IBookmarkTag,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import Tag from "./tag";

export default class BookmarkTag implements IBookmarkTag {
    id: string;
    bookmark_id: string;
    tag_id: string;

    constructor(bookmarkTag: IBookmarkTag) {
        this.id = bookmarkTag.id; // uuid4();
        this.bookmark_id = bookmarkTag.bookmark_id;
        this.tag_id = bookmarkTag.tag_id;
    }

    /**
     * Checks if a bookmark tag exists in the database.
     *
     * This method attempts to acquire a lock based on the caller's name and the bookmark tag query.
     * It then checks if a record exists in the 'bookmark_tags' table using the provided bookmark ID and tag ID.
     *
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the bookmark tag exists, otherwise `false`.
     * @throws {Error} - Throws an error if an issue occurs during the database query or lock acquisition.
     */
    async exists(): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.bookmark_id, this.tag_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (!await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.exists:- ${error}, ${this}`);
            }
            return false;
        });
    }

    /**
     * Checks if a bookmark tag already exists in the database.
     *
     * @returns {Promise<IBookmarkTag | null>} A promise that resolves to the existing bookmark tag if found, otherwise null.
     *
     * @throws {Error} Throws an error if there is an issue querying the database.
     */
    async existing(): Promise<IBookmarkTag | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.bookmark_id, this.tag_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                const existing = await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query);
                return existing ? existing : null;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.exists:- ${error}, ${this}`);
            }
            return null;
        });
    }

    /**
     * Checks if a bookmark tag already exists in the database.
     * @param bookmarkId - The ID of the bookmark to check.
     * @param tagId - The ID of the tag to check.
     *
     * @returns {Promise<boolean>} A promise that resolves to the existing bookmark tag if found, otherwise null.
     *
     * @throws {Error} Throws an error if there is an issue querying the database.
     */
    static async bookmarkTagExists(bookmarkId: string, tagId: string): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [bookmarkId, tagId];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (!await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.exists:- ${error}, ${query}`);
            }
            return false;
        });
    }

    /**
     * Retrieves all bookmark tags from the database.
     *
     * @param query - An optional IDBKeyRange to filter the results.
     * @returns A promise that resolves to an array of IBookmarkTag objects.
     * @throws An error if the operation fails.
     */
    static async getAll(query?: IDBKeyRange): Promise<IBookmarkTag[]> {
        return lockManager.acquire(`BookmarkTag.getAll:${query}`, async () => {
            try {
                return Operator.getRecordsByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getAll:- ${error}, ${query}`);
            }
        });
    }

    /**
     * Retrieves the tags associated with a given bookmark.
     *
     * @param bookmarkId - The ID of the bookmark for which to retrieve tags.
     * @returns A promise that resolves to an array of tags associated with the bookmark.
     * @throws An error if the retrieval process fails.
     */
    static async getTags(bookmarkId: string): Promise<ITag[]> {
        return lockManager.acquire(`BookmarkTag.getTags:${bookmarkId}`, async () => {
            try {
                // Query to handle compound keys between bookmark_id and any other key: [bookmarkId, "..."]
                const query = IDBKeyRange.bound([bookmarkId, ""], [bookmarkId, "\uffff"]);
                const bookmarkTags = await BookmarkTag.getAll(query);
                const allTags = await Tag.getTags();
                return allTags.filter((tag) => {
                    return bookmarkTags.some((bookmarkTag) => bookmarkTag.tag_id === tag.id);
                });
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getTags:- ${error}, ${bookmarkId}`);
            }
        });
    }

    /**
     * Retrieves the tag IDs associated with a given bookmark ID.
     *
     * @param bookmarkId - The ID of the bookmark for which to retrieve tag IDs.
     * @returns A promise that resolves to an array of tag IDs associated with the given bookmark ID.
     * @throws An error if the retrieval process fails.
     */
    static async getTagsIds(bookmarkId: string): Promise<string[]> {
        return lockManager.acquire(`BookmarkTag.getTagsIds:${bookmarkId}`, async () => {
            try {
                // Query to handle compound keys between bookmark_id and any other key: [bookmarkId, "..."]
                const query = IDBKeyRange.bound([bookmarkId, ""], [bookmarkId, "\uffff"]);
                const bookmarkTags = await BookmarkTag.getAll(query);
                return bookmarkTags.map(({ tag_id }) => tag_id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getTagsIds:- ${error}, ${bookmarkId}`);
            }
        });
    }

    /**
     * Retrieves the IDs of bookmarks associated with a given tag.
     *
     * @param tagId - The ID of the tag for which to retrieve bookmark IDs.
     * @returns A promise that resolves to an array of bookmark IDs associated with the specified tag.
     * @throws An error if the retrieval process fails.
     */
    static async getBookmarksIds(tagId: string): Promise<string[]> {
        return lockManager.acquire(`BookmarkTag.getBookmarksIds:${tagId}`, async () => {
            try {
                // Query to handle compound keys between tag_id and any other key: ["...", tagId]
                const query = IDBKeyRange.bound(["", tagId], ["\uffff", tagId]);
                const bookmarkTags = await BookmarkTag.getAll(query);
                return bookmarkTags.map(({ bookmark_id }) => bookmark_id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getBookmarksIds:- ${error}, ${tagId}`);
            }
        });
    }

    /**
     * Retrieves all bookmarks associated with a specific tag.
     *
     * @param tagId - The ID of the tag for which to retrieve bookmarks.
     * @returns A promise that resolves to an array of bookmarks associated with the given tag.
     * @throws An error if the retrieval process fails.
     */
    static async getBookmarks(tagId: string): Promise<IBookmark[]> {
        return lockManager.acquire(`BookmarkTag.getBookmarks:${tagId}`, async () => {
            try {
                // Query to handle compound keys between tag_id and any other key: ["...", tagId]
                const query = IDBKeyRange.bound(["", tagId], ["\uffff", tagId]);
                const bookmarkTags = await BookmarkTag.getAll(query);
                const allBookmarks = await Operator.getRecords<IBookmark>('bookmarks');
                return allBookmarks.filter((bookmark) => {
                    return bookmarkTags.some((bookmarkTag) => bookmarkTag.bookmark_id === bookmark.id);
                });
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getBookmarks:- ${error}, ${tagId}`);
            }
        });
    }

    /**
     * Adds a tag to a bookmark and links it to a given category.
     *
     * @returns A promise that resolves when the tag has been successfully added and linked.
     *
     * @throws Will throw an error if the bookmark with the given ID is not found.
     * @throws Will throw an error if the bookmark does not exist under the given category.
     * @throws Will throw an error if the category with the given ID is not found.
     * @throws Will throw an error if the tag already exists under the given category.
     */
    async create(): Promise<IBookmarkTag> {
        const query = [this.bookmark_id, this.tag_id];
        return lockManager.acquire(`BookmarkTag.create:${query}`, async () => {
            // Ensure bookmark exists
            try {
                // Ensure tag does not already exist under the bookmark
                const existing = await this.existing();
                if (!(existing))
                    return Operator.createRecord<IBookmarkTag>('bookmark_tags', this);
                return existing;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.create:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Moves a tag from one bookmark to another.
     *
     * @param tagId - The ID of the tag to be moved.
     * @param fromBookmarkId - The ID of the bookmark from which the tag is to be moved.
     * @param toBookmarkId - The ID of the bookmark to which the tag is to be moved.
     * @returns A promise that resolves when the tag has been successfully moved.
     * @throws Will throw an error if the tag does not exist.
     * @throws Will throw an error if either the source or destination bookmark does not exist.
     * @throws Will throw an error if the tag does not exist under the source bookmark.
     */
    static async moveBookmarkTag(tagId: string, fromBookmarkId: string, toBookmarkId: string): Promise<void> {
        const query = [fromBookmarkId, tagId];
        lockManager.acquire(`BookmarkTag.moveBookmarkTag:${query}`, async () => {
            // Move a tag from one bookmark to another

            // Ensure tag exists
            try {
                if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId)))
                    throw new Error(`BookmarkTag.moveBookmarkTag:- Tag not found: ${this}`);

                // Ensure both bookmarks exists
                const fromBookmark = await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', fromBookmarkId);
                if (!fromBookmark)
                    throw new Error(`BookmarkTag.moveBookmarkTag:- fromBookmark  not found (${fromBookmarkId}): ${this}`);

                const toBookmark = await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', toBookmarkId);
                if (!toBookmark)
                    throw new Error(`BookmarkTag.moveBookmarkTag:- toBookmark not found (${toBookmarkId}): ${this}`);

                // Ensure tag exists under the fromBookmark
                const bookmarkTag = await Operator.getRecordByIndex<IBookmarkTag>("bookmark_tags", "bookmark_tags_index", [fromBookmarkId, tagId]);
                if (!bookmarkTag)
                    throw new Error(`BookmarkTag.moveBookmarkTag:- Tag (${tagId}) not found under fromBookmark (${fromBookmarkId}): ${this}`);

                const updated = { ...bookmarkTag, bookmark_id: toBookmarkId };
                await Operator.updateRecord<IBookmarkTag>('bookmark_tags', updated);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.moveBookmarkTag:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Removes a tag from a bookmark.
     *
     * @returns A promise that resolves when the tag has been removed from the bookmark.
     * @throws Will throw an error if the tag does not exist.
     * @throws Will throw an error if the bookmark does not exist.
     * @throws Will throw an error if the tag is not associated with the bookmark.
     */
    async delete(): Promise<void> {
        const query = [this.bookmark_id, this.tag_id];
        lockManager.acquire(`BookmarkTag.delete:${query}`, async () => {
            // Ensure tag exists
            try {
                if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', this.tag_id)))
                    throw new Error(`BookmarkTag.delete:- Tag not found: ${this}`);

                // Ensure bookmark exists
                if (!(await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', this.bookmark_id)))
                    throw new Error(`BookmarkTag.delete:- Bookmark not found: ${this}`);

                // Ensure tag exists under the bookmark
                const query = [this.bookmark_id, this.tag_id];
                if (!(await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query)))
                    throw new Error(`BookmarkTag.delete:- BookmarkTag not found (${query}): ${this})`);

                // Delete the bookmark_tag reference
                await Operator.deleteRecordsByIndex("bookmark_tags", "bookmark_tags_index", query);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.delete:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Deletes all BookmarkTag links associated with a given tag ID.
     *
     * This method acquires a lock to ensure that the deletion process is thread-safe.
     * It retrieves all bookmark tags associated with the specified tag ID, deletes them,
     * and returns an array of bookmark IDs that were linked to the tag.
     *
     * @param tagId - The ID of the tag whose bookmark links are to be deleted.
     * @returns A promise that resolves to an array of bookmark IDs that were linked to the tag.
     * @throws An error if the deletion process fails.
     */
    static async deleteBookmarkLinks(tagId: string): Promise<string[]> {
        return lockManager.acquire(`BookmarkTag.deleteBookmarkLinks:${tagId}`, async () => {
            try {
                const query = IDBKeyRange.bound(["", tagId], ["\uffff", tagId]);
                const bookmarkTags = await BookmarkTag.getAll(query);
                await Operator.deleteRecordsByIndex('bookmark_tags', 'bookmark_tags_index', query);
                return bookmarkTags.map(({ bookmark_id }) => bookmark_id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.deleteBookmarkLinks:- ${error}, ${tagId}`);
            }
        });
    }

    /**
     * Deletes all tag links associated with a given bookmark ID.
     *
     * This method acquires a lock to ensure that the deletion process is thread-safe.
     * It retrieves all tag links for the specified bookmark ID, deletes them from the database,
     * and returns an array of tag IDs that were deleted.
     *
     * @param bookmarkId - The ID of the bookmark whose tag links are to be deleted.
     * @returns A promise that resolves to an array of tag IDs that were deleted.
     * @throws An error if the deletion process fails.
     */
    static async deleteTagLinks(bookmarkId: string): Promise<string[]> {
        return lockManager.acquire(`BookmarkTag.deleteTagLinks:${bookmarkId}`, async () => {
            try {
                const query = IDBKeyRange.bound([bookmarkId, ""], [bookmarkId, "\uffff"]);
                const bookmarkTags = await BookmarkTag.getAll(query);
                // await Operator.deleteRecordsByIndex('bookmark_tags', 'bookmark_tags_index', query);
                return bookmarkTags.map(({ tag_id }) => tag_id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.deleteTagLinks:- ${error}, ${bookmarkId}`);
            }
        });
    }

}
