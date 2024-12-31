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

/**
 * Prepends a dot to the given class name if it does not already start with one.
 *
 * @param className - The class name to be processed.
 * @returns The class name with a dot prepended if it did not already start with one, or the original class name if it did.
 */
export function dotIt(className: string): string {
    if (!className) return '';
    return className[0] === '.' ? className : `.${className}`;
}

// Remove class selected from all categories and add it target
export function toggleSelectedClass(target: HTMLLIElement, type?: string) {
    const matches = document.querySelectorAll(dotIt(type || 'category'));
    matches.forEach((match) => {
        removeClass(match, ['selected']);
    });
    console.log(matches);
    addClass(target, ['selected']);
}

// Remove class highlighted from all categories and add it target
export function toggleHighlightedClass(target: HTMLLIElement, type?: string) {
    const matches = document.querySelectorAll(dotIt(type || 'category'));
    matches.forEach((match) => {
        removeClass(match, ['highlighted']);
    });
    addClass(target, ['highlighted']);
}

// Reset selected and highlighted categories, .all will be selected, and categories[0] will be highlighted
export function resetSelections(type?: string) {
    const matches = document.querySelectorAll(dotIt(type || 'category'));
    matches.forEach((match) => {
        removeClass(match, ['selected', 'highlighted']);
    });
    if (matches.length === 0) return;
    addClass(matches[0], ['selected']);
    addClass(type === "category" ? matches[1] : matches[0], ['highlighted']);
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
