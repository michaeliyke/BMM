import { IBookmark, ICategory, ImportData, ITag } from "./types/schemas";

/**
 * Handles the import of categories by loading bulk data and updating the state.
 *
 * @param categories - An array of category objects to be imported.
 * @param setData - A React state setter function to update the categories state.
 * @returns An asynchronous function that performs the import operation.
 */
/* export function importCategoriesHandler(categories: ICategory[], setData: React.Dispatch<React.SetStateAction<ICategory[]>>) {
  return async function () {
    await adapters.loadBulkData(categories);
    setData((prevData) => {
      return prevData.map(existingCat => {
        // Find if there's a new version of this category
        const newCat = categories.find((c) => c.name === existingCat.name);
        if (!newCat) return existingCat;

        // Merge existing and new bookmarks
        const mergedBookmarks = [
          ...existingCat.bookmarks.map(existingBook => {
            const newBook = newCat.bookmarks.find(b => b.id === existingBook.id);
            if (!newBook) return existingBook;
            // Merge tags for existing bookmarks
            const mergedTags = [
              ...existingBook.tags,
              ...newBook.tags.filter((newTag) => {
                return !existingBook.tags.some((existingTag) => existingTag.name === newTag.name);
              })
            ];
            return { ...existingBook, tags: mergedTags };
          }),
          // Add new bookmarks
          ...newCat.bookmarks.filter((newBook) => {
            return !existingCat.bookmarks.some((existingBook) => existingBook.id === newBook.id);
          })
        ];

        // Merge existing and new tags
        const mergedTags = [
          ...existingCat.tags,
          ...newCat.tags.filter((newTag) => {
            return !existingCat.tags.some(existingTag => existingTag.name === newTag.name);
          })
        ];

        return {
          ...existingCat,
          bookmarks: mergedBookmarks,
          tags: mergedTags
        };
      }).concat(
        // Add completely new categories
        categories.filter((newCat) => {
          return !prevData.some((existingCat) => existingCat.name === newCat.name);
        })
      );
    });
  };
}
 */
/**
 * Handles the import of bookmarks and updates the state with the new bookmarks.
 *
 * @param {IBookmark[]} bookmarks - An array of bookmarks to be imported.
 * @param {React.Dispatch<React.SetStateAction<ICategory[]>>} setData - A function to update the state with the new categories.
 * @returns {() => Promise<void>} - A function that, when called, imports the bookmarks and updates the state.
 */
/* export function importBookmarksHandler(bookmarks: IBookmark[], setData: React.Dispatch<React.SetStateAction<ICategory[]>>) {
  return async function () {
    await adapters.loadBulkBookmarks(bookmarks);
    setData((prevData) => {
      const newCategories = prevData.map((category) => {
        if (category.id === "default") {
          const existingBookmarks = category.bookmarks;
          const uniqueBookmarks = bookmarks.filter(newBookmark =>
            !existingBookmarks.some(existingBookmark => existingBookmark.id === newBookmark.id)
          );
          category.bookmarks = [...existingBookmarks, ...uniqueBookmarks];
        }
        return category;
      });
      return newCategories;
    });
  };
} */

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
/* export async function validateImported(importedData: ImportData) {
  if (isCategoryArray(importedData)) {
    // If the imported data is a list of categories, check if each category already exists.
    for (const category of importedData) {
      category.importExists = !!await Category.exists(category.name);
      await markBookmarkExists(category.bookmarks);
      for (const tag of category.tags) {
        tag.importExists = !!await Tag.exists(tag.name);
      }
    }
    return;
  }
  // If the imported data is a list of bookmarks, check if each bookmark already exists.
  await markBookmarkExists(importedData);
} */

/**
 * Checks if each bookmark and its associated tags exist in the database and updates their `importExists` property.
 *
 * @param bookmarks - An array of bookmarks to check for existence.
 * @returns A promise that resolves when the existence check is complete.
 */
/* export async function markBookmarkExists(bookmarks: IBookmark[]) {
  for (const bookmark of bookmarks) {
    bookmark.importExists = !!await Bookmark.exists(bookmark.id);
    for (const tag of bookmark.tags) {
      tag.importExists = !!await Tag.exists(tag.name);
    }
  }
}
 */
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
    if (!item || (item.importType !== "bookmark" && item.importType !== "category"))
      return false;
  }
  return isCategories(data) || isBookmarks(data);
}

/**
 * Handles the import of data by determining the appropriate handler based on the data type.
 *
 * @param data - The data to be imported, which can be of various types.
 * @param setData - A React state setter function to update the state with the imported data.
 * @returns The result of the appropriate import handler function.
 */
/* export function getImportHandler(data: ImportData, setData: React.Dispatch<React.SetStateAction<ICategory[]>>) {
  if (isCategoryArray(data))
    return importCategoriesHandler(data, setData);
  return importBookmarksHandler(data, setData);
} */

export function isBookmarks(data: unknown): data is IBookmark[] {
  const data_ = data as IBookmark[];
  const compulsoryProps = ["id", "title", "url", "created_at", "updated_at", "tags"];

  if (!Array.isArray(data_)) return false; // should be an array

  for (const datum of data_) {
    for (const prop of compulsoryProps) {
      const value = datum[prop as keyof IBookmark];
      if (value === undefined || value === null) return false; // should not be null or undefined
      if (typeof value !== "string") {
        if (prop === "tags") // tags array here
          if ((isTags(value))) continue;
        return false; // must be a string or an array
      } // must be a string or an array
      if (prop === "url" && !value.startsWith("http")) // url must start with http
        return false;

      if (prop === "created_at" || prop === "updated_at")
        if (isNaN((new Date(value)).getTime())) return false;
    }
  }

  return true;
}

export function isTags(data: unknown): data is ITag[] {
  const data_ = data as ITag[];
  const compulsoryProps = ["id", "name", "created_at", "updated_at"];
  if (!Array.isArray(data_)) return false; // should be an array
  for (const datum of data_) {
    for (const prop of compulsoryProps) {
      const value = datum[prop as keyof ITag];
      if (value === undefined || value === null) return false; // should not be null or undefined
      if (typeof value !== "string") return false; // must be a string
      if (prop === "name" && (value as string).length < 3) return false; // name be min of 3 chars
      if (prop === "created_at" || prop === "updated_at")
        if (isNaN((new Date(value as string)).getTime())) return false;
    }
  }
  return true;
}

export function isCategories(data: unknown): data is ICategory[] {
  const data_ = data as ICategory[];
  const compulsoryProps = ["id", "name", "is_default", "created_at", "updated_at", "bookmarks", "tags"];

  if (!Array.isArray(data_)) return false; // should be an array

  for (const datum of data_) {
    for (const prop of compulsoryProps) {
      const value = datum[prop as keyof ICategory];

      if (value === undefined || value === null) return false; // should not be null or undefined

      if (typeof value !== "string" && typeof value !== "number") { // be a string, number or an array
        if (prop === "tags") { // tags array here
          if ((isTags(value))) continue;
          return false;
        }

        if (!(isBookmarks(value))) return false; // bookarks array here
      }
      if (prop === "is_default" && value !== 0 && value !== 1)
        return false; // is_default must be either 0 or 1
      if (typeof value === "number" && prop !== "is_default") return false; // is_default must be a number
      if (prop === "name" && (value as string).length < 3) return false; // name be min of 3 chars
      if (prop === "created_at" || prop === "updated_at")
        if (isNaN((new Date(value as string)).getTime())) return false;
    }
  }
  return true;
}

/* export function markImportType(data: ImportData) {
  if (isCategories(data)) {
    data.forEach((category) => {
      category.importType = "category";
      category.bookmarks.forEach((bookmark) => {
        bookmark.importType = "bookmark";
      });
    });
  } else {
    data.forEach((bookmark) => {
      bookmark.importType = "bookmark";
    });
  }
} */
