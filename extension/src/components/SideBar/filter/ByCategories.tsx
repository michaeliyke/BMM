import { useEffect } from "react";
import { SideBarProps } from "../../../utils/types/props";

import {
    toggleSelectedClass,
    toggleHighlightedClass,
    resetSelections,
    sortedCategories,
} from "../../../utils/common";

import {
    addClass,
    removeClass,
    setDefaultCategoryText,
} from "../../../utils/domHelpers";
import { ICategory } from "../../../utils/types/schemas";
import { FiChevronRight } from "react-icons/fi";


export default function ByCategories({ props }: SideBarProps) {
    const {
        defaultCategory,
        categories,
        selectedCategory,
        setSelectedCategory,
        setBookmarkToShow,
    } = props;


    function toggleSelected(category: ICategory, event: React.MouseEvent<HTMLLIElement>) {
        setSelectedCategory(category);
        setBookmarkToShow(null);
        // Update the category text in the header
        setDefaultCategoryText(category.name);
        toggleSelectedClass(event.currentTarget, "category");
        toggleHighlightedClass(event.currentTarget, "category");
    }

    // Brings the selection and highlighting to the default state
    function restoreDefaultSection(e: React.MouseEvent<HTMLLIElement>) {
        const target = e.currentTarget;
        setSelectedCategory(null);
        setBookmarkToShow(null);
        // If the default category is already selected
        if (selectedCategory?.name === defaultCategory?.name) {
            addClass(target, ['selected']);
            if (target.nextElementSibling)
                removeClass(target.nextElementSibling, ['selected']);
            return
        }
        removeClass(target, ['selected']);
        resetSelections();
        setDefaultCategoryText(defaultCategory?.name);
    }

    useEffect(() => {
        // Set the default category text in the header
        setDefaultCategoryText(defaultCategory?.name);
    }, [defaultCategory]);


    return (
        <section className="filtered-list bg-gray-50 w-64 h-full overflow-y-auto border-r border-gray-200">
            <ul className="categories">
                <li
                    className="category flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 cursor-pointer hover:bg-blue-600"
                    onClick={restoreDefaultSection}
                >
                    <FiChevronRight className="mr-2 text-lg" />
                    <span>All Categories</span>
                </li>
                {sortedCategories(categories).map((category, index) => (
                    <li
                        key={index}
                        className={`category flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-gray-100 ${category.is_default === 1 ? 'bg-gray-200' : ''
                            }`}
                        onClick={(e) => toggleSelected(category, e)}
                    >
                        <FiChevronRight className="mr-2 text-lg text-blue-500" />
                        <span>{category.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

