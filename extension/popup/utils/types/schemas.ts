
import { Dispatch, SetStateAction } from "react";

/**
 * @description: Following file contains the interfaces for the data schemas
 */
export interface IUser {
  id: string;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
};

/**
 * A Tag object
 */
export interface ITag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  categoryIds: string[];
  bookmarkIds: string[];

  importExists?: boolean;
};

/**
 * A Category object
 */
export interface ICategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  bookmarkIds: string[];
  tagIds: string[];

  importType?: 'category' | 'bookmark';
  importExists?: boolean;
  is_default?: number; // 0 or 1 Only the dummy default category should have it set
};

/**
 * A Bookmark object
 */
export interface IBookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  created_at: string;
  updated_at: string;
  categoryIds: string[];
  tagIds: string[];
  // Optional properties set as needed
  importType?: 'category' | 'bookmark';
  importExists?: boolean;
  archived?: number; // 0 or 1
  deleted?: number; // 0 or 1
  starred?: number; // 0 or 1
};

/**
 * A generic map of entity IDs to corresponding values.
 *
 * Used within main BMM object to efficiently access, update, or remove
 * items by ID. Commonly used for objects like bookmarks, tags, or categories.
 *
 * @template T - The type of the value being mapped (e.g., IBookmark, ITag, etc).
 */
export type IDMap<T> = { [ID: string]: T };

/**
 * Zustand-compatible state setter type for partial or full updates.
 *
 * This function signature allows updating Zustand state using:
 * - A full or partial object
 * - A function that receives the previous state and returns a full or partial update
 * - An optional `replace` flag that determines whether to merge or fully replace state
 *
 * @template T - The shape of the state being managed.
 */
export type TState<T> = {
  (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: false,
  ): void;

  (
    state: T | ((state: T) => T),
    replace: true,
  ): void;
}

/**
 * Zustand-compatible state getter type.
 *
 * Returns the current full state of the store at the point of invocation.
 * Typically used within a slice to access current state values before updating.
 *
 * @template T - The shape of the state being retrieved.
 */
export type TStateGet<T> = () => T;

/**
 * Main BMM app object holding all state and data
 */
export interface IBMM {
  bookmarks: string[]; /* ID strings references only */
  bookmarkObjects: IDMap<IBookmark>;

  tagObjects: IDMap<ITag>;
  tags: string[]; /* ID strings references only */

  categories: string[]; /* ID strings references only */
  categoryObjects: IDMap<ICategory>;

  unlinked: { categories: string[]; tags: string[] };
}

export type ImportData = ICategory[] | IBookmark[];

// All Data Adapters should implement the following interface
export interface IDATA {
  exists(): Promise<boolean>;
};

export interface IDataContext {
  defaultCategory: ICategory;
  setDefaultCategory: Dispatch<SetStateAction<ICategory>>;
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
}

export interface IDeletedBookmark {
  created_at: string;
  updated_at: string;
  deleted_at: string;
  tag_ids: string;
  category_ids: string;
  note_ids: string;
  id: string;
  bookmark_id: string;
  title: string;
  url: string;
  description: string;
}

/**
 * Various side bar selectable filters
 */
export type TFilters = "filter:categories"
  | "filter:bookmarks"
  | "filter:tags"
  | "filter:category/tags"
  | "filter:category/bookmarks"
  | "filter:bookmark/tags"
  | "filter:bookmark/categories"
  | "filter:favorites"
  | "filter:archived"
  | "filter:deleted"
  ;

export interface ITab {
  checked: boolean;
  id: number;
  title: string;
  url: string;
  favIconUrl: string;
  windowId: number;
  pinned: boolean;
  active: boolean;
  highlighted: boolean;
  incognito: boolean;
  status: string;
  index: number;
  width: number;
  height: number;
  sessionId?: string;
};
