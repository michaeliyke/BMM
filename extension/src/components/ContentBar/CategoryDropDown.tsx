import { useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useClickAway } from "react-use";
import { getBookmarkCategories } from "../../utils/common";
import { IBookmark, ICategory } from "../../utils/types/schemas";

interface CategoryDropdownProps {
    bookmark: IBookmark;
    data: ICategory[];
}

export default function CategoryDropdown({ bookmark, data }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState("");
    const dropdownRef = useRef(null);

    const categories = getBookmarkCategories(bookmark, data);

    useClickAway(dropdownRef, () => setIsOpen(false));

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            console.log("New Category:", newCategory); // Replace with actual logic
            setNewCategory("");
        }
    };

    return (
        <div className="relative text-sm text-gray-700" ref={dropdownRef}>
            <button
                className="flex flex-col items-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                Categories
                {isOpen ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
            </button>

            {isOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-lg shadow-md bg-white z-10 p-3">
                    {/* Small centered form */}
                    <form
                        className="p-3 rounded-md bg-gray-50 flex flex-col gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddCategory();
                        }}
                    >
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category"
                            className="text-xs border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                        <button
                            type="submit"
                            className="text-xs bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition w-full"
                        >
                            Add Category
                        </button>
                    </form>

                    {/* Category List */}
                    <div className="mt-3 max-h-48 overflow-y-auto">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`py-2 px-3 text-left cursor-pointer rounded-md hover:bg-gray-200 ${selectedCategory === category.name ? "bg-gray-100 font-medium" : ""
                                        }`}
                                    onClick={() => {
                                        setSelectedCategory(category.name);
                                        setIsOpen(false);
                                    }}
                                >
                                    {category.name}
                                </div>
                            ))
                        ) : (
                            <div className="py-2 text-gray-500 text-center">No categories</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
