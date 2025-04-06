import { useAppState } from "../../hooks/globalstate";
import { GoBackWidget } from "./widgets/GoBackWidget";
import { SearchWidget } from "./widgets/SearchWidget";

/**
 * ContentHeader component renders a header section that conditionally displays
 * either a GoBackButton or a SearchWidget based on the presence of a bookmark to show.
 */
export default function ContentHeader() {
  const { bookmarkToShow } = useAppState();

  return (
    <header className="flex items-center justify-center p-2 bg-gray-_100 border border-gray-200">
      {bookmarkToShow ? (
        <nav aria-label="Go back">
          <GoBackWidget />
        </nav>
      ) : <SearchWidget />}
    </header>
  );
}
