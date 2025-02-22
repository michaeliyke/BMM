import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

import {
    categoriesSearch,
    sortedCategories,
    toggleHighlightedClass
} from "../../../utils/common";

import { debounce, DebouncedFunc } from "lodash-es";
import { FiSearch } from "react-icons/fi";
import { PiTagSimpleFill } from "react-icons/pi";
import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";

type BCProps = {
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

type DSI = Dispatch<SetStateAction<ICategory[]>>;
type CL = ICategory[];


/**
 * Component for displaying and selecting categories in a sidebar.
 *
 * @component
 * @param {BCProps} props - The properties passed to the component.
 * @param {ICategory} props.defaultCategory - The default category to be selected.
 * @param {ICategory[]} props.categories - The list of categories to display.
 * @param {Function} props.setSelectedCategory - Function to set the selected category.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to show.
 * @param {Function} props.setGrouping - Function to set the grouping text in the header.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <ByCategories
 *   defaultCategory={defaultCategory}
 *   categories={categories}
 *   setSelectedCategory={setSelectedCategory}
 *   setBookmarkToShow={setBookmarkToShow}
 *   setGrouping={setGrouping}
 * />
 */
export default function ByCategories({ props }: BCProps) {
    const {
        defaultCategory,
        categories,
        setSelectedCategory,
        setBookmarkToShow,
        setGrouping,
    } = props;

    const [query, setQuery] = useState<string>("");
    const [_categories, setCategories] = useState<ICategory[]>([]);


    function toggleSelected(category: ICategory, event: React.MouseEvent<HTMLLIElement>) {
        setSelectedCategory(category.is_default !== 1 ? category : null); // Global state
        setBookmarkToShow(null); // Global state
        if (setGrouping) // Update the category text in the header
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
    const debouncedSearchRef = useRef<DebouncedFunc<(q: string) => void> | null>(null);

    const debouncedSearch = useCallback(CDebouncer, []);

    /**
     * Debounced search function to filter categories based on a query string.
     *
     * @param query - The search query string.
     * @param categoryList - The list of categories to filter from.
     * @param setCategories - The state setter function to update the filtered categories.
     *
     * This function uses a debounced approach to limit the frequency of search executions.
     * It ensures that the search function is called at most once every 300 milliseconds.
     */
    function CDebouncer(query: string, categories: CL, setCategories: DSI) {
        // Memoize the actual debounced function internally
        // in order to avoid creating a new instance on every render.

        function bouncer(query: string) {
            setCategories(categoriesSearch(query, categories));
            debouncedSearchRef.current = null;
        }

        if (!debouncedSearchRef.current) {
            debouncedSearchRef.current = debounce(bouncer, 300);
        }

        debouncedSearchRef.current(query);
    }

    /**
     * Handles the search input change event.
     * Updates the query state and triggers a debounced search.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    function handleSearch(query: string) {
        setQuery(query);
        debouncedSearch(query, categories, setCategories);
    }

    useEffect(() => {
        // Set the default category text in the header
        if (setGrouping)
            setGrouping(defaultCategory?.name); // Global state
        setCategories(categories);

        return () => {
            debouncedSearchRef.current?.cancel();

        };
    }, [defaultCategory.name, setGrouping, debouncedSearchRef, categories]);

    return (
        <section className="filtered-list -ml-[15px] bg-white w-64 h-full overflow-y-auto border-r border-gray-200">
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
                {sortedCategories(_categories).map((category, index) => (
                    <li
                        key={index}
                        data-category={category.name}
                        data-id={category.id}
                        data-default={category.is_default}
                        className={`category flex items-center px-4 py-2 text-xs text-gray-700 cursor-pointer hover:bg-slate-50 ${category.is_default === 1 ? 'highlighted' : ''
                            }`}
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

