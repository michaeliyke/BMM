import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { getBookmarks } from "../../utils/common";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";

type SideBarHeaderProps = {
    props: {
        bookmarks: IBookmark[];
        setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
        filteredCategories: ICategory[];
        setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
        categories: ICategory[];
        setData: Dispatch<SetStateAction<ICategory[]>>;
        updateCategory?: (category: ICategory) => void;
        selectedCategory: ICategory | null;
        setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
        defaultCategory: ICategory;
        bookmarkToShow: IBookmark | null;
        setBookmarkToShow: (bookmark: IBookmark | null) => void;
        filterBy?: string;
        setFilterBy?: Dispatch<SetStateAction<string>>;
        selectedTag?: ITag | null;
        setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
        setGrouping?: Dispatch<SetStateAction<string>>;
        query: string;
        setQuery: Dispatch<SetStateAction<string>>;
    };
};

/**
 * SideBarHeader component renders a header with a filter selection dropdown.
 *
 * @component
 * @param {SideBarHeaderProps} props - The properties passed to the component.
 * @param {string} props.filterBy - The current filter selection.
 * @param {Function} props.setFilterBy - Function to update the filter selection.
 * @param {Function} props.setBookmarks - Function to update the bookmarks based on the filter.
 * @param {Array} props.filteredCategories - The list of filtered categories.
 * @param {Function} props.setQuery - Function to update the search query.
 *
 * @returns {JSX.Element} The rendered SideBarHeader component.
 */
export default function SideBarHeader({ props }: SideBarHeaderProps) {
    const {
        filterBy,
        setFilterBy,
        setBookmarks,
        filteredCategories,
        setQuery,
    } = props;

    function handleFilterSelection(event: ChangeEvent<HTMLSelectElement>) {
        if (setFilterBy) {
            setFilterBy(event.target.value);
            setBookmarks(getBookmarks(filteredCategories));
            setQuery("");
        }
    }

    return (
        <header>
            <form>
                <label htmlFor="filter-options">
                    <select
                        id="filter-options"
                        className="bg-gray-200"
                        aria-label="Filter by"
                        name="filter-options"
                        value={filterBy}
                        onChange={handleFilterSelection}
                    >
                        <option value="categories" className="current">Categories</option>
                        <option value="filter:tags">Filter:Tags</option>
                        <option value="filter:category/tags">Filters:Category/Tags</option>
                    </select>
                </label>
            </form>
        </header>
    );
}
