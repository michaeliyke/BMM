import { useEffect } from "react";
import { SideBarProps } from "../../../utils/types/props";

import {
    toggleSelectedClass,
    toggleHighlightedClass,
    resetSelections,
    sortedCategories,
} from "../../../utils/common";

import {
    setDefaultCategoryText,
} from "../../../utils/domHelpers";
import { ICategory } from "../../../utils/types/schemas";
import { FiChevronRight } from "react-icons/fi";


export default function ByCategories({ props }: SideBarProps) {
    const {
        defaultCategory,
        categories,
        setSelectedCategory,
        setBookmarkToShow,
        setGrouping,
    } = props;


    function toggleSelected(category: ICategory, event: React.MouseEvent<HTMLLIElement>) {
        setSelectedCategory(category);
        setBookmarkToShow(null);
        if (setGrouping) // Update the category text in the header
            setGrouping(category.name);
        toggleSelectedClass(event.currentTarget, "category");
        toggleHighlightedClass(event.currentTarget, "category");
    }

    // Brings the selection and highlighting to the default state
    function restoreDefaultSection() {
        setSelectedCategory(null);
        setBookmarkToShow(null);
        resetSelections();
        if (setGrouping) // Update the category text in the header
            setGrouping(defaultCategory?.name);
    }

    useEffect(() => {
        // Set the default category text in the header
        setDefaultCategoryText(defaultCategory?.name);
    }, [defaultCategory]);


    return (
        <section className="filtered-list bg-gray-50 w-64 h-full overflow-y-auto border-r border-gray-200">
            <ul className="categories">
                <li
                    className="category flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 cursor-pointer hover:bg-blue-600 selected"
                    data-category="All Categories"
                    data-id=""
                    data-default=""
                    onClick={restoreDefaultSection}
                >
                    <FiChevronRight className="mr-2 text-lg" />
                    <span>All Categories</span>
                </li>
                {sortedCategories(categories).map((category, index) => (
                    <li
                        key={index}
                        data-category={category.name}
                        data-id={category.id}
                        data-default={category.is_default}
                        className={`category flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-gray-100 ${category.is_default === 1 ? 'highlighted' : ''
                            }`}
                        onClick={((e) => category.is_default === 1 ?
                            restoreDefaultSection() :
                            toggleSelected(category, e))}
                    >
                        <FiChevronRight className="mr-2 text-lg text-blue-500" />
                        <span>{category.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

