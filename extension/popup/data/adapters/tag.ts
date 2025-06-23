import { isEmpty } from "../../utils/common";
import { lockManager } from "../../utils/locker";
import { ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";

export default class Tag implements ITag {

    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    bookmarkIds: string[];
    categoryIds: string[];

    constructor(tag: ITag) {
        this.id = tag.id; /* uuid4(); */
        this.name = tag.name;
        this.created_at = tag.created_at; /* (new Date()).toISOString(); */
        this.updated_at = tag.updated_at; /* (new Date()).toISOString(); */
        this.bookmarkIds = tag.bookmarkIds;
        this.categoryIds = tag.categoryIds;

        const empty = isEmpty(['id', 'name', 'created_at', 'updated_at',
            'bookmarkIds', 'categoryIds'], tag);
        if (empty) {
            throw new Error(`Tag.constructor:- required field: ${empty}`);
        }
    }

    /**
     * Checks if a tag exists in the database.
     *
     * @returns A promise that resolves to the tag object if it exists, otherwise null.
     */
    async exists(): Promise<ITag | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${this.id}`, async () => {
            try {
                return await Operator.getRecordByIndex<ITag>('tags', 'tags_index', this.name) || null;
            } catch (error) {
                throw new Error(`An error occurred in Tag.exists:- ${error}, ${this.id}`);
            }
        });
    }

    /**
     * Checks if a tag with the given name exists.
     *
     * @param name - The name of the tag to check for existence.
     * @returns A promise that resolves to the tag object if it exists, otherwise null.
     * @throws An error if there is an issue during the check.
     */
    static async exists(name: string): Promise<ITag | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${name}`, async () => {
            try {
                return await Operator.getRecordByIndex<ITag>('tags', 'tags_index', name) || null;
            } catch (error) {
                throw new Error(`An error occurred in Tag.exists:- ${error}, ${name}`);
            }
        });
    }

    /**
     * Creates a new tag record in the database if it does not already exist.
     *
     * @returns {Promise<void>} A promise that resolves when the tag has been created.
     */
    async create(): Promise<ITag> {
        return lockManager.acquire(`Tag.create:${this.id}`, async () => {
            // Create a new tag record in the database if not exists
            try {
                const existing = await this.exists();
                if (!existing) {
                    return await Operator.createRecord<ITag>('tags', this);
                }
                return existing;
            } catch (error) {
                throw new Error(`An error occurred in Tag.create:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Updates an existing tag in the database.
     *
     * @returns {Promise<void>} A promise that resolves when the tag is successfully updated.
     * @throws {Error} Throws an error if the tag does not exist.
     */
    async update(): Promise<void> {
        return lockManager.acquire(`Tag.update:${this.id}`, async () => {
            if (!await this.exists()) {
                throw new Error(`Tag.update:- Tag not found: ${this}`);
            }
            try {
                await Operator.updateRecord<ITag>('tags', this);
            } catch (error) {
                throw new Error(`An error occurred in Tag.update:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Deletes a tag and removes all references to it.
     *
     * @returns A promise that resolves when the tag and all its references have been deleted.
     * @throws An error if the tag with the specified ID is not found.
     */
    async delete(): Promise<void> {
        return lockManager.acquire(`Tag.delete:${this.id}`, async () => {
            // Ensure tag exists
            if (!(await this.exists()))
                throw new Error(`Tag.delete:- Tag not found: ${this}`);

            // Delete all category_tags references to the tag
            try {
                const query = IDBKeyRange.bound(["", this.id], ['\uffff', this.id]);
                await Operator.deleteRecordsByIndex("category_tags", "category_tags_index", query);

                // Delete all bookmark_tags references to the tag
                await Operator.deleteRecordsByIndex("bookmark_tags", "bookmark_tags_index", query);

                // Delete the tag itself
                await Operator.deleteRecord('tags', this.id);
            } catch (error) {
                throw new Error(`An error occurred in Tag.delete:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Retrieves a list of tags from the database.
     *
     * @returns {Promise<ITag[]>} A promise that resolves to an array of tags.
     */
    static async getTags(): Promise<ITag[]> {
        return lockManager.acquire('Tag.getTags', async () => {
            try {
                return await Operator.getRecordsByIndex<ITag>('tags', 'tags_index');
            } catch (error) {
                throw new Error(`An error occurred in Tag.getTags:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Retrieves a tag by its unique identifier.
     *
     * @param ID - The unique identifier of the tag to retrieve.
     * @returns A promise that resolves to the tag object.
     */
    static async getTagById(ID: string): Promise<ITag> {
        return lockManager.acquire(`Tag.getTagById:${ID}`, async () => {
            try {
                return await Operator.getRecordById<ITag>('tags', ID) || null;
            } catch (error) {
                throw new Error(`An error occurred in Tag.getTagById:- ${error}`);
            }
        });
    }
}
