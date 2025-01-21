import { lockManager } from "../../utils/locker";
import {
    IBookmark,
    IBookmarkTag,
    ICategory,
    ICategoryBookmark,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import Category from "./category";
import { v4 as uuid4 } from 'uuid';

// const lockManager = new LockManager();

export default class CategoryBookmark implements ICategoryBookmark {
    id: string;
    category_id: string;
    bookmark_id: string;

    /**
     * Checks if a category bookmark exists in the database.
     *
     * This method constructs a query using the `category_id` and `bookmark_id` properties
     * of the instance and attempts to acquire a lock based on the caller's name and the query.
     * It then checks if a record exists in the 'category_bookmarks' table using the specified index.
     *
     * @returns {Promise<boolean>} A promise that resolves to `true` if the category bookmark exists, otherwise `false`.
     * @throws {Error} Throws an error if an issue occurs during the database query.
     */
    async exists(): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.category_id, this.bookmark_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (await Operator.getRecordByIndex('category_bookmarks', 'category_bookmarks_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.exists:- ${error}, ${this}`);
            }
            return false;
        });
    }

    /**
     * Checks if a category bookmark already exists in the database.
     *
     * @returns {Promise<ICategoryBookmark | null>} A promise that resolves to the existing category bookmark if found, or null if not found.
     *
     * @throws {Error} Throws an error if there is an issue querying the database.
     */
    async existing(): Promise<ICategoryBookmark | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.category_id, this.bookmark_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                const existing = await Operator.getRecordByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query)
                return existing ? existing : null;
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.exists:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Retrieves all category bookmarks that match the given query.
     *
     * @param {IDBKeyRange} [query] - An optional key range to filter the results.
     * @returns {Promise<ICategoryBookmark[]>} A promise that resolves to an array of category bookmarks.
     * @throws {Error} If an error occurs while retrieving the category bookmarks.
     */
    static async getAll(query?: IDBKeyRange): Promise<ICategoryBookmark[]> {
        return lockManager.acquire(`CategoryBookmark.getAll:${query}`, async () => {
            try {
                return Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.getAll:- ${error}, ${query}`);
            }
        });
    }

    /**
     * Retrieves all bookmarks associated with a specific category.
     *
     * @param categoryId - The ID of the category for which to retrieve bookmarks.
     * @returns A promise that resolves to an array of bookmarks associated with the specified category.
     * @throws An error if there is an issue retrieving the bookmarks.
     */
    static async getBookmarks(categoryId: string): Promise<IBookmark[]> {
        return lockManager.acquire(`CategoryBookmark.getBookmarks:${categoryId}`, async () => {
            try {
                // Query to handle compound keys between category_id and any other key: [categoryId, "..."]
                const query = IDBKeyRange.bound([categoryId, ""], [categoryId, "\uffff"]);
                const categoryBookmarks = await CategoryBookmark.getAll(query);
                const allBookmarks = await Bookmark.getBookmarks();
                return allBookmarks.filter((bookmark) => {
                    return categoryBookmarks.some((cateBookmark) => cateBookmark.bookmark_id === bookmark.id);
                });
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.getBookmarks:- ${error}, ${categoryId}`);
            }
        });
    }

    /**
     * Retrieves the categories associated with a given bookmark ID.
     *
     * This method acquires a lock to ensure that the retrieval process is thread-safe.
     * It queries the 'category_bookmarks' store using an index and returns the matching records.
     *
     * @param bookmarkId - The ID of the bookmark for which categories are to be retrieved.
     * @returns A promise that resolves to an array of ICategoryBookmark objects.
     * @throws An error if the retrieval process fails.
     */
    static async getCategories(bookmarkId: string): Promise<ICategory[]> {
        return lockManager.acquire(`CategoryBookmark.getCategories:${bookmarkId}`, async () => {
            try {
                const query = IDBKeyRange.bound([bookmarkId, ""], [bookmarkId, "\uffff"]);
                const categoryBookmarks = await Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
                const promises = categoryBookmarks.map(async ({ category_id }) => {
                    return await Operator.getRecordById<ICategory>('categories', category_id);
                });
                return await Promise.all(promises);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.getCategories:- ${error}, ${bookmarkId}`);
            }
        });
    }

    /**
     * Retrieves the category IDs associated with a given bookmark ID.
     *
     * @param bookmarkId - The ID of the bookmark for which to retrieve category IDs.
     * @returns A promise that resolves to an array of category IDs.
     * @throws Will throw an error if there is an issue retrieving the category IDs.
     */
    static async getCategoryIds(bookmarkId: string): Promise<string[]> {
        return lockManager.acquire(`CategoryBookmark.getCategoryIds:${bookmarkId}`, async () => {
            try {
                const query = IDBKeyRange.bound(["", bookmarkId], ["\uffff", bookmarkId]);
                const categoryBookmarks = await Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
                return categoryBookmarks.map(({ category_id }) => category_id);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.getCategoryIds:- ${error}, ${bookmarkId}`);
            }
        });
    }

    /**
     * Retrieves the bookmark IDs associated with a given category.
     *
     * @param categoryId - The ID of the category for which to retrieve bookmark IDs.
     * @returns A promise that resolves to an array of bookmark IDs.
     * @throws Will throw an error if there is an issue retrieving the bookmark IDs.
     */
    static async getBookmarkIds(categoryId: string): Promise<string[]> {
        return lockManager.acquire(`CategoryBookmark.getBookmarkIds:${categoryId}`, async () => {
            try {
                const query = IDBKeyRange.bound([categoryId, ""], [categoryId, "\uffff"]);
                const categoryBookmarks = await Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
                return categoryBookmarks.map(({ bookmark_id }) => bookmark_id);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.getBookmarkIds:- ${error}, ${categoryId}`);
            }
        });
    }

    /**
     * Checks if a bookmark exists within a specific category.
     *
     * @param categoryId - The ID of the category to check.
     * @param bookmarkId - The ID of the bookmark to check.
     * @returns A promise that resolves to a boolean indicating whether the bookmark exists in the category.
     * @throws Will throw an error if there is an issue accessing the database.
     */
    static async categoryBookmarkExists(categoryId: string, bookmarkId: string): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [categoryId, bookmarkId];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (await Operator.getRecordByIndex('category_bookmarks', 'category_bookmarks_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.exists:- ${error}, ${query}`);
            }
            return false;
        });
    }

    constructor(categoryBookmark: ICategoryBookmark) {
        this.id = categoryBookmark.id || uuid4();
        this.category_id = categoryBookmark.category_id;
        this.bookmark_id = categoryBookmark.bookmark_id;
    }

    /**
     * Creates a bookmark under a specified category.
     *
     * @param bookmark - The bookmark to be created.
     * @param category - The category under which the bookmark will be created.
     * @returns A promise that resolves to the created bookmark.
     *
     * @throws Will throw an error if the category does not exist.
     * @throws Will throw an error if the bookmark already exists under the category.
     * @throws Will throw an error if any other error occurs during the creation process.
     */
    static async createBookmark(bookmark: Bookmark, category: Category): Promise<IBookmark> {
        return lockManager.acquire(`CategoryBookmark.createBookmark:${bookmark.id}`, async () => {
            const query = [category.id, bookmark.id];
            try {
                // Ensure the category exists
                if (!(await category.exists()))
                    throw new Error(`CategoryBookmark.createBookmark:- Category not found: ${category.id}`);

                // If the bookmark already exists under the category, throw an error
                if (await CategoryBookmark.categoryBookmarkExists(category.id, bookmark.id))
                    throw new Error(`CategoryBookmark.createBookmark:- index already exists: ${query}`);

                await new CategoryBookmark({
                    category_id: category.id,
                    bookmark_id: bookmark.id,
                    id: "",
                }).create();

                // Create the bookmark if not exists
                const existing = await bookmark.existing();
                return existing ? existing : await bookmark.create();
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.createBookmark:- ${error}, ${bookmark}`);
            }
        });
    }

    /**
     * Adds a bookmark to a specified category.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark has been added to the category.
     * @throws {Error} If the category with the given ID does not exist.
     * @throws {Error} If the bookmark with the given ID already exists.
     */
    async create(): Promise<ICategoryBookmark> {
        const query = [this.category_id, this.bookmark_id];
        return lockManager.acquire(`CategoryBookmark.create:${query}`, async () => {
            try {
                // Ensure the bookmark doesn't already exist in the category
                const existing = await this.existing();
                if (!(existing))
                    return Operator.createRecord('category_bookmarks', this);
                return existing
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.create:- ${error}, ${this.id}`);
            }
        });
    }

    /**
     * Retrieves all bookmarks associated with a given category ID.
     *
     * @param {string} categoryId - The ID of the category to retrieve bookmarks for.
     * @returns {Promise<IBookmark[]>} A promise that resolves to an array of bookmarks linked to the specified category.
     *
     * @remarks
     * This method performs the following steps:
     * 1. Retrieves all category_bookmarks linked to the specified category ID.
     * 2. For each category_bookmark, retrieves the corresponding bookmark.
     * 3. For each bookmark, retrieves and adds all associated tags to the bookmark object.
     *
     * @example
     * ```typescript
     * const bookmarks = await getCategoryBookmarks('category123');
     * console.log(bookmarks);
     * ```
     */
    static async getCategoryBookmarks(categoryId: string): Promise<IBookmark[]> {
        return lockManager.acquire(`CategoryBookmark.getCategoryBookmarks:${categoryId}`, async () => {
            // Get all category_bookmarks linked to the category
            try {
                const query = IDBKeyRange.bound([categoryId, ""], [categoryId, "\uffff"]);
                const categoryBookmarks = await Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);

                // Save all the bookmark promses in a variable
                const promises = categoryBookmarks.map(async ({ bookmark_id }) => {
                    const bookmark = await Operator.getRecordByIndex<IBookmark>('bookmarks', 'bookmarks_index', bookmark_id);

                    // Get all tags linked to the bookmark and add them to the bookmark object
                    const query = IDBKeyRange.bound([bookmark_id, ""], [bookmark_id, "\uffff"]);
                    const bookmarkTags = await Operator.getRecordsByIndex<IBookmarkTag>('bookmark_tags', 'bookmark_tags_index', query);
                    for (const { tag_id } of bookmarkTags) {
                        bookmark.tags = await Operator.getRecordsByIndex<ITag>('tags', 'tags_index', tag_id);
                    }
                    return bookmark;
                });

                return await Promise.all(promises);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.getCategoryBookmarks:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Deletes category links associated with a given bookmark ID.
     *
     * This method acquires a lock to ensure that the deletion process is thread-safe.
     * It retrieves all category bookmarks associated with the given bookmark ID,
     * deletes them from the database, and returns an array of category IDs that were deleted.
     *
     * @param bookmarkId - The ID of the bookmark whose category links are to be deleted.
     * @returns A promise that resolves to an array of category IDs that were deleted.
     * @throws An error if the deletion process fails.
     */
    static async deleteCategoryLinks(bookmarkId: string): Promise<string[]> {
        return lockManager.acquire(`CategoryBookmark.deleteCategoryLinks:${bookmarkId}`, async () => {
            try {
                const query = IDBKeyRange.bound(["", bookmarkId], ["\uffff", bookmarkId]);
                const categoryBookmarks = await Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
                await Operator.deleteRecordsByIndex('category_bookmarks', 'category_bookmarks_index', query);
                return categoryBookmarks.map(({ category_id }) => category_id);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.deleteCategoryLinks:- ${error}, ${bookmarkId}`);
            }
        });
    }

    /**
     * Deletes all bookmark links associated with a given category ID.
     *
     * @param categoryId - The ID of the category whose bookmark links are to be deleted.
     * @returns A promise that resolves to an array of bookmark IDs that were deleted.
     * @throws An error if the deletion process fails.
     */
    static async deleteBookmarkLinks(categoryId: string): Promise<string[]> {
        return lockManager.acquire(`CategoryBookmark.deleteBookmarkLinks:${categoryId}`, async () => {
            try {
                const query = IDBKeyRange.bound([categoryId, ""], [categoryId, "\uffff"]);
                const categoryBookmarks = await Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
                await Operator.deleteRecordsByIndex('category_bookmarks', 'category_bookmarks_index', query);
                return categoryBookmarks.map(({ bookmark_id }) => bookmark_id);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.deleteBookmarkLinks:- ${error}, ${categoryId}`);
            }
        });
    }

}
