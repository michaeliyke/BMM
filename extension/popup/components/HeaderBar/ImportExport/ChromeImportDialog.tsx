import { openPopup } from "../../../utils/common";

export default function ChromeImportDialog() {
  return (<div className="flex items-center">
    <button
      className="py-2 px-4 rounded-lg tracking-wide border border-blue-700 text-blue-700 flex items-center"
      onClick={() => openPopup("/upload/index.html").catch(console.error)}
      title="Export bookmarks"
    >
      {/* <FaFileUpload className="mr-1" /> */}
      Import
    </button>
  </div>);
}
