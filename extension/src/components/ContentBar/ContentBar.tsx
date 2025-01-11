
import { ContentBarProps } from "../../utils/types/props";
import BookmarksDisplay from "./BookmarksDisplay";
import GoBackButton from "./WidgetGoBack";

export default function ContentBar(props: ContentBarProps) {
    const {
        data,
        selectedCategory,
        bookmarkToShow,
        setBookmarkToShow,
        selectedTag,
    } = props;

    const filteredCategories = selectedCategory ? data.filter((cat) => cat.id === selectedCategory.id) : data;

    return (
        <article className="content mt-0">
            <header className="flex items-center justify-center p-2 bg-gray-100 border-b border-gray-200">
                {bookmarkToShow ? (
                    <nav aria-label="Go back">
                        <GoBackButton
                            categories={filteredCategories}
                            bookmarkToShow={bookmarkToShow}
                            setBookmarkToShow={setBookmarkToShow}
                        />
                    </nav>
                ) : (
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
                )}
            </header>

            <BookmarksDisplay
                categories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
                selectedTag={selectedTag}
            />
            <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
        </article>
    );
}
