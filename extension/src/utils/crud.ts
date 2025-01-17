import { ICategory } from "./types/schemas";

/**
 * Adds a new category to the existing list of categories.
 *
 * @param categories - The array of existing categories.
 * @param category - The new category to be added.
 * @returns A new array containing all existing categories and the new category.
 */
export function create(categories: ICategory[], category: ICategory): ICategory[] {
    // Append the new category to the existing categories
    return [...categories, category];
    // Trigger persistence if any
}

/**
 * Reads and returns the existing categories.
 *
 * @param categories - An array of category objects to be read.
 * @returns An array of category objects.
 */
export function read(categories: ICategory[]): ICategory[] {
    // Return the existing categories
    return categories;
}

/**
 * Updates a category in the list of categories.
 *
 * @param categories - The array of existing categories.
 * @param category - The category object with updated information.
 * @returns A new array of categories with the updated category.
 */
export function update(categories: ICategory[], category: ICategory): ICategory[] {
    // Update the category with the new category
    return categories.map((cat) => cat.name === category.name ? category : cat);
}

/**
 * Removes a specified category from a list of categories.
 *
 * @param categories - The array of existing categories.
 * @param category - The category to be removed.
 * @returns A new array of categories with the specified category removed.
 */
export function delete_(categories: ICategory[], category: ICategory): ICategory[] {
    // Remove the category from the existing categories
    return categories.filter((cat) => cat.name !== category.name);
}
