import { useState } from "react";
import { useAppState } from "../../hooks/globalstate";
import BookmarkList from "./BookmarkList";
import BookmarkView from "./BookmarkView";
import ListArchived from "./ListArchived";
import ListDeleted from "./ListDeleted";
import ListFavorites from "./ListFavorites";

/**
 * The `ContentBody` component is responsible for rendering either the `BookmarkView` or `BookmarkList`
 * component based on the presence of a `bookmarkToShow` prop.
 */
export default function Body() {
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const { filterBy, bookmarkToShow } = useAppState();

  if (bookmarkToShow) {
    return <BookmarkView
      showDetails={showDetails}
      setShowDetails={setShowDetails}
    />
  }

  if (filterBy === 'filter:archived') {
    return <ListArchived />;
  }

  if (filterBy === 'filter:deleted') {
    return <ListDeleted />;
  }

  if (filterBy === 'filter:favorites') {
    return <ListFavorites />;
  }

  return <BookmarkList />;
}
