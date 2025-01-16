import { LockManager } from "../../utils/locker";
import { ICategory, ICategoryTag, ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Bookmark from "./bookmark";
import Category from "./category";
import CategoryBookmark from "./category_bookmark";
import Tag from "./tag";
import { v4 as uuid4 } from 'uuid';

const lockManager = new LockManager();

export default class CategoryTag implements ICategoryTag {
    id: string;
    category_id: string;
    tag_id: string;

    constructor(categoryTag: ICategoryTag) {
        this.id = categoryTag.id || uuid4();
        this.category_id = categoryTag.category_id;
        this.tag_id = categoryTag.tag_id;
    }

    static async createBookmark(bookmark: Bookmark, category: Category, tag: Tag): Promise<Bookmark> {
        return lockManager.acquire(`CategoryTag.createBookmark:${bookmark.id}`, async () => {
            try {
                // Ensure category exists
                if (!(await category.exists()))
                    throw new Error(`CategoryTag.createBookmark:- Category not found: ${category}`);
                // Enusre tag exists
                if (!(await tag.exists()))
                    throw new Error(`CategoryTag.createBookmark:- Tag not found: ${tag}`);
                // Ensure tag exists under the category
                if (!(await CategoryTag.categoryTagExists(category.id, tag.id)))
                    throw new Error(`CategoryTag.createBookmark:- Tag not found under category: ${tag.name}, ${category.name}`);
                // Create bookmark
                await bookmark.create();
                // Create category_bookmark
                const categoryBookmark = new CategoryBookmark({
                    id: "",
                    category_id: category.id,
                    bookmark_id: bookmark.id,
                });
                await categoryBookmark.create();

                // Create bookmark_tag
                const bookmarkTag = new CategoryTag({
                    id: "",
                    category_id: category.id,
                    tag_id: tag.id,
                });
                await bookmarkTag.create();

                return bookmark;
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.createBookmark:- ${error}, ${bookmark}`);
            }
        });
    }
    async exists(): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.category_id, this.tag_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (await Operator.getRecordByIndex<ICategoryTag>('category_tags', 'category_tags_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.exists:- ${error}, ${this}`);
            }
            return false;
        });
    }

    async existing(): Promise<ICategoryTag | null> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [this.category_id, this.tag_id];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                const existing = await Operator.getRecordByIndex<ICategoryTag>('category_tags', 'category_tags_index', query)
                return existing ? existing : null;
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.exists:- ${error}, ${this}`);
            }
        });
    }

    static async getAll(query?: IDBKeyRange): Promise<ICategoryTag[]> {
        return lockManager.acquire(`CategoryTag.getAll:${query}`, async () => {
            try {
                return Operator.getRecordsByIndex<ICategoryTag>('category_tags', 'category_tags_index', query);
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.getAll:- ${error}, ${query}`);
            }
        });
    }

    static async getCategories(tagId: string): Promise<ICategory[]> {
        return lockManager.acquire(`CategoryTag.getCategories:${tagId}`, async () => {
            try {
                const categories = await Category.getCategories();
                const categoryTags = await CategoryTag.getAll();
                const filteredIds = categoryTags
                    .filter((categoryTag) => categoryTag.tag_id === tagId)
                    .map((categoryTag) => categoryTag.category_id);

                return categories.filter((category) => filteredIds.includes(category.id));
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.getCategories:- ${error}, ${tagId}`);
            }
        });
    }

    static async getTags(categoryId: string): Promise<ITag[]> {
        return lockManager.acquire(`CategoryTag.getTags:${categoryId}`, async () => {
            try {
                // Query to handle compound keys between category_id and any other key: [categoryId, "..."]
                const query = IDBKeyRange.bound([categoryId, ""], [categoryId, "\uffff"]);
                const categoryTags = await CategoryTag.getAll(query);
                const allTags = await Tag.getTags();
                return allTags.filter((tag) => {
                    return categoryTags.some((cateTag) => cateTag.tag_id === tag.id);
                });
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.getTags:- ${error}, ${categoryId}`);
            }
        });
    }

    async categoryTagExists_(categoryId: string, tagId: string): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [categoryId, tagId];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (await Operator.getRecordByIndex<ICategoryTag>('category_tags', 'category_tags_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.exists:- ${error}, ${query}`);
            }
            return false;
        });
    }

    static async categoryTagExists(categoryId: string, tagId: string): Promise<boolean> {
        const callerName = new Error().stack?.split('\n')[2].trim().split(' ')[1];
        const query = [categoryId, tagId];
        return lockManager.acquire(`${callerName}:${query}`, async () => {
            try {
                if (await Operator.getRecordByIndex<ICategoryTag>('category_tags', 'category_tags_index', query))
                    return true;
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.exists:- ${error}, ${query}`);
            }
            return false;
        });
    }

    /**
     * Removes a tag from a category.
     *
     * @returns A promise that resolves when the tag is successfully removed from the category.
     * @throws Will throw an error if the tag with the specified ID does not exist.
     * @throws Will throw an error if the category with the specified ID does not exist.
     * @throws Will throw an error if the tag does not exist under the specified category.
     */
    async delete(): Promise<void> {
        // TODO: ...
        const query = [this.category_id, this.tag_id];
        lockManager.acquire(`CategoryTag.delete:${query}`, async () => {
            // Ensure tag exists
            try {
                if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', this.tag_id)))
                    throw new Error(`CategoryTag.delete:- Tag not found: ${this}`);

                // Ensure category exists
                const category = await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', this.category_id);
                if (!category)
                    throw new Error(`CategoryTag.delete:- Category not found: ${this}`);

                // Ensure tag exists under the category
                const query = [this.category_id, this.tag_id];
                const categoryTag = await Operator.getRecordByIndex<ICategoryTag>("category_tags", "category_tags_index", query);
                if (!categoryTag)
                    throw new Error(`CategoryTag.delete:- Tag with id ${this.tag_id} not found: ${this} `);

                await Operator.deleteRecordsByIndex("category_tags", "category_tags_index", query);
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.delete:- ${error}, ${this}`);
            }
        });
    }

    /**
     * Moves a tag from one category to another.
     *
     * @param tagId - The ID of the tag to move.
     * @param fromCategoryId - The ID of the category from which the tag is being moved.
     * @param toCategoryId - The ID of the category to which the tag is being moved.
     * @returns A promise that resolves when the tag has been successfully moved.
     * @throws Will throw an error if the tag does not exist.
     * @throws Will throw an error if either the source or destination category does not exist.
     * @throws Will throw an error if the tag does not exist under the source category.
     */
    static async moveCategoryTag(tagId: string, fromCategoryId: string, toCategoryId: string): Promise<void> {
        const query = [fromCategoryId, tagId];
        lockManager.acquire(`CategoryTag.moveCategoryTag:${query}`, async () => {
            // Ensure tag exists
            try {
                const tag = await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId);
                if (!tag)
                    throw new Error(`CategoryTag.moveCategoryTag:- Tag not found: ${this}`);

                // Ensure both categories exists
                const fromCategory = await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', fromCategoryId);
                if (!fromCategory)
                    throw new Error(`CategoryTag.moveCategoryTag:- fromCategory not found (${fromCategoryId}): ${this}`);

                const toCategory = await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', toCategoryId);
                if (!toCategory)
                    throw new Error(`CategoryTag.moveCategoryTag:- toCategory to found (${toCategoryId}): ${this}`);

                // Ensure tag exists under the fromCategory
                const categoryTag = await Operator.getRecordByIndex<ICategoryTag>("category_tags", "category_tags_index", [fromCategoryId, tagId]);
                if (!categoryTag)
                    throw new Error(`Tag with id ${tagId} not found under category with id ${fromCategoryId} `);

                const updated = { ...categoryTag, category_id: toCategoryId };
                await Operator.updateRecord<ICategoryTag>('category_tags', updated);
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.moveCategoryTag:- ${error}, ${this}`);
            }
        });
    }

    /**
    * Adds a tag to a specified category.
    *
    * @param tag - The tag to be added.
    * @param categoryId - The ID of the category to which the tag will be linked.
    * @returns A promise that resolves when the tag has been added.
    * @throws Will throw an error if the category with the given ID is not found.
    *
    * @remarks
    * - Ensures the category exists before adding the tag.
    * - Checks if the tag already exists under the specified category to avoid duplicates.
    * - Creates the tag if it does not already exist.
    * - Links the tag to the category by creating a record in the `category_tags` table.
    */
    async create(): Promise<ICategoryTag> {
        const query = [this.category_id, this.tag_id];
        return lockManager.acquire(`CategoryTag.create:${query}`, async () => {
            // Ensure category exists
            try {
                // Ensure tag doesn't already exist under the category
                const existing = await this.existing();
                if (!(existing))
                    return await Operator.createRecord<ICategoryTag>('category_tags', this);
                return existing;
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.create:- ${error}, ${this}`);
            }
        });
    }
}
