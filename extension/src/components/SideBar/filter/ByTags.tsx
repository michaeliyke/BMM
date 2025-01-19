import { Dispatch, SetStateAction, useEffect } from "react";
import { FiHash } from "react-icons/fi";
import { toggleHighlightedClass, resetSelections } from "../../../utils/common";
import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";

type DAPProps = {
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
export function ByTags({ props }: DAPProps) {
    const {
        defaultCategory, categories, setSelectedTag, selectedTag, setGrouping, setBookmarkToShow,
    } = props;

    const tags = categories.flatMap((category) => category.tags);


    function toggleSelected(tag: ITag, event: React.MouseEvent<HTMLLIElement>) {
        const target = event.currentTarget;
        if (setSelectedTag)
            setSelectedTag(tag);
        setBookmarkToShow(null); /* Allow this later */

        // Update the category text in the header
        toggleHighlightedClass(target, "tag");
        if (defaultCategory && setGrouping)
            setGrouping(defaultCategory.name + (tag ? ` # ${tag.name}` : ''));
    }

    // Brings the selection and highlighting to the default state
    function restoreDefaultSection() {
        if (setSelectedTag)
            setSelectedTag(null);
        setBookmarkToShow(null);
        // If the default category is already selected
        resetSelections("tag");
        if (defaultCategory && setGrouping)
            setGrouping(defaultCategory.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
    }

    useEffect(() => {
        if (setGrouping)
            setGrouping(defaultCategory?.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
    }, [setGrouping, defaultCategory.name, selectedTag]);

    return (
        <section className="filtered-list bg-gray-50 w-64 h-full overflow-y-auto border-r border-gray-200">
            <ul className="categories">
                <li
                    data-tag="all"
                    data-id="all"
                    className="tag flex items-center px-4 py-2 text-sm font-medium highlighted cursor-pointer hover:bg-gray-100"
                    onClick={restoreDefaultSection}
                >
                    <FiHash className="mr-2 text-lg text-blue-500" />
                    <span>All Tags</span>
                </li>
                {tags.map((tag, index) => (
                    <li
                        key={index}
                        data-tag={tag.name}
                        data-id={tag.id}
                        className="tag flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-gray-100"
                        onClick={(event) => toggleSelected(tag, event)}
                    >
                        <FiHash className="mr-2 text-lg text-blue-500" />
                        <span>{tag.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
