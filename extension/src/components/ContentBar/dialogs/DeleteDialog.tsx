type DeleteDialogProps = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
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
export function DeleteDialog({ isOpen, onConfirm, onCancel }: DeleteDialogProps) {
    if (!isOpen) return null;

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
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </footer>
            </article>
        </dialog>
    );
}
