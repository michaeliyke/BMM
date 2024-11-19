import { TCategory, TCRUD } from "./types.payload";

const crud: TCRUD = {

    create (categories: TCategory[], category: TCategory): TCategory[] {
        // Append the new category to the existing categories
        return [...categories, category];
    },

    read (categories: TCategory[]): TCategory[] {
        // Return the existing categories
        return categories;
    },

    update (categories: TCategory[], category: TCategory): TCategory[] {
        // Update the category with the new category
        return categories.map((cat) => cat.name === category.name ? category : cat);
    },

    delete (categories: TCategory[], category: TCategory): TCategory[] {
        // Remove the category from the existing categories
        return categories.filter((cat) => cat.name !== category.name);
    },
};

export default crud;
