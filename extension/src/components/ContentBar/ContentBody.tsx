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
  selectedTag?: ITag | null;
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
  selectedCategory: ICategory | null;
};


/**
 * The `ContentBody` component is responsible for rendering either the `BookmarkView` or `BookmarkList`
 * component based on the presence of a `bookmarkToShow` prop.
 */
export default function ContentBody(props: BookmarksDisplayProps) {
  const {
    filteredCategories,
    selectedTag,
    bookmarks,
    setBookmarks,
    data,
    setData,
    selectedCategory,
  } = props;

  const [showDetails, setShowDetails] = useState<boolean>(true);
  const { filterBy, bookmarkToShow } = useAppState();

  if (bookmarkToShow) {
    return <BookmarkView
      filteredCategories={filteredCategories}
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
    selectedTag={selectedTag}
    bookmarks={bookmarks}
    setBookmarks={setBookmarks}
    data={data}
    setData={setData}
    selectedCategory={selectedCategory}
  />;
}
