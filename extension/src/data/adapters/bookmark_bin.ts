import { IBookmark, IBookmarkTag, ICategoryBookmark, IDeletedBookmark } from "../../utils/types/schemas";
import { Operator } from "../operator";
import { lockManager } from "../../utils/locker";
import Bookmark from "./bookmark";
import BookmarkTag from "./bookmark_tag";
import CategoryBookmark from "./category_bookmark";


/**
 * Represents a bin for deleted bookmarks.
 *
 * USAGE Scenarios
 *  1. Delete a bookmark
 *  2. restore a bookmark from the bin
 *  3. Load all deleted bookmarks from the bin
 *
 * The `BookmarkBin` class provides methods to manage bookmarks that have been deleted.
 * It allows for restoring bookmarks, moving bookmarks to the bin, and retrieving deleted bookmarks.
 *
 * @class
 * @property {string} created_at - The creation date of the bookmark.
 * @property {string} updated_at - The last update date of the bookmark.
 * @property {string} deleted_at - The deletion date of the bookmark.
 * @property {string} tag_ids - A comma-separated list of tag IDs associated with the bookmark.
 * @property {string} category_ids - A comma-separated list of category IDs associated with the bookmark.
 * @property {string} note_ids - A comma-separated list of note IDs associated with the bookmark.
 * @property {string} id - The unique identifier of the bookmark bin entry.
 * @property {string} bookmark_id - The unique identifier of the bookmark.
 * @property {string} title - The title of the bookmark.
 * @property {string} url - The URL of the bookmark.
 * @property {string} description - The description of the bookmark.
 */
export default class BookmarkBin {
    created_at: string;
    updated_at: string;
    deleted_at: string;
    tag_ids: string;
    category_ids: string;
    note_ids: string;
    id: string;
    bookmark_id: string;
    title: string;
    url: string;
    description: string;

    constructor(bookmark: IDeletedBookmark) {
        this.created_at = bookmark.created_at;
        this.updated_at = bookmark.updated_at;
        this.deleted_at = bookmark.deleted_at;
        this.tag_ids = bookmark.tag_ids;
        this.category_ids = bookmark.category_ids;
        this.note_ids = bookmark.note_ids;
        this.id = bookmark.id;
        this.bookmark_id = bookmark.bookmark_id;
        this.title = bookmark.title;
        this.url = bookmark.url;
        this.description = bookmark.description;
    }

    async #restoreNotes(): Promise<void> { }

    /**
     * Restores categories associated with the bookmark bin.
     *
     * This method acquires a lock to ensure that the restoration process is thread-safe.
     * It iterates over the category IDs associated with the bookmark bin, creates a new
     * `CategoryBookmark` instance for each category, and saves it to the database.
     *
     * @returns {Promise<void>} A promise that resolves when the restoration process is complete.
     *
     * @throws {Error} Throws an error if the restoration process fails.
     */
    async #restoreCategories(): Promise<void> {
        return lockManager.acquire(`BookmarkBin.restoreCategories:${this.id}`, async () => {
            try {
                for (const category_id of this.category_ids.split(',')) {
                    const { bookmark_id } = this;
                    const categoryBookmark = new CategoryBookmark({ id: '', category_id, bookmark_id });
                    await Operator.createRecord<ICategoryBookmark>('category_bookmarks', categoryBookmark);
                }
            } catch (error) {
                throw new Error(`An error occurred in BookmarkBin.restoreCategories:- ${error}`);
            }
        });
    }

    /**
     * Restores the tags associated with the bookmark.
     *
     * This method acquires a lock to ensure that the restoration process is thread-safe.
     * It iterates over the tag IDs associated with the bookmark, creates a new `BookmarkTag`
     * instance for each tag, and then saves it to the database.
     *
     * @throws {Error} Throws an error if the restoration process fails.
     * @returns {Promise<void>} A promise that resolves when the tags have been successfully restored.
     */
    async #restoreTags(): Promise<void> {
        return lockManager.acquire(`BookmarkBin.restoreTags:${this.id}`, async () => {
            try {
                for (const tag_id of this.tag_ids.split(',')) {
                    const { bookmark_id } = this;
                    const bookmarkTag = new BookmarkTag({ id: '', bookmark_id, tag_id });
                    await Operator.createRecord<IBookmarkTag>('bookmark_tags', bookmarkTag);
                }
            } catch (error) {
                throw new Error(`An error occurred in BookmarkBin.restoreTags:- ${error}`);
            }
        });
    }

    /**
     * Restores a bookmark from the bin.
     *
     * This method acquires a lock to ensure that the restore operation is thread-safe.
     * It creates a new `Bookmark` instance with the properties of the current bin entry.
     *
     * The method performs the following steps:
     * 1. Checks if the bookmark already exists. If it does, throws an error.
     * 2. Checks if the bookmark exists in the bin. If it does not, throws an error.
     * 3. Creates a new record in the `bookmarks` table.
     * 4. Restores associated tags, categories, and notes.
     * 5. Deletes the bookmark entry from the bin.
     *
     * @throws {Error} If the bookmark already exists.
     * @throws {Error} If the bookmark is not found in the bin.
     * @throws {Error} If any other error occurs during the restore process.
     *
     * @returns {Promise<void>} A promise that resolves when the restore operation is complete.
     */
    async restore(): Promise<void> {
        return lockManager.acquire(`BookmarkBin.restore:${this.id}`, async () => {
            try {
                const bookmark = new Bookmark({
                    id: this.bookmark_id,
                    title: this.title,
                    url: this.url,
                    description: this.description,
                    created_at: this.created_at,
                    updated_at: this.updated_at,
                    tags: [],
                    archived: 0
                });
                if (await bookmark.exists())  // TODO
                    throw new Error(`Bookmark already exists:- ${bookmark.id}`);
                if (!await this.exists())
                    throw new Error(`Bookmark not found in bin:- ${this.id}`);
                await Operator.createRecord<IBookmark>('bookmarks', bookmark);
                this.#restoreTags();
                this.#restoreCategories();
                this.#restoreNotes();
                await Operator.deleteRecord('bookmark_bin', this.id);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkBin.restore:- ${error}`);
            }
        });
    }

    /**
     * Moves the current bookmark to the bin.
     *
     * This method ensures that the bookmark exists in the bookmark table before moving it to the bin.
     * If the bookmark already exists in the bin, the method does nothing.
     *
     * The method performs the following steps:
     * 1. Ensures the bookmark exists in the bookmark table.
     * 2. Checks if the bookmark already exists in the bin.
     * 3. Deletes tag links associated with the bookmark and stores the tag IDs.
     * 4. Deletes category links associated with the bookmark and stores the category IDs.
     * 5. Saves the bookmark to the bin.
     * 6. Deletes the bookmark from the bookmarks table.
     *
     * @throws {Error} If the bookmark does not exist in the bookmark table.
     * @throws {Error} If an error occurs during the process.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark has been successfully moved to the bin.
     */
    async moveToBin(): Promise<void> {
        return lockManager.acquire(`BookmarkBin.moveToBin:${this.id}`, async () => {
            try {
                // ensure the bookmark itself exists in the bookmark table
                const bookmark = new Bookmark({
                    id: this.bookmark_id,
                    title: this.title,
                    url: this.url,
                    description: this.description,
                    created_at: this.created_at,
                    updated_at: this.updated_at,
                    tags: [],
                    archived: 0
                });
                if (!await bookmark.exists()) {
                    console.log("Here we are")
                    throw new Error(`Bookmark not found:- ${bookmark.id}`);
                }
                if (await this.exists()) { // if it exists in bookmark_bin, do nothing
                    console.warn(`Bookmark already exists in bin:- ${this.id}`);
                    return;
                }
                // TODO: store bookmark note ids - BookmarkNotes
                this.tag_ids = (await BookmarkTag.deleteTagLinks(bookmark.id)).join(',');
                this.category_ids = (await CategoryBookmark.deleteCategoryLinks(bookmark.id)).join(',');

                // call saveToBin to properly save it in bookmark_bin
                await Operator.createRecord<IDeletedBookmark>('bookmark_bin', this);
                await Operator.deleteRecord('bookmarks', this.bookmark_id); // remove the bookmark itself
            } catch (error) {
                throw new Error(`An error occurred in BookmarkBin.moveToBin:- ${error}`);
            }
        });
    }

    /**
     * Retrieves a deleted bookmark record by its ID.
     *
     * @param ID - The unique identifier of the deleted bookmark.
     * @returns A promise that resolves to the deleted bookmark record.
     * @throws An error if the retrieval operation fails.
     */
    async getDeleted(ID: string): Promise<IDeletedBookmark> {
        return lockManager.acquire(`BookmarkBin.getDeleted:${ID}`, async () => {
            try {
                return await Operator.getRecordById<IDeletedBookmark>('bookmark_bin', ID);
            } catch (error) {
                throw new Error(`An error occurred in BookmarkBin.getDeleted:- ${error}, ${ID}`);
            }
        });
    }

    /**
     * Retrieves all deleted bookmarks from the 'bookmark_bin' table.
     *
     * This method acquires a lock to ensure that the operation is thread-safe.
     * It uses the `Operator.getRecords` method to fetch the records from the database.
     *
     * @returns {Promise<IDeletedBookmark[]>} A promise that resolves to an array of deleted bookmarks.
     * @throws {Error} Throws an error if the operation fails.
     */
    static async getDeletedBookmarks(): Promise<IDeletedBookmark[]> {
        return lockManager.acquire('BookmarkBin.getAllDeleted', async () => {
            try {
                return await Operator.getRecords<IDeletedBookmark>('bookmark_bin');
            } catch (error) {
                throw new Error(`An error occurred in BookmarkBin.getAllDeleted:- ${error}`);
            }
        });
    }

    /**
     * Checks if a bookmark exists in the bookmark bin.
     *
     * @returns {Promise<boolean>} A promise that resolves to `true` if the bookmark exists, otherwise `false`.
     *
     * @throws {Error} Throws an error if there is an issue checking the existence of the bookmark.
     */
    async exists(): Promise<boolean> {
        // get the calling method name
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${this.id}`, async () => {
            try {
                if (await Operator.getRecordById<IDeletedBookmark>('bookmark_bin', this.id))
                    return true;
                return false;
            } catch (error) {
                throw new Error(`An error occurred in BookmarkBin.exists:- ${error}, ${this.id}`);
            }
        });
    }
}
