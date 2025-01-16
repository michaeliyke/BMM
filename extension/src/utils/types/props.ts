// Types store for component props
import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "./schemas";


export type SearchWidgetProps = {
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    grouping: string;
}

export type ContentHeaderProps = {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
    updateCategory?: (category: ICategory) => void;
    selectedCategory: ICategory | null;
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
    selectedTag?: ITag | null;
    setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
    grouping: string;
};


export type SideBarProps = {
    props: {
        bookmarks: IBookmark[];
        setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
        filteredCategories: ICategory[];
        setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
        categories: ICategory[];
        setData: Dispatch<SetStateAction<ICategory[]>>;
        updateCategory?: (category: ICategory) => void;
        selectedCategory: ICategory | null;
        setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
        defaultCategory: ICategory;
        bookmarkToShow: IBookmark | null;
        setBookmarkToShow: (bookmark: IBookmark | null) => void;
        filterBy?: string;
        setFilterBy?: Dispatch<SetStateAction<string>>;
        selectedTag?: ITag | null;
        setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
        setGrouping?: Dispatch<SetStateAction<string>>;
        query: string;
        setQuery: Dispatch<SetStateAction<string>>;
    };
};


export type SideBarHeaderProps = {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
    categories: ICategory[];
    selectedCategory: ICategory | null;
    setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
    defaultCategory: ICategory;
};

export type HeaderProps = {
    selectedCategory: ICategory | null;
    categories: ICategory[];
    // setData takes in fn, a function that takes in the old state (ICategory[])
    // and returns the new state (ICategory[])
    // setData itself returns void
    setData: (fn: (categories: ICategory[]) => ICategory[]) => void;
    defaultCategory: ICategory;
    grouping: string;
    setGrouping?: Dispatch<SetStateAction<string>>;
    selectedTag?: ITag | null;
    filterBy: string;
};

