/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { v4, Version4Options } from "uuid";
import { IBookmark, ICategory } from "./types/schemas";

export function uuid4(options?: Version4Options, buf?: undefined, offset?: number) {
  return v4(options, buf, offset);
}

export function adaptedCategory(_category: ICategory) {
  const category = Object.assign({}, _category);
  category.bookmarks = [];
  category.tags = [];
  return category;
}

export function adaptedBookmark(_bookmark: IBookmark) {
  const bookmark = Object.assign({}, _bookmark);
  bookmark.categories = [];
  bookmark.tags = [];
  return bookmark;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
}
export function safeJsonParse(str: string, fallback = {}) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function debounce(func: Function, delay = 300): Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
