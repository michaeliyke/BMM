// Types store for component props
import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "./schemas";
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
    props: {
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
    };
};


export type SideBarHeaderProps = {
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
};

