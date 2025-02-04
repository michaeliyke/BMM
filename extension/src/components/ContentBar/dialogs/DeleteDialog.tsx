import { Dispatch, SetStateAction } from "react";
import { IBookmark, ICategory } from "../../../utils/types/schemas";
import BookmarkBin from "../../../data/adapters/bookmark_bin";
import { v4 as uuidv4 } from "uuid";

type DeleteDialogProps = {
    bookmark: IBookmark;
    data: ICategory[];
    setData: Dispatch<SetStateAction<ICategory[]>>;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    setActiveBookmarkIndex: Dispatch<SetStateAction<number>>;
};

/**
 * DeleteDialog component renders a confirmation dialog for deleting a bookmark.
 *
 * @param {DeleteDialogProps} props - The properties for the DeleteDialog component.
 * @param {boolean} props.isOpen - Determines if the dialog is open.
 * @param {() => void} props.onConfirm - Callback function to handle the confirm action.
 * @param {() => void} props.onCancel - Callback function to handle the cancel action.
 * @returns {JSX.Element | null} The rendered dialog component or null if not open.
 */
export function DeleteDialog(props: DeleteDialogProps) {
    const {
        bookmark,
        data,
        setData,
        deleteDialogOpen,
        setDeleteDialogOpen,
        setActiveBookmarkIndex,
    } = props;

    if (!deleteDialogOpen)
        return null;

    function handleCancel() {
        setActiveBookmarkIndex(-1);
        setDeleteDialogOpen(false);
    }

    /**
     * Handles the deletion of a bookmark by moving it to the bin and updating the state.
     *
     * This function creates a new `BookmarkBin` instance with the provided bookmark's details,
     * sets the `deleted_at` timestamp to the current date, and assigns a new unique ID.
     * It then moves the bookmark to the bin and updates the state to remove the deleted bookmark
     * from the list of bookmarks. If an error occurs during the process, it logs the error to the console.
     * Finally, it resets the active bookmark index and closes the delete dialog.
     *
     * @returns {void}
     */
    function deleteHandler() {
        const bookmarkBin = new BookmarkBin({
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            deleted_at: new Date().toISOString(),
            bookmark_id: bookmark.id,
            category_ids: '',
            note_ids: "",
            tag_ids: '',
            id: uuidv4(),
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
        });

        bookmarkBin.moveToBin()
            .then(() => {
                const updatedData = data.map((category) => {
                    const updatedBookmarks = category.bookmarks.filter((b) => b.id !== bookmark.id);
                    return { ...category, bookmarks: updatedBookmarks };
                });
                setData(updatedData);
                console.log("Bookmark moved to bin successfully.");
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setActiveBookmarkIndex(-1);
                setDeleteDialogOpen(false);
            });
    }

    return (
        <dialog
            className="fixed h-screen w-screen inset-0 z-1 flex items-center justify-center bg-gray-900 bg-opacity-50"
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
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={deleteHandler}
                        className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </footer>
            </article>
        </dialog>
    );
}
