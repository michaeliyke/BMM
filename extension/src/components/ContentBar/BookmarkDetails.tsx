import { FaClock, FaCommentDots, FaEdit, FaStar } from "react-icons/fa";
import { BookmarksDisplayProps } from "../../utils/types/props";
import moment from "moment";

export default function BookmarkDetails(props: BookmarksDisplayProps) {
    const { bookmarkToShow: bookmark } = props;

    function handleEdit() {
        console.log("Edit button clicked");
        // Add logic to open an edit form or perform the edit action
    }


    if (!bookmark) {
        return <p>No bookmark selected</p>;
    }

    return (
        <article
            className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200"
            aria-labelledby="bookmark-title"
        >
            {/* Header */}
            <header className="mb-4">
                <h1
                    id="bookmark-title"
                    className="text-2xl font-bold text-gray-800"
                >
                    {bookmark.title}
                </h1>
                <p>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm mt-1 inline-block"
                    >
                        {bookmark.url}
                    </a>
                </p>
            </header>

            {/* Metadata */}
            <aside className="flex items-center space-x-4 text-gray-500 text-sm mb-6">
                <div className="flex items-center space-x-1">
                    <FaClock className="text-gray-400" aria-hidden="true" />
                    <span>Updated {moment(bookmark.updated_at).fromNow()}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-500" aria-hidden="true" />
                    <span>Favorite</span>
                </div>
                <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center space-x-1 text-blue-500 hover:underline"
                    aria-label="Edit bookmark"
                >
                    <FaEdit className="text-gray-500" aria-hidden="true" />
                    <span>Edit</span>
                </button>
            </aside>

            {/* Description */}
            <section className="mb-6" aria-labelledby="description-heading">
                <h2
                    id="description-heading"
                    className="text-lg font-semibold text-gray-700 mb-2"
                >
                    Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {bookmark.description}
                </p>
            </section>

            {/* Notes/Comments Section */}
            <section aria-labelledby="notes-heading">
                <h2
                    id="notes-heading"
                    className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2"
                >
                    <FaCommentDots className="text-blue-500" aria-hidden="true" />
                    <span>Notes</span>
                </h2>
            </section>
        </article>
    );
}
