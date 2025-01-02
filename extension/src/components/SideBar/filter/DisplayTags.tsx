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


function DisplayAllTags({ props }: SideBarProps) {
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

function DisplayCategoryTags({ props }: SideBarProps) {
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
        <section className="filtered-list">
            <ul className="categories">
                <li
                    className="category all selected"
                    onClick={restoreDefaultSection}
                ><span>All Categories</span></li>
                {sortedCategories(categories).map((category, index) => (
                    <li
                        key={index}
                        className={category.is_default === 1 ? "category highlighted" : "category"}
                        onClick={toggleSelected}
                    >
                        <span>{category.name}</span>
                        {category.tags.length > 0 && (
                            <ul className="tags">
                                {category.tags.map((tag, index) => (
                                    <li key={index} className="tag">
                                        <span>{tag.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default function DisplayTags({ props }: SideBarProps) {

    console.log(props.filterBy);

    if (props.filterBy === "filter:category/tags")
        return <DisplayCategoryTags props={props} />
    if (props.filterBy === "filter:tags")
        return <DisplayAllTags props={props} />
    return null;
}
