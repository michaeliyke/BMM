import { FaClock, FaCommentDots, FaEdit, FaStar } from "react-icons/fa";
import { BookmarksDisplayProps } from "../../utils/types/props";
import moment from "moment";

import React, { useState } from "react";

export default function BookmarkDetails(props: BookmarksDisplayProps) {
    const { bookmarkToShow: bookmark } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: bookmark?.title || "",
        url: bookmark?.url || "",
        description: bookmark?.description || "",
    });

    function handleEdit() {
        setIsEditing(true);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSave() {
        console.log("Updated Bookmark Data:", editData);
        setIsEditing(false);
        // Add logic to save the updated bookmark (e.g., API call or state update)
    }

    function handleCancel() {
        setIsEditing(false);
        setEditData({
            title: bookmark?.title || "",
            url: bookmark?.url || "",
            description: bookmark?.description || "",
        });
    }

    return (
        <article
            className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200"
            aria-labelledby="bookmark-title"
        >
            {/* Header */}
            <header className="mb-4">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="title"
                            value={editData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2 text-gray-800"
                            placeholder="Enter title"
                            aria-label="Edit title"
                        />
                        <input
                            type="url"
                            name="url"
                            value={editData.url}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded text-gray-800"
                            placeholder="Enter URL"
                            aria-label="Edit URL"
                        />
                    </>
                ) : (
                    <>
                        <h1 id="bookmark-title" className="text-2xl font-bold text-gray-800">
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
                    </>
                )}
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
                {!isEditing && (
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="flex items-center space-x-1 text-blue-500 hover:underline"
                        aria-label="Edit bookmark"
                    >
                        <FaEdit className="text-gray-500" aria-hidden="true" />
                        <span>Edit</span>
                    </button>
                )}
            </aside>

            {/* Description */}
            <section className="mb-6" aria-labelledby="description-heading">
                <h2
                    id="description-heading"
                    className="text-lg font-semibold text-gray-700 mb-2"
                >
                    Description
                </h2>
                {isEditing ? (
                    <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded text-gray-800"
                        placeholder="Enter description"
                        aria-label="Edit description"
                    />
                ) : (
                    <p className="text-gray-700 leading-relaxed">{bookmark.description}</p>
                )}
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

            {/* Edit Actions */}
            {isEditing && (
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </article>
    );
}
