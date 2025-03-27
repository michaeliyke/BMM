import adapters from "../data/adapters";
import Bookmark from "../data/adapters/bookmark";
import Category from "../data/adapters/category";
import Tag from "../data/adapters/tag";
import { IBookmark, ICategory, ImportData } from "./types/schemas";

/**
 * Handles the import of categories by loading bulk data and updating the state.
 *
 * @param categories - An array of category objects to be imported.
 * @param setData - A React state setter function to update the categories state.
 * @returns An asynchronous function that performs the import operation.
 */
export function importCategoriesHandler(categories: ICategory[], setData: React.Dispatch<React.SetStateAction<ICategory[]>>) {
    return async function () {
        await adapters.loadBulkData(categories);
        setData((prevData) => [...prevData, ...categories]);
    };
}

/**
 * Handles the import of bookmarks and updates the state with the new bookmarks.
 *
 * @param {IBookmark[]} bookmarks - An array of bookmarks to be imported.
 * @param {React.Dispatch<React.SetStateAction<ICategory[]>>} setData - A function to update the state with the new categories.
 * @returns {() => Promise<void>} - A function that, when called, imports the bookmarks and updates the state.
 */
export function importBookmarksHandler(bookmarks: IBookmark[], setData: React.Dispatch<React.SetStateAction<ICategory[]>>) {
    return async function () {
        await adapters.loadBulkBookmarks(bookmarks);
        setData((prevData) => {
            const newCategories = prevData.map((category) => {
                if (category.id === "default") {
                    category.bookmarks = [...category.bookmarks, ...bookmarks];
                }
                return category;
            });
            return newCategories;
        });
    };
}

/**
 * Validates the imported data by checking if each category, bookmark, and tag already exists in the database.
 *
 * @param importedData - The data to be imported, which can be either an array of categories or an array of bookmarks.
 *
 * If the imported data is a list of categories, it checks if each category, its bookmarks, and its tags already exist.
 * If the imported data is a list of bookmarks, it checks if each bookmark already exists.
 *
 * @returns A promise that resolves when the validation is complete.
 */
export async function validateImported(importedData: ImportData) {
    if (isCategoryArray(importedData)) {
        // If the imported data is a list of categories, check if each category already exists.
        for (const category of importedData) {
            category.importExists = !!await Category.exists(category.id);
            await markBookmarkExists(category.bookmarks);
            for (const tag of category.tags) {
                tag.importExists = !!await Tag.exists(tag.id);
            }
        }
        return;
    }
    // If the imported data is a list of bookmarks, check if each bookmark already exists.
    await markBookmarkExists(importedData);
}

/**
 * Checks if each bookmark and its associated tags exist in the database and updates their `importExists` property.
 *
 * @param bookmarks - An array of bookmarks to check for existence.
 * @returns A promise that resolves when the existence check is complete.
 */
export async function markBookmarkExists(bookmarks: IBookmark[]) {
    for (const bookmark of bookmarks) {
        bookmark.importExists = !!await Bookmark.exists(bookmark.id);
        for (const tag of bookmark.tags) {
            tag.importExists = !!await Tag.exists(tag.id);
        }
    }
}

/**
 * Checks if the given array is an array of ICategory objects.
 *
 * @param array - The array to check.
 * @returns True if the array is an array of ICategory objects, otherwise false.
 */
export function isCategoryArray(array: ImportData): array is ICategory[] {
    for (const item of array) {
        if (!item || item.importType !== "category") return false;
    }
    return true;
}

/**
 * Checks if the provided data is of type `ImportData`.
 *
 * This function verifies that the data is an array and that each item in the array
 * has a valid `importType` property, which can either be "bookmark" or "category".
 *
 * @param data - The data to be checked.
 * @returns `true` if the data is of type `ImportData`, otherwise `false`.
 */
export function isImportData(data: unknown): data is ImportData {
    if (!Array.isArray(data) || data.length === 0) return false;

    for (const item of data as ImportData) {
        if (!item || (item.importType !== "bookmark" && item.importType !== "category")) return false;
    }
    return true;
}

/**
 * Handles the import of data by determining the appropriate handler based on the data type.
 *
 * @param data - The data to be imported, which can be of various types.
 * @param setData - A React state setter function to update the state with the imported data.
 * @returns The result of the appropriate import handler function.
 */
export function getImportHandler(data: ImportData, setData: React.Dispatch<React.SetStateAction<ICategory[]>>) {
    if (isCategoryArray(data))
        return importCategoriesHandler(data, setData);
    return importBookmarksHandler(data, setData);
}
