import { LockManager } from "../../utils/locker";
import {
    IBookmark,
    ICategory,
    ICategoryBookmark,
    ICategoryTag,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import BookmarkTag from "./bookmark_tag";
import CategoryBookmark from "./category_bookmark";
import CategoryTag from "./category_tag";
import { v4 as uuid4 } from 'uuid';

const lockManager = new LockManager();

export default class Category implements ICategory {

    id: string;
    name: string;
    is_default: number;
    created_at: string;
    updated_at: string;
    bookmarks: IBookmark[];
    tags: ITag[];

    constructor(category: ICategory) {
        this.id = category.id || uuid4();
        this.name = category.name;
        this.is_default = category.is_default;
        this.created_at = (new Date()).toISOString();
        this.updated_at = this.created_at;
        this.bookmarks = category.bookmarks;
        this.tags = category.tags;
    }

    /**
     * Checks if a category exists in the database.
     *
     * @returns A promise that resolves to `true` if the category exists, otherwise `false`.
     */
    async exists(): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${this.id}`, async () => {
            if (await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', this.name))
                return true;
            return false;
        });
    }

    static async categoryExists(name: string): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        return lockManager.acquire(`${callerName}:${name}`, async () => {
            if (await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', name))
                return true;
            return false;
        });
    }

    static async getAll(): Promise<ICategory[]> {
        // TODO: Modify to fetch all categories, its bookmarks and tags and their refs
        return lockManager.acquire('Category.getAll', async () => {
            const categories = await Category.getCategories();
            for (const category of categories) {
                const tags = await CategoryTag.getTags(category.id);
                const bookmarks = await CategoryBookmark.getBookmarks(category.id);
                console.log(bookmarks);
                for (const bookmark of bookmarks) {
                    const tags = await BookmarkTag.getTags(bookmark.id);
                    bookmark.tags = tags;
                }
                category.bookmarks = bookmarks;
                category.tags = tags;
            }
            return categories;
        });
    }

    /**
     * Creates a new category record in the database.
     *
     * @returns A promise that resolves when the category has been successfully created.
     */
    async create(): Promise<ICategory> {
        return lockManager.acquire(`Category.create:${this.id}`, async () => {
            this.tags = []; // Do not save tags in the category object
            this.bookmarks = []; // Do not save bookmarks in the category object
            // Only proceed if the category does not already exist
            try {
                if (!await this.exists())
                    return Operator.createRecord<ICategory>('categories', this);
                return this;
            } catch (error) {
                throw new Error(`An error occurred in Category.create:- ${error}, ${JSON.stringify(this)}`);
            }
        });
    }

    /**
     * Updates a category record in the database.
     *
     * @returns A promise that resolves when the update operation is complete.
     */
    async update(): Promise<void> {
        lockManager.acquire(`Category.update:${this.id}`, async () => {
            try {
                if (await this.exists()) {
                    this.tags = []; // Do not save tags in the category object
                    this.bookmarks = []; // Do not save bookmarks in the category object
                    await Operator.updateRecord<ICategory>('categories', this, this.id);
                }
            } catch (error) {
                throw new Error(`An error occurred in Category.update:- ${error}, ${this}`);
            }
        });
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
                return Operator.getRecordById<ICategory>('categories', ID);
            } catch (error) {
                throw new Error(`An error occurred in Category.getCategoryById:- ${error}, ${this}`);
            }
        });
    }

    static async getCategoryByName(name: string): Promise<ICategory> {
        return lockManager.acquire(`Category.getCategoryById:${name}`, async () => {
            try {
                return Operator.getRecordByIndex<ICategory>('categories', 'categories_index', name);
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
        lockManager.acquire(`Category.delete:${this.id}`, async () => {
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
                    await Operator.updateRecord<ICategoryBookmark>('category_bookmarks', updated, categoryBookmark.id);
                }

                // Migrate all its tags to the default category
                const categoryTags = await Operator.getRecordsByIndex<ICategoryTag>('category_tags', 'category_tags_index', query);
                for (const categoryTag of categoryTags) {
                    const updated = { ...categoryTag, category_id: defaultCategory.id };
                    await Operator.updateRecord<ICategoryTag>('category_tags', updated, categoryTag.id);
                }

                // Delete the category itself
                await Operator.deleteRecord('categories', this.id);
            } catch (error) {
                throw new Error(`An error occurred in Category.delete:- ${error}, ${this}`);
            }
        });
    }
}
