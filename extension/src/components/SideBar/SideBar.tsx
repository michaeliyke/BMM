import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import SideBarFooter from "./SideBarFooter";
import SideBarHeader from "./SideBarHeader";
import SideBarSwitcher from "./SideBarSwitcher";

type SideBarProps = {
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
    selectedTag?: ITag | null;
    setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
    setGrouping?: Dispatch<SetStateAction<string>>;
  };
};

/**
 * SideBar component that renders a sidebar with a header, variator, and footer.
 */
export default function SideBar({ props }: SideBarProps) {
  const {
    setData,
    selectedCategory,
  } = props;

  // return <SideBarVariator props={props} />;
  return (
    <article className="sidebar bg-white border-t border-t-gray-200">
      <SideBarHeader props={props} />

      <SideBarSwitcher props={props} />

      <SideBarFooter
        setData={setData}
        selectedCategory={selectedCategory}
      />
    </article>
  );
}
