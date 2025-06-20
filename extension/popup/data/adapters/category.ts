import { isEmpty } from "../../utils/common";
import { lockManager } from "../../utils/locker";
import {
    ICategory,
    ICategoryBookmark,
    ICategoryTag
} from "../../utils/types/schemas";
import { Operator } from "../operator";

export default class Category implements ICategory {

    id: string;
    name: string;
    is_default: number;
    created_at: string;
    updated_at: string;
    tagIds: string[];
    bookmarkIds: string[];

    constructor(category: ICategory) {
        this.id = category.id; /* uuid4() */
        this.name = category.name;
        this.is_default = category.is_default;
        this.created_at = category.created_at; /* (new Date()).toISOString() */
        this.updated_at = category.updated_at; /* (new Date()).toISOString() */
        this.tagIds = category.tagIds;
        this.bookmarkIds = category.bookmarkIds;

        const empty = isEmpty(['id', 'name', 'is_default', 'created_at',
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
     * Fetches all categories along with their associated bookmarks and tags.
     *
     * This method retrieves all categories from the database, and for each category,
     * it fetches the associated tags and bookmarks. For each bookmark, it also fetches
     * the associated tags and attaches them to the bookmark.
     *
     * @returns {Promise<ICategory[]>} A promise that resolves to an array of categories,
     * each containing their associated bookmarks and tags.
     */
    static async getAll(): Promise<ICategory[]> {
        // TODO: Modify to fetch all categories, its bookmarks and tags and their refs
        return lockManager.acquire('Category.getAll', async () => {
            const categories = await Category.getCategories();
            /* for (const category of categories) {
                const tags = await CategoryTag.getTags(category.id);
                const bookmarks = await CategoryBookmark.getBookmarks(category.id);
                for (const bookmark of bookmarks) {
                    const tags = await BookmarkTag.getTags(bookmark.id);
                    bookmark.tags = tags;
                }
                category.bookmarks = bookmarks;
                category.tags = tags;
            } */
            return categories;
        });
    }

    /**
     * Creates a new category record in the database.
     *
     * @returns A promise that resolves when the category has been successfully created.
     */
    async create(): Promise<ICategory> {
        const x = lockManager.acquire(`Category.create:${this.name}`, async () => {
            const existing = await this.exists();
            if (!existing) // Only proceed if the category does not already exist
                return Operator.createRecord<ICategory>('categories', this);
            return existing;
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
     * Retrieves a list of categories from the database.
     *
     * @returns {Promise<ICategory[]>} A promise that resolves to an array of category objects.
     */
    static async getCategories(): Promise<ICategory[]> {
        return lockManager.acquire('Category.getCategories', async () => {
            try {
                return await Operator.getRecords<ICategory>('categories');
            } catch (error) {
                throw new Error(`An error occurred in Category.getCategories:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Retrieves a category by its ID.
     *
     * @param {string} ID - The unique identifier of the category.
     * @returns {Promise<ICategory>} A promise that resolves to the category object.
     */
    static async getCategoryById(ID: string): Promise<ICategory> {
        return lockManager.acquire(`Category.getCategoryById:${ID}`, async () => {
            try {
                return await Operator.getRecordById<ICategory>('categories', ID) || null;
            } catch (error) {
                throw new Error(`An error occurred in Category.getCategoryById:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Retrieves a category by its name.
     *
     * This method acquires a lock to ensure that the retrieval operation is thread-safe.
     * It uses the `Operator.getRecordByIndex` method to fetch the category record from the 'categories' store
     * using the 'categories_index' index.
     *
     * @param name - The name of the category to retrieve.
     * @returns A promise that resolves to the category object.
     * @throws An error if the retrieval operation fails.
     */
    static async getCategoryByName(name: string): Promise<ICategory> {
        return lockManager.acquire(`Category.getCategoryById:${name}`, async () => {
            try {
                return await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', name) || null;
            } catch (error) {
                throw new Error(`An error occurred in Category.getCategoryById:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Deletes a category by its ID, migrating its bookmarks and tags to the default category.
     *
     * @throws {Error} If the category with the given ID does not exist.
     * @throws {Error} If the default category does not exist.
     * @throws {Error} If attempting to delete the default category.
     * @returns A promise that resolves when the category has been deleted and its bookmarks and tags have been migrated.
     */
    async delete(): Promise<void> {
        lockManager.acquire(`Category.delete:${this.name}`, async () => {
            // Ensure the category exists
            try {
                if (!(await Operator.getRecordByIndex('categories', 'categories_index', this.id)))
                    throw new Error(`Category with id ${this.id} not found`);

                // Ensure the default category exists
                const defaultCategory = await Operator.getDefaultCategory();
                if (!defaultCategory)
                    throw new Error('Default category not found');

                // The default category cannot be deleted but can be changed
                if (this.id === defaultCategory.id)
                    throw new Error('Cannot delete the default category');

                // Query to handle compound keys between category_id and any other key: [categoryId, "..."]
                const query = IDBKeyRange.bound([this.id, ""], [this.id, "\uffff"]);

                // Migrate all its bookmarks to the default category
                const categoryBookmarks = await Operator.getRecordsByIndex<ICategoryBookmark>('category_bookmarks', 'category_bookmarks_index', query);
                for (const categoryBookmark of categoryBookmarks) {
                    const updated = { ...categoryBookmark, category_id: defaultCategory.id };
                    await Operator.updateRecord<ICategoryBookmark>('category_bookmarks', updated);
                }

                // Migrate all its tags to the default category
                const categoryTags = await Operator.getRecordsByIndex<ICategoryTag>('category_tags', 'category_tags_index', query);
                for (const categoryTag of categoryTags) {
                    const updated = { ...categoryTag, category_id: defaultCategory.id };
                    await Operator.updateRecord<ICategoryTag>('category_tags', updated);
                }

                // Delete the category itself
                await Operator.deleteRecord('categories', this.id);
            } catch (error) {
                throw new Error(`An error occurred in Category.delete:- ${error}, ${this}`);
            }
        });
    }
}
