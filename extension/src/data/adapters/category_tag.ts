import { LockManager } from "../../utils/locker";
import { ICategory, ICategoryTag, ITag } from "../../utils/types/schemas";
import { Operator } from "../operator";
import Category from "./category";
import Tag from "./tag";

const lockManager = new LockManager();

export default class CategoryTag implements ICategoryTag {
    id: string;
    category_id: string;
    tag_id: string;

    constructor(categoryTag: ICategoryTag) {
        this.id = categoryTag.id;
        this.category_id = categoryTag.category_id;
        this.tag_id = categoryTag.tag_id;
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

    async categoryTagExists(categoryId: string, tagId: string): Promise<boolean> {
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

    static async CategoryTagExists(categoryId: string, tagId: string): Promise<boolean> {
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
        lockManager.acquire(tagId, async () => {
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
                await Operator.updateRecord<ICategoryTag>('category_tags', updated, categoryTag.id);
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
    async create(): Promise<void> {
        const query = [this.category_id, this.tag_id];
        lockManager.acquire(`CategoryTag.create:${query}`, async () => {
            const { tag_id: tagId, category_id: categoryId } = this;
            // Ensure category exists
            try {
                if (!(await Category.categoryExists(categoryId)))
                    throw new Error(`CategoryTag.create:- Category not found: ${this}`);

                // Ensure tag exists
                if (!(await Tag.tagExists(tagId)))
                    throw new Error(`CategoryTag.create:- Tag not found: ${this}`);

                // Ensure tag doesn't already exist under the category
                if (!(await this.exists())) {
                    await Operator.createRecord<ICategoryTag>('category_tags', this);
                }
            } catch (error) {
                throw new Error(`An error occurred in CategoryTag.create:- ${error}, ${this}`);
            }
        });
    }
}
