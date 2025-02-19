import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiChevronRight, FiHash } from "react-icons/fi";
import { sortedCategories, toggleHighlightedClass } from "../../../utils/common";
import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";

type DCPProps = {
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

export function ByCategoryTags({ props }: DCPProps) {
    const {
        defaultCategory, categories, selectedCategory, setSelectedCategory, setBookmarkToShow, setGrouping, selectedTag, setSelectedTag,
    } = props;

    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean; }>({});

    function toggleExpand(category: ICategory, event: React.MouseEvent<HTMLElement>) {
        const target = event.currentTarget;
        if (target.classList.contains("highlighted"))
            target.classList.add("highlighted"); /* Dummy code, won't do anything */
        setExpandedCategories((prev) => {
            const temp = { ...prev, [category.id]: !prev[category.id] };
            return temp;
        });
    }

    function toggleSelectedTag(tag: ITag, event: React.MouseEvent<HTMLElement>) {
        const target = event.currentTarget;
        if (setSelectedTag)
            setSelectedTag(tag);
        setBookmarkToShow(null); /* Allow this later */

        // Update the category text in the header
        toggleHighlightedClass(target, "tag");
        if (selectedCategory && setGrouping)
            setGrouping(selectedCategory.name + (tag ? ` # ${tag.name}` : ''));
    }


    function toggleSelected(event: React.MouseEvent<HTMLElement>) {
        const target = event.currentTarget;
        const category = categories.find((cat) => cat.name === target.textContent);
        if (category) {
            setSelectedCategory(category.is_default !== 1 ? category : null);
            setBookmarkToShow(null);
            if (setSelectedTag)
                setSelectedTag(null);
            // Update the category text in the header
            if (setGrouping)
                setGrouping(category.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
            toggleHighlightedClass(target);
        }
    }

    useEffect(() => {
        // Set the default category text in the header
        const category = selectedCategory || defaultCategory;
        if (setGrouping) // Global state
            setGrouping(category.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
    }, [defaultCategory, setGrouping, selectedTag, selectedCategory]);


    return (
        <section className="filtered-list bg-gray-50 w-64 h-full overflow-y-auto border-r border-gray-200">
            <ul className="categories">
                {sortedCategories(categories).map((category, index) => (
                    <li
                        key={index}
                        className=""
                        data-category={category.name}
                        data-id={category.id}
                        data-default={category.is_default}
                    >
                        <div
                            className={`category flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-gray-100 ${category.is_default === 1 ? 'highlighted' : ''}`}
                            onClick={((e) => {
                                toggleExpand(category, e);
                                toggleSelected(e);
                            })}
                        >
                            <FiChevronRight
                                className={`mr-2 text-lg text-blue-500 transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''}`} />
                            <span>{category.name}</span>
                        </div>
                        {expandedCategories[category.id] && category.tags.length > 0 && (
                            <ul className="tags ml-8 mt-2 space-y-1">
                                {category.tags.map((tag, tagIndex) => (
                                    <li
                                        key={tagIndex}
                                        className="tag flex items-center px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                                        onClick={(event) => toggleSelectedTag(tag, event)}
                                    >
                                        <FiHash className="mr-2 text-xs text-gray-500" />
                                        <span>{tag.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
