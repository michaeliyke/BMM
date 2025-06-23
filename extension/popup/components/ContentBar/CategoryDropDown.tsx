import { useRef, useState } from "react";
import { FiChevronDown, FiChevronUp, FiTag } from "react-icons/fi";
import { useClickAway } from "react-use";
import { useAppState } from "../../hooks/globalstate";
import { getBookmarkCategories } from "../../utils/appState";
import { log } from "../../utils/functional.lib.dev";
import { IBookmark } from "../../utils/types/schemas";

interface CategoryDropdownProps {
  bookmark: IBookmark;
}

/**
 * Handles the categories dropdown icon on the bookmark listing view
 * @param param0 The bookmark object whose categories dropdown icon is clicked
 * @returns React component
 */
export default function CategoryDropdown({ bookmark }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const dropdownRef = useRef(null);
  const { bmm } = useAppState();

  const categories = getBookmarkCategories(bmm, bookmark.id);
  log(categories)

  useClickAway(dropdownRef, () => setIsOpen(false));

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    // Handle adding logic
    setNewCategory("");
  };

  return (
    <div className="relative text-sm text-gray-500" ref={dropdownRef}>
      <button
        className="flex text-xs items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-1 -ml-2 text-gray-400">Categories</span>
        {isOpen
          ? <FiChevronUp className="text-gray-500 bg-slate-200 rounded-full" size={12} />
          : <FiChevronDown className="text-gray-500 bg-slate-200 rounded-full" size={12} />}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-0 w-48 border border-gray-200 rounded-md shadow-sm bg-white z-10">
          {/* Small centered form */}
          <form
            className="p-3 rounded-t-md bg-slate-100 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }}
          >
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="text-xs border border-gray-300 rounded-md p-2.5 focus:ring-1 focus:ring-blue-400 outline-none"
            />
            <button
              type="submit"
              className="text-xs bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition w-full"
            >
              Add category
            </button>
          </form>

          {/* Category List */}
          <div className="mt-3 max-h-48 overflow-y-auto pb-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 py-1 px-3 text-left text-gray-500 text-sm font-medium"
                >
                  <FiTag className="text-gray-400" />
                  {category.name}
                </div>
              ))
            ) : (
              <div className="py-1 text-gray-400 text-center">No categories</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
