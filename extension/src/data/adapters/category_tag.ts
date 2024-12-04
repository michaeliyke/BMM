import {
    ICategory,
    ICategoryTag,
    ITag,
} from "../../utils/types/schemas";
import { Operator } from "../operator";
import { v4 as uuidv4 } from 'uuid';

export default {
    /**
     * Removes a tag from a category.
     *
     * @param tagId - The ID of the tag to be removed.
     * @param categoryId - The ID of the category from which the tag will be removed.
     * @returns A promise that resolves when the tag is successfully removed from the category.
     * @throws Will throw an error if the tag with the specified ID does not exist.
     * @throws Will throw an error if the category with the specified ID does not exist.
     * @throws Will throw an error if the tag does not exist under the specified category.
     */
    async deleteCategoryTag(tagId: string, categoryId: string): Promise<void> {
        // Ensure tag exists
        if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId)))
            throw new Error(`Tag with id ${tagId} not found`);

        // Ensure category exists
        const category = await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', categoryId);
        if (!category)
            throw new Error(`Category with id ${categoryId} not found`);

        // Ensure tag exists under the category
        const categoryTag = await Operator.getRecordByIndex<ICategoryTag>("category_tags", "category_tags_index", [categoryId, tagId]);
        if (!categoryTag)
            throw new Error(`Tag with id ${tagId} not found under category with id ${categoryId} `);

        await Operator.deleteRecordsByIndex("category_tags", "category_tags_index", [categoryId, tagId]);
    },

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
    async moveCategoryTag(tagId: string, fromCategoryId: string, toCategoryId: string): Promise<void> {
        // Ensure tag exists
        const tag = await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId);
        if (!tag)
            throw new Error(`Tag with id ${tagId} not found`);

        // Ensure both categories exists
        const fromCategory = await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', fromCategoryId);
        if (!fromCategory)
            throw new Error(`Category with id ${fromCategoryId} not found`);

        const toCategory = await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', toCategoryId);
        if (!toCategory)
            throw new Error(`Category with id ${toCategoryId} not found`);

        // Ensure tag exists under the fromCategory
        const categoryTag = await Operator.getRecordByIndex<ICategoryTag>("category_tags", "category_tags_index", [fromCategoryId, tagId]);
        if (!categoryTag)
            throw new Error(`Tag with id ${tagId} not found under category with id ${fromCategoryId} `);

        const updated = { ...categoryTag, category_id: toCategoryId };
        await Operator.updateRecord<ICategoryTag>('category_tags', updated, categoryTag.id);
    },

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
    async createCategoryTag(tagId: string, categoryId: string): Promise<void> {
        // Ensure category exists
        const category = await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', categoryId);
        if (!category)
            throw new Error(`Category with id ${categoryId} not found`);

        // Ensure tag doesn't already exist under the category
        const categoryTag = await Operator.getRecordByIndex<ICategoryTag>(
            'category_tags', 'category_tags_index', [categoryId, tagId]);
        if (categoryTag) {
            console.warn(`Tag with id ${tagId} already exists under category with id ${categoryId}`);
            return;
        }

        // Ensure tag exists
        if (!(await Operator.getRecordByIndex<ITag>('tags', 'tags_index', tagId)))
            throw new Error(`Tag with id ${tagId} not found`);

        const data = { tag_id: tagId, category_id: categoryId, id: uuidv4() };
        await Operator.createRecord<ICategoryTag>('category_tags', data);
    },
};
