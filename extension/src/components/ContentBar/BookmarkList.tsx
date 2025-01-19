/**
 * BookmarkList component displays a list of bookmarks filtered by a category or a tag or both
 * Each bookmark displays its title, URL, description, and action buttons
 *
 * @param {BookmarkListProps} props - The properties for the BookmarkList component.
 * @param {function} props.setBookmarkToShow - Function to set the bookmark to show in detail view.
 * @param {object} props.selectedTag - The tag selected for filtering bookmarks.
 * @param {Array} props.bookmarks - The list of bookmarks to display.
 *
 * @returns {JSX.Element} The rendered BookmarkList component.
 */
import moment from "moment";
import { MdOutlineArchive } from "react-icons/md";
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { sortedBookmarks } from "../../utils/common";
import { FaRegStar } from "react-icons/fa";
import { Dispatch, SetStateAction, useState } from "react";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { ArchiveDialog } from "./dialogs/ArchiveDialog";

type BookmarkListProps = {
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
    selectedTag?: ITag | null;
    data: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
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
    } = props;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
    const [archivedBookmarkIndex, setArchivedBookmarkIndex] = useState<number>(-1);

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    function handleArchive(index: number) {
        setArchivedBookmarkIndex(index);
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

    // console.log(selectedTag);

    return (
        <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
            {filteredBookmarks.map((bookmark, index) => (
                <article
                    key={index}
                    className="relative px-5 py-2 bg-white shadow-md rounded-lg hover:shadow-xl hover:bg-gray-100 transition duration-300 group"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-gray-900 truncate">
                            <button
                                onClick={() => setBookmarkToShow(bookmark)}
                                className="text-sm text-gray-700 line-clamp-2 mt-1 hover:underline"
                                title="View bookmark details"
                            >
                                {bookmark.title}
                            </button>
                        </h2>
                        <nav className="flex items-center space-x-5">
                            <menu className="flex space-x-3 opacity-0 group-hover:opacity-100 transition duration-300">
                                <button
                                    onClick={() => handleArchive(index)}
                                    className="text-gray-500 hover:text-blue-600 transition duration-200"
                                    aria-label="Archive"
                                    title="Archive"
                                >
                                    <MdOutlineArchive size={20} />
                                </button>
                                <button
                                    className="text-gray-500 hover:text-green-600 transition duration-200"
                                    aria-label="Edit"
                                    title="Edit"
                                >
                                    <AiOutlineEdit size={20} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-gray-500 hover:text-red-600 transition duration-200"
                                    aria-label="Delete"
                                    title="Delete"
                                >
                                    <BsTrash size={20} />
                                </button>
                            </menu>
                            <time
                                className="text-sm text-gray-400"
                                dateTime={moment(bookmark.updated_at).toISOString()}
                            >
                                {moment(bookmark.updated_at).fromNow()}
                            </time>
                        </nav>
                    </div>

                    <section className="mt-1 max-w-md">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline truncate inline"
                            title={bookmark.url}
                        >
                            {bookmark.url}
                        </a>
                        <button
                            onClick={() => setBookmarkToShow(bookmark)}
                            className="text-sm text-gray-700 line-clamp-2 mt-1 hover:underline"
                            title="View bookmark details"
                        >
                            {bookmark.description}
                        </button>
                    </section>

                    <aside className="absolute right-4 top-2/3 transform -translate-y-2/3">
                        <button
                            className="text-gray-300 hover:text-gray-600 transition duration-200"
                            aria-label="Favorite"
                            title="Favorite"
                        >
                            <FaRegStar size={20} />
                        </button>
                    </aside>
                </article>
            ))}
            <DeleteDialog
                isOpen={deleteDialogOpen}
                onConfirm={() => {
                    setDeleteDialogOpen(false);
                    console.log('Bookmark deleted!');
                }}
                onCancel={() => setDeleteDialogOpen(false)}
            />
            <ArchiveDialog
                data={props.data}
                setData={props.setData}
                bookmark={filteredBookmarks[archivedBookmarkIndex]}
                archiveDialogOpen={archiveDialogOpen}
                setArchiveDialogOpen={setArchiveDialogOpen}
                setArchivedBookmarkIndex={setArchivedBookmarkIndex}
            />

        </section>
    );
}

