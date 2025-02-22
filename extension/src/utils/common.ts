import moment from "moment";
import { addClass, removeClass } from "./domHelpers";
import { IBookmark, ICategory, ITag } from "./types/schemas";


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

/**
 * Toggles the 'highlighted' class on the target element and removes it from other elements of the same type.
 *
 * @param {HTMLElement} target - The target element to toggle the 'highlighted' class on.
 * @param {string} [type] - The type of elements to query and remove the 'highlighted' class from. Defaults to 'category'.
 */
export function toggleHighlightedClass(target: HTMLElement, type?: string) {
    const formattedType = dotIt(type || 'category');
    const matches = document.querySelectorAll(formattedType);

    matches.forEach((match) => {
        if (match.classList.contains('highlighted') && match !== target) {
            removeClass(match, ['highlighted']);
        }
    });
    addClass(target, ['highlighted']);
}

/**
 * Resets the selections based on the provided type.
 *
 * @param {string} [type] - The type of selection to reset. Defaults to 'category' if not provided.
 *
 * The function performs the following actions:
 * 1. Formats the type using the `dotIt` function.
 * 2. Selects all elements matching the formatted type.
 * 3. If no matches are found, the function returns early.
 * 4. Removes the 'selected' and 'highlighted' classes from all matched elements.
 * 5. If the formatted type is ".category":
 *    - Adds the 'selected' class to the first matched element.
 *    - Adds the 'highlighted' class to the second matched element.
 * 6. If the formatted type is not ".category":
 *    - Adds the 'highlighted' class to the first matched element.
 */
export function resetSelections(type?: string) {
    const formattedType = dotIt(type || 'category');
    const matches = document.querySelectorAll(formattedType);
    if (matches.length === 0)
        return;

    matches.forEach((match) => {  /* Remove current selections */
        removeClass(match, ['selected', 'highlighted']);
    });

    if (formattedType === ".category") { /* Select the All Categories and highlight default category */
        addClass(matches[0], ['selected']);
        addClass(matches[1], ['highlighted']);
        return;
    }

    /* Highlight All tags */
    addClass(matches[0], ['highlighted']);
}


/**
 * Sorts an array of categories alphabetically by their name and ensures that the default category
 * (identified by `is_default` property) is placed at the front of the array.
 *
 * @param data - An array of categories to be sorted.
 * @returns A new array of categories sorted alphabetically by name with the default category at the front.
 *
 * @remarks
 * This function creates a deep copy of the input array to avoid mutating the original data.
 *
 * @example
 * ```typescript
 * const categories = [
 *   { name: 'Beverages', is_default: 0 },
 *   { name: 'Snacks', is_default: 1 },
 *   { name: 'Dairy', is_default: 0 }
 * ];
 * const sorted = sortedCategories(categories);
 * console.log(sorted);
 * // Output:
 * // [
 * //   { name: 'Snacks', is_default: 1 },
 * //   { name: 'Beverages', is_default: 0 },
 * //   { name: 'Dairy', is_default: 0 }
 * // ]
 * ```
 */
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

/**
 * Perform a weighted search on an array of bookmarks.
 * @param query - The search term entered by the user.
 * @param bookmarks - Array of IBookmark objects to search within.
 * @returns A sorted array of bookmarks ranked by relevance.
 */
export function weightedSearch(query: string, bookmarks: IBookmark[]): IBookmark[] {
    if (!query.trim()) return bookmarks;
    const lowerQuery = query.toLowerCase(); // case-insensitive matching.

    // Define weights for fields.
    const weights = {
        title: 3,
        description: 2,
        url: 1,
    };

    return bookmarks
        .map((bookmark) => {
            // Compute scores for each field based on matching.
            const titleScore = bookmark.title.toLowerCase().includes(lowerQuery) ? weights.title : 0;
            const descriptionScore = bookmark.description.toLowerCase().includes(lowerQuery) ? weights.description : 0;
            const urlScore = bookmark.url.toLowerCase().includes(lowerQuery) ? weights.url : 0;

            // Calculate total score.
            const totalScore = titleScore + descriptionScore + urlScore;

            return { bookmark, totalScore };
        })
        .filter((result) => result.totalScore > 0) // Exclude ones with no matches.
        .sort((a, b) => b.totalScore - a.totalScore) // Sort by relevance (highest score first).
        .map((result) => result.bookmark); // Return sorted bookmarks.
}

export function categoryTagsSearch(query: string, categories: ICategory[]): ICategory[] {
    if (!query.trim())
        return categories;

    const queryLower = query.toLowerCase(); // case-insensitive matching.

    // Define weights for fields.
    const weights = {
        category: 2,
        tag: 1,
    };

    return categories
        .map((category) => {
            // Compute scores for each field based on matching.
            const categoryScore = category.name.toLowerCase().includes(queryLower) ? weights.category : 0;
            let tagScore = 0;
            for (const tag of category.tags) {
                if (tag.name.toLowerCase().includes(queryLower)) {
                    tagScore = weights.tag;
                    break;
                }
            }

            // Calculate total score.
            const totalScore = categoryScore + tagScore;

            return { category, totalScore };
        })
        .filter((result) => result.totalScore > 0) // Exclude ones with no matches.
        .sort((a, b) => b.totalScore - a.totalScore) // Sort by relevance (highest score first).
        .map((result) => result.category); // Return sorted bookmarks.
}

export function categoriesSearch(query: string, categories: ICategory[]): ICategory[] {
    if (!query.trim())
        return categories;

    return categories
        .filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name (alphabetical order).
}

/**
 * Retrieves all bookmarks from the provided categories.
 *
 * @param categories - An array of category objects, each containing an array of bookmarks.
 * @returns An array of bookmarks extracted from the provided categories.
 */
export function getBookmarks(categories: ICategory[]): IBookmark[] {
    return categories.flatMap((category) => category.bookmarks)
        .filter((bookmark) => bookmark.archived !== 1);
}

/**
 * Retrieves the categories that contain the specified bookmark.
 *
 * @param bookmark - The bookmark to find categories for.
 * @param categories - The list of categories to search within.
 * @returns An array of categories that contain the specified bookmark.
 */
export function getBookmarkCategories(bookmark: IBookmark, categories: ICategory[]): ICategory[] {
    return categories.filter((category) => {
        // Exclude default category from search
        if (category.is_default === 1) return false;
        return category.bookmarks.some((b) => b.id === bookmark.id);
    });
}

/**
 * Filters out archived bookmarks from a list of categories.
 *
 * @param categories - An array of category objects, each containing a list of bookmarks.
 * @returns An array of bookmarks that are marked as archived.
 */
export function filterArchived(categories: ICategory[]): IBookmark[] {
    return categories.flatMap((category) => category.bookmarks)
        .filter((bookmark) => bookmark.archived === 1);
}


/**
 * Filters an array of items based on a predicate function.
 *
 * @param items - The array of items to filter.
 * @param predicate - The predicate function used to filter the items.
 * @returns An array of items that satisfy the predicate.
 */
export function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
    return items.filter(predicate);
}

/**
 * Checks if any of the specified properties in the given object are empty.
 *
 * @param props - An array of property names to check in the object.
 * @param obj - The object to check for empty properties.
 * @returns The name of the first empty property found, or `false` if all properties are non-empty.
 */
export function isEmpty<T extends object>(props: (keyof T)[], obj: T): false | (keyof T) {
    for (const prop of props) {
        const value = prop in obj ? String(obj[prop]).trim() : '';
        if (!value) return prop;
    }
    return false;
}

/**
 * Retrieves the URL of the current tab in the browser.
 *
 * @returns The URL of the current tab, or the current location if the URL cannot be retrieved.
 */
export async function getCurrentTabUrl() {
    if (typeof chrome === 'undefined' || !chrome.tabs) return location.href;
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab?.url ? tab.url : location.href;
    } catch (error) {
        throw new Error(`Error retrieving current tab URL: ${error}`);
    }
}

/**
 * Retrieves the title of the current tab in the browser.
 *
 * @returns The title of the current tab, or the current document title if the title cannot be retrieved.
 */
export async function getCurrentTabTitle() {
    if (typeof chrome === 'undefined' || !chrome.tabs) return document.title;
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return document.title;
        return tab.title ? tab.title : document.title;
    } catch (error) {
        throw new Error(`Error retrieving current tab title: ${error}`);
    }
}


/**
 * Extracts and returns an array of tags from the given categories.
 *
 * @param categories - An array of category objects, each containing a list of tags.
 * @returns An array of tags extracted from the provided categories.
 */
export function getTags(categories: ICategory[]): ITag[] {
    return categories.flatMap((category) => category.tags)
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name (alphabetical order).
}

/**
 * Filters and sorts an array of tags based on a search query.
 *
 * @param query - The search query string used to filter the tags.
 * @param categories - An array of tags to be filtered and sorted.
 * @returns An array of tags that match the search query, sorted alphabetically by name.
 */
export function tagsSearch(query: string, categories: ICategory[]): ICategory[] {
    if (!query.trim())
        return categories;
    console.log(categories);
    return categories
        .filter((category) => {
            const tags = category.tags.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()));
            return tags.length > 0 ? category : null;
        });
}
