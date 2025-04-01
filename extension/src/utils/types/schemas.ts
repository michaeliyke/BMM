
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
};

export interface ICategory {
  importType?: 'category' | 'bookmark';
  importExists?: boolean;
  id: string;
  name: string;
  is_default: number; // 0 or 1
  created_at: string;
  updated_at: string;
  bookmarks: IBookmark[];
  tags: ITag[];
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
  tags: ITag[];
  archived: number; // 0 or 1
  starred?: number; // 0 or 1
};

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
