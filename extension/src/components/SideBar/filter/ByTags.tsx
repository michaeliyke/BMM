import { useEffect } from "react";
import { SideBarProps } from "../../../utils/types/props";

import {
    toggleSelectedClass,
    toggleHighlightedClass,
    resetSelections,
} from "../../../utils/common";

import {
    removeClass,
    setDefaultCategoryText,
} from "../../../utils/domHelpers";


export default function ByTags({ props }: SideBarProps) {
    const {
        defaultCategory,
        categories,
        setSelectedTag,
        selectedTag,
        setGrouping,
        setBookmarkToShow,
    } = props;

    const tags = categories.flatMap((category) => category.tags);


    function toggleSelected(event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
        const tag = tags.find((cat) => cat.name === target.textContent);
        if (tag) {
            if (setSelectedTag)
                setSelectedTag(tag);
            setBookmarkToShow(null); /* Allow this later */
            // Update the category text in the header
            toggleSelectedClass(target, "tag");
            toggleHighlightedClass(target, "tag");
        }
        if (defaultCategory && setGrouping)
            setGrouping(defaultCategory.name + (tag ? ` # ${tag.name}` : ''));
    }

    // Brings the selection and highlighting to the default state
    function restoreDefaultSection(e: React.MouseEvent<HTMLLIElement>) {
        const target = e.currentTarget;
        if (setSelectedTag)
            setSelectedTag(null);
        setBookmarkToShow(null);
        // If the default category is already selected
        removeClass(target, ['selected']);
        resetSelections("tag");
        setDefaultCategoryText(defaultCategory?.name); /* TODO: change this */
        if (defaultCategory && setGrouping)
            setGrouping(defaultCategory.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
    }

    useEffect(() => {
        // Set the default category text in the header
        setDefaultCategoryText(defaultCategory?.name); /* TODO: change this */
    }, [defaultCategory]);

    return (
        <section className="filtered-list">
            <ul className="categories">
                <li
                    className="tag all selected"
                    onClick={restoreDefaultSection}
                ><span>All Tags</span></li>
                {tags.map((tag, index) => (
                    <li
                        key={index}
                        className="tag"
                        onClick={toggleSelected}
                    >
                        <span>{tag.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

