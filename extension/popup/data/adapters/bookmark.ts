
import { isEmpty } from "../../utils/common";
import { lockManager } from "../../utils/locker";
import { IBMM, IBookmark, IDMap } from "../../utils/types/schemas";
import { Operator } from "../operator";

export default class Bookmark implements IBookmark {
    id: string;
    title: string;
    url: string;
    description: string;
    created_at: string;
    updated_at: string;
    categoryIds: string[];
    tagIds: string[];

    // optional fields
    archived?: number;
    starred?: number;
    importType?: "category" | "bookmark";
    importExists?: boolean;
    deleted?: number;

    constructor(bookmark: IBookmark) {
        this.id = bookmark.id; /* uuid4() */
        this.title = bookmark.title;
        this.url = bookmark.url;
        this.description = bookmark.description;
        this.created_at = bookmark.created_at; /* (new Date()).toISOString(); */
        this.updated_at = bookmark.updated_at; /* (new Date()).toISOString(); */
        this.categoryIds = bookmark.categoryIds;
        this.tagIds = bookmark.tagIds;

        // optional fileds
        this.archived = bookmark.archived;
        this.starred = bookmark.starred;
        this.importType = bookmark.importType;
        this.importExists = bookmark.importExists;
        this.deleted = bookmark.deleted;


        const prop = isEmpty(['id', 'url', 'created_at', 'updated_at',
            'tagIds', 'categoryIds',], bookmark);
        if (prop) throw new Error(`Bookmark.constructor: required field: '${prop}'`);
    }

    /**
     * Retrieves the list of favorite bookmarks.
     *
     * This method acquires a lock to ensure that the retrieval process is thread-safe.
     * It fetches all bookmark records and filters out those that are not starred.
     *
     * @returns {Promise<IBookmark[]>} A promise that resolves to an array of favorite bookmarks.
     * @throws {Error} Throws an error if the retrieval process fails.
     */
    static async getFavorites(): Promise<IBookmark[]> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:getFavorites`, async () => {
            try {
                const records = await Operator.getRecords<IBookmark>('bookmarks');
                return records.filter((bookmark) => bookmark.starred === 1);
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.getFavorites:- ${error}`);
            }
        });
    }

    /**
     * Toggles the 'starred' property of a given bookmark.
     *
     * This method acquires a lock based on the caller's name and the bookmark ID to ensure
     * that the operation is thread-safe. It retrieves the existing bookmark record, toggles
     * the 'starred' property (setting it to 1 if it was 0 or undefined, and to 0 if it was 1),
     * updates the record in the database, and returns the updated bookmark.
     *
     * @param {IBookmark} bookmark - The bookmark object to be toggled.
     * @returns {Promise<IBookmark>} - A promise that resolves to the updated bookmark object.
     * @throws {Error} - Throws an error if the bookmark is not found or if any other error occurs during the operation.
     */
    static async toggleStarred(bookmark: IBookmark): Promise<IBookmark> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${bookmark.id}`, async () => {
            try {
                const existing = await Operator.getRecordById<IBookmark>('bookmarks', bookmark.id);
                if (!existing) throw new Error(`Bookmark.toggleStarred: Bookmark not found: ${bookmark.id}`);
                // toggle the starred property even if undefined earlier
                existing.starred = existing.starred ? 0 : 1;
                await Operator.updateRecord<IBookmark>('bookmarks', existing);
                return existing;
            } catch (error) {
                throw new Error(`An error occurred in Bookmark.toggleStarred:- ${error}, ${bookmark.id}`);
            }
        }
        );
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
                return await Operator.getRecordById<IBookmark>('bookmarks', ID) || null;
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
                return await Operator.getRecordById<IBookmark>('bookmarks', this.id) || null;
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
        const x = lockManager.acquire(`Bookmark.create:${this.id}`, async () => {
            // Create a new bookmark record in the database if not exists
            if (await this.exists()) throw new Error(`Bookmark already exists: ${this.id}`);
            return await Operator.createRecord<IBookmark>('bookmarks', this);
        });
        try {
            return await x;
        } catch (error) {
            throw new Error(`An error occurred in Bookmark.create:- ${error}, ${this.id}`);
        }
    }

    /**
     * Alias to the instance.create()
     */
    static async create(bookmark: IBookmark) {
        return new Bookmark(bookmark).create();
    }

    /**
     * Updates an existing bookmark in the database.
     *
     * @returns A promise that resolves when the bookmark is successfully updated.
     * @throws An error if the bookmark with the specified ID does not exist.
     */
    async update(): Promise<IBookmark> {
        const x = lockManager.acquire(`Bookmark.update:${this.id}`, async () => {
            if (!(await this.exists()))
                throw new Error(`Bookmark.update: Bookmark does not exist: ${this.id}`);
            await Operator.updateRecord<IBookmark>('bookmarks', this);
            return this;
        });

        try {
            return await x;
        } catch (error) {
            throw new Error(`An error occurred in Bookmark.update:- ${error}, ${this.id}`);
        }
    }

    /**
     * Alias to instance.update() method
     */
    static async update(bookmark: IBookmark) {
        return new Bookmark(bookmark).update();
    }

    /**
     * Deletes a bookmark by its ID.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark is deleted.
     * @throws {Error} If the bookmark with the specified ID does not exist.
     */
    async delete(): Promise<void> {
        return lockManager.acquire(`Bookmark.delete:${this.id}`, async () => {
            if (!(await this.exists())) {
                throw new Error(`Bookmark.delete:- Bookmark not found: ${this}`);
            }

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
                return await Operator.getRecordById<IBookmark>('bookmarks', ID) || null;
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
    async archive(): Promise<IBookmark> {
        this.archived = 1;
        return await this.update();
    }

    static async fechAllProperties() {
        const p = lockManager.acquire('Bookmark.fechAllProperties', async () => {
            const bmm = {} as IBMM;
            const bookmarks: IBookmark[] = await this.getBookmarks();

            // Initialize BMM objects to defaults values
            bmm.bookmarks = [];
            bmm.categories = [];
            bmm.tags = [];

            bmm.bookmarkObjects = {};
            bmm.categoryObjects = {};
            bmm.tagObjects = {};
            bmm.unlinked = { categories: [], tags: [] };

            // Fill up the initial empty values with data
            bmm.bookmarks = bookmarks.map((bookmark) => bookmark.id);
            bmm.bookmarkObjects = bookmarks.reduce(function (bookmarkObject, bookmark) {
                bookmarkObject[bookmark.id] = bookmark;
                return bookmarkObject;
            }, {} as IDMap<IBookmark>);

            await Operator.fillCategories(bmm); // side effects - modifies input
            await Operator.fillTags(bmm); // side effects - modifies input
            return bmm;
        });

        try {
            return await p;
        } catch (err) {
            throw new Error(`An error occurred in Bookmark.getBookmarkById:- ${err}`);
        }
    }

}
