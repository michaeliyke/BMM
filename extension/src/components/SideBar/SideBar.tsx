import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory } from "../../utils/types/schemas";
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
  };
};

/**
 * SideBar component that renders a sidebar with a header, variator, and footer.
 */
export default function SideBar({ props }: SideBarProps) {
  const { setData } = props;

  // return <SideBarVariator props={props} />;
  return (
    <article className="sidebar bg-white border-t border-t-gray-200">
      <SideBarHeader props={props} />

      <SideBarSwitcher props={props} />

      <SideBarFooter
        setData={setData}
      />
    </article>
  );
}
