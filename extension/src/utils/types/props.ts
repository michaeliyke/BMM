// For commons types

import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory } from "./schemas";
export type ContentBarProps = {
    data: ICategory[];
    updateCategory?: (category: ICategory) => void;
    selectedCategory: ICategory | null;
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
};

export type BookmarksDisplayProps = {
    categories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
};

export type SideBarProps = {
    categories: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
    updateCategory?: (category: ICategory) => void;
    selectedCategory: ICategory | null;
    setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
    defaultCategory: ICategory;
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
};


