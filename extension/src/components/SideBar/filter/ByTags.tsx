import { debounce, DebouncedFunc } from "lodash-es";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { FiHash, FiSearch } from "react-icons/fi";
import { getTags, resetSelections, tagsSearch, toggleHighlightedClass } from "../../../utils/common";
import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";

type DAPProps = {
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

type DSI = Dispatch<SetStateAction<ITag[]>>;
type CL = ICategory[];

export function ByTags({ props }: DAPProps) {
    const {
        defaultCategory,
        categories,
        setSelectedTag,
        selectedTag,
        setGrouping,
        setBookmarkToShow,
    } = props;

    const [query, setQuery] = useState<string>('');
    const [tags, setTags] = useState<ITag[]>([]);
    const [hasExecuted, setHasExecuted] = useState<boolean>(false);

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
            console.log('Searching for tags with query:', q);
            setCategories(tagsSearch(q, categories));
            setHasExecuted(true);
        }

    }, []);


    function handleSearch(query: string) {
        setQuery(query);
        search(query, categories, setTags);
    }


    function toggleSelected(tag: ITag, event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
        if (setSelectedTag)
            setSelectedTag(tag);
        setBookmarkToShow(null); /* Allow this later */

        // Update the category text in the header
        toggleHighlightedClass(target, "tag");
        if (defaultCategory && setGrouping)
            setGrouping(defaultCategory.name + (tag ? ` # ${tag.name}` : ''));
    }

    // Brings the selection and highlighting to the default state
    function restoreDefaultSection() {
        if (setSelectedTag)
            setSelectedTag(null);
        setBookmarkToShow(null);
        // If the default category is already selected
        resetSelections("tag");
        if (defaultCategory && setGrouping)
            setGrouping(defaultCategory.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
    }

    useEffect(() => {
        if (setGrouping)
            setGrouping(defaultCategory?.name + (selectedTag ? ` # ${selectedTag.name}` : ''));

        if (!query)
            setTags(getTags(categories));

        return () => {
            // Clean up the debounced search function after it has executed
            if (searchFnRef.current && hasExecuted) {
                searchFnRef.current.cancel();
                setHasExecuted(false);
            }
        };

    }, [setGrouping, defaultCategory.name, selectedTag, query, categories, hasExecuted]);

    return (
        <section className="filtered-list bg-white -ml-[15px] w-64 h-full overflow-y-auto border-r border-gray-200">
            {/* Search Bar */}
            <label htmlFor="tag-search" className="sr-only">
                Search Tags
            </label>
            <form role="search" className="relative px-4 py-3 border-b border-gray-200">
                <FiSearch
                    aria-hidden="true"
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                />
                <input
                    id="tag-search"
                    type="search"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search Tags"
                    className="w-full pl-8 pr-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
                    aria-label="Search tags"
                />
            </form>
            <ul className="categories">
                <li
                    data-tag="all"
                    data-id="all"
                    className="tag flex items-center px-4 py-2 text-xs text-gray-700 font-medium highlighted cursor-pointer hover:bg-slate-50"
                    onClick={restoreDefaultSection}
                >
                    <FiHash className="text-sm text-gray-400" />
                    <span>All Tags</span>
                </li>
                {tags.map((tag, index) => (
                    <li
                        key={index}
                        data-tag={tag.name}
                        data-id={tag.id}
                        className="tag flex items-center text-gray-700 px-4 py-2 text-xs font-medium cursor-pointer hover:bg-slate-50"
                        onClick={(event) => toggleSelected(tag, event)}
                    >
                        <FiHash className="text-sm text-gray-400" />
                        <span>{tag.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
