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


export default function ByCategories({ props }: SideBarProps) {
    const {
        defaultCategory,
        categories,
        selectedCategory,
        setSelectedCategory,
        setBookmarkToShow,
    } = props;


    function toggleSelected(event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
        const category = categories.find((cat) => cat.name === target.textContent);
        if (category) {
            setSelectedCategory(category);
            setBookmarkToShow(null);
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
        setBookmarkToShow(null);
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
    )
}

