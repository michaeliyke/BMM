import moment from "moment";
import { BookmarksDisplayProps } from "../../utils/types/commons";
import { MdOutlineArchive, MdOutlineEdit, MdOutlineDelete, MdOutlineStar } from "react-icons/md";
import { sortedBookmarks } from "../../utils/common";
import { IBookmark } from "../../utils/types/schemas";

export default function ShowBookmarks(props: BookmarksDisplayProps) {
    const {
        categories,
        setBookmarkToShow,
    } = props;

    const bookmarks: IBookmark[] = [];
    for (const category of categories) {
        bookmarks.push(...category.bookmarks);
    }

    return (
        <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
            {sortedBookmarks(bookmarks).map((bookmark, index) => (
                <article
                    key={index}
                    className="relative px-5 py-2 bg-white shadow-md rounded-lg hover:shadow-xl hover:bg-gray-100 transition duration-300 group"
                >
                    {/* Header: Title, Timestamp, and Action Icons */}
                    <header className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-gray-900 truncate">
                            {bookmark.title}
                        </h2>
                        <div className="flex items-center space-x-5">
                            {/* Action Buttons */}
                            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition duration-300">
                                <button
                                    className="text-gray-500 hover:text-blue-600 transition duration-200"
                                    aria-label="Archive"
                                >
                                    <MdOutlineArchive size={20} />
                                </button>
                                <button
                                    className="text-gray-500 hover:text-green-600 transition duration-200"
                                    aria-label="Edit"
                                >
                                    <MdOutlineEdit size={20} />
                                </button>
                                <button
                                    className="text-gray-500 hover:text-red-600 transition duration-200"
                                    aria-label="Delete"
                                >
                                    <MdOutlineDelete size={20} />
                                </button>
                            </div>
                            {/* Timestamp */}
                            <time
                                className="text-sm text-gray-400"
                                dateTime={moment(bookmark.updated_at).toISOString()}
                            >
                                {moment(bookmark.updated_at).fromNow()}
                            </time>
                        </div>
                    </header>

                    {/* Main Content: Bookmark Details */}
                    <section className="mt-1 max-w-md">
                        {/* URL styled as a link */}
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline truncate inline"
                            title={bookmark.url}
                        >
                            {bookmark.url}
                        </a>
                        {/* Description styled as a clickable button */}
                        <button
                            onClick={() => setBookmarkToShow(bookmark)}
                            className="text-sm text-gray-700 line-clamp-2 mt-1 hover:underline"
                            title="View bookmark details"
                        >
                            {bookmark.description}
                        </button>
                    </section>


                    {/* Favorite Button */}
                    <aside className="absolute right-4 top-1/2 transform -translate-y-1/3">
                        <button
                            className="text-gray-300 hover:text-gray-600 transition duration-200"
                            aria-label="Favorite"
                            title="Favorite"
                        >
                            <MdOutlineStar size={24} />
                        </button>
                    </aside>
                </article>
            ))}
        </section>
    );
}

