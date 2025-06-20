
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

export interface ITag {
  importExists?: boolean;
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  categoryIds: string[];
  bookmarkIds: string[];
};

export interface ICategory {
  importType?: 'category' | 'bookmark';
  importExists?: boolean;
  id: string;
  name: string;
  is_default: number; // 0 or 1
  created_at: string;
  updated_at: string;
  bookmarkIds: string[];
  tagIds: string[];
};

export interface IBookmark {
  importType?: 'category' | 'bookmark';
  importExists?: boolean;
  id: string;
  title: string;
  url: string;
  description: string;
  created_at: string;
  updated_at: string;
  archived: number; // 0 or 1
  starred?: number; // 0 or 1
  categoryIds: string[];
  tagIds: string[];
};

// A map of IDs to a type.
export type IDMap<T> = { [ID: string]: T };

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


export interface ICategoryBookmark {
  id: string;
  category_id: string;
  bookmark_id: string;
};

export interface ICategoryTag {
  id: string;
  category_id: string;
  tag_id: string;
};

export interface IBookmarkTag {
  id: string;
  bookmark_id: string;
  tag_id: string;
};

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

// Various side bar selectable filters
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
