import { FaFileUpload } from "react-icons/fa";
import { ICategory } from "../../utils/types/schemas";
import { markImportType } from "../../utils/importExport";

// define the props type
type propsType = {
  categories: ICategory[];
};

export default function ExportWidget(props: propsType) {
  const { categories } = props;

  // Button onclick handler: make a json of all categories and pop up a download
  // dialog to save the file as bookmarks_data.json
  function handleExport(event: React.MouseEvent) {
    if (!categories || categories.length === 0) {
      event.preventDefault();
      event.stopPropagation();
      console.error("No categories to export");
      return;
    }
    markImportType(categories);
    const dataStr = JSON.stringify(categories, null, 2);
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
        {/* Icon */}
        {/* <CiImport className="mr-1" /> */}
        {/* <CiExport className="mr-1" /> */}
        {/* <CiExport className="mr-1" /> */}
        <FaFileUpload className="mr-1" />
        Export
      </button>
    </div>
  );
}
