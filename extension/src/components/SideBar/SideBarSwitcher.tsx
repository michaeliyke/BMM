import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import ByCategories from "./filter/ByCategories";
import { ByCategoryTags } from "./filter/ByCategoryTags";
import { ByTags } from "./filter/ByTags";

type SBSProps = {
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
 * A component that renders different sidebar variations based on the filter type provided in the props.
 *
 * @component
 * @param {SBSProps} props - The properties object containing the filter type and other necessary data.
 * @returns {JSX.Element} The corresponding sidebar variation component.
 *
 * @example
 * // Usage example:
 * <SideBarVariator props={{ filterBy: 'categories', ...otherProps }} />
 *
 * @remarks
 * The component supports the following filter types:
 * - 'categories': Renders the `ByCategories` component.
 * - 'filter:tags': Renders the `ByTags` component.
 * - 'filter:category/tags': Renders the `ByCategoryTags` component.
 * - Any other value defaults to rendering the `ByCategories` component.
 */
export default function SideBarSwitcher({ props }: SBSProps) {
    switch (props.filterBy) {
        case 'categories':
            return <ByCategories props={props} />;
        case 'filter:tags':
            return <ByTags props={props} />
        case 'filter:category/tags':
            return <ByCategoryTags props={props} />
        default:
            return <ByCategories props={props} />;
    }
}
