import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import { FiChevronDown } from "react-icons/fi";
import { getBookmarks } from "../../utils/common";
import { IBookmark, ICategory, TFilters } from "../../utils/types/schemas";
import { useAppState } from "../../hooks/globalstate";

type SideBarHeaderProps = {
  props: {
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    categories: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
    updateCategory?: (category: ICategory) => void;
  };
};

/**
 * SideBarHeader component renders a header with a filter selection dropdown.
 */
export default function SideBarHeader({ props }: SideBarHeaderProps) {
  const { setBookmarks } = props;

  const {
    setQuery,
    setFilterBy,
    filterBy,
    filteredCategories,
  } = useAppState();

  function handleFilterSelection(value: TFilters) {
    if (setFilterBy) {
      setFilterBy(value);
      setBookmarks(getBookmarks(filteredCategories));
      setQuery("");
    }
  }

  const options = [
    { value: "filter:categories", label: "Categories" },
    { value: "filter:tags", label: "Filter : Tags" },
    { value: "filter:category/tags", label: "Filter : Category / Tags" },
    { value: "filter:favorites", label: "Filter : Favorites" },
    { value: "filter:archived", label: "Filter : Archived" },
    { value: "filter:deleted", label: "Filter : Deleted" },
  ];


  return (
    <header className="mt-4 mb-3">
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
