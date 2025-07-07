import { FaFileUpload } from "react-icons/fa";
import { useAppState } from "../../../hooks/globalstate";
import { downloadFile } from "../../../utils/common2";
import { IBMM } from "../../../utils/types/schemas";

/**
 * A button for exporting bookmarks data as JSON.
 */
export default function Export() {
  const { bmm } = useAppState();

  /**
   * Initiates the download or throws an error if no data is found
   *
   * @param bmm {@link IBMM BMM}
   */
  function initiateExport(bmm: IBMM) {
    if (bmm.bookmarks.length === 0)
      throw new Error("No categories to export");

    downloadFile(
      JSON.stringify(bmm, null, 2),
      "bookmarks_data.json",
      "application/json",
    );
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        className="py-2 px-4 rounded-lg tracking-wide border border-blue-700 text-blue-700 flex items-center"
        onClick={() => initiateExport(bmm)}
        title="Export bookmarks"
      >
        <FaFileUpload className="mr-1" />
        Export
      </button>
    </div>
  );
}
