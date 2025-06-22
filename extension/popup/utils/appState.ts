/**
 * @fileoverview Provides utility functions for managing and querying bookmark manager state
 * Contains functions for retrieving categories, tags, and bookmarks from the BMM state
 */

import { IBMM, IBookmark, ICategory, ITag } from "./types/schemas";

/**
 * Retrieves all categories from the bookmark manager state
 * @param {IBMM} bmm - The bookmark manager state object
 * @returns {ICategory[]} Array of all category objects
 */
export function getAllCategories(bmm: IBMM): ICategory[] {
  return bmm.categories.map((categoryId: string) => bmm.categoryObjects[categoryId]);
}

/**
 * Gets all tags associated with a specific category
 * @param {IBMM} bmm - The bookmark manager state object
 * @param {string} categoryId - ID of the category to get tags for
 * @returns {ITag[]} Array of tag objects belonging to the category
 */
export function getCategoryTags(bmm: IBMM, categoryId: string): ITag[] {
  return bmm.tags.map((tagId) => bmm.tagObjects[tagId])
    .filter((tag) => tag.categoryIds.includes(categoryId));
}

/**
 * Gets all bookmarks associated with a specific category
 * @param {IBMM} bmm - The bookmark manager state object
 * @param {string} categoryId - ID of the category to get bookmarks for
 * @returns {IBookmark[]} Array of bookmark objects belonging to the category
 */
export function getCategoryBookmarks(bmm: IBMM, categoryId: string): IBookmark[] {
  return bmm.bookmarks.map((bookmarkId) => bmm.bookmarkObjects[bookmarkId])
    .filter((bookmark) => bookmark.categoryIds.includes(categoryId));
}

/**
 * Retrieves all tags from the bookmark manager state
 * @param {IBMM} bmm - The bookmark manager state object
 * @returns {ITag[]} Array of all tag objects
 */
export function getAllTags(bmm: IBMM): ITag[] {
  return bmm.tags.map((tagId: string) => bmm.tagObjects[tagId]);
}

/**
 * Retrieves all bookmarks from the bookmark manager state
 * @param {IBMM} bmm - The bookmark manager state object
 * @returns {IBookmark[]} Array of all bookmark objects
 */
export function getAllBookmarks(bmm: IBMM): IBookmark[] {
  return bmm.bookmarks.map((bookmarkId: string) => bmm.bookmarkObjects[bookmarkId]);
}

/**
 * Gets all categories associated with a specific bookmark
 * @param {IBMM} bmm - The bookmark manager state object
 * @param {string} bookmarkId - ID of the bookmark to get categories for
 * @returns {ICategory[]} Array of category objects that contain the bookmark
 */
export function getBookmarkCategories(bmm: IBMM, bookmarkId: string): ICategory[] {
  return bmm.categories.map((categoryId) => bmm.categoryObjects[categoryId])
    .filter((category) => category.bookmarkIds.includes(bookmarkId));
}

/**
 * Gets all tags associated with a specific bookmark
 * @param {IBMM} bmm - The bookmark manager state object
 * @param {string} bookmarkId - ID of the bookmark to get tags for
 * @returns {ITag[]} Array of tag objects associated with the bookmark
 */
export function getBookmarkTags(bmm: IBMM, bookmarkId: string): ITag[] {
  return bmm.tags.map((tagId) => bmm.tagObjects[tagId])
    .filter((tag) => tag.bookmarkIds.includes(bookmarkId));
}
