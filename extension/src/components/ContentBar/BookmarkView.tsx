import moment from "moment";
import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { FaClock, FaCommentDots, FaRegStar } from "react-icons/fa";
import { MdOutlineArchive } from "react-icons/md";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import { BookmarkEditForm } from "./BookmarkEditForm";
import BookmarkItemFooter from "./BookmarkItemFooter";

type BookmarkViewProps = {
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: Dispatch<SetStateAction<IBookmark | null>>;
    selectedTag?: ITag | null;
    data: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
    showDetails: boolean;
    setShowDetails: Dispatch<SetStateAction<boolean>>;
};


/**
 * BookmarkView component displays the details of a selected bookmark.
 * It allows users to view and edit the bookmark information.
 *
 * @param {BookmarkViewProps} props - The properties for the BookmarkView component.
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
export default function BookmarkView(props: BookmarkViewProps) {
    const { bookmarkToShow: bookmark, showDetails, setShowDetails } = props;
    const [isEditing, setIsEditing] = useState<boolean>(false);

    /**
     * Handles the edit action by setting the editing state to true.
     * This function is typically called when the user initiates an edit operation.
     */
    function initiateEditing() {
        setIsEditing(true);
    }


    if (!bookmark) {
        return <p>No bookmark selected</p>;
    }
    // console.log(JSON.stringify(bookmark));

    return (
        isEditing ?
            <BookmarkEditForm
                bookmark={bookmark}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                data={props.data}
                setData={props.setData}
            /> :
            <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
                <article
                    className="max-w-4xl p-6 pt-2 bg-white shadow-lg rounded-lg border border-gray-200"
                    aria-labelledby="bookmark-title"
                >
                    {/* Header */}
                    <header className="mb-4 flex flex-col">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-900 py-2 bg-white hover:underline text-sm w-full text-center"
                        >
                            {bookmark.url}
                        </a>
                        <div className="flex space-x-4 mt-2">
                            <button
                                type="button"
                                className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-t-md hover:bg-gray-100"
                            >
                                Details
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-t-md hover:bg-gray-100"
                            >
                                Categories
                            </button>
                        </div>
                    </header>

                    {/* Metadata */}
                    <aside className="flex items-center space-x-4 text-gray-500 text-sm mb-6">
                        <div className="flex items-center space-x-1">
                            <FaClock className="text-gray-400" aria-hidden="true" />
                            <span>Updated {moment(bookmark.updated_at).fromNow()}</span>
                        </div>
                        <button
                            type="button"
                            className="flex items-center space-x-1 text-blue-500 hover:underline"
                            aria-label="Archive bookmark"
                            title="Archive bookmark"
                        >
                            <MdOutlineArchive className="text-gray-500" aria-hidden="true" />
                            {/* <span>Archive</span> */}
                        </button>
                        <button
                            type="button"
                            onClick={initiateEditing}
                            className="flex items-center space-x-1 text-blue-500 hover:underline"
                            aria-label="Edit bookmark"
                            title="Edit bookmark"
                        >
                            <AiOutlineEdit className="text-gray-500" aria-hidden="true" />
                            {/* <span>Edit</span> */}
                        </button>
                        <button
                            type="button"
                            className="flex items-center space-x-1 text-blue-500 hover:underline"
                            aria-label="Delete bookmark"
                            title="Delete bookmark"
                        >
                            <BsTrash className="text-gray-500" aria-hidden="true" />
                            {/* <span>Delete</span> */}
                        </button>
                        <button
                            type="button"
                            className="flex items-center space-x-1 text-blue-500 hover:underline"
                            aria-label="Favorite bookmark"
                            title="Toggle favorite"
                        >
                            <FaRegStar className="text-gray-500" aria-hidden="true" />
                            {/* <span>Favorite</span> */}
                        </button>
                    </aside>

                    {/* Description */}
                    <section className="mb-6" aria-labelledby="description-heading">
                        <h2
                            id="description-heading"
                            className="text-lg font-semibold text-gray-700 mb-2"
                        >
                            {bookmark.title}
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
                    <hr className="my-3" />
                    <BookmarkItemFooter
                        bookmark={bookmark}
                        setBookmark={props.setBookmarkToShow}
                        selectedCategory={null}
                        setBookmarks={props.setBookmarks}
                        bookmarks={props.bookmarks}
                    />
                </article>
            </section>
    );
}
