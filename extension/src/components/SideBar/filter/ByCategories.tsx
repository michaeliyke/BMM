import { Dispatch, SetStateAction, useEffect } from "react";

import {
    toggleSelectedClass,
    toggleHighlightedClass,
    resetSelections,
    sortedCategories,
} from "../../../utils/common";

import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";
import { FiChevronRight } from "react-icons/fi";

type BCProps = {
    props: {
        bookmarks: IBookmark[];
        setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
        filteredCategories: ICategory[];
        setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
        categories: ICategory[];
        setData: Dispatch<SetStateAction<ICategory[]>>;
        updateCategory?: (category: ICategory) => void;
        selectedCategory: ICategory | null;
        setSelectedCategory: Dispatch<SetStateAction<ICategory | null>>;
        defaultCategory: ICategory;
        bookmarkToShow: IBookmark | null;
        setBookmarkToShow: (bookmark: IBookmark | null) => void;
        filterBy?: string;
        setFilterBy?: Dispatch<SetStateAction<string>>;
        selectedTag?: ITag | null;
        setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
        setGrouping?: Dispatch<SetStateAction<string>>;
        query: string;
        setQuery: Dispatch<SetStateAction<string>>;
    };
};

/**
 * Component for displaying and selecting categories in a sidebar.
 *
 * @component
 * @param {BCProps} props - The properties passed to the component.
 * @param {ICategory} props.defaultCategory - The default category to be selected.
 * @param {ICategory[]} props.categories - The list of categories to display.
 * @param {Function} props.setSelectedCategory - Function to set the selected category.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to show.
 * @param {Function} props.setGrouping - Function to set the grouping text in the header.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <ByCategories
 *   defaultCategory={defaultCategory}
 *   categories={categories}
 *   setSelectedCategory={setSelectedCategory}
 *   setBookmarkToShow={setBookmarkToShow}
 *   setGrouping={setGrouping}
 * />
 */
export default function ByCategories({ props }: BCProps) {
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
        if (setGrouping)
            setGrouping(defaultCategory?.name);
    }, [defaultCategory.name, setGrouping]);

    return (
        <section className="filtered-list bg-gray-50 w-64 h-full overflow-y-auto border-r border-gray-200">
            <ul className="categories">
                <li
                    className="category flex items-center px-4 py-2 text-sm text-gray font-medium cursor-pointer hover: selected"
                    data-category="All Categories"
                    data-id=""
                    data-default=""
                    onClick={restoreDefaultSection}
                >
                    <FiChevronRight className="mr-2 text-lg text-gray" />
                    <span>All Categories</span>
                </li>
                {sortedCategories(categories).map((category, index) => (
                    <li
                        key={index}
                        data-category={category.name}
                        data-id={category.id}
                        data-default={category.is_default}
                        className={`category flex items-center px-4 py-2 text-sm text-gray font-medium cursor-pointer hover:bg-gray-100 ${category.is_default === 1 ? 'highlighted' : ''
                            }`}
                        onClick={((e) => category.is_default === 1 ?
                            restoreDefaultSection() :
                            toggleSelected(category, e))}
                    >
                        <FiChevronRight className="mr-2 text-lg text-gray" />
                        <span>{category.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

