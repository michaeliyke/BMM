import { DisplayAllTags } from "./DisplayAllTags";
import { DisplayCategoryTags } from "./DisplayCategoryTags";
import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";

type DTProps = {
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
 * Component to display tags based on the filter criteria.
 *
 * @param {DTProps} props - The properties object.
 * @param {string} props.filterBy - The filter criteria to determine which tags to display.
 *
 * @returns {JSX.Element | null} - Returns the appropriate tag display component based on the filter criteria, or null if no criteria match.
 */
export default function DisplayTags({ props }: DTProps) {
    if (props.filterBy === "filter:category/tags")
        return <DisplayCategoryTags props={props} />
    if (props.filterBy === "filter:tags")
        return <DisplayAllTags props={props} />
    return null;
}
