import { IBookmark, ICategory } from "../../utils/types/schemas";
import moment from 'moment';
import {
    MdOutlineArchive,
    MdOutlineEdit,
    MdOutlineDelete,
    MdOutlineStar,
} from 'react-icons/md';

import {
    FaStar,
    FaClock,
    FaCommentDots,
    FaArrowLeft,
} from "react-icons/fa";


type ContentBarProps = {
    data: ICategory[];
    updateCategory?: (category: ICategory) => void;
    selectedCategory: ICategory | null;
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
};

type BookmarksDisplayProps = {
    categories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
};

function sortedBookmarks(bookmarks: IBookmark[]): IBookmark[] {
    // Deep copy the original data to avoid mutation
    const copy: IBookmark[] = JSON.parse(JSON.stringify(bookmarks));
    // Sort bookmarks in each category by updated_at
    copy.sort((a, b) => moment(b.updated_at).diff(moment(a.updated_at)));
    return copy;
}

function BookmarksDisplay(props: BookmarksDisplayProps) {
    const {
        categories,
        bookmarkToShow,
        setBookmarkToShow,
    } = props;

    // We will show all bookmarks if:
    //  showAll is true
    //  bookmarkToShow is null
    // selectedCategory changes

    const whatToShow = bookmarkToShow ?
        <BookmarkDetails
            categories={categories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
        /> :
        <ShowBookmarks
            categories={categories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
        />;
    return <>{whatToShow}</>;
}

function ShowBookmarks(props: BookmarksDisplayProps) {
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



function BookmarkDetails(props: BookmarksDisplayProps) {
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

function GoBackButton(props: BookmarksDisplayProps) {
    const { setBookmarkToShow } = props;
    const handleGoBack = () => {
        console.log("Go Back button clicked");
        setBookmarkToShow(null);
    };

    return (
        <button
            onClick={handleGoBack}
            className="flex items-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none transition"
        >
            <FaArrowLeft className="mr-2" />
            Go Back
        </button>
    );
}

export default function ContentBar(props: ContentBarProps) {
    const {
        data,
        selectedCategory,
        bookmarkToShow,
        setBookmarkToShow,
    } = props;

    const filteredCategories = selectedCategory ? data.filter((cat) => cat.id === selectedCategory.id) : data;

    return (
        <article className="content">
            <header className="flex justify-between items-center mt-4 p-4 bg-gray-100 border-b border-gray-200">
                {bookmarkToShow &&
                    <GoBackButton
                        categories={filteredCategories}
                        bookmarkToShow={bookmarkToShow}
                        setBookmarkToShow={setBookmarkToShow}
                    ></GoBackButton>}
                <h1 className="text-lg font-semibold text-gray-800">Content Header</h1>
            </header>
            <BookmarksDisplay
                categories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
            />
            <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
        </article>
    );
}
