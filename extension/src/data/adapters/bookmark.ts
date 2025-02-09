
import { isEmpty } from "../../utils/common";
import { lockManager } from "../../utils/locker";
import { IBookmark, ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";


export default class Bookmark implements IBookmark {
    id: string;
    title: string;
    url: string;
    description: string;
    created_at: string;
    updated_at: string;
    tags: ITag[];
    archived: number;

    constructor(bookmark: IBookmark) {
        this.id = bookmark.id; /* uuid4() */
        this.title = bookmark.title;
        this.url = bookmark.url;
        this.description = bookmark.description;
        this.created_at = bookmark.created_at; /* (new Date()).toISOString(); */
        this.updated_at = bookmark.updated_at; /* (new Date()).toISOString(); */
        this.tags = bookmark.tags;
        this.archived = bookmark.archived;

        const prop = isEmpty([
            'id', 'url', 'created_at', 'updated_at', 'archived'], bookmark);
        if (prop) throw new Error(`Bookmark.constructor: require field: '${prop}'`);
    }

    /**
     * Checks if a bookmark with the given ID exists in the database.
     *
     * @param ID - The unique identifier of the bookmark to check.
     * @returns A promise that resolves to the bookmark if it exists, otherwise `null`.
     * @throws An error if there is an issue accessing the database or performing the check.
     */
    static async exists(ID: string): Promise<IBookmark | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${ID}`, async () => {
            try {
                return await Operator.getRecordById<IBookmark>('bookmarks', ID);
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.bokmarkExists:- ${error}, ${ID}`);
            }
        });
    }

    /**
     * Checks if a bookmark exists in the database.
     *
     * This method acquires a lock based on the calling method name and the bookmark ID
     * to ensure that the existence check is performed atomically.
     *
     * @returns {Promise<IBookmark | null>} A promise that resolves to the bookmark if it exists, or null if it does not.
     * @throws {Error} Throws an error if there is an issue during the existence check.
     */
    async exists(): Promise<IBookmark | null> {
        // get the calling method name
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${this.id}`, async () => {
            try {
                return await Operator.getRecordById<IBookmark>('bookmarks', this.id);
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.bokmarkExists:- ${error}, ${this.id}`);
            }
        });
    }

    /**
     * Creates a new bookmark.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark is created.
     * @throws {Error} Throws an error if a bookmark with the same id already exists.
     */
    async create(): Promise<IBookmark> {
        return lockManager.acquire(`Bookmark.create:${this.id}`, async () => {
            this.tags = []; // Do not save tags in the bookmark object
            // Create a new bookmark record in the database if not exists
            try {
                const existing = await this.exists();
                if (existing) return existing;
                return await Operator.createRecord<IBookmark>('bookmarks', this);
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.create:- ${error}, ${this.id}`);
            }
        });
    }

    /**
     * Updates an existing bookmark in the database.
     *
     * @returns A promise that resolves when the bookmark is successfully updated.
     * @throws An error if the bookmark with the specified ID does not exist.
     */
    async update(): Promise<void> {
        await lockManager.acquire(`Bookmark.update:${this.id}`, async () => {
            this.tags = []; // Do not save tags in the bookmark object
            if (!(await this.exists()))
                throw new Error(`Bookmark.update: Bookmark does not exist: ${this}`);
            try {
                await Operator.updateRecord<IBookmark>('bookmarks', this);
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.update:- ${error}, ${this.id}`);
            }
        });
    }

    /**
     * Deletes a bookmark by its ID.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark is deleted.
     * @throws {Error} If the bookmark with the specified ID does not exist.
     */
    async delete(): Promise<void> {
        lockManager.acquire(`Bookmark.delete:${this.id}`, async () => {
            if (!(await this.exists()))
                throw new Error(`Bookmark.delete:- Bookmark not found: ${this}`);
            // TODO: Check & raise an error to call this.moveTags and this.moveCategories
            try {
                await Operator.deleteRecord('bookmarks', this.id);
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.delete:- ${error}, ${this.id}`);
            }
        });
    }

    /**
     * Retrieves a list of bookmarks from the database.
     *
     * @returns {Promise<IBookmark[]>} A promise that resolves to an array of bookmarks.
     */
    static async getBookmarks(): Promise<IBookmark[]> {
        return lockManager.acquire('Bookmark.getBookmarks', async () => {
            try {
                return await Operator.getRecords<IBookmark>('bookmarks');
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.getBookmarks:- ${error}`);
            }
        });
    }

    /**
     * Retrieves a bookmark by its unique identifier.
     *
     * @param {string} ID - The unique identifier of the bookmark.
     * @returns {Promise<IBookmark>} A promise that resolves to the bookmark object.
     */
    static async getBookmarkById(ID: string): Promise<IBookmark> {
        return lockManager.acquire(`Bookmark.getBookmarkById:${ID}`, async () => {
            try {
                return await Operator.getRecordById<IBookmark>('bookmarks', ID);
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.getBookmarkById:- ${error}, ${ID}`);
            }
        });
    }

    /**
     * Archives the current bookmark by setting its `archived` property to 1
     * and then updating the bookmark in the database.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark has been archived.
     */
    async archive(): Promise<void> {
        this.archived = 1;
        await this.update();
    }

}
