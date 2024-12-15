import { ICategory } from "./types/schemas";

export function create(categories: ICategory[], category: ICategory): ICategory[] {
    // Append the new category to the existing categories
    return [...categories, category];
    // Trigger persistence if any
}

export function read(categories: ICategory[]): ICategory[] {
    // Return the existing categories
    return categories;
}

export function update(categories: ICategory[], category: ICategory): ICategory[] {
    // Update the category with the new category
    return categories.map((cat) => cat.name === category.name ? category : cat);
}

export function delete_(categories: ICategory[], category: ICategory): ICategory[] {
    // Remove the category from the existing categories
    return categories.filter((cat) => cat.name !== category.name);
}
