
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
    importID?: string;
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
        this.importID = bookmark.importID;
        this.deleted = bookmark.deleted;


        const prop = isEmpty(['id', 'url', 'created_at', 'updated_at',
            'tagIds', 'categoryIds',], bookmark);
        if (prop) throw new Error(`Bookmark.constructor: required field: '${prop}'`);
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
