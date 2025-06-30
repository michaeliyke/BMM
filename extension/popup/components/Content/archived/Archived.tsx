import moment from "moment";
import { useAppState } from "../../../hooks/globalstate";
import { sortedBookmarks } from "../../../utils/common";

export default function Archived() {
  const { setBookmarkToShow, bookmarks } = useAppState();

  const archived = bookmarks.filter(function (bookmark) {
    return (
      bookmark.deleted !== 1
      && bookmark.archived === 1
    );
  });

  return (
    <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
      {sortedBookmarks(archived).map(function (bookmark, index) {
        return <article
          key={index}
          className="relative px-5 py-2 bg-white shadow-md rounded-lg hover:shadow-xl hover:bg-gray-100 transition duration-300 group"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              <button
                onClick={() => setBookmarkToShow(bookmark)}
                className="text-sm text-gray-700 line-clamp-2 mt-1 hover:underline"
                title="View bookmark details"
              >
                {bookmark.title}
              </button>
            </h2>
            <nav className="flex items-center space-x-5">

              <time
                className="text-sm text-gray-400"
                dateTime={moment(bookmark.updated_at).toISOString()}
              >
                {moment(bookmark.updated_at).fromNow()}
              </time>
            </nav>
          </div>

          <section className="mt-1 max-w-md">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline truncate inline"
              title={bookmark.url}
            >
              {bookmark.url}
            </a>
            <button
              onClick={() => setBookmarkToShow(bookmark)}
              className="text-sm text-gray-700 line-clamp-2 mt-1 hover:underline"
              title="View bookmark details"
            >
              {bookmark.description}
            </button>
          </section>

        </article>
      })}
    </section>
  );
}
