import { useAppState } from "../../hooks/globalstate";
import Archived from "./archived/Archived";
import Bookmarks from "./Bookmarks";
import Deleted from "./deleted/Deleted";
import Favorites from "./favorites/Favorites";

/**
 * Responsible for rendering various views like Bookmark, Archived, Deleted,
 * and Favorites
 */
export default function Switcher() {
  const { filterBy } = useAppState();

  switch (filterBy) {
    case 'filter:archived': return <Archived />;
    case 'filter:deleted': return <Deleted />;
    case 'filter:favorites': return <Favorites />;
    default: return <Bookmarks />;
  }
}
