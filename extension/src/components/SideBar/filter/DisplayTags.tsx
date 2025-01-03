import { useEffect, useState } from "react";
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
import { FiChevronRight, FiHash } from "react-icons/fi";
import { ITag } from "../../../utils/types/schemas";


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


    function toggleSelected(tag: ITag, event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
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
        <section className="filtered-list bg-gray-50 w-64 h-full overflow-y-auto border-r border-gray-200">
            <ul className="categories">
                <li
                    className="tag flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 cursor-pointer hover:bg-blue-600"
                    onClick={restoreDefaultSection}
                >
                    <FiHash className="mr-2 text-lg" />
                    <span>All Tags</span>
                </li>
                {tags.map((tag, index) => (
                    <li
                        key={index}
                        className="tag flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-gray-100"
                        onClick={(event) => toggleSelected(tag, event)}
                    >
                        <FiHash className="mr-2 text-lg text-blue-500" />
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

    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

    function toggleExpand(categoryId: string) {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    }


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
                    <li key={index} className="category">
                        <div
                            className={`flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-gray-100 ${category.is_default === 1 ? 'bg-gray-200' : ''
                                }`}
                            onClick={() => toggleExpand(category.id)}
                        >
                            <FiChevronRight
                                className={`mr-2 text-lg text-blue-500 transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''
                                    }`}
                            />
                            <span>{category.name}</span>
                        </div>
                        {expandedCategories[category.id] && category.tags.length > 0 && (
                            <ul className="tags ml-8 mt-2 space-y-1">
                                {category.tags.map((tag, tagIndex) => (
                                    <li
                                        key={tagIndex}
                                        className="tag flex items-center px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                                    >
                                        <FiHash className="mr-2 text-lg text-gray-500" />
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
