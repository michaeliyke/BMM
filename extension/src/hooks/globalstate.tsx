import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { IBookmark, ICategory, ITag, TFilters } from "../utils/types/schemas";

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
  defaultCategory: ICategory;
  setDefaultCategory: (category: ICategory) => void;

  filteredCategories: ICategory[];
  setFilteredCategories: (categories: ICategory[]) => void;
  bookmarks: IBookmark[];
  setBookmarks: (bookmarks: IBookmark[] | ((bookmarks: IBookmark[]) => IBookmark[])) => void;
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
  filteredBookmarks: IBookmark[];
  setFilteredBookmarks: (bookmarks: IBookmark[]) => void;
}

type TState = {
  (partial: IState | Partial<IState> | ((state: IState) => IState | Partial<IState>), replace?: false): void;
  (state: IState | ((state: IState) => IState), replace: true): void;
}

/**
 * Zustand store for managing application state.
 *
 * @param {TState} set - The function to update the state.
 * @returns {IState} The initial state and functions to update it.
 */
function stateInitializer(set: TState): IState {
  return {
    headerForm: false,
    filterBy: "filter:categories",
    query: "",
    selectedTag: null,
    grouping: "",
    bookmarkToShow: null,
    selectedCategory: null,
    defaultCategory: {
      id: 'dummy-id',
      name: 'No Category Selected',
      is_default: 0,
      created_at: (new Date()).toUTCString(),
      updated_at: (new Date()).toUTCString(),
      tags: [],
      bookmarks: []
    },
    filteredCategories: [],
    bookmarks: [],
    data: [],
    filteredBookmarks: [],


    setFilteredCategories(categories: ICategory[]) {
      set({ filteredCategories: categories });
    },

    setFilteredBookmarks(bookmarks: IBookmark[]) {
      set({ filteredBookmarks: bookmarks });
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

    setDefaultCategory(category: ICategory) {
      set({ defaultCategory: category });
    },

    setBookmarkToShow(bookmark: IBookmark | null) {
      set({ bookmarkToShow: bookmark });
    },

    setSelectedCategory(value: ICategory | null) {
      set({ selectedCategory: value });
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

/*
  const [grouping, setGrouping] = useState(
    (selectedCategory || defaultCategory).name +
    (selectedTag ? ` # ${selectedTag.name}` : '')
  ); */
