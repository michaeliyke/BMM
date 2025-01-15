import { FaClock, FaCommentDots, FaStar } from "react-icons/fa";
import { BookmarksDisplayProps } from "../../utils/types/props";
import moment from "moment";
import { useState } from "react";
import { IBookmark } from "../../utils/types/schemas";
import { BookmarkEditForm } from "./BookmarkEditForm";
import { AiOutlineEdit as Edit } from 'react-icons/ai';
/**
 * BookmarkView component displays the details of a selected bookmark.
 * It allows users to view and edit the bookmark information.
 *
 * @param {BookmarksDisplayProps} props - The properties for the BookmarkView component.
 * @param {IBookmark} props.bookmarkToShow - The bookmark object to display.
 *
 * @returns {JSX.Element} The rendered BookmarkView component.
 *
 * @component
 * @example
 * const bookmark = {
 *   title: "Example Bookmark",
 *   url: "https://example.com",
 *   updated_at: "2023-10-01T12:00:00Z",
 *   description: "This is an example bookmark.",
 * };
 * return <BookmarkView bookmarkToShow={bookmark} />;
 */
export default function BookmarkView(props: BookmarksDisplayProps) {
    const { bookmarkToShow: bookmark } = props;
    const [isEditing, setIsEditing] = useState<boolean>(false);

    function handleEdit() {
        setIsEditing(true);
    }

    function handleUpdate(updatedDetails: IBookmark) {
        console.log("Updated details:", updatedDetails);
        // Add logic to update the bookmark details in the data source
        setIsEditing(false);
    }

    function handleCancel() {
        setIsEditing(false);
    }

    if (!bookmark) {
        return <p>No bookmark selected</p>;
    }

    return (
        isEditing ?
            <BookmarkEditForm
                bookmark={bookmark}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
            /> :
            <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
                <article
                    className="max-w-4xl p-6 bg-white shadow-lg rounded-lg border border-gray-200"
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
                            <Edit className="text-gray-500" aria-hidden="true" />
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
            </section>
    );
}
