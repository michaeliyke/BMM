import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
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
  setBookmarks: (bookmarks: IBookmark[] | ((prev: IBookmark[]) => IBookmark[])) => void;

  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;

  allCategories: ICategory[];
  setAllCategories(next: ICategory[] | ((prev: ICategory[]) => ICategory[])): void

  tags: ITag[];
  setTags(tags: ITag[] | ((prev: ITag[]) => ITag[])): void

  filteredBookmarks: IBookmark[];
  setFilteredBookmarks: (bookmarks: IBookmark[]) => void;
  getFilteredBookmarks: () => IBookmark[];

  allProperties: IBMM;
  getAllProperties: () => IBMM;
  setAllProperties: Dispatch<SetStateAction<IBMM>>;

  bmm: IBMM;
  getBmm(): IBMM;
  setBmm(next: IBMM | ((prev: IBMM) => IBMM)): void;

  feedAllStateComponents(nextBMM: IBMM | ((prev: IBMM) => IBMM)): void;
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
    tags: [],
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
        const _state = typeof bmm === "function"
          ? { ...state, bmm: bmm(state.bmm) }
          : { ...state, bmm };
        return _state;
      });
    },

    getAllProperties() {
      return get().allProperties;
    },

    setBookmarks(bookmarks: SetStateAction<IBookmark[]>) {
      set(function (state) {
        const _state = typeof bookmarks === "function"
          ? { ...state, bookmarks: bookmarks(state.bookmarks) }
          : { ...state, bookmarks };
        return _state;
      });
    },

    setTags(tags: SetStateAction<ITag[]>): void {
      set(function (state) {
        const _state = typeof tags === "function"
          ? { ...state, tags: tags(state.tags) }
          : { ...state, tags };
        return _state;
      });
    },

    setAllCategories(categories: SetStateAction<ICategory[]>) {
      if (typeof categories !== 'function') {
        return void set({ allCategories: categories });
      }
      set((state) => ({ allCategories: categories(state.allCategories) }));
    },

    // All data parts needing properties will be fed here upon properties update
    feedAllStateComponents(_bmm: SetStateAction<IBMM>): void {
      const bmm = typeof _bmm === "function" ? _bmm(get().bmm) : _bmm;
      get().setBmm(bmm);
      get().setAllCategories(getAllCategories(bmm));
      get().setBookmarks(getAllBookmarks(bmm));
      get().setTags(getAllTags(bmm));
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


/**
 * Zustand store for managing application state.
 *
 * @type {IState}
 */
export const useAppState = create<IState>()(subscribeWithSelector(stateInitializer));

// subscribeWithSelector()
