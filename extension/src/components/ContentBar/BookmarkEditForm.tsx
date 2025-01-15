import { useState } from "react";
import { BookmarkEditFormProps } from "./BookmarkView";

/**
 * BookmarkEditForm component allows users to edit the details of a bookmark.
 *
 * @param {BookmarkEditFormProps} props - The properties for the BookmarkEditForm component.
 * @param {Bookmark} props.bookmark - The bookmark object containing the current details.
 * @param {function} props.onUpdate - Callback function to handle the update of the bookmark.
 * @param {function} props.onCancel - Callback function to handle the cancellation of the edit.
 *
 * @returns {JSX.Element} The BookmarkEditForm component.
 */
export function BookmarkEditForm({ bookmark, onUpdate, onCancel }: BookmarkEditFormProps) {
    const [title, setTitle] = useState<string>(bookmark.title);
    const [url, setUrl] = useState<string>(bookmark.url);
    const [description, setDescription] = useState<string>(bookmark.description);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onUpdate({
            title, url, description,
            id: "",
            created_at: "",
            updated_at: "",
            tags: []
        });
    }

    return (
        <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
            <article
                className="max-w-4xl mx-aut-o p-6 bg-white shadow-lg rounded-lg border border-gray-200"
                aria-labelledby="edit-bookmark-title"
            >
                <section className="space-y-6">
                    <h2
                        id="edit-bookmark-title"
                        className="text-xl font-bold text-gray-800 border-b pb-2"
                    >
                        Edit Bookmark
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 p-5 rounded-md border border-gray-300">
                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </legend>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                required />
                        </fieldset>

                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">
                                URL
                            </legend>
                            <input
                                id="url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                required />
                        </fieldset>

                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </legend>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                rows={4}
                            ></textarea>
                        </fieldset>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                            >
                                Update Details
                            </button>
                        </div>
                    </form>
                </section>
            </article>
        </section>
    );
}
