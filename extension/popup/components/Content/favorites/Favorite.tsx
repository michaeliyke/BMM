import { FaRegStar, FaStar } from "react-icons/fa";
import Bookmark from "../../../data/adapters/bookmark";
import { useAppState } from "../../../hooks/globalstate";
import { error } from "../../../utils/functional.lib.dev";
import { IBMM, IBookmark } from "../../../utils/types/schemas";

export default function Favorite({ bookmark }: { bookmark: IBookmark; }) {
  const { feedAllStateComponents } = useAppState();

  /**
    * Replaces the old bookmark object with the updated version within bmm
    * @param bookmark the updated bookmark object
    */
  function postProcess(bookmark: IBookmark) {
    feedAllStateComponents(function (bmm: IBMM) {
      bmm.bookmarkObjects[bookmark.id] = { ...bookmark };
      return bmm;
    });
    return bookmark;
  }

  /**
   * Handles the starring of a bookmark
   */
  function toggleStarred(bookmark: IBookmark): void {
    const starred = bookmark.starred === 1 ? 0 : 1

    Bookmark.update({ ...bookmark, starred })
      .then(postProcess)
      .catch(error);
  }

  return <aside className="absolute right-4 mt-2 top-1/2 transform -translate-y-2/3">
    <button
      type="button"
      className={`${bookmark.starred ? "text-dark-yellow" : "text-gray-400"} hover:text-dark-yellow transition duration-200`}
      aria-label="Favorite"
      title="Favorite"
      onClick={() => toggleStarred(bookmark)}
    >
      {bookmark.starred ? <FaStar size={14} /> : <FaRegStar size={14} />}
    </button>
  </aside>;
}
