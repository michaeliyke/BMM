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

    const categories = [
        'Category 1',
        'Category 2',
        'Category 3',
        'Category 4',
        'Category 5',
        'Category 6',
        'Category 7',
        'Category 8',
        'Category 9',
        'Category 10',

    ]

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
                    <header className="mb-4 flex flex-col bg-slate-200">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-900 py-2 bg-white hover:underline text-sm w-full text-center"
                        >
                            {bookmark.url}
                        </a>
                        <div className="flex justify-between mt-2">
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    className={`px-2 py-1 text-xs font-medium text-gray-700 bg-white border-gray-300 rounded-t-md hover:bg-white ${showDetails ? 'underline' : ''} underline-offset-8`}
                                    onClick={() => setShowDetails(true)}
                                >
                                    Details
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 py-1 text-xs font-medium text-gray-700 bg-white bor_der border-gray-300 rounded-t-md hover:bg-white ${!showDetails ? 'underline' : ''} underline-offset-8`}
                                    onClick={() => setShowDetails(false)}
                                >
                                    Categories
                                </button>
                            </div>
                            <aside className="flex items-center space-x-2 text-gray-500 text-sm">
                                <button
                                    type="button"
                                    onClick={initiateEditing}
                                    className="flex items-center space-x-1 text-blue-500 hover:underline"
                                    aria-label="Edit bookmark"
                                    title="Edit bookmark"
                                >
                                    <AiOutlineEdit className="text-gray-500" aria-hidden="true" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center space-x-1 text-blue-500 hover:underline"
                                    aria-label="Delete bookmark"
                                    title="Delete bookmark"
                                >
                                    <BsTrash className="text-gray-500" aria-hidden="true" />
                                    <span>Delete</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center space-x-1 text-blue-500 hover:underline"
                                    aria-label="Favorite bookmark"
                                    title="Toggle favorite"
                                >
                                    <FaRegStar className="text-gray-500" aria-hidden="true" />
                                    <span>Fav</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center space-x-1 text-blue-500 hover:underline"
                                    aria-label="Archive bookmark"
                                    title="Archive bookmark"
                                >
                                    <MdOutlineArchive className="text-gray-500" aria-hidden="true" />
                                    <span>Archive</span>
                                </button>
                                <time dateTime={bookmark.updated_at} className="flex items-center space-x-1">
                                    <FaClock className="text-gray-400" aria-hidden="true" />
                                    <span>{moment(bookmark.updated_at).fromNow()}</span>
                                </time>
                            </aside>
                        </div>
                    </header>
                    {showDetails ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <section aria-labelledby="create-category-heading" className="w-60 mx-auto p-4 bg-white shadow-md rounded-md border border-gray-200">
                                <h2
                                    id="create-category-heading"
                                    className="text-md font-semibold text-sm text-gray-400 mb-2 text-center"
                                >
                                    Create a New Category
                                </h2>
                                <form className="flex flex-col space-y-2">
                                    <label htmlFor="category-name" className="text-xs text-gray-700">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        id="category-name"
                                        name="category-name"
                                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 text-xs text-gray-500"
                                        placeholder="Enter category name"
                                    />
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs self-center"
                                        onClick={() => console.log('Create category button clicked')}
                                    >
                                        Create
                                    </button>
                                </form>
                            </section>
                            <hr className="my-3" />
                            <section aria-labelledby="categories-heading">
                                <h2
                                    id="categories-heading"
                                    className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2"
                                >
                                    Categories
                                </h2>
                                <ul className="flex flex-wrap gap-2">
                                    {categories.map((category, index) => (
                                        <li key={index} className="relative group px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-500">
                                            {category}
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 hidden group-hover:block bg-red-500 text-white rounded-full px-1 py-0.5 text-xs"
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to remove ${category}?`)) {
                                                        console.log(`Removed category: ${category}`);
                                                    } else {
                                                        console.log(`Cancelled removal of category: ${category}`);
                                                    }
                                                }}
                                            >
                                                x
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </>
                    )}
                </article>
            </section >
    );
}
