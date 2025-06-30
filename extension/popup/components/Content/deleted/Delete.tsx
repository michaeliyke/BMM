import { Dispatch, SetStateAction } from "react";
import Bookmark from "../../../data/adapters/bookmark";
import { useAppState } from "../../../hooks/globalstate";
import { error } from "../../../utils/functional.lib.dev";
import { IBMM, IBookmark } from "../../../utils/types/schemas";

type DeleteDialogProps = {
  bookmark: IBookmark;
  dialog: boolean;
  setDialog: Dispatch<SetStateAction<boolean>>;
  bgOpacity?: number;
};

/**
 * Renders a confirmation dialog for deleting a bookmark.
 */
export default function Delete(props: DeleteDialogProps) {
  const { bookmark, dialog, setDialog, bgOpacity = 50 } = props;

  const { feedAllStateComponents, bookmarkToShow, setBookmarkToShow } = useAppState();

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
   * Handles the deletion of a bookmark
  */
  function deleteHandler(bookmark: IBookmark) {
    Bookmark.update({ ...bookmark, deleted: 1 })
      .then(postProcess)
      .then(stateUpdates)
      .catch(error);
  }

  return (
    <dialog
      className={`fixed h-screen w-screen inset-0 z-[100000] flex items-center justify-center bg-gray-900 bg-opacity-${bgOpacity}`}
    >
      <article className="bg-white rounded-lg p-6 max-w-sm w-full shadow-md">
        <header>
          <h2 className="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
        </header>
        <p className="mt-4 text-sm text-gray-700">
          Are you sure you want to delete this bookmark? This action cannot be undone.
        </p>
        <footer className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setDialog(false)}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteHandler(bookmark)}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </footer>
      </article>
    </dialog>
  );
}
