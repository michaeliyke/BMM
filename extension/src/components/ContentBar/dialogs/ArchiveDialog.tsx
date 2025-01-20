import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory } from "../../../utils/types/schemas";
import Bookmark from "../../../data/adapters/bookmark";

type ArchiveDialogProps = {
    bookmark: IBookmark;
    data: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
    archiveDialogOpen: boolean;
    setArchiveDialogOpen: Dispatch<SetStateAction<boolean>>;
    setActiveBookmarkIndex: Dispatch<SetStateAction<number>>;
};

/**
 * ArchiveDialog component renders a modal dialog to confirm the archiving of a bookmark.
 *
 * @param {ArchiveDialogProps} props - The properties for the ArchiveDialog component.
 * @param {boolean} props.isOpen - Determines if the dialog is open or not.
 * @param {() => void} props.onConfirm - Callback function to handle the confirm action.
 * @param {() => void} props.onCancel - Callback function to handle the cancel action.
 * @returns {JSX.Element | null} The rendered dialog component or null if not open.
 */
export function ArchiveDialog(props: ArchiveDialogProps) {
    const {
        bookmark,
        data,
        setData,
        archiveDialogOpen,
        setArchiveDialogOpen,
        setActiveBookmarkIndex,
    } = props;
    if (!archiveDialogOpen)
        return null;

    function handleCancel() {
        setArchiveDialogOpen(false);
        setActiveBookmarkIndex(-1);
    }

    /**
     * Handles the archiving of a bookmark. This function updates the bookmark's
     * archived status to 1, updates the state with the new data, and closes the
     * archive dialog.
     *
     * @function
     * @returns {void}
     *
     * @example
     * // Example usage:
     * archiveHandler();
     *
     * @throws {Error} If the archiving process fails.
     */
    function archiveHandler() {
        (new Bookmark(bookmark)).archive()
            .then(() => {
                const updatedData = data.map((category) => {
                    const updatedBookmarks = category.bookmarks.map((b) => {
                        return b.id === bookmark.id ? { ...b, archived: 1 } : b;
                    });
                    return { ...category, bookmarks: updatedBookmarks };
                });
                setData(updatedData);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setArchiveDialogOpen(false);
                setActiveBookmarkIndex(-1);
            });
    }

    return (
        <dialog className="fixed h-screen w-screen z-1 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 open">
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
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={archiveHandler}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Archive
                    </button>
                </footer>
            </article>
        </dialog>
    );
}
