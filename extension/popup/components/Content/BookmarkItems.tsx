
import { useState } from "react";
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { MdOutlineArchive } from "react-icons/md";
import { useAppState } from "../../hooks/globalstate";
import { bookmarkRefFilter } from "../../utils/appState";
import { sortedBookmarks } from "../../utils/common";
import ReadableDate from "../../utils/readabledate";
import BookmarkItemFooter from "./BookmarkItemFooter";
import Archive from "./archived/Archive";
import Delete from "./deleted/Delete";
import Favorite from "./favorites/Favorite";
import CategoryDropdown from "./widgets/CategoryDropDown";

/**
 * BookmarkList component displays a list of bookmarks filtered by a selected tag.
 * Each bookmark can be viewed, edited, archived, or deleted.
 */
export default function Bookmarks() {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [archiveDialog, setArchiveDialog] = useState(false);

  const {
    setBookmarkToShow,
    selectedTag,
    bookmarks,
    selectedCategory,
  } = useAppState();

  const tagBookmark = bookmarkRefFilter(selectedTag);
  const categoryBookmark = bookmarkRefFilter(selectedCategory);

  let filteredBookmarks = bookmarks.filter(function filter(bookmark) {
    return (
      tagBookmark(bookmark)
      && categoryBookmark(bookmark)
      && bookmark.deleted !== 1
      && bookmark.archived !== 1
    );
  });

  filteredBookmarks = sortedBookmarks(filteredBookmarks);

  return (
    <section className="grid grid-cols-1 gap-2 bg-gray-50">
      {filteredBookmarks.map(function (bookmark, index) {
        return <article
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
              <CategoryDropdown bookmark={bookmark} />

            </div>
            <nav className="flex items-center space-x-5">
              <menu className="flex space-x-3 opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                  onClick={() => setArchiveDialog(true)}
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
                  onClick={() => setDeleteDialog(true)}
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
          <Favorite bookmark={bookmark} />

          {/* Tags Section */}
          <BookmarkItemFooter />

          {/* Archive and Delete dialogs */}
          <Delete
            bookmark={bookmark}
            dialog={deleteDialog}
            setDialog={setDeleteDialog}
            bgOpacity={5}
          />
          <Archive
            bookmark={bookmark}
            dialog={archiveDialog}
            setDialog={setArchiveDialog}
            bgOpacity={5}
          />
        </article>
      })}
    </section>

  );
}

