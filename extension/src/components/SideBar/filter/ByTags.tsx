import { useEffect } from "react";
import { SideBarProps } from "../../../utils/types/props";

import {
    toggleSelectedClass,
    toggleHighlightedClass,
    resetSelections,
} from "../../../utils/common";

import {
    addClass,
    removeClass,
    setDefaultCategoryText,
} from "../../../utils/domHelpers";


export default function ByTags({ props }: SideBarProps) {
    const {
        defaultCategory,
        categories,
        selectedCategory,
        setSelectedCategory,
        setBookmarkToShow,
    } = props;

    const tags = categories.flatMap((category) => category.tags);


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
                ><span>All Tags</span></li>
                {tags.map((tag, index) => (
                    <li
                        key={index}
                        className="category"
                        onClick={toggleSelected}
                    >
                        <span>{tag.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

