import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag, TFilters, TState } from "../utils/types/schemas";

export interface IAction {
  headerForm: boolean;
  setHeaderForm: Dispatch<SetStateAction<boolean>>;

  filterBy: TFilters;
  setFilterBy: Dispatch<SetStateAction<TFilters>>;

  query: string;
  setQuery: Dispatch<SetStateAction<string>>;

  selectedTag: ITag | null;
  setSelectedTag: Dispatch<SetStateAction<ITag | null>>;

  grouping: string;
  setGrouping: Dispatch<SetStateAction<string>>;

  bookmarkToShow: IBookmark | null;
  setBookmarkToShow: Dispatch<SetStateAction<IBookmark | null>>;

  selectedCategory: ICategory | null;
  setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;

  filteredCategories: ICategory[];
  setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;

  filteredBookmarks: IBookmark[];
  setFilteredBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
}


/**
 * Zustand slice for managing UI-driven state and user actions.
 *
 * This slice contains reactive flags and filters tied to user interaction, such as
 * query inputs, tag/category selections, visibility flags, and filtered views.
 *
 * These values are typically transient and driven by user intent during sessions.
 *
 * @param set - Zustand's `set` function to update the action state.
 * @returns A partial state object implementing the `IAction` interface.
 */
export default function action(set: TState<IAction>): IAction {
  return {
    filteredCategories: [],
    setFilteredCategories(categories: SetStateAction<ICategory[]>) {
      set(function (state) {
        return typeof categories === "function"
          ? { ...state, filteredCategories: categories(state.filteredCategories) }
          : { ...state, filteredCategories: categories };
      });
    },

    filteredBookmarks: [],
    setFilteredBookmarks(bookmarks: SetStateAction<IBookmark[]>) {
      set(function (state) {
        return typeof bookmarks === "function"
          ? { ...state, filteredBookmarks: bookmarks(state.filteredBookmarks) }
          : { ...state, filteredBookmarks: bookmarks };
      });
    },

    bookmarkToShow: null,
    setBookmarkToShow(bookmark: SetStateAction<IBookmark | null>) {
      set(function (state) {
        return typeof bookmark === "function"
          ? { ...state, bookmarkToShow: bookmark(state.bookmarkToShow) }
          : { ...state, bookmarkToShow: bookmark };
      });
    },

    selectedCategory: null,
    setSelectedCategory(category: SetStateAction<ICategory | null>) {
      set(function (state) {
        return typeof category === "function"
          ? { ...state, selectedCategory: category(state.selectedCategory) }
          : category?.is_default === 1 /* If default category quit */
            ? { ...state, selectedCategory: null }
            : { ...state, selectedCategory: category }
      });
    },

    selectedTag: null,
    setSelectedTag(tag: SetStateAction<ITag | null>) {
      set(function (state) {
        return typeof tag === "function"
          ? { ...state, selectedTag: tag(state.selectedTag) }
          : { ...state, selectedTag: tag };
      });
    },

    grouping: "",
    setGrouping(grouping: SetStateAction<string>) {
      set(function (state) {
        return typeof grouping === "function"
          ? { ...state, grouping: grouping(state.grouping) }
          : { ...state, grouping: grouping };
      });
    },

    headerForm: false,
    setHeaderForm(bool: SetStateAction<boolean>) {
      set(function (state) {
        return typeof bool === "function"
          ? { ...state, headerForm: bool(state.headerForm) }
          : { ...state, headerForm: bool };
      });
    },

    filterBy: "filter:categories",
    setFilterBy(filter: SetStateAction<TFilters>) {
      set(function (state) {
        return typeof filter === "function"
          ? { ...state, filterBy: filter(state.filterBy) }
          : { ...state, filterBy: filter };
      });
    },

    query: "",
    setQuery(query: SetStateAction<string>) {
      set(function (state) {
        return typeof query === "function"
          ? { ...state, query: query(state.query) }
          : { ...state, query: query };
      });
    },
  };
}
