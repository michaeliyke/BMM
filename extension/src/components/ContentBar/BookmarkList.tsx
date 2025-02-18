
import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdOutlineArchive } from "react-icons/md";
import Bookmark from "../../data/adapters/bookmark";
import { sortedBookmarks } from "../../utils/common";
import ReadableDate from "../../utils/readabledate";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import BookmarkItemFooter from "./BookmarkItemFooter";
import CategoryDropdown from "./CategoryDropDown";
import { ArchiveDialog } from "./dialogs/ArchiveDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";

type BookmarkListProps = {
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: Dispatch<SetStateAction<IBookmark | null>>;
    selectedTag?: ITag | null;
    data: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
    selectedCategory: ICategory | null;
};

/**
 * BookmarkList component displays a list of bookmarks filtered by a selected tag.
 * Each bookmark can be viewed, edited, archived, or deleted.
 *
 * @param {BookmarkListProps} props - The properties for the BookmarkList component.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to show in detail.
 * @param {Tag} props.selectedTag - The selected tag to filter bookmarks.
 * @param {Array<Bookmark>} props.bookmarks - The list of bookmarks to display.
 *
 * @returns {JSX.Element} The rendered BookmarkList component.
 */
export default function BookmarkList(props: BookmarkListProps) {
    const {
        setBookmarkToShow,
        selectedTag,
        bookmarks,
        data,
        selectedCategory,
    } = props;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
    const [activeBookmarkIndex, setActiveBookmarkIndex] = useState<number>(-1);

    const handleDelete = (index: number) => {
        setActiveBookmarkIndex(index);
        setDeleteDialogOpen(true);
    };

    function handleArchive(index: number) {
        setActiveBookmarkIndex(index);
        setArchiveDialogOpen(true);
    };


    let filteredBookmarks = bookmarks;

    // Filter out bookmarks that include the selected tag
    if (selectedTag) {
        filteredBookmarks = bookmarks.filter((bookmark) => {
            return bookmark.tags.some((tag) => tag.name === selectedTag.name);
        });
    }

    filteredBookmarks = sortedBookmarks(filteredBookmarks);

    return (
        <section className="grid grid-cols-1 gap-2 bg-gray-50">
            {filteredBookmarks.map((bookmark, index) => (
                <article
                    key={index}
                    className="relative px-5 pt-1 pb-2 bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 group"
                >
                    <header className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-sm font-semibold text-gray-900 truncate">
                                <button
                                    onClick={() => setBookmarkToShow(bookmark)}
                                    className="text-xs text-gray-700 line-clamp-2 mt-1 hover:underline"
                                    title="View bookmark details"
                                >
                                    {bookmark.title.length > 35 ? `${bookmark.title.substring(0, 35)} ...More` : bookmark.title}
                                </button>
                            </h2>
                            {/* Categories Dropdown */}
                            <CategoryDropdown bookmark={bookmark} data={data} />

                        </div>
                        <nav className="flex items-center space-x-5">
                            <menu className="flex space-x-3 opacity-0 group-hover:opacity-100 transition duration-300">
                                <button
                                    onClick={() => handleArchive(index)}
                                    className="text-gray-500 hover:text-blue-600 transition duration-200"
                                    aria-label="Archive"
                                    title="Archive"
                                >
                                    <MdOutlineArchive size={14} />
                                </button>
                                <button
                                    className="text-gray-500 hover:text-green-600 transition duration-200"
                                    aria-label="Edit"
                                    title="Edit"
                                >
                                    <AiOutlineEdit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="text-gray-500 hover:text-red-600 transition duration-200"
                                    aria-label="Delete"
                                    title="Delete"
                                >
                                    <BsTrash size={14} />
                                </button>
                            </menu>
                            <time
                                className="text-xs/2 text-gray-400"
                                dateTime={ReadableDate.toISOString(bookmark.updated_at)}
                            >
                                {ReadableDate.format(bookmark.updated_at)}
                            </time>
                        </nav>
                    </header>

                    {/* The Link */}
                    <section className="max-w-md mt-1.5">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 mb-0 hover:underline truncate inline"
                            title={bookmark.url}
                            style={{ display: 'inline-block', maxWidth: '50ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {bookmark.url}
                        </a>

                        <hr className="-mt-1 mb-0.5" />
                    </section>

                    {/* Favorite button */}
                    <FavoriteButton bookmark={bookmark} />

                    {/* Tags Section */}
                    <BookmarkItemFooter
                        bookmark={bookmark}
                        setBookmark={setBookmarkToShow}
                        selectedCategory={selectedCategory}
                        setBookmarks={props.setBookmarks}
                        bookmarks={props.bookmarks}
                    />
                </article>
            ))}
            <ArchiveDialog
                data={props.data}
                setData={props.setData}
                bookmark={filteredBookmarks[activeBookmarkIndex]}
                archiveDialogOpen={archiveDialogOpen}
                setArchiveDialogOpen={setArchiveDialogOpen}
                setActiveBookmarkIndex={setActiveBookmarkIndex}
            />
            <DeleteDialog
                data={props.data}
                setData={props.setData}
                bookmark={filteredBookmarks[activeBookmarkIndex]}
                deleteDialogOpen={deleteDialogOpen}
                setDeleteDialogOpen={setDeleteDialogOpen}
                setActiveBookmarkIndex={setActiveBookmarkIndex}
            />
        </section>

    );
}


function FavoriteButton({ bookmark }: { bookmark: IBookmark }) {
    const [starred, setStarred] = useState(bookmark.starred || false);

    function toggleStarred(): void {
        Bookmark.toggleStarred(bookmark).then(() => {
            setStarred(!starred);
        }).catch(console.error);
    }

    return <aside className="absolute right-4 mt-2 top-1/2 transform -translate-y-2/3">
        <button
            type="button"
            className={`${starred ? "text-dark-yellow" : "text-gray-400"} hover:text-dark-yellow transition duration-200`}
            aria-label="Favorite"
            title="Favorite"
            onClick={toggleStarred}
        >
            {starred ? <FaStar size={14} /> : <FaRegStar size={14} />}
        </button>
    </aside>;
}

