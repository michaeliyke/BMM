import { create } from "zustand";
import { TFilters } from "../utils/types/schemas";

interface IState {
  headerForm: boolean;
  filterBy: TFilters;
  query: string;
  setHeaderForm: (value: boolean) => void;
  setFilterBy: (value: TFilters) => void;
  setQuery: (value: string) => void;
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

    /**
     * Sets the header form state.
     *
     * @param {boolean}
     * @returns {void}
     */
    setHeaderForm(value: boolean) {
      set({ headerForm: value });
    },

    /**
     * Sets the filter type.
     *
     * @param {TFilters}
     * @returns {void}
     */
    setFilterBy(value: TFilters) {
      set({ filterBy: value });
    },

    /**
     * Sets the query string.
     *
     * @param {string}
     * @returns {void}
     */
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
