import { FaFileUpload } from "react-icons/fa";
import { useAppState } from "../../../hooks/globalstate";
import { ICategory } from "../../../utils/types/schemas";
import { log } from "../../../utils/functional.lib.dev";

export default function ExportWidget() {
  const { data } = useAppState();
  // Button onclick handler: make a json of all categories and pop up a download
  // dialog to save the file as bookmarks_data.json
  function handleExport(event: React.MouseEvent) {
    if (data.length === 0) {
      event.preventDefault();
      event.stopPropagation();
      console.error("No categories to export");
      return;
    }
    markImportType(data);
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks_data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center">
      <button
        className="py-2 px-4 rounded-lg tracking-wide border border-blue-700 text-blue-700 flex items-center"
        onClick={handleExport}
        title="Export bookmarks"
      >
        <FaFileUpload className="mr-1" />
        Export
      </button>
    </div>
  );
}
function markImportType(data: ICategory[]) {
  log(data)
  throw new Error("Function not implemented.");
}

