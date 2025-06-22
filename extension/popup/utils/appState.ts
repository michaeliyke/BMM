import { IBMM, ICategory, ITag, IBookmark } from "./types/schemas";

// Category Related functions
export function getAllCategories(bmm: IBMM): ICategory[] {
  return bmm.categories.map((categoryId: string) => bmm.categoryObjects[categoryId]);
}
export function getCategoryTags(bmm: IBMM, categoryId: string): ITag[] {
  return bmm.tags.map((tagId) => bmm.tagObjects[tagId])
    .filter((tag) => tag.categoryIds.includes(categoryId));
}
export function getCategoryBookmarks(bmm: IBMM, categoryId: string): IBookmark[] {
  return bmm.bookmarks.map((bookmarkId) => bmm.bookmarkObjects[bookmarkId])
    .filter((bookmark) => bookmark.categoryIds.includes(categoryId));
}


export function getAllTags(bmm: IBMM): ITag[] {
  return bmm.tags.map((tagId: string) => bmm.tagObjects[tagId]);
}

export function getAllBookmarks(bmm: IBMM): IBookmark[] {
  return bmm.bookmarks.map((bookmarkId: string) => bmm.bookmarkObjects[bookmarkId]);
}
export function getBookmarkCategories(bmm: IBMM, bookmarkId: string): ICategory[] {
  return bmm.categories.map((categoryId) => bmm.categoryObjects[categoryId])
    .filter((category) => category.bookmarkIds.includes(bookmarkId));
}
export function getBookmarkTags(bmm: IBMM, bookmarkId: string): ITag[] {
  return bmm.tags.map((tagId) => bmm.tagObjects[tagId])
    .filter((tag) => tag.bookmarkIds.includes(bookmarkId));
}
