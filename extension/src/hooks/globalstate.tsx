import {create} from "zustand";

type filters = "filter:categories"
	| "filter:bookmarks"
	| "filter:tags"
	| "filter:category/tags"
	| "filter:category/bookmarks"
	| "filter:bookmark/tags"
	| "filter:bookmark/categories"
	| "filter:favorites"
	| "filter:archived"
	| "filter:delete"
	;

interface IState {
  	headerForm: boolean;
	filterBy: filters;
  	setHeaderForm: (value: boolean) => void;
	setFilterBy: (value: filters) => void;
}

type TState = {
	(partial: IState | Partial<IState> | ((state: IState) => IState | Partial<IState>),replace?: false): void;
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
		 * @param {filters}
		 * @returns {void}
		 */
		setFilterBy(value: filters){
			set({ filterBy: value });
		},
	};
}

/**
 * Zustand store for managing application state.
 *
 * @type {IState}
 */
export const useAppState = create<IState>(stateInitializer);
