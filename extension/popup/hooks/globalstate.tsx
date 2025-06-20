import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { IBMM, IBookmark, ICategory, ITag, TFilters } from "../utils/types/schemas";

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
  setAllCategories(next: ICategory[] | ((prev: ICategory[]) => ICategory[])): void

  filteredBookmarks: IBookmark[];
  setFilteredBookmarks: (bookmarks: IBookmark[]) => void;
  getFilteredBookmarks: () => IBookmark[];

  allProperties: IBMM;
  getAllProperties: () => IBMM;
  setAllProperties: Dispatch<SetStateAction<IBMM>>;

  bmm: IBMM;
  getBmm(): IBMM;
  setBmm(next: IBMM | ((prev: IBMM) => IBMM)): void;

  feedAllStateComponents(state: IBMM): void;
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

    allProperties: {
      bookmarks: [],
      bookmarkObjects: {},
      tagObjects: {},
      tags: [],
      categories: [],
      categoryObjects: {},
      unlinked: {
        categories: [],
        tags: []
      }
    },
    bmm: {
      bookmarks: [],
      bookmarkObjects: {},
      tagObjects: {},
      tags: [],
      categories: [],
      categoryObjects: {},
      unlinked: {
        categories: [],
        tags: []
      }
    },
    allCategories: [],

    getBmm() {
      return get().bmm;
    },
    setBmm(bmm: SetStateAction<IBMM>) {
      set(function (state: IState) {

        if (typeof bmm === "function") {
          get().feedAllStateComponents(bmm(state.bmm));
          return { ...state, bmm: bmm(state.bmm) };
        }

        get().feedAllStateComponents(bmm);
        return { ...state, bmm };
      });
    },

    getAllProperties() {
      return get().allProperties;
    },

    setAllCategories(categories: SetStateAction<ICategory[]>) {
      set(function (state) {

        if (typeof categories === 'function')
          return { allCategories: categories(state.allCategories) };

        return { allCategories: categories };
      });
    },

    // All data parts needing properties will be fed here upon properties update
    feedAllStateComponents(bmm: IBMM): void {
      get().setAllCategories(getAllCategories(bmm));
    },

    // sets up an all properties object. This objects makes things faster
    setAllProperties(bmm: SetStateAction<IBMM>) {
      set(function (state) {

        if (typeof bmm === 'function') {
          get().feedAllStateComponents(bmm(state.allProperties));
          return { allProperties: bmm(state.allProperties) };
        }

        get().feedAllStateComponents(bmm);
        return { allProperties: bmm };
      });
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
      set(function (state) {
        return { data: typeof data === 'function' ? data(state.data) : data };
      });
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

// Category Related functions
export function getAllCategories(bmm: IBMM): ICategory[] {
  return bmm.categories.map((categoryId: string) => bmm.categoryObjects[categoryId]);
}
export function getCategoryTags(bmm: IBMM, categoryId: string): ITag[] {
  return bmm.tags.map((tagId) => bmm.tagObjects[tagId])
    .filter((tag) => tag.categoryIds.includes(categoryId));
}
export function getCategoryBookmarks(bmm: IBMM, categoryId: string): IBookmark[] {
  return bmm.bookmarks.map((bookmarkId) => bmm.bookmarkObjects[bookmarkId])
    .filter((bookmark) => bookmark.categoryIds.includes(categoryId));
}


export function getAllTags(bmm: IBMM): ITag[] {
  return bmm.tags.map((tagId: string) => bmm.tagObjects[tagId]);
}

export function getAllBookmarks(bmm: IBMM): IBookmark[] {
  return bmm.bookmarks.map((bookmarkId: string) => bmm.bookmarkObjects[bookmarkId]);
}
export function getBookmarkCategories(bmm: IBMM, bookmarkId: string): ICategory[] {
  return bmm.categories.map((categoryId) => bmm.categoryObjects[categoryId])
    .filter((category) => category.bookmarkIds.includes(bookmarkId));
}
export function getBookmarkTags(bmm: IBMM, bookmarkId: string): ITag[] {
  return bmm.tags.map((tagId) => bmm.tagObjects[tagId])
    .filter((tag) => tag.bookmarkIds.includes(bookmarkId));
}
