import { Dispatch, SetStateAction } from "react";
import Bookmark from "../data/adapters/bookmark";
import Category from "../data/adapters/category";
import Tag from "../data/adapters/tag";
import { getAllBookmarks, getAllCategories, getAllTags } from "./appState";
import { isEmpty } from "./common";
import { isDateValid, isUUIDValid, uuid4 } from "./common2";
import { log } from "./functional.lib.dev";
import { BMMTypes, BMMTypesStr, IBMM, IBookmark, ICategory, IDMap, ImportData, ITag } from "./types/schemas";

export async function validateImported(d: ImportData) {
  log(d);
}

export function getBookmarks(d: ICategory[]): IBookmark[] {
  log(d);
  return [];
}

export function getImportHandler(d: ImportData, s: Dispatch<SetStateAction<ICategory[]>>) {
  log(d, s);
  return function () { };
}

/**
 * Checks if the whole import {@link bmm} is valid.
 *
 * @param bmm import bmm {@link bmm}
 * @returns {string} Error string of the first check failure to be encountered
 *  or an empty string if data is valid
 */
export function validateImport(bmm: IBMM): string {
  if (!bmm || typeof bmm !== "object")
    return "Data object is null"

  // Check that relevant fields are set properly

  // Bookmarks - there is one ore more bookmarks or no nothing to import
  const unsetProp = isEmpty(["bookmarks", "bookmarkObjects"], bmm);
  if (unsetProp)
    return `Missing field: '${unsetProp}'`;

  // Tags: both tags and tagObjects must exists together
  if (Array.isArray(bmm.tags) && bmm.tags.length > 0)
    if (!bmm.tagObjects || typeof bmm.tagObjects !== "object")
      return "Missing field: 'tagObjects'";

  // Categories
  if (Array.isArray(bmm.categories) && bmm.categories.length > 0)
    if (!bmm.categoryObjects || typeof bmm.categoryObjects !== "object")
      return "Missing field: 'categoryObjects";

  // check bookmarks and bookmark objects
  for (const ID of bmm.bookmarks) {
    if (!(bmm.bookmarkObjects[ID] && validBookmark(bmm, bmm.bookmarkObjects[ID])))
      return `Invalid bookmark: ID ${ID}`;
  }

  // check categories and category objects including unlinked categories
  for (const ID of [...bmm.categories, ...bmm.unlinked.categories]) {
    if (!(bmm.categoryObjects[ID] && validCategory(bmm, bmm.categoryObjects[ID])))
      return `Invalid category: ID ${ID}`;
  }

  // check tags and tag objects including unlinked tags
  for (const ID of [...bmm.tags, ...bmm.unlinked.tags]) {
    if (!(bmm.tagObjects[ID] && validTag(bmm, bmm.tagObjects[ID])))
      return `Invalid tag: ID ${ID}`;
  }

  return "";
}

/**
 * Validates if the properties of a tag are valid:
 * @example
 * ```ts
 * interface tag {
*  id: string; // non empty string
*  name: string; // non empty string
*  created_at: string; // empty or a date eg 2024-7-24 15:30
*  updated_at: string; // empty or a date eg 2024-7-24 15:30
*  categoryIds: string[]; // omit, or array of connected category IDs
*  bookmarkIds: string[]; // omit, or array of connected bookmark IDs
 *
 * importID?: string; // omit this field. It will be auto-generated.
 * }
 * ```
 *
 * @returns a boolean showing if a tag is valid
 */
export function validTag(bmm: IBMM, t: ITag) {

  switch (true) {
    case t.id.length < 1: return false;
    case t.name.length < 1: return false;
    case t.created_at && !isDateValid(t.created_at): return false;
    case t.updated_at && !isDateValid(t.updated_at): return false;
  }

  // Here I need to guarantee that referenced objects exist
  if (t.bookmarkIds && t.bookmarkIds.length !== 0)
    if (!refsExist(bmm.bookmarkObjects, t.bookmarkIds)) return false;

  // Here I need to guarantee that referenced objects exist
  if (t.categoryIds && t.categoryIds.length !== 0)
    if (!refsExist(bmm.categoryObjects, t.categoryIds)) return false;

  return true;
}

/**
 * Validates if the properties of a category are valid:
 * @example
 * ```ts
 * interface ICategory {
 *  id: string; // mandatory
 *  name: string; // mandatory
 *  created_at: string; //optional
 *  updated_at: string; //optional
 *  bookmarkIds: string[]; //optional
 *  tagIds: string[]; //optional

 *  importID?: string; // Auto-generated
 *  is_default?: number; // 0 or 1 DO NOT SET THIS
 * }
 * ```
 * @returns a boolean showing if a category is valid
 */
export function validCategory(bmm: IBMM, b: ICategory) {
  switch (true) {
    case b.id.length < 1: return false;
    case b.name.length < 1: return false;
    case b.created_at && !isDateValid(b.created_at): return false;
    case b.updated_at && !isDateValid(b.updated_at): return false;
  }

  // Here I need to guarantee that referenced objects exist
  if (b.tagIds && b.tagIds.length !== 0)
    if (!refsExist(bmm.bookmarkObjects, b.tagIds)) return false;

  // Here I need to guarantee that referenced objects exist
  if (b.bookmarkIds && b.bookmarkIds.length !== 0)
    if (!refsExist(bmm.bookmarkObjects, b.bookmarkIds)) return false;

  return true;
}

/**
 * Validates if the properties of a bookmark are valid:
 * @example
 * ```ts
 * interface IBookmark {
  id: string; // mandatory
  url: string; // mandatory
  title: string; // optional
  description: string; // optional
  created_at: string; // optional
  updated_at: string; // optional
  categoryIds: string[]; // optional
  tagIds: string[]; // optional

  importID?: string; // Auto-generated
  archived?: number; // optional 0 or 1
  deleted?: number; // optional 0 or 1
  starred?: number; // optional 0 or 1
}
 * ```
 *
 * @returns a boolean showing if a bookmark is valid
 */
export function validBookmark(bmm: IBMM, b: IBookmark) {

  switch (true) {
    case b.id.length < 1: return false;
    case b.url.length < 1: return false;
    case b.created_at && !isDateValid(b.created_at): return false;
    case b.updated_at && !isDateValid(b.updated_at): return false;
  }

  // Here I need to guarantee that referenced objects exist
  if (b.tagIds && b.tagIds.length !== 0)
    if (!refsExist(bmm.bookmarkObjects, b.tagIds)) return false;

  // Here I need to guarantee that referenced objects exist
  if (b.categoryIds && b.categoryIds.length !== 0)
    if (!refsExist(bmm.categoryObjects, b.categoryIds)) return false;

  return true;
}

/**
 * Verifies that objects corresponding to a given list of {@link IDs}
 * exist (are not `null` or `undefined`) within the provided {@link IDMap map}.
 *
 * This function performs a strict check for object presence only;
 * it does not inspect the content or validity of the objects themselves.
 * If any {@link ID} does not have a corresponding object in the {@link map},
 * the function immediately returns `false`.
 *
 * @param {IDMap<ICategory | IBookmark | IBookmark>} map - The map object (e.g., `categoryObjects`, `bookmarkObjects`)
 * where keys are string {@link IDs} and values are the associated objects.
 * @param {string[]} IDs - An array of string {@link IDs} to check for existence within the {@link map}.
 * @returns {boolean} `true` if all {@link IDs} in the list have a corresponding non-null object in the {@link map};
 * otherwise, `false`.
 *
 * @example
 * // Scenario 1: All referenced objects exist
 * const categoryMap = {
 * cat1: { id: "cat1", name: "Science" },
 * cat2: { id: "cat2", name: "Fiction" }
 * };
 * const categoryIDs = ["cat1", "cat2"];
 * console.log(refsExist(categoryMap, categoryIDs));
 * // Expected output: true
 *
 * @example
 * // Scenario 2: Some referenced objects are missing
 * const bookmarkMap = {
 * bm1: { id: "bm1", title: "My Article" },
 * bm3: { id: "bm3", title: "Another Link" }
 * };
 * const bookmarkIDs = ["bm1", "bm2", "bm3"]; // "bm2" is missing
 * console.log(refsExist(bookmarkMap, bookmarkIDs));
 * // Expected output: false
 */
export function refsExist(map: IDMap<ICategory | IBookmark | IBookmark>, IDs: string[]) {
  for (const ID of IDs) {
    if (map[ID] == null) return false;
  }
  return true;
}

/**
 * Normalizes the Date to ISO String format and the ID to a UUID
 * This function is pure
 *
 * When data is imported, the ID could be any simple string like "1", "2".
 * Also the Date could be missing, be an empty string or a simple handwritten
 * Date without a timestamp.
 * Also, the user could add extra fields out of curiosity
 *
 * These have already been validated to meet above criteria elsewhere.
 * When Date is missing, generate a new one.
 * When improperly written, regenerate it to include timestamp
 *
 * Creates a new instance of the passed in type to ensure an authentic data record
 *
 * @param d a category, tag, or bookmark
 * @returns - new instance of the type passed
 */
export function normalizeRecord(data: BMMTypes, typeStr: BMMTypesStr) {
  const d = Object.assign({}, data); // This makes the function pure
  // correct ID
  if (isUUIDValid(d.id) === false)
    d.id = uuid4();

  // created_at is improper or missing, correct it
  if (isDateValid(d.created_at))
    d.created_at = (new Date(d.created_at)).toISOString();
  else
    d.created_at = (new Date()).toISOString();

  // updated_at is improper or missing, correct it
  if (isDateValid(d.updated_at))
    d.updated_at = (new Date(d.updated_at)).toISOString();
  else
    d.updated_at = (new Date()).toISOString();

  // Crucial - recreate the type to drop any irrelevant details
  switch (typeStr) {
    case "bookmark": return new Bookmark(d as IBookmark);
    case "category": return new Category(d as ICategory)
    default: return new Tag(d as ITag);
  }
}

/**
   * Ensures fields integrity for each record for consistency
   *
   * @param {IBMM} bmm The {@link IBMM} data being uploaded
   */
export function ensureDataIntegrity(bmm: IBMM) {
  for (const b of getAllBookmarks(bmm))
    bmm.bookmarkObjects[b.id] = normalizeRecord(b, "bookmark") as IBookmark;

  for (const c of getAllCategories(bmm))
    bmm.categoryObjects[c.id] = normalizeRecord(c, "category") as ICategory;

  for (const tag of getAllTags(bmm))
    bmm.tagObjects[tag.id] = normalizeRecord(tag, "tag") as ITag;

  return bmm;
}
