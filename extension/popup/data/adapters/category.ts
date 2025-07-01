import { isEmpty } from "../../utils/common";
import { lockManager } from "../../utils/locker";
import {
    ICategory
} from "../../utils/types/schemas";
import { Operator } from "../operator";

export default class Category implements ICategory {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    tagIds: string[];
    bookmarkIds: string[];

    // optional fields
    importType?: 'category' | 'bookmark';
    importExists?: boolean;
    is_default?: number;

    constructor(category: ICategory) {
        this.id = category.id; /* uuid4() */
        this.name = category.name;
        this.created_at = category.created_at; /* (new Date()).toISOString() */
        this.updated_at = category.updated_at; /* (new Date()).toISOString() */
        this.tagIds = category.tagIds;
        this.bookmarkIds = category.bookmarkIds;

        // optional fields
        this.importType = category.importType;
        this.importExists = category.importExists;
        this.is_default = category.is_default;

        const empty = isEmpty(['id', 'name', 'created_at',
            'updated_at', 'tagIds', 'bookmarkIds'], category);
        if (empty) throw new Error(`Category.constructor: required field: ${empty}`);
    }

    /**
     * Checks if a category exists in the database.
     *
     * @returns A promise that resolves to the category object if it exists, otherwise `null`.
     */
    async exists(): Promise<ICategory | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${this.name}`, async () => {
            return await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', this.name) || null;
        });
    }

    /**
     * Checks if a category with the given name exists.
     *
     * @param name - The name of the category to check.
     * @returns A promise that resolves to the category object if it exists, otherwise `null`.
     */
    static async exists(name: string): Promise<ICategory | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${name}`, async () => {
            return await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', name) || null;
        });
    }

    /**
     * Creates a new category record in the database.
     *
     * @returns A promise that resolves when the category has been successfully created.
     */
    async create(): Promise<ICategory> {
        const x = lockManager.acquire(`Category.create:${this.name}`, async () => {
            if (await this.exists()) // Only proceed if the category does not already exist
                throw new Error(`Category already exists: ${this.name}`);
            return Operator.createRecord<ICategory>('categories', this);
        });

        try {
            return await x;
        } catch (error) {
            throw new Error(`An error occurred in Category.create:- ${error}, ${this.id}`);
        }
    }

    // Alias to the instance.create() method
    static async create(category: ICategory): Promise<ICategory> {
        return new Category(category).create();
    }

    /**
     * Updates a category record in the database.
     *
     * @returns A promise that resolves when the update operation is complete.
     */
    async update(): Promise<void> {
        const x = lockManager.acquire(`Category.update:${this.name}`, async () => {
            const existing = await this.exists();
            if (!(existing)) {
                throw new Error(`Category.update: Category does not exist: ${this.id}`);
            }
            await Operator.updateRecord<ICategory>('categories', this);
        });
        try {
            await x;
        } catch (error) {
            throw new Error(`An error occurred in Category.update:- ${error}`);
        }
    }

    /**
     * Alias to the instance .update() method
     * @param category An updated ICategory object
     * @returns void
     */
    static async update(category: ICategory) {
        return new Category(category).update();
    }
}
