import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { IBookmark, IBookmarkObjects, ICategory, ITag, TFilters } from "../utils/types/schemas";

interface IState {
  headerForm: boolean;
  setHeaderForm: (value: boolean) => void;

  filterBy: TFilters;
  setFilterBy: (value: TFilters) => void;

  query: string;
  setQuery: (value: string) => void;

  selectedTag: ITag | null;
  setSelectedTag: (value: ITag | null) => void;

  grouping: string;
  setGrouping: (value: string) => void;

  bookmarkToShow: IBookmark | null;
  setBookmarkToShow: (bookmark: IBookmark | null) => void;

  selectedCategory: ICategory | null;
  setSelectedCategory: (value: ICategory | null) => void;
  getSelectedCategory: () => ICategory | null;

  filteredCategories: ICategory[];
  setFilteredCategories: (categories: ICategory[]) => void;
  getFilteredCategories: () => ICategory[];

  bookmarks: IBookmark[];
  setBookmarks: (bookmarks: IBookmark[] | ((bookmarks: IBookmark[]) => IBookmark[])) => void;

  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;

  allCategories: ICategory[];
  setAllCategories: Dispatch<SetStateAction<ICategory[]>>;

  filteredBookmarks: IBookmark[];
  setFilteredBookmarks: (bookmarks: IBookmark[]) => void;
  getFilteredBookmarks: () => IBookmark[];

  allProperties: IBookmarkObjects;
  getAllProperties: () => IBookmarkObjects;
  setAllProperties: Dispatch<SetStateAction<IBookmarkObjects>>;

}

type TState = {
  (partial: IState | Partial<IState> | ((state: IState) => IState | Partial<IState>), replace?: false): void;
  (state: IState | ((state: IState) => IState), replace: true): void;
}

type TStateGet<T> = () => T;

/**
 * Zustand store for managing application state.
 *
 * @param {TState} set - The function to update the state.
 * @returns {IState} The initial state and functions to update it.
 */
function stateInitializer(set: TState, get: TStateGet<IState>): IState {
  return {
    headerForm: false,
    filterBy: "filter:categories",
    query: "",
    selectedTag: null,
    grouping: "",
    bookmarkToShow: null,

    selectedCategory: null,
    filteredCategories: [],
    bookmarks: [],
    data: [],
    filteredBookmarks: [],

    allProperties: {},
    allCategories: [],

    getAllProperties() {
      return get().allProperties;
    },

    setAllCategories(categories: SetStateAction<ICategory[]>) {
      set((state) => ({
        allCategories: typeof categories === 'function'
          ? (categories as (prev: ICategory[]) => ICategory[])(state.allCategories)
          : categories,
      }));
    },

    setAllProperties(props: SetStateAction<IBookmarkObjects>) {
      set((state) => ({
        allProperties: typeof props === 'function'
          ? (props as (prev: IBookmarkObjects) => IBookmarkObjects)(state.allProperties)
          : props,
      }));
    },

    setFilteredCategories(categories: ICategory[]) {
      set({ filteredCategories: categories });
    },
    getFilteredCategories() {
      return get().filteredCategories;
    },

    setFilteredBookmarks(bookmarks: IBookmark[]) {
      set({ filteredBookmarks: bookmarks });
    },
    getFilteredBookmarks() {
      return get().filteredBookmarks;
    },

    setBookmarks(bookmarks: IBookmark[] | ((bookmarks: IBookmark[]) => IBookmark[])) {
      // Use a map to ensure that the bookmarks are unique
      const uniqueBookmarks = new Map<string, IBookmark>();
      function unique(bookmark: IBookmark) {
        if (bookmark.archived === 1 || uniqueBookmarks.has(bookmark.id)) {
          return false;
        }
        uniqueBookmarks.set(bookmark.id, bookmark);
        return true;
      }

      if (Array.isArray(bookmarks)) {
        set({ bookmarks: bookmarks.filter(unique) });
      } else {
        set((state) => {
          return { bookmarks: bookmarks(state.bookmarks).filter(unique) };
        });
      }
    },

    setData(data: SetStateAction<ICategory[]>) {
      set((state) => ({
        data: typeof data === 'function'
          ? (data as (prev: ICategory[]) => ICategory[])(state.data)
          : data,
      }));
    },

    setBookmarkToShow(bookmark: IBookmark | null) {
      set({ bookmarkToShow: bookmark });
    },

    getSelectedCategory() {
      return get().selectedCategory;
    },

    setSelectedCategory(category: ICategory | null) {
      if (category?.is_default === 1) /* If default category quit */
        return void set({ selectedCategory: null });
      set({ selectedCategory: category });
    },

    setSelectedTag(value: ITag | null) {
      set({ selectedTag: value });
    },

    setGrouping(value: string) {
      set({ grouping: value });
    },

    setHeaderForm(value: boolean) {
      set({ headerForm: value });
    },

    setFilterBy(value: TFilters) {
      set({ filterBy: value });
    },

    setQuery(value: string) {
      set({ query: value });
    },
  };
}

/**
 * Zustand store for managing application state.
 *
 * @type {IState}
 */
export const useAppState = create<IState>(stateInitializer);

export function getAllCategories(allProperties: IBookmarkObjects) {
  return Object.values(allProperties).flatMap(v => v.categories);
}
