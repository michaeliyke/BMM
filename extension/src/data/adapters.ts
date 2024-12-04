import bookmark from "./adapters/bookmark";
import category from "./adapters/category";
import tag from "./adapters/tag";
import user from "./adapters/user";
import bookmarkTag from "./adapters/bookmark_tag";
import categoryBookmark from "./adapters/category_bookmark";
import categoryTag from "./adapters/category_tag";
import { TCategory } from "../utils/types/payload";

export default {
    ...bookmark,
    ...category,
    ...tag,
    ...user,
    ...bookmarkTag,
    ...categoryBookmark,
    ...categoryTag,
    async getAll(): Promise<TCategory> {
        return new Promise(() => { })
    },

    /**
     * Loads the initial data into the database.
     *
     * This method initializes the database and populates it with the provided categories,
     * bookmarks, and tags. It also establishes relationships between bookmarks and categories,
     * as well as bookmarks and tags.
     *
     * @param data - An array of categories, each containing bookmarks and tags to be loaded into the database.
     * @returns A promise that resolves when the data has been successfully loaded.
     */
    async loadInitialData(data: TCategory[]): Promise<void> {
        for (const category of data) {
            await this.createCategory(category); // Save the category

            // save category-tags relationship
            for (const tag of category.tags) {
                await this.createTag(tag); // Save the tag
                await this.createCategoryTag(tag.id, category.id); // Save category-tag
            }

            for (const bookmark of category.bookmarks) {
                await this.createBookmark(bookmark); // Save bookmark
                // Save category-bookmark
                await this.createCategoryBookmark(category.id, bookmark.id);
                // save bookmark-tags relationship
                for (const tag of bookmark.tags) {
                    await this.createTag(tag); // Save the tag if not exists
                    await this.createBookmarkTag(tag.id, bookmark.id); // Save bookmark-tag
                }
            }
        }
    },
};
