import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import { GoBackWidget } from "./widgets/GoBackWidget";
import { SearchWidget } from "./widgets/SearchWidget";
import { useAppState } from "../../hooks/globalstate";

type ContentHeaderProps = {
  bookmarks: IBookmark[];
  setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
  filteredCategories: ICategory[];
  setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
  updateCategory?: (category: ICategory) => void;
  selectedCategory: ICategory | null;
  selectedTag?: ITag | null;
  setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
  grouping: string;
};

/**
 * ContentHeader component renders a header section that conditionally displays
 * either a GoBackButton or a SearchWidget based on the presence of a bookmark to show.
 *
 * @returns {JSX.Element} The rendered ContentHeader component.
 */
export default function ContentHeader(props: ContentHeaderProps) {
  const {
    filteredCategories,
    bookmarks,
    setBookmarks,
    grouping,
  } = props;

  const { bookmarkToShow } = useAppState();

  return (
    <header className="flex items-center justify-center p-2 bg-gray-100 border-b border-gray-200">
      {bookmarkToShow ? (
        <nav aria-label="Go back">
          <GoBackWidget />
        </nav>
      ) : <SearchWidget
        filteredCategories={filteredCategories}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        grouping={grouping}
      />}
    </header>
  );
}
