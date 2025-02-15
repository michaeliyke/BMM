import { useRef, useState } from "react";
import { FiChevronDown, FiChevronUp, FiTag } from "react-icons/fi";
import { useClickAway } from "react-use";
import { getBookmarkCategories } from "../../utils/common";
import { IBookmark, ICategory } from "../../utils/types/schemas";

interface CategoryDropdownProps {
    bookmark: IBookmark;
    data: ICategory[];
}

export default function CategoryDropdown({ bookmark, data }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const dropdownRef = useRef(null);

    const categories = getBookmarkCategories(bookmark, data);

    useClickAway(dropdownRef, () => setIsOpen(false));

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;
        // Handle adding logic
        setNewCategory("");
    };

    return (
        <div className="relative text-sm top-2 text-gray-500" ref={dropdownRef}>
            <button
                className="flex text-xs flex-col items-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                Categories
                {isOpen ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
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
