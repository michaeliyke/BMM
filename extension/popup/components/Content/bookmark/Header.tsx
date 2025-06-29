import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { FaClock, FaRegStar } from "react-icons/fa";
import { MdOutlineArchive } from "react-icons/md";
import { IBookmark } from "../../../utils/types/schemas";

type HeaderProps = {
  bookmark: IBookmark;
  showDetails: boolean;
  setShowDetails: Dispatch<SetStateAction<boolean>>;
  initiateEditing: () => void;
};

export default function Header(props: HeaderProps) {
  const { bookmark, showDetails, setShowDetails, initiateEditing } = props;
  return <header className="mb-4 flex flex-col">
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-900 py-2 bg-white hover:underline text-sm w-full text-center"
    >
      {bookmark.url.length > 65 ? `${bookmark.url.substring(0, 65)}...` : bookmark.url}
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
          className="flex items-center space-x-1 text-xs/2 text-blue-500 hover:underline"
          aria-label="Edit bookmark"
          title="Edit bookmark"
        >
          <AiOutlineEdit className="text-gray-500" aria-hidden="true" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          className="flex items-center space-x-1 text-xs/2 text-blue-500 hover:underline"
          aria-label="Delete bookmark"
          title="Delete bookmark"
        >
          <BsTrash className="text-gray-500" aria-hidden="true" />
          <span>Delete</span>
        </button>
        <button
          type="button"
          className="flex items-center space-x-1 text-xs/2 text-blue-500 hover:underline"
          aria-label="Favorite bookmark"
          title="Toggle favorite"
        >
          <FaRegStar className="text-gray-500" aria-hidden="true" />
          <span>Favorite</span>
        </button>
        <button
          type="button"
          className="flex items-center text-xs/2 space-x-1 text-blue-500 hover:underline"
          aria-label="Archive bookmark"
          title="Archive bookmark"
        >
          <MdOutlineArchive className="text-gray-500" aria-hidden="true" />
          <span>Archive</span>
        </button>
        <time dateTime={bookmark.updated_at} className="flex items-center text-xs/2 space-x-1">
          <FaClock className="text-gray-400" aria-hidden="true" />
          <span>{moment(bookmark.updated_at).fromNow()}</span>
        </time>
      </aside>
    </div>
  </header>;
}
