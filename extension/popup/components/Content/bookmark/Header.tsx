import moment from "moment";
import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { FaClock, FaRegStar } from "react-icons/fa";
import { MdOutlineArchive } from "react-icons/md";
import { useAppState } from "../../../hooks/globalstate";
import Archive from "../archived/Archive";
import Delete from "../deleted/Delete";

type HeaderProps = {
  showDetails: boolean;
  setShowDetails: Dispatch<SetStateAction<boolean>>;
  initiateEditing: () => void;
};

export default function Header(props: HeaderProps) {
  const { showDetails, setShowDetails, initiateEditing } = props;

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [archiveDialog, setArchiveDialog] = useState(false);
  const { bookmarkToShow } = useAppState();

  // Never runs since this it the Header details of a selected bookmark.
  if (!bookmarkToShow) return null;


  return <header className="mb-4 flex flex-col">

    {/* The url detail */}
    <a
      href={bookmarkToShow.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-900 py-2 bg-white hover:underline text-sm w-full text-center"
    >
      {bookmarkToShow.url.length > 65 ? `${bookmarkToShow.url.substring(0, 65)}...` : bookmarkToShow.url}
    </a>


    <div className="flex justify-between mt-2">
      {/* Details and Categories tabs */}
      <div className="flex space-x-3">
        {/* The Details tab */}
        <button
          type="button"
          className={`px-2 py-1 text-xs font-medium text-gray-700 bg-white border-gray-300 rounded-t-md hover:bg-white ${showDetails ? 'underline' : ''} underline-offset-8`}
          onClick={() => setShowDetails(true)}
        >
          Details
        </button>

        {/* The Categories tab */}
        <button
          type="button"
          className={`px-2 py-1 text-xs font-medium text-gray-700 bg-white bor_der border-gray-300 rounded-t-md hover:bg-white ${!showDetails ? 'underline' : ''} underline-offset-8`}
          onClick={() => setShowDetails(false)}
        >
          Categories
        </button>
      </div>
      {/* ---------------------------------------- */}

      <aside className="flex items-center space-x-2 text-gray-500 text-sm">
        {/* The Edit button */}
        <button
          type="button"
          onClick={initiateEditing}
          className="flex items-center space-x-1 text-xs/2 text-blue-500 hover:underline"
          aria-label="Edit bookmark"
          title="Edit bookmark"
        >
          <AiOutlineEdit className="text-gray-500" aria-hidden="true" />
          <span>Edit</span>
        </button>


        {/* The Delete button */}
        <button
          type="button"
          className="flex items-center space-x-1 text-xs/2 text-blue-500 hover:underline"
          aria-label="Delete bookmark"
          title="Delete bookmark"
          onClick={() => setDeleteDialog(true)}
        >
          <BsTrash className="text-gray-500" aria-hidden="true" />
          <span>Delete</span>
        </button>


        {/* The Favorite button */}
        <button
          type="button"
          className="flex items-center space-x-1 text-xs/2 text-blue-500 hover:underline"
          aria-label="Favorite bookmark"
          title="Toggle favorite"
        >
          <FaRegStar className="text-gray-500" aria-hidden="true" />
          <span>Favorite</span>
        </button>


        {/* The Archive button */}
        <button
          type="button"
          className="flex items-center text-xs/2 space-x-1 text-blue-500 hover:underline"
          aria-label="Archive bookmark"
          title="Archive bookmark"
          onClick={() => setArchiveDialog(true)}
        >
          <MdOutlineArchive className="text-gray-500" aria-hidden="true" />
          <span>Archive</span>
        </button>


        {/* The time widget */}
        <time dateTime={bookmarkToShow.updated_at} className="flex items-center text-xs/2 space-x-1">
          <FaClock className="text-gray-400" aria-hidden="true" />
          <span>{moment(bookmarkToShow.updated_at).fromNow()}</span>
        </time>
      </aside>
    </div>
    <Delete
      bookmark={bookmarkToShow}
      dialog={deleteDialog}
      setDialog={setDeleteDialog}
    />
    <Archive
      bookmark={bookmarkToShow}
      dialog={archiveDialog}
      setDialog={setArchiveDialog}
    />
  </header>;
}
