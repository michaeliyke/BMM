import { Dispatch, SetStateAction, useState } from "react";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import BookmarkList from "./BookmarkList";
import BookmarkView from "./BookmarkView";
import ListArchived from "./ListArchived";
import ListDeleted from "./ListDeleted";
import ListFavorites from "./ListFavorites";
import { useAppState } from "../../hooks/globalstate";

type BookmarksDisplayProps = {
  bookmarks: IBookmark[];
  setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
  filteredCategories: ICategory[];
  bookmarkToShow: IBookmark | null;
  setBookmarkToShow: Dispatch<SetStateAction<IBookmark | null>>;
  selectedTag?: ITag | null;
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
  selectedCategory: ICategory | null;
};


/**
 * The `ContentBody` component is responsible for rendering either the `BookmarkView` or `BookmarkList`
 * component based on the presence of a `bookmarkToShow` prop.
 *
 * @param {BookmarksDisplayProps} props - The properties passed to the component.
 * @param {Array} props.filteredCategories - The list of filtered categories to display.
 * @param {Object} props.bookmarkToShow - The bookmark object to display in detail view.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to show in detail view.
 * @param {string} props.selectedTag - The currently selected tag for filtering bookmarks.
 * @param {Array} props.bookmarks - The list of bookmarks to display.
 * @param {Function} props.setBookmarks - Function to set the list of bookmarks.
 *
 * @returns {JSX.Element} The rendered component, either `BookmarkView` or `BookmarkList`.
 */
export default function ContentBody(props: BookmarksDisplayProps) {
  const {
    filteredCategories,
    bookmarkToShow,
    setBookmarkToShow,
    selectedTag,
    bookmarks,
    setBookmarks,
    data,
    setData,
    selectedCategory,
  } = props;

  const [showDetails, setShowDetails] = useState<boolean>(true);
  const { filterBy } = useAppState();

  if (bookmarkToShow) {
    return <BookmarkView
      filteredCategories={filteredCategories}
      bookmarkToShow={bookmarkToShow}
      setBookmarkToShow={setBookmarkToShow}
      bookmarks={bookmarks}
      setBookmarks={setBookmarks}
      data={data}
      setData={setData}
      showDetails={showDetails}
      setShowDetails={setShowDetails}
    />
  }

  if (filterBy === 'filter:archived') {
    return <ListArchived
      filteredCategories={filteredCategories}
      bookmarkToShow={bookmarkToShow}
      setBookmarkToShow={setBookmarkToShow}
      selectedTag={selectedTag}
      bookmarks={bookmarks}
      setBookmarks={setBookmarks}
      data={data}
      setData={setData}
    />;
  }

  if (filterBy === 'filter:deleted') {
    return <ListDeleted />;
  }

  if (filterBy === 'filter:favorites') {
    return <ListFavorites />;
  }

  return <BookmarkList
    filteredCategories={filteredCategories}
    bookmarkToShow={bookmarkToShow}
    setBookmarkToShow={setBookmarkToShow}
    selectedTag={selectedTag}
    bookmarks={bookmarks}
    setBookmarks={setBookmarks}
    data={data}
    setData={setData}
    selectedCategory={selectedCategory}
  />;
}
