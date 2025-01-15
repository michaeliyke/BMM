import { ContentHeaderProps, SearchWidgetProps } from "../../utils/types/props";
import { FaArrowLeft } from "react-icons/fa";
import { BookmarksDisplayProps } from "../../utils/types/props";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { getBookmarks, weightedSearch } from "../../utils/common";
import { debounce, DebouncedFunc } from "lodash-es"
import { IBookmark } from "../../utils/types/schemas";

/**
 * GoBackButton component renders a button that allows users to navigate back
 * to the previous view by setting the bookmark to show to null.
 *
 * @param {BookmarksDisplayProps} props - The properties passed to the component.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to show.
 *
 * @returns {JSX.Element} A button element that triggers the go back action.
 */
function GoBackButton(props: BookmarksDisplayProps) {
    const { setBookmarkToShow } = props;
    function handleGoBack() {
        setBookmarkToShow(null);
    }

    return (
        <button
            onClick={handleGoBack}
            className="flex items-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none transition"
        >
            <FaArrowLeft className="mr-2" />
            Go Back
        </button>
    );
}


/**
 * SearchWidget component allows users to search and filter bookmarks.
 *
 * @param {SearchWidgetProps} props - The properties for the SearchWidget component.
 * @param {Dispatch<SetStateAction<IBookmark[]>>} props.setBookmarks - Function to update the list of bookmarks.
 * @param {string[]} props.filteredCategories - The categories to filter the bookmarks.
 * @param {string} props.query - The current search query.
 * @param {Dispatch<SetStateAction<string>>} props.setQuery - Function to update the search query.
 * @param {string} [props.grouping] - Optional grouping filter for the search.
 *
 * @returns {JSX.Element} The rendered SearchWidget component.
 *
 * @component
 *
 * @example
 * <SearchWidget
 *   setBookmarks={setBookmarks}
 *   filteredCategories={filteredCategories}
 *   query={query}
 *   setQuery={setQuery}
 *   grouping={grouping}
 * />
 */
function SearchWidget(props: SearchWidgetProps) {
    const {
        setBookmarks,
        filteredCategories,
        query,
        setQuery,
        grouping,
    } = props;

    const debouncedSearchRef = useRef<DebouncedFunc<(q: string) => void> | null>(null);

    const debouncedSearch = useCallback((query: string, bookmarks: IBookmark[], setBookmarks: Dispatch<SetStateAction<IBookmark[]>>) => {
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
        }
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
                {
                    grouping ?
                        `FILTER: ${grouping.toUpperCase()}`
                        : "Narrow down your search - filter by categories and tags."
                }
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
                aria-describedby="search-description"
            />
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
                    d="M3 21l4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                />
            </svg>
        </form>
    );
}


/**
 * ContentHeader component renders a header section that conditionally displays
 * either a GoBackButton or a SearchWidget based on the presence of a bookmark to show.
 *
 * @param {ContentHeaderProps} props - The properties passed to the component.
 * @param {Array} props.filteredCategories - The list of filtered categories.
 * @param {boolean} props.bookmarkToShow - Flag indicating if a bookmark is to be shown.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to show.
 * @param {Array} props.bookmarks - The list of bookmarks.
 * @param {Function} props.setBookmarks - Function to set the bookmarks.
 * @param {string} props.query - The search query string.
 * @param {Function} props.setQuery - Function to set the search query.
 * @param {string} props.grouping - The grouping criteria for the bookmarks.
 *
 * @returns {JSX.Element} The rendered ContentHeader component.
 */
export default function ContentHeader(props: ContentHeaderProps) {
    const {
        filteredCategories,
        bookmarkToShow,
        setBookmarkToShow,
        bookmarks,
        setBookmarks,
        query,
        setQuery,
        grouping,
    } = props;

    return (
        <header className="flex items-center justify-center p-2 bg-gray-100 border-b border-gray-200">
            {bookmarkToShow ? (
                <nav aria-label="Go back">
                    <GoBackButton
                        filteredCategories={filteredCategories}
                        bookmarkToShow={bookmarkToShow}
                        setBookmarkToShow={setBookmarkToShow}
                        bookmarks={bookmarks}
                        setBookmarks={setBookmarks}
                    />
                </nav>
            ) : <SearchWidget
                filteredCategories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
                bookmarks={bookmarks}
                setBookmarks={setBookmarks}
                query={query}
                setQuery={setQuery}
                grouping={grouping}
            />}
        </header>
    );
}
