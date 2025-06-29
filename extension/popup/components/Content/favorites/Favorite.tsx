import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import Bookmark from "../../../data/adapters/bookmark";
import { IBookmark } from "../../../utils/types/schemas";

export default function Favorite({ bookmark }: { bookmark: IBookmark; }) {
  const [starred, setStarred] = useState(bookmark.starred || false);

  function toggleStarred(): void {
    Bookmark.toggleStarred(bookmark).then(() => {
      setStarred(!starred);
    }).catch(console.error);
  }

  return <aside className="absolute right-4 mt-2 top-1/2 transform -translate-y-2/3">
    <button
      type="button"
      className={`${starred ? "text-dark-yellow" : "text-gray-400"} hover:text-dark-yellow transition duration-200`}
      aria-label="Favorite"
      title="Favorite"
      onClick={toggleStarred}
    >
      {starred ? <FaStar size={14} /> : <FaRegStar size={14} />}
    </button>
  </aside>;
}
