type ArchiveDialogProps = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
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
export function ArchiveDialog({ isOpen, onConfirm, onCancel }: ArchiveDialogProps) {
    if (!isOpen) return null;

    return (
        <dialog className="fixed h-screen w-screen z-1 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <article className="bg-white rounded-lg p-6 max-w-sm w-full shadow-md">
                <header>
                    <h2 className="text-lg font-semibold text-gray-900">Confirm Archiving</h2>
                </header>
                <p className="mt-4 text-sm text-gray-700">Are you sure you want to archive this bookmark? You can restore it later if needed.</p>
                <footer className="mt-6 flex justify-end space-x-3">
                    <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Archive
                    </button>
                </footer>
            </article>
        </dialog>
    );
}
