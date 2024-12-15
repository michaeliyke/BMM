
import { LockManager } from "../../utils/locker";
import { IBookmark, ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";

const lockManager = new LockManager();

export default class Bookmark implements IBookmark {
    id: string;
    title: string;
    url: string;
    description: string;
    created_at: string;
    updated_at: string;
    tags: ITag[];

    constructor(bookmark: IBookmark) {
        this.id = bookmark.id;
        this.title = bookmark.title;
        this.url = bookmark.url;
        this.description = bookmark.description;
        this.created_at = bookmark.created_at;
        this.updated_at = bookmark.updated_at;
        this.tags = bookmark.tags;
    }

    async exists(): Promise<boolean> {
        try {
            if (await Operator.getRecordById<IBookmark>('bookmarks', this.id))
                return true;
            return false;
        } catch (error) {
            throw new Error(`An error occurred in Bookmark.exists:- ${error}, ${this.id}`);
        }
    }

    /**
     * Creates a new bookmark.
     *
     * @returns {Promise<void>} A promise that resolves when the bookmark is created.
     * @throws {Error} Throws an error if a bookmark with the same id already exists.
     */
    async create(): Promise<void> {
        await lockManager.acquire(this.id, async () => {
            this.tags = []; // Do not save tags in the bookmark object
            // Create a new bookmark record in the database if not exists
            if (await this.exists()) return;
            try {
                await Operator.createRecord<IBookmark>('bookmarks', this);
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
        await lockManager.acquire(this.id, async () => {
            this.tags = []; // Do not save tags in the bookmark object
            if (!(await this.exists()))
                throw new Error(`Bookmark.update: Bookmark does not exist: ${this}`);
            try {
                await Operator.updateRecord<IBookmark>('bookmarks', this, this.id);
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
        lockManager.acquire(this.id, async () => {
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
        try {
            return await Operator.getRecords<IBookmark>('bookmarks');
        } catch (error) {
            throw new Error(`An error occurred in Bookmark.getBookmarks:- ${error}`);
        }
    }

    /**
     * Retrieves a bookmark by its unique identifier.
     *
     * @param {string} id - The unique identifier of the bookmark.
     * @returns {Promise<IBookmark>} A promise that resolves to the bookmark object.
     */
    static async getBookmarkById(id: string): Promise<IBookmark> {
        try {
            return await Operator.getRecordById<IBookmark>('bookmarks', id);
        } catch (error) {
            throw new Error(`An error occurred in Bookmark.getBookmarkById:- ${error}, ${id}`);
        }
    }

}
