import { Dispatch, SetStateAction } from "react";
import { getAllBookmarks, getCategoryBookmarks, getTagBookmarks } from "../utils/appState";
import { IBookmark, ICategory, ITag, TFilters, TState, TStateGet } from "../utils/types/schemas";
import { IPayload } from "./payload";

/**
 * Interface defining the action state and methods for managing UI-driven interactions.
 *
 * This interface encompasses all reactive state properties and their corresponding
 * setter functions that handle user interactions, filtering, and view management
 * within the bookmark management application.
 */
export interface IAction {
  /** Flag indicating whether the header form is currently visible/active */
  headerForm: boolean;
  /** Setter function to toggle the visibility of the header form */
  setHeaderForm: Dispatch<SetStateAction<boolean>>;

  /** Current filter type being applied to the bookmark list */
  filterBy: TFilters;
  /** Setter function to change the active filter type */
  setFilterBy: Dispatch<SetStateAction<TFilters>>;

  /** Current search query string for filtering bookmarks */
  query: string;
  /** Setter function to update the search query */
  setQuery: Dispatch<SetStateAction<string>>;

  /** Currently selected tag for filtering bookmarks, null if no tag is selected */
  selectedTag: ITag | null;
  /** Setter function to select or deselect a tag filter */
  setSelectedTag: Dispatch<SetStateAction<ITag | null>>;

  /** Text indicator showing the current grouping context (category/tag name) */
  grouping: string;
  /** Setter function to update the grouping indicator text */
  setGrouping: Dispatch<SetStateAction<string>>;

  /** Currently selected bookmark to display in detail view, null if none selected */
  bookmarkToShow: IBookmark | null;
  /** Setter function to select a bookmark for detailed viewing */
  setBookmarkToShow: Dispatch<SetStateAction<IBookmark | null>>;

  /** Currently selected category for filtering bookmarks, null if no category is selected */
  selectedCategory: ICategory | null;
  /** Setter function to select or deselect a category filter */
  setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;

  /** Array of categories that match the current filter criteria */
  filteredCategories: ICategory[];
  /** Setter function to update the filtered categories list */
  setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;

  /** Array of bookmarks that match the current filter criteria */
  filteredBookmarks: IBookmark[];
  /** Setter function to update the filtered bookmarks list */
  setFilteredBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
}


/**
 * Zustand slice factory function for managing UI-driven state and user actions.
 *
 * This function creates a reactive state slice that contains flags and filters tied to user
 * interaction, such as query inputs, tag/category selections, visibility flags, and filtered views.
 * These values are typically transient and driven by user intent during active sessions.
 *
 * The returned object provides both state properties and their corresponding setter functions,
 * following React's useState pattern for state management consistency.
 *
 * @param set - Zustand's `set` function to update the action state slice
 * @param get - Zustand's `get` function to access current state from other slices
 * @returns A state object implementing the `IAction` interface with reactive properties and methods
 */
export default function action(set: TState<IAction>, get: TStateGet<IAction & IPayload>): IAction {
  return {
    /** Array of categories matching current filter criteria */
    filteredCategories: [],

    /**
     * Updates the filtered categories list.
     *
     * Accepts either a new array of categories or a function that receives the current
     * filtered categories and returns a new array. This follows React's setState pattern
     * for consistent state updates.
     *
     * @param categories - New categories array or updater function
     */
    setFilteredCategories(categories: SetStateAction<ICategory[]>) {
      set(function (state) {
        return typeof categories === "function"
          ? { ...state, filteredCategories: categories(state.filteredCategories) }
          : { ...state, filteredCategories: categories };
      });
    },

    /** Array of bookmarks matching current filter criteria */
    filteredBookmarks: [],

    /**
     * Updates the filtered bookmarks list.
     *
     * Accepts either a new array of bookmarks or a function that receives the current
     * filtered bookmarks and returns a new array. Commonly used after applying search
     * queries, category filters, or tag filters.
     *
     * @param bookmarks - New bookmarks array or updater function
     */
    setFilteredBookmarks(bookmarks: SetStateAction<IBookmark[]>) {
      set(function (state) {
        return typeof bookmarks === "function"
          ? { ...state, filteredBookmarks: bookmarks(state.filteredBookmarks) }
          : { ...state, filteredBookmarks: bookmarks };
      });
    },

    /** Currently selected bookmark for detailed viewing, null when no bookmark is selected */
    bookmarkToShow: null,

    /**
     * Sets the bookmark to display in the detail view.
     *
     * Used to show detailed information about a specific bookmark. Setting to null
     * will close the detail view and return to the list view.
     *
     * @param bookmark - Bookmark to display or null to close detail view
     */
    setBookmarkToShow(bookmark: SetStateAction<IBookmark | null>) {
      set(function (state) {
        return typeof bookmark === "function"
          ? { ...state, bookmarkToShow: bookmark(state.bookmarkToShow) }
          : { ...state, bookmarkToShow: bookmark };
      });
    },

    /** Currently selected category for filtering, null when no category filter is active */
    selectedCategory: null,

    /**
     * Sets the active category filter and updates the bookmark list accordingly.
     *
     * When a category is selected, automatically filters the bookmark list to show only
     * bookmarks belonging to that category. Setting to null or a default category
     * will reset the filter and show all bookmarks.
     *
     * @param cat - Category to filter by or null to clear category filter
     */
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

    /** Currently selected tag for filtering, null when no tag filter is active */
    selectedTag: null,

    /**
     * Sets the active tag filter and updates the bookmark list accordingly.
     *
     * When a tag is selected, automatically filters the bookmark list to show only
     * bookmarks associated with that tag. Setting to null will reset the filter
     * and show all bookmarks.
     *
     * @param tag - Tag to filter by or null to clear tag filter
     */
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

    /** Text indicator showing current grouping context (e.g., category or tag name) */
    grouping: "",

    /**
     * Updates the grouping indicator text displayed in the header.
     *
     * This text provides visual feedback to users about the current filter context,
     * such as showing the name of the selected category or tag. Empty strings are
     * ignored to prevent clearing meaningful grouping indicators accidentally.
     *
     * @param grouping - New grouping text or updater function
     */
    setGrouping(grouping: SetStateAction<string>) {
      if (!grouping) // Empty string
        return;
      set(function (state) {
        return typeof grouping === "function"
          ? { ...state, grouping: grouping(state.grouping) }
          : { ...state, grouping: grouping };
      });
    },

    /** Flag indicating whether the header form is currently visible and active */
    headerForm: false,

    /**
     * Toggles the visibility of the header form.
     *
     * The header form is typically used for adding new bookmarks or performing
     * quick actions. This setter controls its visibility state.
     *
     * @param bool - New visibility state or updater function
     */
    setHeaderForm(bool: SetStateAction<boolean>) {
      set(function (state) {
        return typeof bool === "function"
          ? { ...state, headerForm: bool(state.headerForm) }
          : { ...state, headerForm: bool };
      });
    },

    /** Current filter type being applied to organize and display content */
    filterBy: "filter:categories",

    /**
     * Sets the active filter type for organizing content display.
     *
     * Determines how content is filtered and organized in the interface.
     * Common values include filtering by categories, tags, or other criteria.
     *
     * @param filter - New filter type or updater function
     */
    setFilterBy(filter: SetStateAction<TFilters>) {
      set(function (state) {
        return typeof filter === "function"
          ? { ...state, filterBy: filter(state.filterBy) }
          : { ...state, filterBy: filter };
      });
    },

    /** Current search query string for filtering bookmarks by text content */
    query: "",

    /**
     * Updates the search query string.
     *
     * The query is used to filter bookmarks based on their title, URL, description,
     * or other text content. An empty string shows all bookmarks (subject to other filters).
     *
     * @param query - New search query or updater function
     */
    setQuery(query: SetStateAction<string>) {
      set(function (state) {
        return typeof query === "function"
          ? { ...state, query: query(state.query) }
          : { ...state, query: query };
      });
    },
  };
}
