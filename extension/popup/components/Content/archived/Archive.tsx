import { Dispatch, SetStateAction } from "react";
import Bookmark from "../../../data/adapters/bookmark";
import { useAppState } from "../../../hooks/globalstate";
import { error } from "../../../utils/functional.lib.dev";
import { IBMM, IBookmark } from "../../../utils/types/schemas";

type ArchiveDialogProps = {
  bookmark: IBookmark;
  dialog: boolean;
  setDialog: Dispatch<SetStateAction<boolean>>;
  bgOpacity?: number;
};

/**
 * ArchiveDialog component renders a modal dialog to confirm the archiving of a bookmark.
 */
export default function Archive(props: ArchiveDialogProps) {
  const { bookmark, dialog, setDialog, bgOpacity = 50 } = props;

  const { bookmarkToShow, setBookmarkToShow, feedAllStateComponents, } = useAppState();

  if (!dialog)
    return null;

  /**
   * Replaces the old bookmark object with the updated version within bmm
   * @param bookmark the updated bookmark object
   */
  function postProcess(bookmark: IBookmark) {
    feedAllStateComponents(function (bmm: IBMM) {
      bmm.bookmarkObjects[bookmark.id] = { ...bookmark };
      return bmm;
    });
    return bookmark;
  }

  /**
   * Restores relevant states
   * @param bookmark the updated bookmark object
   */
  function stateUpdates(bookmark: IBookmark) {
    setDialog(false);

    // if the bookmark is currently displayed, close it
    if (bookmarkToShow?.id === bookmark.id)
      setBookmarkToShow(null);
    return bookmark;
  }

  /**
   * Handles the archiving of a bookmark
  */
  function archiveHandler(bookmark: IBookmark) {
    Bookmark.update({ ...bookmark, archived: 1 })
      .then(postProcess)
      .then(stateUpdates)
      .catch(error);
  }

  return (
    <dialog className={`fixed h-screen w-screen z-[1000000] inset-0 flex items-center justify-center bg-gray-900 bg-opacity-${bgOpacity} open`}>
      <article className="bg-white rounded-lg p-6 max-w-sm w-full shadow-md">
        <header>
          <h2 className="text-lg font-semibold text-gray-900">Confirm Archiving</h2>
        </header>
        <p className="mt-4 text-sm text-gray-700">
          Are you sure you want to archive the bookmark "{bookmark.title}"? You can
          restore it later if needed.
        </p>
        <footer className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setDialog(false)}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => archiveHandler(bookmark)}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Archive
          </button>
        </footer>
      </article>
    </dialog>
  );
}
