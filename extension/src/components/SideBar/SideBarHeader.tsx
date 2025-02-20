import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import { FiChevronDown } from "react-icons/fi";
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

    function handleFilterSelection(value: string) {
        if (setFilterBy) {
            setFilterBy(value);
            setBookmarks(getBookmarks(filteredCategories));
            setQuery("");
        }
    }

    const options = [
        { value: "categories", label: "Categories" },
        { value: "filter:tags", label: "Filter : Tags" },
        { value: "filter:category/tags", label: "Filter : Category / Tags" },
        { value: "filter:favorites", label: "Filter : Favorites" },
        { value: "filter:archived", label: "Filter : Archived" },
        { value: "filter:deleted", label: "Filter : Deleted" },
    ];


    return (
        <header>
            <form>
                <label htmlFor="filter-options">
                    <Listbox value={filterBy} onChange={handleFilterSelection}>
                        <div className="relative w-[85%]">
                            <ListboxButton className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-4 py-2 text-xs text-gray-700 font-medium shadow-sm w-full cursor-pointer">
                                {options.find((opt) => opt.value === filterBy)?.label || "Select"}
                                <FiChevronDown className="w-4 h-4 ml-2" /> {/* Caret Icon */}
                            </ListboxButton>

                            <ListboxOptions className="absolute mt-1 min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                                {/* Dropdown Title */}
                                <div className="px-4 py-1.5 pt-3 text-xs text-gray-400 font-semibold pointer-events-none">
                                    Filter Options
                                </div>
                                <hr />

                                {options.map((option, index) => (
                                    <ListboxOption
                                        key={option.value}
                                        value={option.value}
                                        className={"px-4 py-0.5 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer" + (index === options.length - 1 ? " pb-2" : "")}
                                    >
                                        {option.label}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </div>
                    </Listbox>

                </label>
            </form>
        </header>
    );
}
