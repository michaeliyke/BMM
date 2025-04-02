import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory } from "../../utils/types/schemas";
import { GoBackWidget } from "./widgets/GoBackWidget";
import { SearchWidget } from "./widgets/SearchWidget";
import { useAppState } from "../../hooks/globalstate";

type ContentHeaderProps = {
  bookmarks: IBookmark[];
  setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
  updateCategory?: (category: ICategory) => void;
};

/**
 * ContentHeader component renders a header section that conditionally displays
 * either a GoBackButton or a SearchWidget based on the presence of a bookmark to show.
 */
export default function ContentHeader(props: ContentHeaderProps) {
  const { bookmarks, setBookmarks } = props;

  const { bookmarkToShow } = useAppState();

  return (
    <header className="flex items-center justify-center p-2 bg-gray-100 border-b border-gray-200">
      {bookmarkToShow ? (
        <nav aria-label="Go back">
          <GoBackWidget />
        </nav>
      ) : <SearchWidget
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
      />}
    </header>
  );
}
