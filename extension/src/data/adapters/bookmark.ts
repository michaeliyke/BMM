import {
    IBookmark,
} from "../../utils/types/schemas";
import { Operator } from "../operator";

export default {
    /**
     * Creates a new bookmark.
     *
     * @param {IBookmark} bookmark - The bookmark object to be created.
     * @returns {Promise<void>} A promise that resolves when the bookmark is created.
     * @throws {Error} Throws an error if a bookmark with the same id already exists.
     */
    async createBookmark(bookmark: IBookmark): Promise<void> {
        if (await Operator.getRecordById<IBookmark>('bookmarks', bookmark.id))
            throw new Error(`Bookmark with id ${bookmark.id} already exists`);

        bookmark.tags = []; // Do not save tags in the bookmark object
        await Operator.createRecord<IBookmark>('bookmarks', bookmark);
    },

    /**
     * Updates an existing bookmark in the database.
     *
     * @param updatedBookmark - The bookmark object containing updated information.
     * @returns A promise that resolves when the bookmark is successfully updated.
     * @throws An error if the bookmark with the specified ID does not exist.
     */
    async updateBookmark(updatedBookmark: IBookmark): Promise<void> {
        if (!(await Operator.getRecordById<IBookmark>('bookmarks', updatedBookmark.id)))
            throw new Error(`Bookmark with id ${updatedBookmark.id} does not exist`);
        await Operator.updateRecord<IBookmark>('bookmarks', updatedBookmark, updatedBookmark.id);
    },

    /**
     * Deletes a bookmark by its ID.
     *
     * @param {string} ID - The ID of the bookmark to delete.
     * @returns {Promise<void>} A promise that resolves when the bookmark is deleted.
     * @throws {Error} If the bookmark with the specified ID does not exist.
     */
    async deleteBookmark(ID: string): Promise<void> {
        if (!(await Operator.getRecordById<IBookmark>('bookmarks', ID)))
            throw new Error(`Bookmark with id ${ID} does not exist`);
        await Operator.deleteRecord('bookmarks', ID);
    },

    /**
     * Retrieves a list of bookmarks from the database.
     *
     * @returns {Promise<IBookmark[]>} A promise that resolves to an array of bookmarks.
     */
    async getBookmarks(): Promise<IBookmark[]> {
        return await Operator.getRecords<IBookmark>('bookmarks');
    },

    /**
     * Retrieves a bookmark by its unique identifier.
     *
     * @param {string} id - The unique identifier of the bookmark.
     * @returns {Promise<IBookmark>} A promise that resolves to the bookmark object.
     */
    async getBookmarkById(id: string): Promise<IBookmark> {
        if (!(await Operator.getRecordById<IBookmark>('bookmarks', id)))
            throw new Error(`Bookmark with id ${id} does not exist`);
        return await Operator.getRecordById<IBookmark>('bookmarks', id);
    },

};
