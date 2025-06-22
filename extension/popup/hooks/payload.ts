import { Dispatch, SetStateAction } from "react";
import { getAllBookmarks, getAllCategories, getAllTags } from "../utils/appState";
import { IBMM, IBookmark, ICategory, ITag, TState, TStateGet } from "../utils/types/schemas";

export interface IPayload {
  bookmarks: IBookmark[];
  setBookmarks: (bookmarks: IBookmark[] | ((prev: IBookmark[]) => IBookmark[])) => void;

  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;

  categories: ICategory[];
  setCategories(next: ICategory[] | ((prev: ICategory[]) => ICategory[])): void

  tags: ITag[];
  setTags(tags: ITag[] | ((prev: ITag[]) => ITag[])): void

  properties: IBMM;
  setProperties: Dispatch<SetStateAction<IBMM>>;

  bmm: IBMM;
  setBmm(next: IBMM | ((prev: IBMM) => IBMM)): void;

  feedAllStateComponents(nextBMM: IBMM | ((prev: IBMM) => IBMM)): void;
}

/**
 * Zustand slice for managing persistent application data (payload).
 *
 * This slice handles the core entities of the app such as bookmarks, tags,
 * categories, and derived structures like BMM and properties. It also provides
 * utilities to mutate and sync these structures consistently.
 *
 * @param set - Zustand's `set` function to update the payload state.
 * @param get - Zustand's `get` function to access the current payload state.
 * @returns A partial state object implementing the `IPayload` interface.
 */
export default function payload(set: TState<IPayload>, get: TStateGet<IPayload>): IPayload {
  return {
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
    setBmm(bmm: SetStateAction<IBMM>) {
      set(function (state) {
        const _state = typeof bmm === "function"
          ? { ...state, bmm: bmm(state.bmm) }
          : { ...state, bmm };
        return _state;
      });
    },

    bookmarks: [],
    setBookmarks(bookmarks: SetStateAction<IBookmark[]>) {
      set(function (state) {
        const _state = typeof bookmarks === "function"
          ? { ...state, bookmarks: bookmarks(state.bookmarks) }
          : { ...state, bookmarks };
        return _state;
      });
    },

    tags: [],
    setTags(tags: SetStateAction<ITag[]>): void {
      set(function (state) {
        const _state = typeof tags === "function"
          ? { ...state, tags: tags(state.tags) }
          : { ...state, tags };
        return _state;
      });
    },

    categories: [],
    setCategories(categories: SetStateAction<ICategory[]>) {
      set(function (state) {
        return typeof categories === "function"
          ? { ...state, categories: categories(state.categories) }
          : { ...state, categories: categories };
      });
    },

    // All data parts needing properties will be fed here upon properties update
    feedAllStateComponents(_bmm: SetStateAction<IBMM>): void {
      const bmm = typeof _bmm === "function" ? _bmm(get().bmm) : _bmm;
      get().setBmm(bmm);
      get().setCategories(getAllCategories(bmm));
      get().setBookmarks(getAllBookmarks(bmm));
      get().setTags(getAllTags(bmm));
    },

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
    // sets up an all properties object. This objects makes things faster
    setProperties(bmm: SetStateAction<IBMM>) {
      set(function (state) {
        return typeof bmm === 'function'
          ? { ...state, properties: bmm(state.properties) }
          : { ...state, properties: bmm };
      });
    },

    data: [],
    setData(data: SetStateAction<ICategory[]>) {
      set(function (state) {
        return typeof data === "function"
          ? { ...state, data: data(state.data) }
          : { ...state, data };
      });
    },
  };
}
