import { Dispatch, SetStateAction } from "react";
import { getAllBookmarks, getAllCategories, getAllTags } from "../utils/appState";
import { IBMM, IBookmark, ICategory, ITag, TState, TStateGet } from "../utils/types/schemas";
import { IAction } from "./actions";

/**
 * Interface defining the payload state and methods for managing persistent application data.
 *
 * This interface encompasses all core data entities and their management functions,
 * including bookmarks, categories, tags, and the centralized BMM (Bookmark Management Model)
 * structure that coordinates all application data.
 */
export interface IPayload {
  /** Array of all bookmarks in the application */
  bookmarks: IBookmark[];
  /** Setter function to update the bookmarks array */
  setBookmarks: (bookmarks: IBookmark[] | ((prev: IBookmark[]) => IBookmark[])) => void;

  /** Array of category data used for various operations and displays */
  data: ICategory[];
  /** Setter function to update the data categories array */
  setData: Dispatch<SetStateAction<ICategory[]>>;

  /** Array of all categories in the application */
  categories: ICategory[];
  /** Setter function to update the categories array */
  setCategories(next: ICategory[] | ((prev: ICategory[]) => ICategory[])): void

  /** Array of all tags in the application */
  tags: ITag[];
  /** Setter function to update the tags array */
  setTags(tags: ITag[] | ((prev: ITag[]) => ITag[])): void

  /** Complete BMM structure containing all application data in an optimized format */
  properties: IBMM;
  /** Setter function to update the properties BMM structure */
  setProperties: Dispatch<SetStateAction<IBMM>>;

  /** Main BMM (Bookmark Management Model) structure containing all organized data */
  bmm: IBMM;
  /** Setter function to update the main BMM structure */
  setBmm(next: IBMM | ((prev: IBMM) => IBMM)): void;

  /**
   * Utility function to synchronize all state components with updated BMM data.
   * This ensures all derived arrays (bookmarks, categories, tags) stay in sync with the main BMM.
   */
  feedAllStateComponents(nextBMM: IBMM | ((prev: IBMM) => IBMM)): void;
}

/**
 * Zustand slice factory function for managing persistent application data (payload).
 *
 * This function creates a state slice that handles the core entities of the bookmark management
 * application, including bookmarks, tags, categories, and the centralized BMM (Bookmark Management Model)
 * structure. It provides utilities to mutate and synchronize these data structures consistently,
 * ensuring data integrity across the application.
 *
 * The BMM structure serves as the single source of truth for all application data, containing
 * both arrays and optimized object lookups for efficient data access and manipulation.
 *
 * @param set - Zustand's `set` function to update the payload state slice
 * @param get - Zustand's `get` function to access current state from this and other slices
 * @returns A state object implementing the `IPayload` interface with data properties and methods
 */
export default function payload(set: TState<IPayload>, get: TStateGet<IPayload & IAction>): IPayload {
  return {
    /**
     * Main BMM (Bookmark Management Model) structure containing all organized application data.
     *
     * This is the central data structure that contains bookmarks, categories, tags, and their
     * relationships in both array and object formats for efficient access patterns.
     */
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

    /**
     * Updates the main BMM structure.
     *
     * This is the primary method for updating the central data model. Changes to the BMM
     * typically require subsequent updates to derived arrays (categories, bookmarks, tags)
     * to maintain data consistency across the application.
     *
     * @param bmm - New BMM structure or updater function
     */
    setBmm(bmm: SetStateAction<IBMM>) {
      set(function (state) {
        const _state = typeof bmm === "function"
          ? { ...state, bmm: bmm(state.bmm) }
          : { ...state, bmm };
        return _state;
      });
    },

    /** Array of all bookmarks currently loaded in the application */
    bookmarks: [],

    /**
     * Updates the bookmarks array.
     *
     * This array represents the current set of bookmarks that are displayed and available
     * for user interaction. It may be filtered based on current selections (categories, tags)
     * or search queries.
     *
     * @param bookmarks - New bookmarks array or updater function
     */
    setBookmarks(bookmarks: SetStateAction<IBookmark[]>) {
      set(function (state) {
        const _state = typeof bookmarks === "function"
          ? { ...state, bookmarks: bookmarks(state.bookmarks) }
          : { ...state, bookmarks };
        return _state;
      });
    },

    /** Array of all tags available in the application */
    tags: [],

    /**
     * Updates the tags array.
     *
     * Tags are used to categorize and filter bookmarks. This array contains all available
     * tags that can be applied to bookmarks or used for filtering the bookmark list.
     *
     * @param tags - New tags array or updater function
     */
    setTags(tags: SetStateAction<ITag[]>): void {
      set(function (state) {
        const _state = typeof tags === "function"
          ? { ...state, tags: tags(state.tags) }
          : { ...state, tags };
        return _state;
      });
    },

    /** Array of all categories available in the application */
    categories: [],

    /**
     * Updates the categories array.
     *
     * Categories provide organizational structure for bookmarks. This array contains all
     * available categories that bookmarks can be assigned to or used for filtering.
     *
     * @param categories - New categories array or updater function
     */
    setCategories(categories: SetStateAction<ICategory[]>) {
      set(function (state) {
        return typeof categories === "function"
          ? { ...state, categories: categories(state.categories) }
          : { ...state, categories: categories };
      });
    },

    /**
     * Synchronizes all state components with updated BMM data.
     *
     * This utility function ensures that when the main BMM structure is updated,
     * all derived arrays (bookmarks, categories, tags) are automatically updated
     * to reflect the new data. This maintains consistency across all state slices
     * and prevents stale data issues.
     *
     * @param _bmm - New BMM structure or updater function to apply and propagate
     */
    feedAllStateComponents(_bmm: SetStateAction<IBMM>): void {
      const bmm = typeof _bmm === "function" ? _bmm(get().bmm) : _bmm;
      get().setBmm(bmm);
      get().setCategories(getAllCategories(bmm));
      get().setBookmarks(getAllBookmarks(bmm));
      get().setTags(getAllTags(bmm));
    },

    /**
     * Complete BMM structure used for performance-optimized operations.
     *
     * This is a duplicate of the main BMM structure that can be used for read-heavy
     * operations without affecting the main data flow. It contains the same data
     * structure with optimized object lookups for faster access patterns.
     */
    properties: {
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

    /**
     * Updates the properties BMM structure.
     *
     * This setter updates the performance-optimized copy of the BMM data.
     * The properties structure is used for operations that require fast lookups
     * and don't need to trigger full state updates.
     *
     * @param bmm - New properties BMM structure or updater function
     */
    setProperties(bmm: SetStateAction<IBMM>) {
      set(function (state) {
        return typeof bmm === 'function'
          ? { ...state, properties: bmm(state.properties) }
          : { ...state, properties: bmm };
      });
    },

    /** Array of category data used for various display and operational purposes */
    data: [],

    /**
     * Updates the data categories array.
     *
     * This array contains category data that may be used for specific UI components
     * or operations that need a separate category dataset from the main categories array.
     * It allows for flexible data management in different contexts.
     *
     * @param data - New data categories array or updater function
     */
    setData(data: SetStateAction<ICategory[]>) {
      set(function (state) {
        return typeof data === "function"
          ? { ...state, data: data(state.data) }
          : { ...state, data };
      });
    },
  };
}
