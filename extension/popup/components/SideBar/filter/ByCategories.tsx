import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

import {
  categoryTagsSearch,
  sortedCategories,
  toggleHighlightedClass
} from "../../../utils/common";

import { debounce, DebouncedFunc } from "lodash-es";
import { FiSearch } from "react-icons/fi";
import { PiTagSimpleFill } from "react-icons/pi";
import { defaultCategory } from "../../../data/data";
import { useAppState } from "../../../hooks/globalstate";
import { log } from "../../../utils/functional.lib.dev";
import { ICategory } from "../../../utils/types/schemas";
type DSI = Dispatch<SetStateAction<ICategory[]>>;
type CL = ICategory[];


/**
 * Component for displaying and selecting categories in a sidebar.
 */
export default function ByCategories() {
  const [query, setQuery] = useState<string>("");
  const [hasExecuted, setHasExecuted] = useState<boolean>(true);
  const {
    setBookmarkToShow,
    setSelectedCategory,
    setGrouping,
    getAllCategories,
  } = useAppState();
  const [_categories, setCategories] = useState<ICategory[]>([]);

  function toggleSelected(category: ICategory, event: React.MouseEvent<HTMLLIElement>) {
    setSelectedCategory(category); // Global state
    setBookmarkToShow(null); // Global state
    setGrouping(category.name); // Global state
    toggleHighlightedClass(event.currentTarget, "category");
  }

  /**
   * A reference to a debounced search function.
   * This reference is used to store a debounced version of a search function
   * that takes a string query as an argument. The debounced function will delay
   * the execution of the search function to optimize performance and reduce the
   * number of search requests made.
   *
   * @type {React.MutableRefObject<DebouncedFunc<(q: string) => void> | null>}
   */
  const searchFnRef = useRef<DebouncedFunc<(q: string) => void> | null>(null);

  const search = useCallback((query: string, categories: CL, setCategories: DSI) => {
    if (!searchFnRef.current)
      searchFnRef.current = debounce(performSearch, 300);

    searchFnRef.current(query);

    function performSearch(q: string) {
      setCategories(categoryTagsSearch(q, categories));
      setHasExecuted(true);
    }
  }, []);

  /**
   * Handles the search input change event.
   * Updates the query state and triggers a debounced search.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  function handleSearch(query: string) {
    setQuery(query);
    search(query, _categories, setCategories);
  }

  useEffect(() => {
    // Set the default category text in the header
    setGrouping(defaultCategory.name); // Global state
    setCategories(getAllCategories())
    log("useEffects Here--------------");
    return () => {
      // Cancel the debounced search function when the component unmounts.
      if (searchFnRef.current && hasExecuted) {
        searchFnRef.current.cancel();
        setHasExecuted(false);
      }
    };
  }, [setGrouping, searchFnRef, hasExecuted, getAllCategories]);

  return (
    <section className="filtered-list w-full h-full overflow-y-auto">
      {/* Search Bar */}
      <label htmlFor="category-search" className="sr-only">
        Search Categories
      </label>
      <form role="search" className="relative px-4 py-3 border-b border-gray-200">
        <FiSearch
          aria-hidden="true"
          className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
        />
        <input
          id="category-search"
          type="search"
          onChange={(e) => handleSearch(e.target.value)}
          value={query}
          placeholder="Search Categories"
          className="w-full pl-8 pr-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          aria-label="Search categories"
        />
      </form>


      {/* Categories List */}
      <ul className="categories">
        <li /* Default Category */
          key={1}
          data-category={defaultCategory.name}
          data-id={defaultCategory.id}
          data-default={defaultCategory.is_default}
          className="category flex items-center px-4 py-2 text-xs text-gray-700 cursor-pointer hover:bg-slate-50 highlighted"
          onClick={(e) => toggleSelected(defaultCategory, e)}
        >
          <PiTagSimpleFill size={12} className="text-gray-400" />
          <span>{defaultCategory.name}</span>
        </li>
        {sortedCategories(_categories).map((category, index) => (
          <li
            key={index}
            data-category={category.name}
            data-id={category.id}
            data-default={category.is_default}
            className="category flex items-center px-4 py-2 text-xs text-gray-700 cursor-pointer hover:bg-slate-50"
            onClick={(e) => toggleSelected(category, e)}
          >
            <PiTagSimpleFill size={12} className="text-gray-400" />
            <span>{category.name}</span>
          </li>
        ))}
      </ul>
    </section>

  )
}

