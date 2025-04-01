import { Dispatch, SetStateAction, useEffect } from "react";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import ByCategories from "./filter/ByCategories";
import { ByCategoryTags } from "./filter/ByCategoryTags";
import { ByTags } from "./filter/ByTags";
import { useAppState } from "../../hooks/globalstate";

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
    selectedTag?: ITag | null;
    setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
    setGrouping?: Dispatch<SetStateAction<string>>;
  };
};


/**
 * A component that renders different sidebar variations based on the filter type provided in the props.
 */
export default function SideBarSwitcher({ props }: SBSProps) {
  const { headerForm, setHeaderForm, filterBy } = useAppState();

  useEffect(() => {
    // The following views need the header form, so we unhide it.
    const viewsNeedForm = ["filter:categories"];
    if (filterBy && viewsNeedForm.includes(filterBy)) {
      if (headerForm === false) setHeaderForm(true);

    } else
      if (headerForm === true) setHeaderForm(false);

  }, [headerForm, setHeaderForm, filterBy]);

  switch (filterBy) {
    case 'filter:categories':
      return <ByCategories props={props} />;
    case 'filter:tags':
      return <ByTags props={props} />
    case 'filter:category/tags':
      return <ByCategoryTags props={props} />
    default:
      return <ByCategories props={props} />;
  }
}
