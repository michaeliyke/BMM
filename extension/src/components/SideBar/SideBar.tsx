import Category from "../../data/adapters/category";
import Tag from "../../data/adapters/tag";
import { addClass, removeClass, setDefaultCategoryText } from "../../utils/domHelpers";
import { ICategory } from "../../utils/types/schemas";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { v4 as uuid4 } from 'uuid';

type SideBarProps = {
    categories: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
    updateCategory?: (category: ICategory) => void;
    selectedCategory: ICategory | null;
    setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
    defaultCategory: ICategory;
};

// Remove class selected from all categories and add it target
function toggleSelectedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        if (category.classList.contains('selected') && category !== target) {
            removeClass(category, 'selected');
        }
    });

    if (!target.classList.contains('selected')) {
        addClass(target, 'selected');
    }
}
// Remove class highlighted from all categories and add it target
function toggleHighlightedClass(target: HTMLLIElement) {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        if (category.classList.contains('highlighted') && category !== target) {
            removeClass(category, 'highlighted');
        }
    });

    if (!target.classList.contains('highlighted')) {
        addClass(target, 'highlighted');
    }
}

// Reset selected and highlighted categories, .all will be selected, and categories[0] will be highlighted
function resetSelections() {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category) => {
        removeClass(category, 'selected');
        removeClass(category, 'highlighted');
    });
    addClass(categories[0], 'selected');
    addClass(categories[1], 'highlighted');
}


function sortedCategories(data: ICategory[]): ICategory[] {
    // Deep copy the original data to avoid mutation
    const copy: ICategory[] = JSON.parse(JSON.stringify(data));
    // Sort the categories alphabetically by name
    copy.sort((a, b) => a.name.localeCompare(b.name));

    // Push the defaultCategory to the front of the array
    const defaultCategoryIndex = copy.findIndex((cat) => cat.is_default === 1);
    // If found, remove it from its current index and push it to the front
    if (defaultCategoryIndex !== -1) {
        const removedCategory = copy.splice(defaultCategoryIndex, 1)[0];
        copy.unshift(removedCategory);
        return copy;
    }

    return copy;
}

export default function SideBar(props: SideBarProps) {
    const { defaultCategory } = props;
    const { categories, setData, selectedCategory, setSelectedCategory } = props;

    const [showCategoryPopup, setShowCategoryPopup] = useState(false);
    const [showTagPopup, setShowTagPopup] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [tagName, setTagName] = useState("");

    const handleCreateCategory = () => {
        const category = new Category({
            name: categoryName,
            is_default: 0,
            bookmarks: [],
            id: uuid4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: [],
        });
        category.create()
            .then(() => {
                setData((state: ICategory[]) => {
                    return [...state, category]; // shallow copy of the state array
                });
                console.log("Category Created:", categoryName);
                setShowCategoryPopup(false);
                setCategoryName("");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCreateTag = () => {
        const tag = new Tag({
            name: tagName,
            id: uuid4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        tag.create()
            .then(() => {
                setData((state: ICategory[]) => {
                    // Find the index of the selected category
                    const index = state.findIndex((cat) => cat.id === selectedCategory?.id);
                    if (index === -1) return state; // Safety check: if not found, return the current state

                    // Modify the selected category's tags array and return the new state
                    const updatedCategory = {
                        ...state[index], // shallow copy of the category object
                        tags: [...state[index].tags, tag], // new tags array
                    };

                    // Replace the category with the updated one
                    state[index] = updatedCategory;
                    return state; // Return the new state
                });
            })
            .then(() => {
                console.log("Tag Created:", tagName);
                setShowTagPopup(false);
                setTagName("");
            })
            .catch((error) => {
                console.error(error);
            });

    };

    function toggleSelected(event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
        const category = categories.find((cat) => cat.name === target.textContent);
        if (category) {
            setSelectedCategory(category);
            // Update the category text in the header
            setDefaultCategoryText(category.name);
            toggleSelectedClass(target);
            toggleHighlightedClass(target);
        }
    }

    // Brings the selection and highlighting to the default state
    function restoreDefaultSection(e: React.MouseEvent<HTMLLIElement>) {
        const target = e.currentTarget;
        setSelectedCategory(null);
        // If the default category is already selected
        if (selectedCategory?.name === defaultCategory?.name) {
            addClass(target, 'selected');
            if (target.nextElementSibling)
                removeClass(target.nextElementSibling, 'selected');
            return
        }
        removeClass(target, 'selected');
        resetSelections();
        setDefaultCategoryText(defaultCategory?.name);
    }

    useEffect(() => {
        // Set the default category text in the header
        setDefaultCategoryText(defaultCategory?.name);
    }, [defaultCategory]);


    return (
        <article className="sidebar">
            <header>
                <form>
                    <select aria-label="Filter Options" name="filter-options">
                        <option value="categories" className="current">Categories</option>
                        <option value="filter:tags">Filter:Tags</option>
                        <option value="filter:category/tags">Filter:Category/Tags</option>
                    </select>
                </form>
            </header>
            <section className="filtered-list">
                <ul className="categories">
                    <li
                        className="category all selected"
                        onClick={restoreDefaultSection}
                    ><span>All Categories</span></li>
                    {sortedCategories(categories).map((category, index) => (
                        (category.tags.length > 0 && console.log(`${category.name}:`, category.tags)),
                        <li
                            key={index}
                            className={category.is_default === 1 ? "category highlighted" : "category"}
                            onClick={toggleSelected}
                        >
                            <span>{category.name}</span>
                        </li>
                    ))}
                </ul>
            </section>
            <footer className="relative flex items-center p-2 bg-gray-100 border-t space-x-4">
                {/* Create Category Button */}
                <button
                    onClick={() => setShowCategoryPopup(!showCategoryPopup)}
                    className="flex items-center justify-center gap-2 px-3 pr-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-blue-700 focus:outline-none transition"
                >
                    <MdAdd size={16} />
                    <span>Category</span>
                </button>

                {/* Popup for Create Category */}
                {showCategoryPopup && (
                    <div className="absolute bottom-full mb-2 left-0 w-48 bg-white shadow-lg rounded-md p-3 z-10">
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button
                            onClick={handleCreateCategory}
                            className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Create
                        </button>
                    </div>
                )}

                {/* Create Tag Button */}
                <button
                    onClick={() => setShowTagPopup(!showTagPopup)}
                    className="flex items-center justify-center gap-2 px-3 pr-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-green-700 focus:outline-none transition"
                >
                    <MdAdd size={16} />
                    <span>Tag</span>
                </button>

                {/* Popup for Create Tag */}
                {showTagPopup && (
                    <div className="absolute bottom-full mb-2 left-0 w-48 bg-white shadow-lg rounded-md p-3 z-10">
                        <input
                            type="text"
                            placeholder="Tag Name"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
                        />
                        <button
                            onClick={handleCreateTag}
                            className="mt-2 w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Create
                        </button>
                    </div>
                )}
            </footer>

        </article>

    )
}

