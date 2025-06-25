import { Dispatch, SetStateAction } from "react";
import { getAllBookmarks, getCategoryBookmarks, getTagBookmarks } from "../utils/appState";
import { IBookmark, ICategory, ITag, TFilters, TState, TStateGet } from "../utils/types/schemas";
import { IPayload } from "./payload";

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
export default function action(set: TState<IAction>, get: TStateGet<IAction & IPayload>): IAction {
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
    setSelectedCategory(cat: SetStateAction<ICategory | null>) {
      set(function (state) {
        const category = typeof cat === "function" ? cat(state.selectedCategory) : cat;

        // null should be used to reset category selection
        if (!category) {
          get().setBookmarks(getAllBookmarks(get().bmm));
          return { ...state, selectedCategory: null };
        }

        if (category.is_default === 1) {
          get().setBookmarks(getAllBookmarks(get().bmm));
          return { ...state, selectedCategory: null };
        }

        get().setBookmarks(getCategoryBookmarks(get().bmm, category.id));
        return { ...state, selectedCategory: category };
      });
    },

    selectedTag: null,
    setSelectedTag(tag: SetStateAction<ITag | null>) {
      set(function (state) {
        const _tag = typeof tag === "function" ? tag(state.selectedTag) : tag;

        // null should be used to reset tag selection
        if (!_tag) {
          get().setBookmarks(getAllBookmarks(get().bmm));
          return { ...state, selectedTag: null };
        }

        get().setBookmarks(getTagBookmarks(get().bmm, _tag.id));
        return { ...state, selectedTag: _tag };
      });
    },

    grouping: "",
    setGrouping(grouping: SetStateAction<string>) {
      if (!grouping) // Empty string
        return;
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
