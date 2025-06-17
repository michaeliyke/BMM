import { v4 as uuid4 } from "uuid";
import { filterBy, isEmpty } from "../../utils/common";
import { lockManager } from "../../utils/locker";
import {
    IBookmark,
    IBookmarkTag,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import Category from "./category";
import CategoryBookmark from "./category_bookmark";
import CategoryTag from "./category_tag";
import Tag from "./tag";

export default class BookmarkTag implements IBookmarkTag {
    id: string;
    bookmark_id: string;
    tag_id: string;

    constructor(bookmarkTag: IBookmarkTag) {
        this.id = bookmarkTag.id; // uuid4();
        this.bookmark_id = bookmarkTag.bookmark_id;
        this.tag_id = bookmarkTag.tag_id;
        const prop = isEmpty(['id', 'bookmark_id', 'tag_id'], bookmarkTag);
        if (prop)
            throw new Error(`BookmarkTag.constructor: require field: '${prop}'`);
    }

    /**
     * Checks if a bookmark tag exists in the database.
     *
     * This method attempts to acquire a lock based on the caller's name and the bookmark tag query.
     * It then checks if a record exists in the 'bookmark_tags' table using the provided bookmark ID and tag ID.
     *
     * @returns {Promise<IBookmarkTag | null>} - A promise that resolves to the existing bookmark tag if found, otherwise null.
     * @throws {Error} - Throws an error if an issue occurs during the database query or lock acquisition.
     */
    async exists(): Promise<IBookmarkTag | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.bookmark_id, this.tag_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                return await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query) || null;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.exists:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Checks if a bookmark tag already exists in the database.
     *
     * @param bookmarkId - The ID of the bookmark to check.
     * @param tagId - The ID of the tag to check.
     *
     * @returns {Promise<IBookmarkTag | null>} A promise that resolves to the existing bookmark tag if found, otherwise null.
     *
     * @throws {Error} Throws an error if there is an issue querying the database.
     */
    static async exists(bookmarkId: string, tagId: string): Promise<IBookmarkTag | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [bookmarkId, tagId];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                return await Operator.getRecordByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query) || null;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.exists:- ${error}, ${query}`);
            }
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
                const bookmarkTags = await BookmarkTag.getAllByBookmarkId(bookmarkId);
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
                const bookmarkTags = await BookmarkTag.getAllByTagId(tagId);
                return bookmarkTags.map(({ bookmark_id }) => bookmark_id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getBookmarksIds:- ${error}, ${tagId}`);
            }
        });
    }

    /**
     * Retrieves all bookmark tags associated with a specific tag ID.
     *
     * @param tagId - The ID of the tag for which to retrieve bookmark tags.
     * @returns A promise that resolves to an array of IBookmarkTag objects associated with the given tag ID.
     * @throws An error if the retrieval process
     */
    static async getAllByTagId(tagId: string): Promise<IBookmarkTag[]> {
        return lockManager.acquire(`BookmarkTag.getAllByTagId:${tagId}`, async () => {
            try {
                // Get all the bookmark tags available
                const bookmarkTags = await Operator.getRecords<IBookmarkTag>('bookmark_tags');
                return bookmarkTags.filter((bookmarkTag) => bookmarkTag.tag_id === tagId);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getAllByTagId:- ${error}, ${tagId}`);
            }
        });
    }

    /**
     * Retrieves all bookmark tags associated with a specific bookmark ID.
     *
     * @param bookmarkId - The ID of the bookmark for which to retrieve tags.
     * @returns A promise that resolves to an array of IBookmarkTag objects associated with the given bookmark ID.
     * @throws An error if the retrieval process fails.
     */
    static async getAllByBookmarkId(bookmarkId: string): Promise<IBookmarkTag[]> {
        return lockManager.acquire(`BookmarkTag.getAllByBookmarkId:${bookmarkId}`, async () => {
            try {
                // Get all the bookmark tags available
                const bookmarkTags = await Operator.getRecords<IBookmarkTag>('bookmark_tags');
                return bookmarkTags.filter((bookmarkTag) => bookmarkTag.bookmark_id === bookmarkId);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.getAllByBookmarkId:- ${error}, ${bookmarkId}`);
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
                const bookmarkTags = await BookmarkTag.getAllByTagId(tagId);
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
                const existing = await this.exists();
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
        return lockManager.acquire(`BookmarkTag.moveBookmarkTag:${query}`, async () => {
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
        return lockManager.acquire(`BookmarkTag.delete:${query}`, async () => {
            // Ensure tag exists
            try {
                if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', this.tag_id)))
                    throw new Error(`BookmarkTag.delete:- Tag not found: ${this.tag_id}`);

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
                throw new Error(`An error occurred in BookmarkTag.delete:- ${error}, ${this.id}`);
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
                const bookmarkTags = await Operator.getRecords<IBookmarkTag>('bookmark_tags');
                const filtered = filterBy(bookmarkTags, (bookmarkTag) => bookmarkTag.bookmark_id === bookmarkId);
                for (const bookmarkTag of filtered) {
                    await Operator.deleteRecord('bookmark_tags', bookmarkTag.id);
                }
                return filtered.map(({ tag_id }) => tag_id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.deleteTagLinks:- ${error}, ${bookmarkId}`);
            }
        });
    }


    /**
     * Creates a new bookmark tag for a bookmark under a category.
     * If no category is selected, tag is added to the bookmark only.
     * @param tag - The tag to be created.
     * @param bookmark - The bookmark to be tagged.
     * @param category - The category under which the bookmark is tagged.
     * @returns A promise that resolves when the bookmark tag has been successfully created.
     */
    static async createCategoryBookmarkTag(tag: Tag, bookmark: Bookmark, category: Category | null) {
        return lockManager.acquire(`BookmarkTag.createCategoryBookmarkTag:${tag.id}:${bookmark.id}:${category?.id}`, async () => {
            try {
                if (category && !await category.exists()) // Ensure category exists
                    throw new Error(`Category not found: ${category.id}`);

                if (!await bookmark.exists()) // Ensure bookmark exists
                    throw new Error(`Bookmark not found: ${bookmark.id}`);

                if (category && !await CategoryBookmark.exists(category.id, bookmark.id)) // must exist
                    throw new Error(`Bookmark not found under category: ${bookmark.id}`);

                const tag_ = await Tag.exists(tag.name);
                if (!tag_) // create tag if not exists
                    await tag.create(); // allows to add existing tag

                // Create a bookmark tag instance
                const bookmarkTag = new BookmarkTag({
                    id: uuid4(),
                    bookmark_id: bookmark.id,
                    tag_id: tag_?.id || tag.id, /* for both exists and not exists */

                });

                if (await bookmarkTag.exists()) // Ensure bookmark tag does not exist
                    throw new Error(`BookmarkTag already exists: ${bookmarkTag.id}`);

                await bookmarkTag.create(); // create bookmark tag

                if (category) {
                    const categoryTag = new CategoryTag({  // category tag instance
                        id: uuid4(),
                        category_id: category.id,
                        tag_id: tag_?.id || tag.id,/* for both exists and not exists */
                    });

                    if (await categoryTag.exists()) // Ensure category tag does not exist
                        throw new Error(`CategoryTag already exists: ${categoryTag.id}`);

                    await categoryTag.create(); // create category tag
                }
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.createCategoryBookmarkTag:- ${error}, ${tag}, ${bookmark}, ${category}`);
            }
        });
    }

    /**
     * Creates a new bookmark and associates it with the specified tag.
     *
     * This method performs several validations before creating the bookmark:
     * 1. Checks if the tag exists
     * 2. Verifies that the bookmark does not already exist
     * 3. Ensures the bookmark is not already associated with the tag
     *
     * The operation is protected by a lock to prevent concurrent modifications
     * of the same bookmark.
     *
     * @param bookmark - The bookmark object to be created
     * @param tag - The tag to associate with the bookmark
     * @returns Promise resolving to the created bookmark object
     * @throws Error if the tag doesn't exist
     * @throws Error if the bookmark already exists
     * @throws Error if the bookmark is already associated with the tag
     * @throws Error if any other error occurs during creation
     */
    static async createBookmark(bookmark: Bookmark, tag: Tag): Promise<IBookmark> {
        return lockManager.acquire(`BookmarkTag.createBookmark:${bookmark.id}`, async () => {
            try {
                // Ensure the tag exists
                if (!(await tag.exists()))
                    throw new Error(`BookmarkTag.createBookmark:- Tag not found: ${tag.name}`);

                // Ensure bookmark does not already exists
                if (await bookmark.exists())
                    throw new Error(`BookmarkTag.createBookmark:- bookmark already exists ${bookmark.id}`);

                // If the bookmark already exists under the category, throw an error
                if (await BookmarkTag.exists(bookmark.id, tag.id))
                    throw new Error("BookmarkTag.createBookmark:- index already exists");

                await bookmark.create();
                await new BookmarkTag({ bookmark_id: bookmark.id, tag_id: tag.id, id: uuid4() }).create();
                return bookmark;
            } catch (error) {
                throw new Error(`An error occurred in Bookmarktag.createBookmark:- ${error}`);
            }
        });
    }

    /**
     * Adds an existing tag to a bookmark under a category.
     * If no category is selected, the tag is added the bookmark only.
     * @param tag - The tag to be added.
     * @param bookmark - The bookmark to be tagged.
     * @param category - The category under which the bookmark is tagged.
     * @returns A promise that resolves when the tag has been successfully added.
     */
    static async addCategoryBookmarkTag(tag: Tag, bookmark: Bookmark, category: Category | null) {
        return lockManager.acquire(`BookmarkTag.addCategoryBookmarkTag:${tag.id}:${bookmark.id}:${category?.id}`, async () => {
            try {
                if (category && !await category.exists()) // Ensure category exists
                    throw new Error(`Category not found: ${category.id}`);

                if (!await bookmark.exists()) // Ensure bookmark exists
                    throw new Error(`Bookmark not found: ${bookmark.id}`);

                if (category && !await CategoryBookmark.exists(category.id, bookmark.id)) // must exist
                    throw new Error(`Bookmark not found under category: ${bookmark.id}`);

                if (!await tag.exists()) // Ensure tag exists
                    throw new Error(`Tag not found: ${tag.id}`);

                const bookmarkTag = new BookmarkTag({
                    id: uuid4(),
                    bookmark_id: bookmark.id,
                    tag_id: tag.id,
                });

                if (await bookmarkTag.exists()) // Ensure bookmark tag does not exist
                    throw new Error(`BookmarkTag already exists: ${bookmarkTag.id}`);

                await bookmarkTag.create(); // create bookmark tag

                if (category) {
                    const categoryTag = new CategoryTag({  // category tag instance
                        id: uuid4(),
                        category_id: category.id,
                        tag_id: tag.id,
                    });

                    if (!await categoryTag.exists()) // Tag may already exist under category
                        await categoryTag.create(); // create category tag
                }
            } catch (error) {
                throw new Error(`An error occurred in BookmarkTag.addCategoryBookmarkTag:- ${error}, ${tag}, ${bookmark}, ${category}`);
            }
        });
    }
}
