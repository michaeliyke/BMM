import {
    IBookmark,
    IBookmarkTag,
    ICategoryBookmark,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import { v4 as uuid4 } from 'uuid';

export default {

    /**
     * Adds a bookmark to a specified category.
     *
     * @param {IBookmark} bookmark - The bookmark to be added.
     * @param {string} categoryId - The ID of the category to which the bookmark will be added.
     * @returns {Promise<void>} A promise that resolves when the bookmark has been added to the category.
     * @throws {Error} If the category with the given ID does not exist.
     * @throws {Error} If the bookmark with the given ID already exists.
     */
    async createCategoryBookmark(bookmarkId: string, categoryId: string): Promise<void> {
        // Ensure the category exists
        if (!(await Operator.getRecordById('categories', categoryId)))
            throw new Error(`Category with id ${categoryId} not found`);

        // Ensure the bookmark exist
        if (!(await Operator.getRecordById('bookmarks', bookmarkId)))
            throw new Error(`Bookmark with id ${bookmarkId} does not exist`);

        // Ensure the bookmark doesn't already exist in the category
        const query = [categoryId, bookmarkId];
        if (await Operator.getRecordByIndex('category_bookmarks', 'category_bookmarks_index', query))
            throw new Error(`Bookmark with id ${bookmarkId} already exists in category ${categoryId}`);

        const data = { bookmarkId: bookmarkId, categoryId, id: uuid4() };
        await Operator.createRecord('category_bookmarks', data);
    },

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
    async getCategoryBookmarks(categoryId: string): Promise<IBookmark[]> {
        // Get all bookmarks linked to a given category by id

        // Get all category_bookmarks linked to the category
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
    },
};
