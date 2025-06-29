import { useState } from "react";
import { useAppState } from "../../hooks/globalstate";
import Archived from "./archived/Archived";
import BookmarkView from "./bookmark/Bookmark";
import Bookmarks from "./BookmarkItems";
import Deleted from "./deleted/Deleted";
import Favorites from "./favorites/Favorites";

/**
 * Responsible for rendering various views like Bookmark, Archived, Deleted,
 * and Favorites
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
    return <Archived />;
  }

  if (filterBy === 'filter:deleted') {
    return <Deleted />;
  }

  if (filterBy === 'filter:favorites') {
    return <Favorites />;
  }

  return <Bookmarks />;
}
