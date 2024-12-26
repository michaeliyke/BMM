// For commons types

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

