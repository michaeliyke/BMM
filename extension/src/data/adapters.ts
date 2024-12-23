import Bookmark from "./adapters/bookmark";
import Category from "./adapters/category";
import Tag from "./adapters/tag";
// import User from "./adapters/user";
import BookmarkTag from "./adapters/bookmark_tag";
import CategoryBookmark from "./adapters/category_bookmark";
import CategoryTag from "./adapters/category_tag";
import { ICategory } from "../utils/types/schemas";

export default {
    async getAll(): Promise<ICategory[]> {
        return Category.getAll();
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
    async loadInitialData(data: ICategory[]): Promise<void> {
        for (const category of data) {
            // Save the category
            await new Category(category).create();
            // save category-tags relationship
            for (const tag of category.tags) {
                await new Tag(tag).create(); // Save the tag
                // Save category-tag
                await new CategoryTag({
                    id: "",
                    category_id: category.id,
                    tag_id: tag.id,
                }).create();
            }

            // Save bookmarks, category-bookmarks, and bookmark-tags relationships
            for (const bookmark of category.bookmarks) {
                await new Bookmark(bookmark).create(); // Save bookmark
                // Save category-bookmark
                await new CategoryBookmark({
                    id: "",
                    category_id: category.id,
                    bookmark_id: bookmark.id,
                }).create();

                // save bookmark-tags relationship
                for (const tag of bookmark.tags) {
                    await new Tag(tag).create(); // Save the tag if not exists
                    // Save bookmark-tag
                    await new BookmarkTag({
                        id: "",
                        bookmark_id: bookmark.id,
                        tag_id: tag.id,
                    }).create();
                }
            }
        }
    },
};
