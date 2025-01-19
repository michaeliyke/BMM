import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";
import { DisplayCategoryTags } from "./DisplayCategoryTags";

type BCTProps = {
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
 * A functional component that renders category tags in the sidebar.
 *
 * @param {BCTProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered DisplayTags component with the given props.
 */
export default function ByCategoryTags({ props }: BCTProps) {
    return <DisplayCategoryTags props={props} />
}

