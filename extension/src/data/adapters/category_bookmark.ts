import { LockManager } from "../../utils/locker";
import {
    IBookmark,
    IBookmarkTag,
    ICategoryBookmark,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import Category from "./category";

const lockManager = new LockManager();

export default class CategoryBookmark implements ICategoryBookmark {
    id: string;
    category_id: string;
    bookmark_id: string;

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

    static async getAll(query?: IDBKeyRange): Promise<ICategoryBookmark[]> {
        return lockManager.acquire(`CategoryBookmark.getAll:${query}`, async () => {
            try {
                return Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
            } catch (error) {
                throw new Error(`An error occurred in CategoryBookmark.getAll:- ${error}, ${query}`);
            }
        });
    }

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
        this.id = categoryBookmark.id;
        this.category_id = categoryBookmark.category_id;
        this.bookmark_id = categoryBookmark.bookmark_id;
    }

    /**
     * Adds a bookmark to a specified category.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark has been added to the category.
     * @throws {Error} If the category with the given ID does not exist.
     * @throws {Error} If the bookmark with the given ID already exists.
     */
    async create(): Promise<void> {
        const query = [this.category_id, this.bookmark_id];
        lockManager.acquire(`CategoryBookmark.create:${query}`, async () => {
            try {
                // Ensure the category exists
                if (!(await Category.categoryExists(this.category_id)))
                    throw new Error(`CategoryBookmark.create:- Category not found: ${this.category_id}`);

                // Ensure the bookmark exist
                if (!(await Bookmark.bookmarkExists(this.bookmark_id)))
                    throw new Error(`CategoryBookmark.create:- Bookmark not found: ${this}`);

                // Ensure the bookmark doesn't already exist in the category
                if (!(await this.exists())) {
                    await Operator.createRecord('category_bookmarks', this);
                }
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
}
