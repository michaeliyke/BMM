import { FaClock, FaCommentDots, FaStar } from "react-icons/fa";
import { BookmarksDisplayProps } from "../../utils/types/props";
import moment from "moment";

export default function BookmarkDetails(props: BookmarksDisplayProps) {
    const { bookmarkToShow: bookmark } = props;

    if (!bookmark) {
        return <p>No bookmark selected</p>;
    }

    return (
        <article className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            {/* Header */}
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{bookmark.title}</h1>
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm mt-1 inline-block"
                >
                    {bookmark.url}
                </a>
            </header>

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-gray-500 text-sm mb-6">
                <div className="flex items-center space-x-1">
                    <FaClock className="text-gray-400" />
                    <span>Updated {moment(bookmark.updated_at).fromNow()}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-500" />
                    <span>Favorite</span>
                </div>
            </div>

            {/* Description */}
            <section className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{bookmark.description}</p>
            </section>

            {/* Notes/Comments Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <FaCommentDots className="text-blue-500" />
                    <span>Notes</span>
                </h2>

                {/* Render notes */}
                {bookmark.notes && bookmark.notes.length > 0 ? (
                    <ul className="space-y-4">
                        {bookmark.notes.map((note, index) => (
                            <li
                                key={index}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600 font-semibold">
                                        {note.author}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {moment(note.date).fromNow()}
                                    </span>
                                </div>
                                <p className="text-gray-700">{note.content}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No notes added yet.</p>
                )}
            </section>
        </article>
    );
}
