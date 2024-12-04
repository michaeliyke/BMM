import { Dispatch, SetStateAction } from "react";
import {
    IBookmark,
    ICategory,
    ITag,
    IBookmarkTag,
    ICategoryBookmark,
    ICategoryTag,
} from "./schemas";
// BookMark Interface
export type TBookmark = IBookmark;

// ICategory interface
export type TCategory = ICategory;

// ITag interface
export type TTag = ITag;

// ICategoryBookmark interface
export type TCategoryBookmark = ICategoryBookmark;

// IBookmarkTag interface
export type TBookmarkTag = IBookmarkTag;

// ICategoryTag interface
export type TCategoryTag = ICategoryTag;

export interface IDataContext {
    defaultCategory: TCategory;
    setDefaultCategory: Dispatch<SetStateAction<TCategory>>;
}
