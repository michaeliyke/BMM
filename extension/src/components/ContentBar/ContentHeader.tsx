import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import { GoBackWidget } from "./widgets/GoBackWidget";
import { SearchWidget } from "./widgets/SearchWidget";

type ContentHeaderProps = {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
    updateCategory?: (category: ICategory) => void;
    selectedCategory: ICategory | null;
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
    selectedTag?: ITag | null;
    setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
    grouping: string;
    filterBy: string;
    setFilterBy: Dispatch<SetStateAction<string>>;
};

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
                    <GoBackWidget
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
