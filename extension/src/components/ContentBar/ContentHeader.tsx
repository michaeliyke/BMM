import { ContentHeaderProps } from "../../utils/types/props";
import { FaArrowLeft } from "react-icons/fa";
import { BookmarksDisplayProps } from "../../utils/types/props";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { getBookmarks, weightedSearch } from "../../utils/common";
import { debounce, DebouncedFunc } from "lodash-es"
import { IBookmark, ICategory } from "../../utils/types/schemas";

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

type SearchWidgetProps = {
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
}

function SearchWidget(props: SearchWidgetProps) {
    const [query, setQuery] = useState("");
    const { setBookmarks, filteredCategories } = props;

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
            className="relative max-w-xs w-full"
            aria-label="Search bookmarks"
        >
            <label htmlFor="search-input" className="sr-only">
                Search bookmarks
            </label>
            <input
                type="search"
                id="search-input"
                value={query}
                onChange={searchHandler}
                placeholder="Search bookmarks..."
                className="w-full p-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-full focus:ring-1 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 transition"
                aria-describedby="search-description"
            />
            <span
                id="search-description"
                className="sr-only"
            >
                Enter keywords to filter the list of bookmarks.
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-1/2 left-3 w-4 h-4 text-gray-500 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                />
            </svg>
        </form>
    );
}


export default function ContentHeader(props: ContentHeaderProps) {
    const {
        filteredCategories,
        bookmarkToShow,
        setBookmarkToShow,
        bookmarks,
        setBookmarks,
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
            />}
        </header>
    );
}
