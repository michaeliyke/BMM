import Bookmark from "./adapters/bookmark";
import Category from "./adapters/category";
import Tag from "./adapters/tag";
// import User from "./adapters/user";
import BookmarkTag from "./adapters/bookmark_tag";
import CategoryBookmark from "./adapters/category_bookmark";
import CategoryTag from "./adapters/category_tag";
import { ICategory } from "../utils/types/schemas";
import { v4 as uuid4 } from "uuid";
export default {
    /**
     * Retrieves all categories.
     *
     * @returns {Promise<ICategory[]>} A promise that resolves to an array of ICategory objects.
     */
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
            /* TODO: There must be a clear way to avoid data corruption */
            // Save the category
            const cat = new Category(category);
            if (!await cat.exists())
                await cat.create();
            // save category-tags relationship
            for (const tag of category.tags) {
                const tg = new Tag(tag);
                if (!await tg.exists())
                    await tg.create();
                // Save category-tag
                const catTg = new CategoryTag({
                    id: uuid4(),
                    category_id: category.id,
                    tag_id: tag.id,
                });

                if (!await catTg.exists())
                    await catTg.create();
            }

            // Save bookmarks, category-bookmarks, and bookmark-tags relationships
            for (const bookmark of category.bookmarks) {
                const book = new Bookmark(bookmark);
                if (!await book.exists())
                    await book.create();
                // Save category-bookmark
                const cateBook = new CategoryBookmark({
                    id: uuid4(),
                    category_id: category.id,
                    bookmark_id: bookmark.id,
                });

                if (!await cateBook.exists())
                    await cateBook.create();

                // save bookmark-tags relationship
                for (const tag of bookmark.tags) {
                    const tg = new Tag(tag);

                    if (!await tg.exists())
                        await tg.create();

                    // Save bookmark-tag association
                    const bookTg = new BookmarkTag({
                        id: uuid4(),
                        bookmark_id: bookmark.id,
                        tag_id: tag.id,
                    });

                    if (!await bookTg.exists())
                        await bookTg.create();
                }
            }
        }
    },
};
