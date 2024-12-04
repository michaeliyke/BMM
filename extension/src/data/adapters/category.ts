import { ICategory, ICategoryBookmark, ICategoryTag } from "../../utils/types/schemas";
import { Operator } from "../operator";

export default {
    /**
     * Creates a new category record in the database.
     *
     * @param category - The category object to be created.
     * @returns A promise that resolves when the category has been successfully created.
     */
    async createCategory(category: ICategory): Promise<void> {
        // Only proceed if the category does not already exist
        if (await Operator.getRecordByIndex<ICategory>('categories', 'categories_index', category.id)) {
            console.warn(`Category with id ${category.id} already exists`);
            return;
        }
        category.tags = []; // Do not save tags in the category object
        category.bookmarks = []; // Do not save bookmarks in the category object
        await Operator.createRecord<ICategory>('categories', category);
    },

    /**
     * Updates a category record in the database.
     *
     * @param ID - The unique identifier of the category to be updated.
     * @param updatedCategory - The new data for the category.
     * @returns A promise that resolves when the update operation is complete.
     */
    async updateCategory(ID: string, updatedCategory: ICategory): Promise<void> {
        await Operator.updateRecord<ICategory>('categories', updatedCategory, ID);
    },

    /**
     * Retrieves a list of categories from the database.
     *
     * @returns {Promise<ICategory[]>} A promise that resolves to an array of category objects.
     */
    async getCategories(): Promise<ICategory[]> {
        return await Operator.getRecords<ICategory>('categories');
    },

    /**
     * Retrieves a category by its ID.
     *
     * @param {string} ID - The unique identifier of the category.
     * @returns {Promise<ICategory>} A promise that resolves to the category object.
     */
    async getCategoryById(ID: string): Promise<ICategory> {
        return Operator.getRecordByIndex<ICategory>('categories', 'categories_index', ID);
    },

    /**
     * Deletes a category by its ID, migrating its bookmarks and tags to the default category.
     *
     * @param categoryId - The ID of the category to delete.
     * @throws {Error} If the category with the given ID does not exist.
     * @throws {Error} If the default category does not exist.
     * @throws {Error} If attempting to delete the default category.
     * @returns A promise that resolves when the category has been deleted and its bookmarks and tags have been migrated.
     */
    async deleteCategory(categoryId: string): Promise<void> {
        // Delete a category by id, migrate its bookmarks and tags default category

        // Ensure the category exists
        if (!(await Operator.getRecordByIndex('categories', 'categories_index', categoryId)))
            throw new Error(`Category with id ${categoryId} not found`);

        // Ensure the default category exists
        const defaultCategory = await Operator.getDefaultCategory();
        if (!defaultCategory)
            throw new Error('Default category not found');

        // The default category cannot be deleted but can be changed
        if (categoryId === defaultCategory.id)
            throw new Error('Cannot delete the default category');

        // Query to handle compound keys between category_id and any other key: [categoryId, "..."]
        const query = IDBKeyRange.bound([categoryId, ""], [categoryId, "\uffff"]);

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
        await Operator.deleteRecord('categories', categoryId);
    },
};
