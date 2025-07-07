import Bookmark from "../data/adapters/bookmark";
import Category from "../data/adapters/category";
import Tag from "../data/adapters/tag";
import { IBookmark, ICategory, ITag, mimetypes } from "./types/schemas";

export { v7 as uuid, v4 as uuid4, v5 as uuid5, v7 as uuid7 } from "uuid";

/**
 * tells if str is a valid UUID
 * @param str a string
 */
export function isUUIDValid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Tells if a string is empty or a valid date
 * @example
 * Valid Formats:
 * 2024-07-02, July 2, 2024, 02 Jul 2024, 2024-07-02T10:20:30Z, 2024/07/02
 *
 * Invalid: Just just push the month, day, or time off
 * July 35, 2024
 *
 * @param str correct date format string or empty string
 */
export function isDateValid(str: string): boolean {
  return str.trim() === "" || !isNaN((new Date(str)).getTime());
}


/**
 * Promise based: sleeps for {@link ms} number of milliseconds, then do a task after.
 * Use this to delay a task. This task is behind an await call or within the .then()
 * method.
 *
 * @param ms amount of time to sleep in millisconds
 *
 * @example:
 * sleep(1000).then(alert);
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copy a string {@link text} to the clipboard on the browser.
 *
 * @param text string to copy to the clipboard
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
}

/**
 *Safely parses arbitrary JSON string without failing, handles failure quietly

 * @param str JSON string to be parsed
 * @param fallback An empty object showing that parsing has probably failed
 * @returns The object literal or an array object resulting from the parsing
 */
export function safeJsonParse(str: string, fallback = {}) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// export function debounce(func: Function, delay = 300): Function {

//   let timeout: any;

//   return function (...args: any[]) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), delay);
//   };
// }

export function downloadFile(data: string, fileName: string, t: mimetypes) {
  const blob = new Blob([data], { type: t });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Checks if a piece of data is an IBookmark
 */
export function isIBookmark(data: unknown): data is IBookmark {
  try {
    new Bookmark(data as IBookmark);
  } catch {
    return false;
  }
  return true;
}

/**
 * Checks if a piece of data is an ICategory
 */
export function isICategory(data: unknown): data is ICategory {
  try {
    new Category(data as ICategory);
  } catch {
    return false;
  }
  return true;
}

/**
 * Checks if a piece of data is an ITag
 */
export function isITag(data: unknown): data is ITag {
  try {
    new Tag(data as ITag);
  } catch {
    return false;
  }
  return true;
}

/**
  * checks if file has already been imported using uuid5
  * This process uses the file name as a seed with a known uuid as namespace.
  * The generated uuid is compared with existing import IDs in indexedDB.
  * If there's a match, then file has already been imported earlier
  *
  * TODO: This problem about multiple import attempts, let's wait till the issues
  * becomes obvious! We can't solve it correctly until the pain points are clear
  */
// export function makeImportID(ID: string, typeStr: BMMTypeStr, path: string) { }
