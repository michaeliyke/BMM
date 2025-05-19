import { DebouncedFunc, debounce } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
import { useAppState } from "../../../hooks/globalstate";
import { getBookmarks, weightedSearch } from "../../../utils/common";
import { IBookmark } from "../../../utils/types/schemas";

/**
 * SearchWidget component allows users to search and filter bookmarks.
*/
export function SearchWidget() {
  const {
    query,
    setQuery,
    grouping,
    filteredCategories,
    setBookmarks,
  } = useAppState();

  const debouncedSearchRef = useRef<DebouncedFunc<(q: string) => void> | null>(null);

  const debouncedSearch = useCallback((query: string, bookmarks: IBookmark[], setBookmarks: (bookmarks: IBookmark[]) => void) => {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debounce((q: string) => {
        setBookmarks(weightedSearch(q, bookmarks));
        debouncedSearchRef.current = null;
      }, 300);
    }
    debouncedSearchRef.current(query);
  }, []);

  function searchHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setQuery(query);
    debouncedSearch(query, getBookmarks(filteredCategories), setBookmarks);
  }

  useEffect(() => {
    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [debouncedSearchRef]);

  return (
    <form
      role="search"
      className="relative max-w-xs w-full space-y-1"
      aria-label="Search bookmarks"
    >
      {/* Filter Indicator Text */}
      <p
        id="search-description"
        className="text-xs text-gray-600 italic p-2 pb-0.5 fat-text"
      >
        {grouping ?
          `FILTER: ${grouping.toUpperCase()}`
          : "Narrow down your search - filter by categories and tags."}
        {/* Select the tags and categories to filter */}
      </p>
      {/* Search Input */}
      <label htmlFor="search-input" className="sr-only">
        Search bookmarks
      </label>
      <input
        type="search"
        id="search-input"
        value={query}
        onChange={searchHandler}
        placeholder="Search bookmarks..."
        className="w-full p-1.5 pr-10 pl-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:ring-1 focus:outline-none focus:border-blue-400 placeholder-gray-400 shadow-sm focus:shadow-inner transition"
        aria-describedby="search-description" />
      <span id="search-description" className="sr-only">
        Enter keywords to filter the list of bookmarks.
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-11 right-2 w-7 h-7 text-gray-300 transform -translate-y-1/2 rotate-[10deg]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 21l4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </form>
  );
}
