import { TCategory} from "./types.payload";

export function create (categories: TCategory[], category: TCategory): TCategory[] {
    // Append the new category to the existing categories
    return [...categories, category];
    // Trigger persistence if any
}

export function read (categories: TCategory[]): TCategory[] {
    // Return the existing categories
    return categories;
}

export function update (categories: TCategory[], category: TCategory): TCategory[] {
    // Update the category with the new category
    return categories.map((cat) => cat.name === category.name ? category : cat);
}

export function delete_ (categories: TCategory[], category: TCategory): TCategory[] {
    // Remove the category from the existing categories
    return categories.filter((cat) => cat.name !== category.name);
}
