import moment from "moment";
import { IBookmark, ICategory } from "./types/schemas";
import { removeClass, addClass } from "./domHelpers";


export function sortedBookmarks(bookmarks: IBookmark[]): IBookmark[] {
    // Deep copy the original data to avoid mutation
    const copy: IBookmark[] = JSON.parse(JSON.stringify(bookmarks));
    // Sort bookmarks in each category by updated_at
    copy.sort((a, b) => moment(b.updated_at).diff(moment(a.updated_at)));
    return copy;
}

// Remove class selected from all categories and add it target
export function toggleSelectedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        if (category.classList.contains('selected') && category !== target) {
            removeClass(category, 'selected');
        }
    });

    if (!target.classList.contains('selected')) {
        addClass(target, 'selected');
    }
}
// Remove class highlighted from all categories and add it target
export function toggleHighlightedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        if (category.classList.contains('highlighted') && category !== target) {
            removeClass(category, 'highlighted');
        }
    });

    if (!target.classList.contains('highlighted')) {
        addClass(target, 'highlighted');
    }
}

// Reset selected and highlighted categories, .all will be selected, and categories[0] will be highlighted
export function resetSelections() {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        removeClass(category, 'selected');
        removeClass(category, 'highlighted');
    });
    addClass(categories[0], 'selected');
    addClass(categories[1], 'highlighted');
}


export function sortedCategories(data: ICategory[]): ICategory[] {
    // Deep copy the original data to avoid mutation
    const copy: ICategory[] = JSON.parse(JSON.stringify(data));
    // Sort the categories alphabetically by name
    copy.sort((a, b) => a.name.localeCompare(b.name));

    // Push the defaultCategory to the front of the array
    const defaultCategoryIndex = copy.findIndex((cat) => cat.is_default === 1);
    // If found, remove it from its current index and push it to the front
    if (defaultCategoryIndex !== -1) {
        const removedCategory = copy.splice(defaultCategoryIndex, 1)[0];
        copy.unshift(removedCategory);
        return copy;
    }

    return copy;
}
